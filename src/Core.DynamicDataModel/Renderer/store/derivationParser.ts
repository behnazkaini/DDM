// ── derivationParser ──────────────────────────────────────────────────────────
// Builds a DerivationGraph from the raw FormEvents[] baked into a layout's
// Design JSON.  No Blockly runtime is needed – Blockly XML is parsed with a
// lightweight regex instead.

import { LayoutViewModel } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel';
import { LayoutItemType } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType';
import { LayoutItemColumnViewModel } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel';
import { LayoutItemReferenceViewModel } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel';
import { SubLayoutItemViewModel } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel';
import { FormEvents } from '../../../typings/Core.DynamicDataModel/Types';
import { BlocklyOperand, Derivation, DerivationGraph } from './FormValuesStore';

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Build a DerivationGraph from the Events array embedded in a layout's Design.
 *
 * @param events      The `Design.Events` array from the layout (FormEvents[]).
 * @param layout      The current layout (used to resolve LayoutItemGuid → rowKey).
 * @param allLayouts  All layouts from the API response (used to resolve archive
 *                    layout item Guids to ColumnGuids for GridSum derivations).
 */
export function buildDerivationGraph(
  events: FormEvents[],
  layout: LayoutViewModel,
  allLayouts: LayoutViewModel[] = [],
): DerivationGraph {
  const graph: DerivationGraph = new Map();

  if (!events?.length) return graph;

  events.forEach(event => {
    if (!event.Actions?.length) return;

    event.LayoutItems?.forEach(layoutItemTrigger => {
      // Resolve the trigger Guid to the rowKey used by the store.
      // For SubLayout items the server stores the item's .Guid in the event,
      // but SublayoutItemHelper.getRowKey returns .RelationGuid, so we must
      // resolve here to get the same key that store.setGrid() uses.
      const triggerRowKey = resolveToRowKey(layoutItemTrigger.Guid, layout);

      event.Actions.forEach(action => {
        if (action.ActionId === 3 || action.ActionId === 2) {
          // ── SetRequired / SetDisabled derivation ───────────────────────────
          // When the trigger field is non-empty, the target becomes required (3)
          // or disabled (2).
          const targetRowKey = resolveToRowKey(action.Guid, layout);
          const derivation: Derivation = {
            type: action.ActionId === 3 ? 'SetRequired' : 'SetDisabled',
            sourceRowKey: triggerRowKey,
          };
          graph.set(targetRowKey, derivation);
        } else if (action.ExtraData?.isGridAction) {
          // ── GridSum derivation ─────────────────────────────────────────────
          // target: action.Guid is the LayoutItemGuid → resolve to ColumnGuid.
          // source: action.ExtraData.layoutItem.Id is the archive layout *item* Guid,
          //   but grid rows are keyed by ColumnGuid (ArchiveLayoutHelper.getRowKey).
          //   Resolve via the sub-layout's archive Items: itemGuid → ColumnGuid.
          const targetRowKey = resolveToRowKey(action.Guid, layout);
          const sourceColumnGuid = resolveArchiveItemToColumnGuid(
            layoutItemTrigger.Guid,
            action.ExtraData.layoutItem.Id,
            layout,
            allLayouts,
          );
          const derivation: Derivation = {
            type: 'GridSum',
            subLayoutRowKey: triggerRowKey, // RelationGuid – matches store.setGrid key
            sourceColumnGuid,
          };
          graph.set(targetRowKey, derivation);
        } else if (action.CodeXml) {
          // ── BlocklyOp derivation ───────────────────────────────────────────
          // target: action.Guid is the LayoutItemGuid → resolve to ColumnGuid
          const targetRowKey = resolveToRowKey(action.Guid, layout);
          const derivation = parseBlocklyXml(action.CodeXml, layout);
          if (derivation) {
            graph.set(targetRowKey, derivation);
          }
        }
      });
    });
  });

  return graph;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Resolve a guid to its form field rowKey:
 *  - Column item  → ColumnGuid
 *  - Reference / SubLayout item → RelationGuid
 *  - Not found in Items (already a ColumnGuid/RelationGuid) → returned as-is
 */
function resolveToRowKey(guid: string, layout: LayoutViewModel): string {
  if (!layout?.Items) return guid;
  const item = layout.Items.find(x => x.Guid.toLowerCase() === guid.toLowerCase());
  if (!item) return guid; // already a ColumnGuid or RelationGuid
  switch (item.Type) {
    case LayoutItemType.Column:
      return (item as LayoutItemColumnViewModel).ColumnGuid;
    case LayoutItemType.Reference:
    case LayoutItemType.SubLayout:
      return (item as LayoutItemReferenceViewModel).RelationGuid;
    default:
      return guid;
  }
}

/**
 * Resolve an archive layout item Guid to its ColumnGuid.
 *
 * Grid rows are stored with ColumnGuid as key (ArchiveLayoutHelper.getRowKey),
 * but the event's ExtraData.layoutItem.Id is the archive layout *item* Guid.
 * Chain: trigger item Guid → SubLayout item → SubLayoutGuid → archive layout →
 *        archive item with matching Guid → ColumnGuid.
 */
function resolveArchiveItemToColumnGuid(
  subLayoutItemGuid: string,
  archiveItemId: string,
  mainLayout: LayoutViewModel,
  allLayouts: LayoutViewModel[],
): string {
  if (!mainLayout?.Items || !allLayouts?.length) return archiveItemId;

  const subLayoutItem = mainLayout.Items.find(
    x => x.Guid.toLowerCase() === subLayoutItemGuid.toLowerCase(),
  ) as SubLayoutItemViewModel | undefined;
  if (!subLayoutItem?.SubLayoutGuid) return archiveItemId;

  const archiveLayout = allLayouts.find(
    l => l.Guid.toLowerCase() === subLayoutItem.SubLayoutGuid.toLowerCase(),
  );
  if (!archiveLayout?.Items) return archiveItemId;

  const archiveItem = archiveLayout.Items.find(
    x => x.Guid.toLowerCase() === archiveItemId.toLowerCase(),
  ) as LayoutItemColumnViewModel | undefined;

  return archiveItem?.ColumnGuid ?? archiveItemId;
}

type BlocklyOp = 'MULTIPLY' | 'ADD' | 'MINUS' | 'DIVIDE';

/**
 * Parse a Blockly CodeXml string (HTML-encoded) and extract the arithmetic
 * operation and the two operands (each is either a column field reference or
 * a numeric literal from a math_number block).
 * Returns null if the XML doesn't match the expected math_arithmetic pattern.
 */
function parseBlocklyXml(
  rawXml: string,
  layout: LayoutViewModel,
): Extract<Derivation, { type: 'BlocklyOp' }> | null {
  // The CodeXml stored in the DB is HTML-entity-encoded.
  const xml = decodeHtmlEntities(rawXml);

  // Extract arithmetic operator: <field name="OP">MULTIPLY</field>
  const opMatch = xml.match(/<field[^>]+name\s*=\s*["']OP["'][^>]*>([A-Z]+)<\/field>/);
  const op = opMatch?.[1] as BlocklyOp | undefined;
  if (!op || !['MULTIPLY', 'ADD', 'MINUS', 'DIVIDE'].includes(op)) return null;

  // Extract each value slot (A, B) and resolve to a BlocklyOperand.
  const operands: BlocklyOperand[] = [];
  for (const slot of ['A', 'B'] as const) {
    const operand = extractValueSlotOperand(xml, slot, layout);
    if (!operand) return null; // slot missing or unrecognised block type
    operands.push(operand);
  }

  return { type: 'BlocklyOp', op, operands };
}

/**
 * Extract the operand from a Blockly value slot (A or B).
 *  - Columns block  → { kind: 'field', rowKey: resolvedColumnGuid }
 *  - math_number block → { kind: 'literal', value: number }
 */
function extractValueSlotOperand(
  xml: string,
  slot: 'A' | 'B',
  layout: LayoutViewModel,
): BlocklyOperand | null {
  // Capture the content of <value name="A"> or <value name="B">.
  // Inner blocks (Columns, math_number) have no nested <value> children,
  // so a non-greedy match up to the first </value> is safe.
  const slotRe = new RegExp(
    `<value[^>]+name\\s*=\\s*["']${slot}["'][^>]*>([\\s\\S]*?)<\\/value>`,
  );
  const slotMatch = xml.match(slotRe);
  if (!slotMatch) return null;
  const inner = slotMatch[1];

  // Column reference block: <field name="NAME">layoutItemGuid</field>
  const nameMatch = inner.match(/<field[^>]+name\s*=\s*["']NAME["'][^>]*>([^<]+)<\/field>/);
  if (nameMatch) {
    return { kind: 'field', rowKey: resolveToRowKey(nameMatch[1].trim(), layout) };
  }

  // Numeric literal block: <field name="NUM">2</field>
  const numMatch = inner.match(/<field[^>]+name\s*=\s*["']NUM["'][^>]*>([^<]+)<\/field>/);
  if (numMatch) {
    return { kind: 'literal', value: parseFloat(numMatch[1]) };
  }

  return null;
}

/** Minimal HTML entity decoder for the characters Blockly uses in stored XML. */
function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
/**
 * eventEngine.ts — Data-driven event computation
 *
 * Replaces the current event-driven approach (onChange → run blockly JS → setFieldValue)
 * with a pure data-driven model: parse the layout Events once, produce a list of
 * ComputedFieldDef entries, then let React useMemo derive values automatically.
 *
 * Supported action types
 *   • "grid SUM"     — SUM a column from all grid rows → set a parent form field
 *   • "blockly"      — Parse Blockly XML formula (MULTIPLY / ADD / MINUS / DIVIDE)
 *                      and apply it to row-level fields → set a column in the same row
 */

import {
  EventGroup,
  EventAction,
  LayoutDto,
  LayoutItemDto,
  ComputedFieldDef,
  GridSumComputation,
  BlocklyMultiplyComputation,
  LayoutDesign,
  GridRow,
} from '../types';

// ─── Blockly XML parser ───────────────────────────────────────────────────────

type BlocklyOp = 'MULTIPLY' | 'ADD' | 'MINUS' | 'DIVIDE';

interface BlocklyFormula {
  op: BlocklyOp;
  layoutItemGuidA: string;
  layoutItemGuidB: string;
}

/**
 * Parse a Blockly math_arithmetic XML block.
 * The XML may be either raw or HTML-entity-encoded (e.g. &lt; instead of <).
 */
export function parseBlocklyXml(xmlString: string): BlocklyFormula | null {
  if (!xmlString) return null;

  // Decode HTML entities so DOMParser can handle the XML
  const decoded = xmlString
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(decoded, 'text/xml');

    const mathBlock = doc.querySelector('[type="math_arithmetic"]');
    if (!mathBlock) return null;

    const opEl = mathBlock.querySelector(':scope > field[name="OP"]');
    const op = opEl?.textContent?.trim() as BlocklyOp | undefined;

    const colA = mathBlock
      .querySelector(':scope > value[name="A"] [type="Columns"] field[name="NAME"]')
      ?.textContent?.trim();

    const colB = mathBlock
      .querySelector(':scope > value[name="B"] [type="Columns"] field[name="NAME"]')
      ?.textContent?.trim();

    if (!op || !colA || !colB) return null;

    return { op, layoutItemGuidA: colA, layoutItemGuidB: colB };
  } catch {
    return null;
  }
}

// ─── Extract computed field definitions from a layout ────────────────────────

/**
 * Scan all EventGroups in a layout's Design and produce a flat list of
 * ComputedFieldDef objects that describe how to derive each computed value.
 */
export function extractComputedFields(layout: LayoutDto): ComputedFieldDef[] {
  let design: LayoutDesign;
  try {
    design = JSON.parse(layout.Design) as LayoutDesign;
  } catch {
    return [];
  }

  if (!design.Events?.length) return [];

  const result: ComputedFieldDef[] = [];

  design.Events.forEach((group: EventGroup) => {
    if (!group.Actions?.length) return;

    group.Actions.forEach((action: EventAction) => {
      if (action.ExtraData?.isGridAction && action.ExtraData.functionName === 'SUM') {
        // ── Grid SUM: aggregate a column from all grid rows ──────────────────
        const sourceLayoutItemGuid = action.ExtraData.layoutItem?.Id;
        if (!sourceLayoutItemGuid) return;

        const computation: GridSumComputation = {
          type: 'grid',
          functionName: 'SUM',
          sourceLayoutItemGuid,
        };
        result.push({ targetLayoutItemGuid: action.Guid, computation });
      } else if (action.CodeXml) {
        // ── Blockly formula ──────────────────────────────────────────────────
        const formula = parseBlocklyXml(action.CodeXml);
        if (!formula) return;

        const computation: BlocklyMultiplyComputation = {
          type: 'blockly',
          op: formula.op,
          layoutItemGuidA: formula.layoutItemGuidA,
          layoutItemGuidB: formula.layoutItemGuidB,
        };
        result.push({ targetLayoutItemGuid: action.Guid, computation });
      }
    });
  });

  return result;
}

// ─── Runtime helpers ──────────────────────────────────────────────────────────

/**
 * Given a list of LayoutItemDtos and a LayoutItemGuid, return the ColumnGuid.
 * Needed when converting a formula's LayoutItemGuid → ColumnGuid for data lookup.
 */
export function layoutItemGuidToColumnGuid(
  layoutItems: LayoutItemDto[],
  layoutItemGuid: string
): string | undefined {
  return layoutItems.find(i => i.Guid === layoutItemGuid)?.ColumnGuid;
}

// ─── Apply computed field definitions ────────────────────────────────────────

/**
 * Compute the derived value for a single ComputedFieldDef using current row data.
 *
 * @param def          The computed field definition
 * @param layoutItems  All items of the layout that contains the formula (the define layout)
 * @param row          The current row's values keyed by ColumnGuid
 */
export function computeRowValue(
  def: ComputedFieldDef,
  layoutItems: LayoutItemDto[],
  row: GridRow
): number {
  const comp = def.computation;

  if (comp.type === 'blockly') {
    const colGuidA = layoutItemGuidToColumnGuid(layoutItems, comp.layoutItemGuidA);
    const colGuidB = layoutItemGuidToColumnGuid(layoutItems, comp.layoutItemGuidB);
    const a = Number(row[colGuidA ?? ''] ?? 0);
    const b = Number(row[colGuidB ?? ''] ?? 0);

    switch (comp.op) {
      case 'MULTIPLY': return a * b;
      case 'ADD':      return a + b;
      case 'MINUS':    return a - b;
      case 'DIVIDE':   return b !== 0 ? a / b : 0;
      default:         return 0;
    }
  }

  // Grid SUM is handled at the parent level, not per-row
  return 0;
}

/**
 * Given an array of grid rows (each with values keyed by ColumnGuid),
 * apply all row-level blockly computations and return the updated rows.
 *
 * @param rows         Current grid rows
 * @param defs         All ComputedFieldDef for the define layout
 * @param layoutItems  Items of the define layout (to map LayoutItemGuid → ColumnGuid)
 */
export function applyRowComputations(
  rows: GridRow[],
  defs: ComputedFieldDef[],
  layoutItems: LayoutItemDto[]
): GridRow[] {
  const rowDefs = defs.filter(d => d.computation.type === 'blockly');
  if (!rowDefs.length) return rows;

  return rows.map(row => {
    const updated = { ...row };
    rowDefs.forEach(def => {
      // The targetLayoutItemGuid is a LayoutItem GUID in the define layout
      const targetColGuid = layoutItemGuidToColumnGuid(layoutItems, def.targetLayoutItemGuid);
      if (!targetColGuid) return;
      updated[targetColGuid] = computeRowValue(def, layoutItems, updated);
    });
    return updated;
  });
}

/**
 * Compute the SUM of a column across all grid rows.
 *
 * @param rows              Current grid rows (with computed values already applied)
 * @param sourceLayoutItemGuid  LayoutItemGuid (in the archive layout) of the source column
 * @param archiveLayoutItems    Items of the archive layout
 */
export function computeGridSum(
  rows: GridRow[],
  sourceLayoutItemGuid: string,
  archiveLayoutItems: LayoutItemDto[]
): number {
  const sourceColGuid = layoutItemGuidToColumnGuid(archiveLayoutItems, sourceLayoutItemGuid);
  if (!sourceColGuid) return 0;
  return rows.reduce((total, row) => total + (Number(row[sourceColGuid]) || 0), 0);
}

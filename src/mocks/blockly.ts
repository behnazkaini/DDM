/**
 * mocks/blockly.ts
 *
 * Shim for "blockly"
 *
 * Implements just enough of Blockly to compile the event-action XMLs that the
 * real Renderer code stores in layout Design.Events[].Actions[].CodeXml.
 *
 * How the real code works (workspace.ts + defineLayout.tsx):
 *   1. createWorkSpace() registers JavaScript code generators for each block
 *      type, including a "Columns" dropdown block that maps field GUIDs to
 *      column names via the closure `parameters['ColumnName']`.
 *   2. Blockly.Xml.domToWorkspace(dom, workspace) loads the XML.
 *   3. Blockly.JavaScript.workspaceToCode(workspace) walks the block tree and
 *      produces a JS function body string.
 *
 * Our mock:
 *   • Workspace stores the XML DOM and a snapshot of registered generators.
 *   • domToWorkspace saves the DOM onto the workspace.
 *   • workspaceToCode walks the XML directly, calling registered generators
 *     for custom block types (like "Columns") with a minimal fake block adapter.
 */

// ── Workspace ─────────────────────────────────────────────────────────────────

class WorkspaceStub {
  dom: Element | null = null;
  generators: Record<string, Function> = {};

  getAllBlocks() { return []; }
  clear() {}
  dispose() {}
}

// ── Module-level generator registry ──────────────────────────────────────────
// workspace.ts does: (Blockly as any).JavaScript['Columns'] = function(b) { ... }
// We capture those via the Proxy on `JavaScript` below.
let _generators: Record<string, Function> = {};

// ── XML helpers ───────────────────────────────────────────────────────────────

export const Xml = {
  textToDom(xmlString: string): Element {
    try {
      const parser = new DOMParser();
      const decoded = xmlString
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"');
      return parser.parseFromString(decoded, 'text/xml').documentElement;
    } catch {
      return document.createElement('xml');
    }
  },

  domToWorkspace(dom: Element, workspace: any): void {
    if (workspace instanceof WorkspaceStub) {
      workspace.dom = dom;
    }
  },

  workspaceToDom(_workspace: any): Element {
    return document.createElement('xml');
  },
};

// ── XML walker helpers ────────────────────────────────────────────────────────

function getField(block: Element, name: string): string {
  for (const child of block.children) {
    if (child.tagName === 'field' && child.getAttribute('name') === name) {
      return child.textContent ?? '';
    }
  }
  return '';
}

function getChildBlock(parent: Element, tagName: 'value' | 'statement', inputName: string): Element | null {
  for (const child of parent.children) {
    if (child.tagName === tagName && child.getAttribute('name') === inputName) {
      for (const grandchild of child.children) {
        if (grandchild.tagName === 'block' || grandchild.tagName === 'shadow') return grandchild;
      }
    }
  }
  return null;
}

function getNextBlock(block: Element): Element | null {
  for (const child of block.children) {
    if (child.tagName === 'next') {
      for (const grandchild of child.children) {
        if (grandchild.tagName === 'block') return grandchild;
      }
    }
  }
  return null;
}

// ── Expression compiler ───────────────────────────────────────────────────────

function exprToJs(block: Element | null, gens: Record<string, Function>): string {
  if (!block) return 'null';
  const type = block.getAttribute('type') ?? '';

  // Custom registered generator (e.g. "Columns" from workspace.ts)
  const gen = gens[type];
  if (gen) {
    const fieldVal = getField(block, 'NAME');
    const fakeBlock = { getFieldValue: (n: string) => n === 'NAME' ? fieldVal : '' };
    const result = gen(fakeBlock);
    return Array.isArray(result) ? result[0] : String(result ?? 'null');
  }

  switch (type) {
    case 'variables_get':
      return getField(block, 'VAR') || getField(block, 'VAR_NAME') || 'undefined';

    case 'math_number':
      return getField(block, 'NUM') || '0';

    case 'text':
      return JSON.stringify(getField(block, 'TEXT'));

    case 'math_arithmetic': {
      const op = getField(block, 'OP');
      const a = exprToJs(getChildBlock(block, 'value', 'A'), gens);
      const b = exprToJs(getChildBlock(block, 'value', 'B'), gens);
      const opMap: Record<string, string> = { ADD: '+', SUBTRACT: '-', MULTIPLY: '*', DIVIDE: '/', POWER: '**' };
      return `(${a} ${opMap[op] ?? '+'} ${b})`;
    }

    case 'logic_compare': {
      const op = getField(block, 'OP');
      const a = exprToJs(getChildBlock(block, 'value', 'A'), gens);
      const b = exprToJs(getChildBlock(block, 'value', 'B'), gens);
      const opMap: Record<string, string> = { EQ: '==', NEQ: '!=', LT: '<', LTE: '<=', GT: '>', GTE: '>=' };
      return `(${a} ${opMap[op] ?? '=='} ${b})`;
    }

    case 'logic_operation': {
      const op = getField(block, 'OP');
      const a = exprToJs(getChildBlock(block, 'value', 'A'), gens);
      const b = exprToJs(getChildBlock(block, 'value', 'B'), gens);
      return `(${a} ${op === 'AND' ? '&&' : '||'} ${b})`;
    }

    case 'logic_negate': {
      const val = exprToJs(getChildBlock(block, 'value', 'BOOL'), gens);
      return `(!${val})`;
    }

    case 'logic_boolean':
      return getField(block, 'BOOL') === 'TRUE' ? 'true' : 'false';

    case 'math_single': {
      const op = getField(block, 'OP');
      const val = exprToJs(getChildBlock(block, 'value', 'NUM'), gens);
      const fnMap: Record<string, string> = {
        ROOT: 'Math.sqrt', ABS: 'Math.abs', NEG: '-',
        LN: 'Math.log', LOG10: '(x => Math.log10(x))',
        EXP: 'Math.exp', POW10: '(x => Math.pow(10,x))',
        ROUND: 'Math.round', ROUNDUP: 'Math.ceil', ROUNDDOWN: 'Math.floor',
        SIN: 'Math.sin', COS: 'Math.cos', TAN: 'Math.tan',
        ASIN: 'Math.asin', ACOS: 'Math.acos', ATAN: 'Math.atan',
      };
      return op === 'NEG' ? `(-${val})` : `${fnMap[op] ?? 'Math.abs'}(${val})`;
    }

    case 'math_modulo': {
      const a = exprToJs(getChildBlock(block, 'value', 'DIVIDEND'), gens);
      const b = exprToJs(getChildBlock(block, 'value', 'DIVISOR'), gens);
      return `(${a} % ${b})`;
    }

    case 'logic_ternary': {
      const cond = exprToJs(getChildBlock(block, 'value', 'IF'), gens);
      const then_ = exprToJs(getChildBlock(block, 'value', 'THEN'), gens);
      const else_ = exprToJs(getChildBlock(block, 'value', 'ELSE'), gens);
      return `(${cond} ? ${then_} : ${else_})`;
    }

    default:
      return `/* unknown expr: ${type} */null`;
  }
}

// ── Statement compiler ────────────────────────────────────────────────────────

function stmtToJs(block: Element | null, gens: Record<string, Function>, indent = '  '): string {
  if (!block) return '';
  const type = block.getAttribute('type') ?? '';
  let code = '';

  switch (type) {
    case 'variables_set': {
      const varName = getField(block, 'VAR') || getField(block, 'VAR_NAME');
      const val = exprToJs(getChildBlock(block, 'value', 'VALUE'), gens);
      code = `${indent}${varName} = ${val};\n`;
      break;
    }

    case 'controls_if': {
      // Handles IF0/DO0, ELSEIF0/DO1, ELSE
      let i = 0;
      while (true) {
        const cond = exprToJs(getChildBlock(block, 'value', `IF${i}`), gens);
        const doBlock = getChildBlock(block, 'statement', `DO${i}`);
        if (!doBlock && i > 0) break;
        const doCode = stmtToJs(doBlock, gens, indent + '  ');
        if (i === 0) {
          code += `${indent}if (${cond}) {\n${doCode}${indent}}`;
        } else {
          code += ` else if (${cond}) {\n${doCode}${indent}}`;
        }
        i++;
        if (!getChildBlock(block, 'value', `IF${i}`)) break;
      }
      const elseBlock = getChildBlock(block, 'statement', 'ELSE');
      if (elseBlock) {
        code += ` else {\n${stmtToJs(elseBlock, gens, indent + '  ')}${indent}}`;
      }
      code += '\n';
      break;
    }

    default:
      code = `${indent}/* stmt: ${type} */\n`;
  }

  const next = getNextBlock(block);
  if (next) code += stmtToJs(next, gens, indent);
  return code;
}

// ── Main compiler entry point ─────────────────────────────────────────────────

function generateFromDom(dom: Element, gens: Record<string, Function>): string {
  // Find the main_func block anywhere in the XML tree
  function findMainFunc(el: Element): Element | null {
    if (el.tagName === 'block' && el.getAttribute('type') === 'main_func') return el;
    for (const child of el.children) {
      const found = findMainFunc(child);
      if (found) return found;
    }
    return null;
  }

  const mainFunc = findMainFunc(dom);
  if (!mainFunc) return '/* no main_func block */\nreturn null;';

  // Collect declared variable names
  const vars: string[] = [];
  for (const child of dom.children) {
    if (child.tagName === 'variables') {
      for (const v of child.children) {
        const name = v.textContent?.trim();
        if (name) vars.push(name);
      }
    }
  }

  const stmtBlock = getChildBlock(mainFunc, 'statement', 'STATEMENT');
  const retBlock  = getChildBlock(mainFunc, 'value', 'RETURN');

  const varDecls = vars.length ? `  var ${vars.join(', ')};\n` : '';
  const stmtCode = stmtToJs(stmtBlock, gens);
  const retExpr  = exprToJs(retBlock, gens);

  return `function main(parameters) {\n${varDecls}${stmtCode}  return ${retExpr};\n}`;
}

// ── JavaScript code generator (with Proxy to capture registrations) ───────────

export const JavaScript: any = new Proxy({
  workspaceToCode(workspace: WorkspaceStub): string {
    if (!workspace?.dom) return '/* no dom */\nreturn null;';
    return generateFromDom(workspace.dom, workspace.generators);
  },

  // These are called by the main_func generator registered in workspace.ts.
  // Since we bypass that generator and parse XML directly, these are no-ops.
  statementToCode: (_block: any, _name: string) => '',
  valueToCode: (_block: any, _name: string, _order: number) => 'null',

  ORDER_ATOMIC: 0,
  ORDER_NONE: 99,
  ORDER_ADDITION: 12,
  ORDER_MULTIPLICATION: 13,
  ORDER_UNARY_NEGATION: 4,
} as any, {
  set(target, prop, value) {
    if (typeof prop === 'string' && typeof value === 'function') {
      _generators[prop] = value;
    }
    (target as any)[prop] = value;
    return true;
  },
  get(target, prop) {
    if (prop in (target as any)) return (target as any)[prop];
    return _generators[prop as string];
  },
});

// ── createWorkspace / inject ──────────────────────────────────────────────────

export function inject(_container: string | Element, _options?: any): WorkspaceStub {
  const ws = new WorkspaceStub();
  // Snapshot the generators registered so far (the Columns generator etc.)
  ws.generators = { ..._generators };
  return ws;
}

// ── Blocks registry ───────────────────────────────────────────────────────────

export const Blocks: Record<string, any> = new Proxy({} as Record<string, any>, {
  get: () => ({}),
  set: (_t, _p, _v) => true,
});

// ── Constants & classes ───────────────────────────────────────────────────────

export const ALIGN_RIGHT = 2;

export class FieldDropdown {
  constructor(_options: any) {}
}

// ── Default export (matches "import * as Blockly from 'blockly'") ─────────────

const Blockly = {
  Xml,
  JavaScript,
  inject,
  Workspace: WorkspaceStub,
  Blocks,
  ALIGN_RIGHT,
  FieldDropdown,
};

export default Blockly;

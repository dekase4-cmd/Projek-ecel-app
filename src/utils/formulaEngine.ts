import { CellValue, GridData } from '../types/spreadsheet';

// Column letter to index (0-based)
export function colNameToIndex(colName: string): number {
  let index = 0;
  const upper = colName.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
}

// Column index (0-based) to letter
export function colIndexToName(index: number): string {
  let num = index + 1;
  let colName = '';
  while (num > 0) {
    const rem = (num - 1) % 26;
    colName = String.fromCharCode(65 + rem) + colName;
    num = Math.floor((num - 1) / 26);
  }
  return colName;
}

// Convert "B6" -> { r: 5, c: 1 }
export function parseCellAddress(addr: string): { r: number; c: number } | null {
  const match = addr.trim().toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;
  const col = colNameToIndex(match[1]);
  const row = parseInt(match[2], 10) - 1;
  return { r: row, c: col };
}

// Convert { r: 5, c: 1 } -> "B6"
export function formatCellAddress(r: number, c: number): string {
  return `${colIndexToName(c)}${r + 1}`;
}

// Parse range "B2:B5" -> list of coordinates [{r, c}, ...]
export function parseRange(rangeStr: string): { r: number; c: number }[] {
  const parts = rangeStr.split(':').map((s) => s.trim().toUpperCase());
  if (parts.length === 1) {
    const cell = parseCellAddress(parts[0]);
    return cell ? [cell] : [];
  }
  if (parts.length === 2) {
    const start = parseCellAddress(parts[0]);
    const end = parseCellAddress(parts[1]);
    if (!start || !end) return [];

    const minR = Math.min(start.r, end.r);
    const maxR = Math.max(start.r, end.r);
    const minC = Math.min(start.c, end.c);
    const maxC = Math.max(start.c, end.c);

    const cells: { r: number; c: number }[] = [];
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        cells.push({ r, c });
      }
    }
    return cells;
  }
  return [];
}

// Helper to clean and format number values for display
export function formatValueForDisplay(val: CellValue, format?: string): string {
  if (val === null || val === undefined || val === '') return '';
  if (typeof val === 'number') {
    if (isNaN(val)) return '#VALUE!';
    if (!isFinite(val)) return '#DIV/0!';

    if (format === 'currency') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(val);
    }
    if (format === 'percent') {
      return (val * 100).toFixed(1) + '%';
    }
    // Standard thousands separator if integer or clean decimals
    if (Number.isInteger(val)) {
      return new Intl.NumberFormat('id-ID').format(val);
    }
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(val);
  }
  if (typeof val === 'boolean') {
    return val ? 'TRUE' : 'FALSE';
  }
  return String(val);
}

// Evaluates a single cell or formula
export function evaluateFormula(
  formulaOrValue: string,
  grid: GridData,
  visiting: Set<string> = new Set()
): CellValue {
  if (typeof formulaOrValue !== 'string') return formulaOrValue;
  const trimmed = formulaOrValue.trim();
  if (!trimmed.startsWith('=')) {
    // Check if it's a numeric string
    if (trimmed !== '' && !isNaN(Number(trimmed)) && !trimmed.startsWith('0') || trimmed === '0') {
      return Number(trimmed);
    }
    return formulaOrValue;
  }

  const rawExpr = trimmed.substring(1).trim();

  // Helper to get raw cell evaluated value
  const getCellValue = (r: number, c: number): CellValue => {
    const key = `${r},${c}`;
    if (visiting.has(key)) {
      return '#REF!'; // Circular reference detected
    }
    const cell = grid[r]?.[c];
    if (!cell) return null;
    if (cell.formula) {
      visiting.add(key);
      const res = evaluateFormula(cell.formula, grid, visiting);
      visiting.delete(key);
      return res;
    }
    return cell.value ?? null;
  };

  try {
    return evaluateExpression(rawExpr, getCellValue);
  } catch (err) {
    return '#ERROR!';
  }
}

// Tokenize and evaluate expression with function calls, parentheses, arithmetic, comparison
function evaluateExpression(
  expr: string,
  getVal: (r: number, c: number) => CellValue
): CellValue {
  let str = expr.trim();
  if (str === '') return '';

  // Check top-level comparisons (=, <>, <=, >=, <, >)
  // Split by top-level comparison operator outside strings and parentheses
  const compSplit = splitTopLevel(str, ['<=', '>=', '<>', '=', '<', '>']);
  if (compSplit) {
    const leftVal = evaluateExpression(compSplit.left, getVal);
    const rightVal = evaluateExpression(compSplit.right, getVal);
    const op = compSplit.op;

    const numL = Number(leftVal);
    const numR = Number(rightVal);
    const bothNums = !isNaN(numL) && !isNaN(numR) && typeof leftVal !== 'string';

    switch (op) {
      case '=':
        return String(leftVal).toLowerCase() === String(rightVal).toLowerCase();
      case '<>':
        return String(leftVal).toLowerCase() !== String(rightVal).toLowerCase();
      case '>=':
        return (bothNums ? numL : String(leftVal)) >= (bothNums ? numR : String(rightVal));
      case '<=':
        return (bothNums ? numL : String(leftVal)) <= (bothNums ? numR : String(rightVal));
      case '>':
        return (bothNums ? numL : String(leftVal)) > (bothNums ? numR : String(rightVal));
      case '<':
        return (bothNums ? numL : String(leftVal)) < (bothNums ? numR : String(rightVal));
    }
  }

  // Check top-level string concatenation (&)
  const concatSplit = splitTopLevel(str, ['&']);
  if (concatSplit) {
    const l = evaluateExpression(concatSplit.left, getVal);
    const r = evaluateExpression(concatSplit.right, getVal);
    return `${l ?? ''}${r ?? ''}`;
  }

  // Check top-level addition/subtraction (+, -)
  const addSubSplit = splitTopLevel(str, ['+', '-']);
  if (addSubSplit) {
    const left = evaluateExpression(addSubSplit.left, getVal);
    const right = evaluateExpression(addSubSplit.right, getVal);
    const numL = Number(left) || 0;
    const numR = Number(right) || 0;
    return addSubSplit.op === '+' ? numL + numR : numL - numR;
  }

  // Check top-level multiplication/division (*, /)
  const mulDivSplit = splitTopLevel(str, ['*', '/']);
  if (mulDivSplit) {
    const left = evaluateExpression(mulDivSplit.left, getVal);
    const right = evaluateExpression(mulDivSplit.right, getVal);
    const numL = Number(left) || 0;
    const numR = Number(right);
    if (mulDivSplit.op === '/') {
      if (numR === 0) return '#DIV/0!';
      return numL / numR;
    }
    return numL * (isNaN(numR) ? 0 : numR);
  }

  // Parentheses wrap: ( ... )
  if (str.startsWith('(') && str.endsWith(')')) {
    if (isEnclosedInParens(str)) {
      return evaluateExpression(str.substring(1, str.length - 1), getVal);
    }
  }

  // String literal "..."
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    return str.substring(1, str.length - 1);
  }

  // Pure Number
  if (!isNaN(Number(str))) {
    return Number(str);
  }

  // Function calls: NAME(...)
  const fnMatch = str.match(/^([A-Za-z0-9_]+)\s*\((.*)\)$/s);
  if (fnMatch && isEnclosedInParens(str.substring(fnMatch[1].length).trim())) {
    const fnName = fnMatch[1].toUpperCase();
    const argsStr = fnMatch[2];
    const args = parseArguments(argsStr);

    return executeFunction(fnName, args, getVal);
  }

  // Single Cell Reference: e.g. "B6", "A1"
  const cellCoord = parseCellAddress(str);
  if (cellCoord) {
    return getVal(cellCoord.r, cellCoord.c);
  }

  return str;
}

// Split expression by top-level operators outside quotes and parentheses
function splitTopLevel(
  expr: string,
  operators: string[]
): { left: string; right: string; op: string } | null {
  let depth = 0;
  let inQuote = false;
  let quoteChar = '';

  // Sort operators by length descending so that '<=' is matched before '<'
  const sortedOps = [...operators].sort((a, b) => b.length - a.length);

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if ((ch === '"' || ch === "'") && !inQuote) {
      inQuote = true;
      quoteChar = ch;
    } else if (inQuote && ch === quoteChar) {
      inQuote = false;
    } else if (!inQuote) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (depth === 0) {
        for (const op of sortedOps) {
          if (expr.substring(i, i + op.length) === op) {
            // Avoid unary minus at start
            if ((op === '-' || op === '+') && i === 0) continue;
            return {
              left: expr.substring(0, i).trim(),
              right: expr.substring(i + op.length).trim(),
              op,
            };
          }
        }
      }
    }
  }
  return null;
}

function isEnclosedInParens(str: string): boolean {
  if (!str.startsWith('(') || !str.endsWith(')')) return false;
  let depth = 0;
  let inQuote = false;
  let quoteChar = '';
  for (let i = 0; i < str.length - 1; i++) {
    const ch = str[i];
    if ((ch === '"' || ch === "'") && !inQuote) {
      inQuote = true;
      quoteChar = ch;
    } else if (inQuote && ch === quoteChar) {
      inQuote = false;
    } else if (!inQuote) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (depth === 0) return false;
    }
  }
  return depth === 1;
}

// Parse function arguments split by commas or semicolons outside quotes/parens
function parseArguments(argsStr: string): string[] {
  const result: string[] = [];
  let current = '';
  let depth = 0;
  let inQuote = false;
  let quoteChar = '';

  for (let i = 0; i < argsStr.length; i++) {
    const ch = argsStr[i];
    if ((ch === '"' || ch === "'") && !inQuote) {
      inQuote = true;
      quoteChar = ch;
      current += ch;
    } else if (inQuote && ch === quoteChar) {
      inQuote = false;
      current += ch;
    } else if (!inQuote) {
      if (ch === '(') {
        depth++;
        current += ch;
      } else if (ch === ')') {
        depth--;
        current += ch;
      } else if ((ch === ',' || ch === ';') && depth === 0) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    } else {
      current += ch;
    }
  }
  if (current.trim() !== '') {
    result.push(current.trim());
  }
  return result;
}

// Flatten range or list of cell references into array of values
function extractValues(
  arg: string,
  getVal: (r: number, c: number) => CellValue
): CellValue[] {
  const trimmed = arg.trim();
  if (trimmed.includes(':')) {
    const cells = parseRange(trimmed);
    return cells.map((cell) => getVal(cell.r, cell.c));
  }
  const cell = parseCellAddress(trimmed);
  if (cell) {
    return [getVal(cell.r, cell.c)];
  }
  return [evaluateExpression(trimmed, getVal)];
}

// Main function executor
function executeFunction(
  fnName: string,
  args: string[],
  getVal: (r: number, c: number) => CellValue
): CellValue {
  switch (fnName) {
    case 'SUM': {
      let total = 0;
      for (const arg of args) {
        const vals = extractValues(arg, getVal);
        for (const v of vals) {
          const num = Number(v);
          if (!isNaN(num) && v !== null && v !== '') {
            total += num;
          }
        }
      }
      return total;
    }

    case 'AVERAGE': {
      let total = 0;
      let count = 0;
      for (const arg of args) {
        const vals = extractValues(arg, getVal);
        for (const v of vals) {
          const num = Number(v);
          if (!isNaN(num) && v !== null && v !== '') {
            total += num;
            count++;
          }
        }
      }
      return count === 0 ? '#DIV/0!' : total / count;
    }

    case 'MAX': {
      let max: number | null = null;
      for (const arg of args) {
        const vals = extractValues(arg, getVal);
        for (const v of vals) {
          const num = Number(v);
          if (!isNaN(num) && v !== null && v !== '') {
            if (max === null || num > max) max = num;
          }
        }
      }
      return max ?? 0;
    }

    case 'MIN': {
      let min: number | null = null;
      for (const arg of args) {
        const vals = extractValues(arg, getVal);
        for (const v of vals) {
          const num = Number(v);
          if (!isNaN(num) && v !== null && v !== '') {
            if (min === null || num < min) min = num;
          }
        }
      }
      return min ?? 0;
    }

    case 'COUNT': {
      let count = 0;
      for (const arg of args) {
        const vals = extractValues(arg, getVal);
        for (const v of vals) {
          const num = Number(v);
          if (!isNaN(num) && v !== null && v !== '') {
            count++;
          }
        }
      }
      return count;
    }

    case 'COUNTA': {
      let count = 0;
      for (const arg of args) {
        const vals = extractValues(arg, getVal);
        for (const v of vals) {
          if (v !== null && v !== '' && v !== undefined) {
            count++;
          }
        }
      }
      return count;
    }

    case 'COUNTIF': {
      if (args.length < 2) return '#VALUE!';
      const rangeVals = extractValues(args[0], getVal);
      const rawCriteria = evaluateExpression(args[1], getVal);
      const critStr = String(rawCriteria).trim();

      let matchCount = 0;
      for (const v of rangeVals) {
        if (checkCriteriaMatch(v, critStr)) {
          matchCount++;
        }
      }
      return matchCount;
    }

    case 'SUMIF': {
      if (args.length < 2) return '#VALUE!';
      const rangeCells = parseRange(args[0]);
      const rawCriteria = evaluateExpression(args[1], getVal);
      const critStr = String(rawCriteria).trim();

      const sumCells = args.length >= 3 ? parseRange(args[2]) : rangeCells;

      let sum = 0;
      for (let i = 0; i < rangeCells.length; i++) {
        const checkVal = getVal(rangeCells[i].r, rangeCells[i].c);
        if (checkCriteriaMatch(checkVal, critStr)) {
          const addVal = sumCells[i] ? getVal(sumCells[i].r, sumCells[i].c) : checkVal;
          const num = Number(addVal);
          if (!isNaN(num)) sum += num;
        }
      }
      return sum;
    }

    case 'IF': {
      if (args.length < 2) return '#VALUE!';
      const condition = evaluateExpression(args[0], getVal);
      const isTrue = condition === true || (typeof condition === 'number' && condition !== 0) || condition === 'TRUE';
      if (isTrue) {
        return evaluateExpression(args[1], getVal);
      }
      return args.length > 2 ? evaluateExpression(args[2], getVal) : false;
    }

    case 'IFERROR': {
      if (args.length < 2) return '#VALUE!';
      const val = evaluateExpression(args[0], getVal);
      if (typeof val === 'string' && val.startsWith('#')) {
        return evaluateExpression(args[1], getVal);
      }
      return val;
    }

    case 'VLOOKUP': {
      if (args.length < 3) return '#VALUE!';
      const lookupVal = evaluateExpression(args[0], getVal);
      const tableRange = parseRange(args[1]);
      if (tableRange.length === 0) return '#N/A';

      const colIndex = Number(evaluateExpression(args[2], getVal));
      if (isNaN(colIndex) || colIndex < 1) return '#VALUE!';

      // Group table cells into rows
      const minR = Math.min(...tableRange.map((c) => c.r));
      const maxR = Math.max(...tableRange.map((c) => c.r));
      const minC = Math.min(...tableRange.map((c) => c.c));
      const targetCol = minC + colIndex - 1;

      for (let r = minR; r <= maxR; r++) {
        const firstColVal = getVal(r, minC);
        if (
          String(firstColVal).trim().toLowerCase() ===
          String(lookupVal).trim().toLowerCase()
        ) {
          return getVal(r, targetCol);
        }
      }
      return '#N/A';
    }

    case 'HLOOKUP': {
      if (args.length < 3) return '#VALUE!';
      const lookupVal = evaluateExpression(args[0], getVal);
      const tableRange = parseRange(args[1]);
      if (tableRange.length === 0) return '#N/A';

      const rowIndex = Number(evaluateExpression(args[2], getVal));
      if (isNaN(rowIndex) || rowIndex < 1) return '#VALUE!';

      const minR = Math.min(...tableRange.map((c) => c.r));
      const minC = Math.min(...tableRange.map((c) => c.c));
      const maxC = Math.max(...tableRange.map((c) => c.c));
      const targetRow = minR + rowIndex - 1;

      for (let c = minC; c <= maxC; c++) {
        const topRowVal = getVal(minR, c);
        if (
          String(topRowVal).trim().toLowerCase() ===
          String(lookupVal).trim().toLowerCase()
        ) {
          return getVal(targetRow, c);
        }
      }
      return '#N/A';
    }

    case 'INDEX': {
      if (args.length < 2) return '#VALUE!';
      const range = parseRange(args[0]);
      if (range.length === 0) return '#REF!';
      const rowNum = Number(evaluateExpression(args[1], getVal));
      const colNum = args.length >= 3 ? Number(evaluateExpression(args[2], getVal)) : 1;

      const minR = Math.min(...range.map((c) => c.r));
      const minC = Math.min(...range.map((c) => c.c));
      const maxR = Math.max(...range.map((c) => c.r));
      const maxC = Math.max(...range.map((c) => c.c));

      const targetR = minR + rowNum - 1;
      const targetC = minC + colNum - 1;

      if (targetR > maxR || targetC > maxC || targetR < minR || targetC < minC) {
        return '#REF!';
      }
      return getVal(targetR, targetC);
    }

    case 'MATCH': {
      if (args.length < 2) return '#VALUE!';
      const lookupVal = evaluateExpression(args[0], getVal);
      const cells = parseRange(args[1]);

      for (let i = 0; i < cells.length; i++) {
        const v = getVal(cells[i].r, cells[i].c);
        if (
          String(v).trim().toLowerCase() ===
          String(lookupVal).trim().toLowerCase()
        ) {
          return i + 1;
        }
      }
      return '#N/A';
    }

    case 'CONCAT':
    case 'CONCATENATE': {
      let result = '';
      for (const arg of args) {
        const vals = extractValues(arg, getVal);
        for (const v of vals) {
          result += v ?? '';
        }
      }
      return result;
    }

    case 'LEFT': {
      if (args.length < 1) return '#VALUE!';
      const text = String(evaluateExpression(args[0], getVal) ?? '');
      const count = args.length >= 2 ? Number(evaluateExpression(args[1], getVal)) : 1;
      return text.substring(0, Math.max(0, count));
    }

    case 'RIGHT': {
      if (args.length < 1) return '#VALUE!';
      const text = String(evaluateExpression(args[0], getVal) ?? '');
      const count = args.length >= 2 ? Number(evaluateExpression(args[1], getVal)) : 1;
      return text.substring(Math.max(0, text.length - count));
    }

    case 'MID': {
      if (args.length < 3) return '#VALUE!';
      const text = String(evaluateExpression(args[0], getVal) ?? '');
      const start = Number(evaluateExpression(args[1], getVal)) - 1;
      const count = Number(evaluateExpression(args[2], getVal));
      return text.substring(Math.max(0, start), Math.max(0, start + count));
    }

    case 'LEN': {
      if (args.length < 1) return 0;
      const text = String(evaluateExpression(args[0], getVal) ?? '');
      return text.length;
    }

    case 'TRIM': {
      if (args.length < 1) return '';
      const text = String(evaluateExpression(args[0], getVal) ?? '');
      return text.trim().replace(/\s+/g, ' ');
    }

    case 'UPPER': {
      if (args.length < 1) return '';
      return String(evaluateExpression(args[0], getVal) ?? '').toUpperCase();
    }

    case 'LOWER': {
      if (args.length < 1) return '';
      return String(evaluateExpression(args[0], getVal) ?? '').toLowerCase();
    }

    case 'PROPER': {
      if (args.length < 1) return '';
      const text = String(evaluateExpression(args[0], getVal) ?? '');
      return text.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    case 'ROUND': {
      if (args.length < 1) return 0;
      const val = Number(evaluateExpression(args[0], getVal));
      const digits = args.length >= 2 ? Number(evaluateExpression(args[1], getVal)) : 0;
      if (isNaN(val)) return '#VALUE!';
      const factor = Math.pow(10, digits);
      return Math.round(val * factor) / factor;
    }

    case 'ROUNDUP': {
      if (args.length < 1) return 0;
      const val = Number(evaluateExpression(args[0], getVal));
      const digits = args.length >= 2 ? Number(evaluateExpression(args[1], getVal)) : 0;
      if (isNaN(val)) return '#VALUE!';
      const factor = Math.pow(10, digits);
      return Math.ceil(val * factor) / factor;
    }

    case 'ROUNDDOWN': {
      if (args.length < 1) return 0;
      const val = Number(evaluateExpression(args[0], getVal));
      const digits = args.length >= 2 ? Number(evaluateExpression(args[1], getVal)) : 0;
      if (isNaN(val)) return '#VALUE!';
      const factor = Math.pow(10, digits);
      return Math.floor(val * factor) / factor;
    }

    case 'TODAY': {
      const now = new Date();
      return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    }

    case 'NOW': {
      const now = new Date();
      return now.toLocaleString('id-ID');
    }

    default:
      return `#NAME? (${fnName})`;
  }
}

// Match criteria like ">50", "<=10", "=Elektronik", "Laptop"
function checkCriteriaMatch(val: CellValue, criteria: string): boolean {
  if (val === null || val === undefined) return false;
  const matchOp = criteria.match(/^([><=!]+)(.*)$/);
  if (matchOp) {
    const op = matchOp[1];
    const target = matchOp[2].trim();
    const numVal = Number(val);
    const numTarget = Number(target);

    if (!isNaN(numVal) && !isNaN(numTarget)) {
      switch (op) {
        case '>':
          return numVal > numTarget;
        case '<':
          return numVal < numTarget;
        case '>=':
          return numVal >= numTarget;
        case '<=':
          return numVal <= numTarget;
        case '=':
          return numVal === numTarget;
        case '<>':
          return numVal !== numTarget;
      }
    }
  }

  // Exact or wildcard comparison
  const cleanTarget = criteria.replace(/^=/, '').trim().toLowerCase();
  const valStr = String(val).trim().toLowerCase();
  return valStr === cleanTarget;
}

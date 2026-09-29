export type CellValue = string | number | boolean | null;

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  bgColor?: string;
  textColor?: string;
  format?: 'general' | 'currency' | 'percent' | 'number';
  borderBottom?: boolean;
  borderTop?: boolean;
}

export interface CellData {
  value: CellValue;
  formula?: string; // e.g. "=SUM(D2:D5)"
  style?: CellStyle;
}

export type GridData = {
  [row: number]: {
    [col: number]: CellData;
  };
};

export interface ExerciseItem {
  id: number;
  title: string;
  category: 'Dasar' | 'Logika' | 'Lookup' | 'Statistik' | 'Teks';
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan';
  instruction: string;
  targetCells: string[]; // e.g. ["D6"] or ["C2", "C3", "C4", "C5"]
  expectedFormulaKeywords?: string[]; // e.g. ["SUM"]
  hint: string;
  solutionFormula: string;
  solutionExplanation: string;
  initialSheetData: {
    r: number;
    c: number;
    v: CellValue;
    f?: string;
    style?: CellStyle;
  }[];
  // Validator function that takes the current grid and evaluated cell getter
  validate: (getVal: (r: number, c: number) => CellValue, getFormula: (r: number, c: number) => string | undefined) => {
    isCorrect: boolean;
    feedback: string;
  };
}

export interface FormulaDocItem {
  name: string;
  category: 'Matematika' | 'Statistik' | 'Logika' | 'Lookup' | 'Teks' | 'Tanggal';
  description: string;
  syntax: string;
  arguments: { name: string; desc: string; optional?: boolean }[];
  example: string;
  sampleResult: string;
  sampleSheetData?: {
    r: number;
    c: number;
    v: CellValue;
    f?: string;
    style?: CellStyle;
  }[];
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ExcelHeader } from './components/ExcelHeader';
import { ExcelToolbar } from './components/ExcelToolbar';
import { FormulaBar } from './components/FormulaBar';
import { SpreadsheetGrid } from './components/SpreadsheetGrid';
import { Sidebar } from './components/Sidebar';
import { TaskPanel } from './components/TaskPanel';
import { ResultModal } from './components/ResultModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { HelpGuideModal } from './components/HelpGuideModal';

import { 
  GridData, 
  CellValue, 
  CellStyle, 
  ExerciseItem, 
  FormulaDocItem 
} from './types/spreadsheet';
import { 
  evaluateFormula, 
  formatCellAddress, 
  colIndexToName 
} from './utils/formulaEngine';
import { EXERCISES } from './data/exercises';
import { FORMULA_DICTIONARY } from './data/dictionary';
import { TEMPLATES, TemplateItem } from './data/templates';

export default function App() {
  // Grid state
  const [grid, setGrid] = useState<GridData>({});
  const [activeCell, setActiveCell] = useState<{ r: number; c: number }>({ r: 5, c: 1 });
  const [selectionEnd, setSelectionEnd] = useState<{ r: number; c: number }>({ r: 5, c: 1 });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');

  // Exercise & Progression state
  const [currentExerciseId, setCurrentExerciseId] = useState<number | null>(1);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<number[]>([]);

  // Modals
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    isCorrect: boolean;
    feedback: string;
    solutionFormula?: string;
  }>({
    isOpen: false,
    isCorrect: false,
    feedback: '',
  });
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Active Exercise object
  const currentExercise = useMemo(() => {
    return EXERCISES.find((ex) => ex.id === currentExerciseId) || null;
  }, [currentExerciseId]);

  // Recalculate grid formulas dynamically
  const recalculateGrid = useCallback((baseGrid: GridData): GridData => {
    const nextGrid: GridData = JSON.parse(JSON.stringify(baseGrid));
    
    // Evaluate cells with formulas
    for (const rStr in nextGrid) {
      const r = parseInt(rStr, 10);
      for (const cStr in nextGrid[r]) {
        const c = parseInt(cStr, 10);
        const cell = nextGrid[r][c];
        if (cell && cell.formula && cell.formula.startsWith('=')) {
          cell.value = evaluateFormula(cell.formula, nextGrid);
        }
      }
    }
    return nextGrid;
  }, []);

  // Load an exercise dataset into the spreadsheet
  const loadExercise = useCallback((id: number) => {
    const targetExercise = EXERCISES.find((ex) => ex.id === id);
    if (!targetExercise) return;

    setCurrentExerciseId(id);
    const newGrid: GridData = {};

    targetExercise.initialSheetData.forEach((item) => {
      if (!newGrid[item.r]) newGrid[item.r] = {};
      newGrid[item.r][item.c] = {
        value: item.v,
        formula: item.f,
        style: item.style,
      };
    });

    const evaluated = recalculateGrid(newGrid);
    setGrid(evaluated);

    // Target the first exercise target cell
    if (targetExercise.targetCells.length > 0) {
      const targetStr = targetExercise.targetCells[0];
      const match = targetStr.match(/^([A-Z]+)([0-9]+)$/);
      if (match) {
        const c = match[1].charCodeAt(0) - 65;
        const r = parseInt(match[2], 10) - 1;
        setActiveCell({ r, c });
        setSelectionEnd({ r, c });
      }
    }
    setIsEditing(false);
    setEditValue('');
  }, [recalculateGrid]);

  // Initialize with Exercise 1 on first load
  useEffect(() => {
    loadExercise(1);
  }, [loadExercise]);

  // Load sample dataset from Formula Dictionary
  const handleLoadDictionarySample = (item: FormulaDocItem) => {
    if (!item.sampleSheetData) return;
    setCurrentExerciseId(null); // Switch to Free Mode
    const newGrid: GridData = {};

    item.sampleSheetData.forEach((cell) => {
      if (!newGrid[cell.r]) newGrid[cell.r] = {};
      newGrid[cell.r][cell.c] = {
        value: cell.v,
        formula: cell.f,
        style: cell.style,
      };
    });

    const evaluated = recalculateGrid(newGrid);
    setGrid(evaluated);
    setActiveCell({ r: 0, c: 0 });
    setSelectionEnd({ r: 0, c: 0 });
    setIsEditing(false);
  };

  // Load a template
  const handleLoadTemplate = (template: TemplateItem) => {
    setCurrentExerciseId(null); // Switch to Free Mode
    const newGrid: GridData = {};

    template.data.forEach((cell) => {
      if (!newGrid[cell.r]) newGrid[cell.r] = {};
      newGrid[cell.r][cell.c] = {
        value: cell.v,
        formula: cell.f,
        style: cell.style,
      };
    });

    const evaluated = recalculateGrid(newGrid);
    setGrid(evaluated);
    setActiveCell({ r: 0, c: 0 });
    setSelectionEnd({ r: 0, c: 0 });
    setIsEditing(false);
  };

  // Cell selection handler
  const handleSelectCell = (r: number, c: number, extendSelection = false) => {
    if (extendSelection) {
      setSelectionEnd({ r, c });
    } else {
      setActiveCell({ r, c });
      setSelectionEnd({ r, c });
    }

    if (isEditing) {
      commitCellEdit(editValue);
    }
  };

  // Start inline editing
  const handleStartEdit = (initialVal?: string) => {
    const currentCell = grid[activeCell.r]?.[activeCell.c];
    const val = initialVal !== undefined
      ? initialVal
      : (currentCell?.formula || (currentCell?.value !== null && currentCell?.value !== undefined ? String(currentCell.value) : ''));

    setEditValue(val);
    setIsEditing(true);
  };

  // Commit editing to active cell and recalculate formulas
  const commitCellEdit = (rawInput: string) => {
    setIsEditing(false);
    const trimmed = rawInput.trim();

    setGrid((prevGrid) => {
      const nextGrid: GridData = JSON.parse(JSON.stringify(prevGrid));
      if (!nextGrid[activeCell.r]) nextGrid[activeCell.r] = {};

      const existingStyle = nextGrid[activeCell.r][activeCell.c]?.style;

      if (trimmed.startsWith('=')) {
        // Formula cell
        nextGrid[activeCell.r][activeCell.c] = {
          formula: trimmed,
          value: evaluateFormula(trimmed, nextGrid),
          style: existingStyle,
        };
      } else {
        // Plain text or numeric cell
        let val: CellValue = trimmed;
        if (trimmed !== '' && !isNaN(Number(trimmed))) {
          val = Number(trimmed);
        } else if (trimmed === '') {
          val = '';
        }
        nextGrid[activeCell.r][activeCell.c] = {
          value: val,
          formula: undefined,
          style: existingStyle,
        };
      }

      return recalculateGrid(nextGrid);
    });
  };

  const handleCommitEdit = () => {
    commitCellEdit(editValue);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue('');
  };

  // Apply cell styling (bold, color, format, etc.)
  const handleApplyStyle = (newStyle: Partial<CellStyle>) => {
    setGrid((prevGrid) => {
      const nextGrid: GridData = JSON.parse(JSON.stringify(prevGrid));
      const minR = Math.min(activeCell.r, selectionEnd.r);
      const maxR = Math.max(activeCell.r, selectionEnd.r);
      const minC = Math.min(activeCell.c, selectionEnd.c);
      const maxC = Math.max(activeCell.c, selectionEnd.c);

      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          if (!nextGrid[r]) nextGrid[r] = {};
          if (!nextGrid[r][c]) {
            nextGrid[r][c] = { value: '', style: {} };
          }
          nextGrid[r][c].style = {
            ...nextGrid[r][c].style,
            ...newStyle,
          };
        }
      }
      return nextGrid;
    });
  };

  // Clear selected cell contents
  const handleClearCell = () => {
    setGrid((prevGrid) => {
      const nextGrid: GridData = JSON.parse(JSON.stringify(prevGrid));
      const minR = Math.min(activeCell.r, selectionEnd.r);
      const maxR = Math.max(activeCell.r, selectionEnd.r);
      const minC = Math.min(activeCell.c, selectionEnd.c);
      const maxC = Math.max(activeCell.c, selectionEnd.c);

      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          if (nextGrid[r]?.[c]) {
            nextGrid[r][c].value = '';
            nextGrid[r][c].formula = undefined;
          }
        }
      }
      return recalculateGrid(nextGrid);
    });
  };

  // Quick insert SUM formula
  const handleInsertSumFormula = () => {
    // Scan cells above active cell to find contiguous numbers
    let topR = activeCell.r - 1;
    while (topR >= 0 && typeof grid[topR]?.[activeCell.c]?.value === 'number') {
      topR--;
    }
    const startR = topR + 1;
    const endR = activeCell.r - 1;

    let formulaStr = '=SUM(';
    if (startR <= endR && endR >= 0) {
      formulaStr += `${colIndexToName(activeCell.c)}${startR + 1}:${colIndexToName(activeCell.c)}${endR + 1})`;
    } else {
      formulaStr += ')';
    }

    setEditValue(formulaStr);
    setIsEditing(true);
  };

  // Check the answer for the active exercise
  const handleCheckAnswer = () => {
    if (!currentExercise) return;

    const getVal = (r: number, c: number): CellValue => {
      return grid[r]?.[c]?.value ?? null;
    };

    const getFormula = (r: number, c: number): string | undefined => {
      return grid[r]?.[c]?.formula;
    };

    const result = currentExercise.validate(getVal, getFormula);

    if (result.isCorrect) {
      if (!completedExerciseIds.includes(currentExercise.id)) {
        setCompletedExerciseIds((prev) => [...prev, currentExercise.id]);
      }
    }

    setResultModal({
      isOpen: true,
      isCorrect: result.isCorrect,
      feedback: result.feedback,
      solutionFormula: result.isCorrect ? undefined : currentExercise.solutionFormula,
    });
  };

  // Proceed to next exercise
  const handleNextExercise = () => {
    if (!currentExercise) return;
    const currentIndex = EXERCISES.findIndex((ex) => ex.id === currentExercise.id);
    if (currentIndex >= 0 && currentIndex < EXERCISES.length - 1) {
      const nextId = EXERCISES[currentIndex + 1].id;
      loadExercise(nextId);
    }
  };

  // Export current grid to CSV
  const handleExportCsv = () => {
    let maxR = 0;
    let maxC = 0;
    for (const rStr in grid) {
      const r = parseInt(rStr, 10);
      if (r > maxR) maxR = r;
      for (const cStr in grid[r]) {
        const c = parseInt(cStr, 10);
        if (c > maxC) maxC = c;
      }
    }

    const rows: string[] = [];
    for (let r = 0; r <= Math.max(maxR, 10); r++) {
      const rowVals: string[] = [];
      for (let c = 0; c <= Math.max(maxC, 6); c++) {
        const val = grid[r]?.[c]?.value ?? '';
        const escaped = `"${String(val).replace(/"/g, '""')}"`;
        rowVals.push(escaped);
      }
      rows.push(rowVals.join(','));
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `excel-learnhub-${currentExercise ? `latihan-${currentExercise.id}` : 'sheet'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Currently active cell details for formula bar
  const activeCellAddress = formatCellAddress(activeCell.r, activeCell.c);
  const activeCellData = grid[activeCell.r]?.[activeCell.c];
  const formulaBarDisplayValue = isEditing
    ? editValue
    : (activeCellData?.formula || (activeCellData?.value !== null && activeCellData?.value !== undefined ? String(activeCellData.value) : ''));

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* 1. TOP EXCEL HEADER */}
      <ExcelHeader
        completedCount={completedExerciseIds.length}
        totalExercises={EXERCISES.length}
        onResetSheet={() => {
          if (currentExerciseId) {
            loadExercise(currentExerciseId);
          } else {
            setGrid({});
          }
        }}
        onExportCsv={handleExportCsv}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        activeExerciseTitle={currentExercise?.title}
      />

      {/* 2. MAIN APPLICATION WORKSPACE: SIDEBAR + SPREADSHEET AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR: KAMUS & LATIHAN & TEMPLATE */}
        <Sidebar
          dictionary={FORMULA_DICTIONARY}
          exercises={EXERCISES}
          templates={TEMPLATES}
          currentExerciseId={currentExerciseId}
          completedExerciseIds={completedExerciseIds}
          onSelectExercise={loadExercise}
          onLoadDictionarySample={handleLoadDictionarySample}
          onLoadTemplate={handleLoadTemplate}
        />

        {/* MAIN CONTENT WORKSPACE */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
          {/* TASK INSTRUCTION PANEL */}
          <TaskPanel
            currentExercise={currentExercise}
            onCheckAnswer={handleCheckAnswer}
            isCompleted={currentExercise ? completedExerciseIds.includes(currentExercise.id) : false}
          />

          {/* EXCEL RIBBON TOOLBAR */}
          <ExcelToolbar
            currentStyle={activeCellData?.style}
            onApplyStyle={handleApplyStyle}
            onClearCell={handleClearCell}
            onInsertSumFormula={handleInsertSumFormula}
          />

          {/* FORMULA BAR */}
          <FormulaBar
            selectedAddress={activeCellAddress}
            formulaValue={formulaBarDisplayValue}
            isEditing={isEditing}
            onFormulaChange={(val) => {
              setEditValue(val);
              if (!isEditing) setIsEditing(true);
            }}
            onFormulaSubmit={handleCommitEdit}
            onFormulaCancel={handleCancelEdit}
            onFormulaFocus={() => {
              if (!isEditing) {
                handleStartEdit();
              }
            }}
          />

          {/* SPREADSHEET GRID */}
          <SpreadsheetGrid
            grid={grid}
            activeCell={activeCell}
            selectionEnd={selectionEnd}
            isEditing={isEditing}
            editValue={editValue}
            targetCells={currentExercise?.targetCells || []}
            onSelectCell={handleSelectCell}
            onStartEdit={handleStartEdit}
            onEditChange={setEditValue}
            onCommitEdit={handleCommitEdit}
            onCancelEdit={handleCancelEdit}
            rowCount={28}
            colCount={10}
          />
        </main>
      </div>

      {/* RESULT MODAL */}
      <ResultModal
        isOpen={resultModal.isOpen}
        isCorrect={resultModal.isCorrect}
        feedback={resultModal.feedback}
        solutionFormula={resultModal.solutionFormula}
        onClose={() => setResultModal((prev) => ({ ...prev, isOpen: false }))}
        onNextExercise={handleNextExercise}
        hasNextExercise={Boolean(
          currentExercise &&
          EXERCISES.findIndex((ex) => ex.id === currentExercise.id) < EXERCISES.length - 1
        )}
      />

      {/* KEYBOARD SHORTCUTS MODAL */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* HELP GUIDE MODAL */}
      <HelpGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

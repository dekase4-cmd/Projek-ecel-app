import React, { useState, useRef, useEffect } from 'react';
import { 
  GridData, 
  CellValue, 
  CellStyle 
} from '../types/spreadsheet';
import { 
  colIndexToName, 
  formatCellAddress, 
  formatValueForDisplay,
  parseCellAddress
} from '../utils/formulaEngine';
import { FORMULA_DICTIONARY } from '../data/dictionary';

interface SpreadsheetGridProps {
  grid: GridData;
  activeCell: { r: number; c: number };
  selectionEnd: { r: number; c: number };
  isEditing: boolean;
  editValue: string;
  targetCells: string[];
  onSelectCell: (r: number, c: number, extendSelection?: boolean) => void;
  onStartEdit: (initialVal?: string) => void;
  onEditChange: (val: string) => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  rowCount?: number;
  colCount?: number;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  grid,
  activeCell,
  selectionEnd,
  isEditing,
  editValue,
  targetCells,
  onSelectCell,
  onStartEdit,
  onEditChange,
  onCommitEdit,
  onCancelEdit,
  rowCount = 24,
  colCount = 10,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      // place cursor at end
      const len = editInputRef.current.value.length;
      editInputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  // Compute selected bounding box
  const minR = Math.min(activeCell.r, selectionEnd.r);
  const maxR = Math.max(activeCell.r, selectionEnd.r);
  const minC = Math.min(activeCell.c, selectionEnd.c);
  const maxC = Math.max(activeCell.c, selectionEnd.c);

  // Status bar calculations for current selection
  const selectedStats = React.useMemo(() => {
    let sum = 0;
    let numCount = 0;
    let totalCells = 0;

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        totalCells++;
        const cell = grid[r]?.[c];
        if (cell && cell.value !== null && cell.value !== undefined && cell.value !== '') {
          const num = Number(cell.value);
          if (!isNaN(num)) {
            sum += num;
            numCount++;
          }
        }
      }
    }

    return {
      sum: numCount > 0 ? sum : null,
      average: numCount > 0 ? sum / numCount : null,
      count: totalCells,
      numCount,
    };
  }, [grid, minR, maxR, minC, maxC]);

  // Global keyboard navigation on the grid
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        e.preventDefault();
        onCommitEdit();
        if (e.shiftKey) {
          onSelectCell(Math.max(0, activeCell.r - 1), activeCell.c);
        } else {
          onSelectCell(Math.min(rowCount - 1, activeCell.r + 1), activeCell.c);
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        onCommitEdit();
        if (e.shiftKey) {
          onSelectCell(activeCell.r, Math.max(0, activeCell.c - 1));
        } else {
          onSelectCell(activeCell.r, Math.min(colCount - 1, activeCell.c + 1));
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancelEdit();
      }
      return;
    }

    // Navigation when NOT editing
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onSelectCell(Math.max(0, activeCell.r - 1), activeCell.c, e.shiftKey);
        break;
      case 'ArrowDown':
        e.preventDefault();
        onSelectCell(Math.min(rowCount - 1, activeCell.r + 1), activeCell.c, e.shiftKey);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onSelectCell(activeCell.r, Math.max(0, activeCell.c - 1), e.shiftKey);
        break;
      case 'ArrowRight':
        e.preventDefault();
        onSelectCell(activeCell.r, Math.min(colCount - 1, activeCell.c + 1), e.shiftKey);
        break;
      case 'Enter':
        e.preventDefault();
        if (e.shiftKey) {
          onSelectCell(Math.max(0, activeCell.r - 1), activeCell.c);
        } else {
          onSelectCell(Math.min(rowCount - 1, activeCell.r + 1), activeCell.c);
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          onSelectCell(activeCell.r, Math.max(0, activeCell.c - 1));
        } else {
          onSelectCell(activeCell.r, Math.min(colCount - 1, activeCell.c + 1));
        }
        break;
      case 'F2':
        e.preventDefault();
        onStartEdit();
        break;
      case 'Backspace':
      case 'Delete':
        // Start edit with empty string
        e.preventDefault();
        onStartEdit('');
        break;
      default:
        // Typing letters or numbers directly starts editing
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          onStartEdit(e.key);
        }
        break;
    }
  };

  // Formula suggestions when typing e.g. "=S"
  const suggestions = React.useMemo(() => {
    if (!isEditing || !editValue.startsWith('=')) return [];
    const query = editValue.substring(1).toUpperCase().trim();
    if (!query || query.includes('(')) return [];
    return FORMULA_DICTIONARY.filter((item) => item.name.startsWith(query)).slice(0, 4);
  }, [isEditing, editValue]);

  // Select suggestion
  const handleSelectSuggestion = (fnName: string) => {
    onEditChange(`=${fnName}(`);
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col h-full bg-[#f8f9fa] overflow-hidden select-none outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={containerRef}
    >
      {/* Scrollable Spreadsheet Table */}
      <div 
        className="flex-1 overflow-auto relative border-b border-slate-300"
        onMouseUp={() => setIsMouseDown(false)}
      >
        <table className="border-collapse table-fixed min-w-full text-xs font-sans">
          {/* Column Headers */}
          <thead className="sticky top-0 z-10 bg-slate-200">
            <tr>
              {/* Top-left corner */}
              <th className="w-12 h-6 border-r border-b border-slate-300 bg-slate-200 text-slate-500 font-semibold sticky left-0 z-20">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 border-r border-b border-slate-400 rotate-45 transform origin-center opacity-40"></div>
                </div>
              </th>
              {Array.from({ length: colCount }).map((_, c) => {
                const colLetter = colIndexToName(c);
                const isColActive = minC <= c && c <= maxC;
                return (
                  <th
                    key={c}
                    className={`min-w-[125px] w-32 h-6 border-r border-b border-slate-300 font-medium text-center transition-colors ${
                      isColActive ? 'bg-emerald-100 text-emerald-900 font-bold border-b-[#107c41]' : 'text-slate-600 bg-slate-200'
                    }`}
                  >
                    {colLetter}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Grid Rows */}
          <tbody>
            {Array.from({ length: rowCount }).map((_, r) => {
              const isRowActive = minR <= r && r <= maxR;
              return (
                <tr key={r} className="h-7">
                  {/* Row Header Number */}
                  <th
                    className={`w-12 border-r border-b border-slate-300 text-center font-medium sticky left-0 z-10 transition-colors ${
                      isRowActive ? 'bg-emerald-100 text-emerald-900 font-bold border-r-[#107c41]' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {r + 1}
                  </th>

                  {/* Row Cells */}
                  {Array.from({ length: colCount }).map((_, c) => {
                    const cellAddr = formatCellAddress(r, c);
                    const cell = grid[r]?.[c];
                    const isTarget = targetCells.includes(cellAddr);
                    const isActive = activeCell.r === r && activeCell.c === c;
                    const isSelected = r >= minR && r <= maxR && c >= minC && c <= maxC;

                    // Custom cell styles
                    const style = cell?.style || {};
                    const displayValue = formatValueForDisplay(cell?.value ?? '', style.format);

                    // Background color resolution
                    let cellBg = style.bgColor || '#ffffff';
                    if (isSelected && !isActive) {
                      cellBg = '#e8f5e9'; // Soft green highlight for selection
                    }
                    if (isTarget && !cell?.value && !isEditing) {
                      cellBg = '#fef9c3'; // Subtle yellow target prompt
                    }

                    return (
                      <td
                        key={c}
                        onMouseDown={() => {
                          setIsMouseDown(true);
                          onSelectCell(r, c);
                        }}
                        onMouseEnter={() => {
                          if (isMouseDown) {
                            onSelectCell(r, c, true);
                          }
                        }}
                        onDoubleClick={() => {
                          onStartEdit();
                        }}
                        className={`border-r border-b border-slate-200 px-2 py-1 relative truncate transition-shadow ${
                          isActive 
                            ? 'ring-2 ring-[#107c41] ring-inset z-5 font-medium' 
                            : ''
                        } ${
                          isTarget && !isActive
                            ? 'outline-2 outline-dashed outline-amber-400 outline-offset-[-2px]'
                            : ''
                        }`}
                        style={{
                          backgroundColor: cellBg,
                          fontWeight: style.bold ? '700' : '400',
                          fontStyle: style.italic ? 'italic' : 'normal',
                          textDecoration: style.underline ? 'underline' : 'none',
                          textAlign: style.align || (typeof cell?.value === 'number' ? 'right' : 'left'),
                          color: style.textColor || '#1e293b',
                          borderTop: style.borderTop ? '2px solid #1e293b' : undefined,
                          borderBottom: style.borderBottom ? '2px double #1e293b' : undefined,
                        }}
                      >
                        {/* Target badge indicator */}
                        {isTarget && !cell?.value && (
                          <span className="absolute top-0.5 right-1 text-[9px] font-bold text-amber-700 pointer-events-none opacity-80 uppercase">
                            Target
                          </span>
                        )}

                        {/* Inline Editor if active and editing */}
                        {isActive && isEditing ? (
                          <div className="absolute inset-0 z-30 bg-white">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editValue}
                              onChange={(e) => onEditChange(e.target.value)}
                              className="w-full h-full px-2 py-0 font-mono text-xs text-slate-900 border-2 border-[#107c41] outline-none"
                            />
                            {/* Suggestions Popup */}
                            {suggestions.length > 0 && (
                              <div className="absolute left-0 top-full mt-1 bg-white border border-slate-300 rounded shadow-lg z-40 py-1 min-w-[200px]">
                                <div className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 border-b border-slate-100">
                                  SUGESTI FUNGSI EXCEL
                                </div>
                                {suggestions.map((fn) => (
                                  <button
                                    key={fn.name}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleSelectSuggestion(fn.name);
                                    }}
                                    className="w-full text-left px-2 py-1 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between text-xs"
                                  >
                                    <span className="font-bold font-mono text-[#107c41]">{fn.name}</span>
                                    <span className="text-[10px] text-slate-500">{fn.category}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="block truncate">
                            {displayValue}
                          </span>
                        )}

                        {/* Active Cell Corner Drag Handle */}
                        {isActive && !isEditing && (
                          <div 
                            className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#107c41] border border-white z-10 cursor-crosshair"
                            title="Tarik untuk mengisi sel (Fill Handle)"
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Spreadsheet Status Bar */}
      <div className="bg-slate-200 border-t border-slate-300 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-700 shrink-0 font-medium select-none">
        {/* Left: Ready indicator & sheet tabs */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Siap</span>
          </div>

          <div className="flex items-center bg-slate-300/80 rounded px-2 py-0.5 text-slate-800 font-semibold border border-slate-400/50">
            <span>Lembar 1 (Aktif)</span>
          </div>
        </div>

        {/* Right: Real-time Selection Metrics */}
        <div className="flex items-center gap-4 text-slate-600">
          {selectedStats.average !== null && (
            <div>
              <span>Rata-Rata: </span>
              <span className="font-bold text-slate-900 font-mono">
                {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(selectedStats.average)}
              </span>
            </div>
          )}

          <div>
            <span>Jumlah Sel: </span>
            <span className="font-bold text-slate-900 font-mono">{selectedStats.count}</span>
          </div>

          {selectedStats.sum !== null && (
            <div>
              <span>Total: </span>
              <span className="font-bold text-[#107c41] font-mono">
                {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(selectedStats.sum)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

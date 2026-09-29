import React, { useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface FormulaBarProps {
  selectedAddress: string;
  formulaValue: string;
  isEditing: boolean;
  onFormulaChange: (val: string) => void;
  onFormulaSubmit: () => void;
  onFormulaCancel: () => void;
  onFormulaFocus: () => void;
}

export const FormulaBar: React.FC<FormulaBarProps> = ({
  selectedAddress,
  formulaValue,
  isEditing,
  onFormulaChange,
  onFormulaSubmit,
  onFormulaCancel,
  onFormulaFocus,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onFormulaSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onFormulaCancel();
    }
  };

  return (
    <div className="bg-white border-b border-slate-300 px-2 py-1 flex items-center gap-1 shrink-0 select-none text-xs">
      {/* Name Box (Current Cell Address) */}
      <div 
        className="w-16 h-7 px-2 bg-slate-50 border border-slate-300 rounded flex items-center justify-center font-mono font-bold text-slate-800 tracking-wider shadow-2xs"
        title="Kotak Nama / Koordinat Sel"
      >
        {selectedAddress || 'A1'}
      </div>

      {/* Editing Action Buttons */}
      <div className="flex items-center gap-0.5 px-1 border-r border-slate-300">
        <button
          onClick={onFormulaCancel}
          disabled={!isEditing}
          title="Batalkan Perubahan (Esc)"
          className={`p-1 rounded ${
            isEditing 
              ? 'text-red-600 hover:bg-red-50 cursor-pointer' 
              : 'text-slate-300 cursor-default'
          }`}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onFormulaSubmit}
          disabled={!isEditing}
          title="Terapkan Rumus (Enter)"
          className={`p-1 rounded ${
            isEditing 
              ? 'text-emerald-700 hover:bg-emerald-50 cursor-pointer font-bold' 
              : 'text-slate-300 cursor-default'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* fx Label */}
      <div className="px-2 text-slate-500 font-serif italic font-bold text-sm tracking-tight select-none">
        fx
      </div>

      {/* Formula Input */}
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={formulaValue}
          onChange={(e) => onFormulaChange(e.target.value)}
          onFocus={onFormulaFocus}
          onKeyDown={handleKeyDown}
          placeholder="Ketik nilai atau rumus (misal: =SUM(B2:B5))..."
          className="w-full h-7 px-2 font-mono text-xs text-slate-900 border border-slate-300 rounded focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41] focus:outline-none transition-all"
        />
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  DollarSign, 
  Percent, 
  Hash, 
  PaintBucket, 
  Type, 
  Eraser, 
  Sigma, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CellStyle } from '../types/spreadsheet';

interface ExcelToolbarProps {
  currentStyle?: CellStyle;
  onApplyStyle: (style: Partial<CellStyle>) => void;
  onClearCell: () => void;
  onInsertSumFormula: () => void;
}

export const ExcelToolbar: React.FC<ExcelToolbarProps> = ({
  currentStyle = {},
  onApplyStyle,
  onClearCell,
  onInsertSumFormula,
}) => {
  return (
    <div className="bg-slate-100 border-b border-slate-300 px-3 py-1 flex items-center gap-1 flex-wrap shrink-0 text-slate-700 select-none">
      {/* Font Styles */}
      <div className="flex items-center gap-0.5 border-r border-slate-300 pr-2">
        <button
          onClick={() => onApplyStyle({ bold: !currentStyle.bold })}
          title="Tebal (Ctrl+B)"
          className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
            currentStyle.bold ? 'bg-slate-300 text-slate-900 font-bold' : ''
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onApplyStyle({ italic: !currentStyle.italic })}
          title="Miring (Ctrl+I)"
          className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
            currentStyle.italic ? 'bg-slate-300 text-slate-900' : ''
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onApplyStyle({ underline: !currentStyle.underline })}
          title="Garis Bawah (Ctrl+U)"
          className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
            currentStyle.underline ? 'bg-slate-300 text-slate-900' : ''
          }`}
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 border-r border-slate-300 pr-2">
        <button
          onClick={() => onApplyStyle({ align: 'left' })}
          title="Rata Kiri"
          className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
            currentStyle.align === 'left' ? 'bg-slate-300 text-slate-900' : ''
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onApplyStyle({ align: 'center' })}
          title="Rata Tengah"
          className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
            currentStyle.align === 'center' ? 'bg-slate-300 text-slate-900' : ''
          }`}
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onApplyStyle({ align: 'right' })}
          title="Rata Kanan"
          className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
            currentStyle.align === 'right' ? 'bg-slate-300 text-slate-900' : ''
          }`}
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Number Formats */}
      <div className="flex items-center gap-0.5 border-r border-slate-300 pr-2">
        <button
          onClick={() => onApplyStyle({ format: currentStyle.format === 'currency' ? 'general' : 'currency' })}
          title="Format Mata Uang Rupiah (Rp)"
          className={`flex items-center gap-1 px-1.5 py-1 text-xs font-semibold rounded hover:bg-slate-200 transition-colors ${
            currentStyle.format === 'currency' ? 'bg-slate-300 text-emerald-800' : ''
          }`}
        >
          <span className="font-mono text-[11px]">Rp</span>
        </button>

        <button
          onClick={() => onApplyStyle({ format: currentStyle.format === 'percent' ? 'general' : 'percent' })}
          title="Format Persen (%)"
          className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
            currentStyle.format === 'percent' ? 'bg-slate-300 text-blue-800' : ''
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onApplyStyle({ format: 'general' })}
          title="Format Standar"
          className={`px-1.5 py-1 text-xs rounded hover:bg-slate-200 transition-colors ${
            currentStyle.format === 'general' || !currentStyle.format ? 'bg-slate-300' : ''
          }`}
        >
          <span className="text-[11px] font-mono">123</span>
        </button>
      </div>

      {/* Cell Fill Colors */}
      <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
        <span className="text-[11px] text-slate-500 hidden sm:inline flex items-center gap-0.5">
          <PaintBucket className="w-3 h-3" />
        </span>
        <div className="flex items-center gap-1">
          {[
            { color: '#ffffff', label: 'Putih' },
            { color: '#fef3c7', label: 'Kuning' },
            { color: '#dcfce7', label: 'Hijau' },
            { color: '#e0f2fe', label: 'Biru' },
            { color: '#fee2e2', label: 'Merah' },
          ].map((item) => (
            <button
              key={item.color}
              onClick={() => onApplyStyle({ bgColor: item.color === '#ffffff' ? undefined : item.color })}
              title={`Isi warna: ${item.label}`}
              className="w-4 h-4 rounded border border-slate-400 hover:scale-110 transition-transform"
              style={{ backgroundColor: item.color }}
            />
          ))}
        </div>
      </div>

      {/* Quick Insert SUM */}
      <button
        onClick={onInsertSumFormula}
        title="Otomatis masukkan rumus =SUM(...)"
        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-2xs"
      >
        <Sigma className="w-3.5 h-3.5 text-emerald-700" />
        <span className="font-semibold">AutoSum</span>
      </button>

      {/* Clear cell */}
      <button
        onClick={onClearCell}
        title="Hapus isi & format sel terpilih"
        className="p-1.5 rounded hover:bg-red-50 text-slate-600 hover:text-red-700 transition-colors ml-auto"
      >
        <Eraser className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

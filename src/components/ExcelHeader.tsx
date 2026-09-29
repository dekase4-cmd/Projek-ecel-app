import React from 'react';
import { 
  FileSpreadsheet, 
  HelpCircle, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  Keyboard, 
  BookOpen
} from 'lucide-react';

interface ExcelHeaderProps {
  completedCount: number;
  totalExercises: number;
  onResetSheet: () => void;
  onExportCsv: () => void;
  onOpenShortcuts: () => void;
  activeExerciseTitle?: string;
  onOpenHelp: () => void;
}

export const ExcelHeader: React.FC<ExcelHeaderProps> = ({
  completedCount,
  totalExercises,
  onResetSheet,
  onExportCsv,
  onOpenShortcuts,
  activeExerciseTitle,
  onOpenHelp,
}) => {
  const progressPercent = Math.round((completedCount / totalExercises) * 100);

  return (
    <header className="bg-[#107c41] text-white px-4 py-2 flex items-center justify-between shadow-md select-none shrink-0 z-20">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="bg-white/15 p-1.5 rounded-lg flex items-center justify-center">
          <FileSpreadsheet className="w-5 h-5 text-emerald-200" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-base leading-tight">Excel LearnHub</span>
            <span className="text-[11px] px-2 py-0.5 bg-emerald-900/60 rounded text-emerald-200 border border-emerald-500/30">
              Modul & Praktek Interaktif
            </span>
          </div>
          <p className="text-xs text-emerald-100/80 truncate max-w-[280px] md:max-w-md">
            {activeExerciseTitle ? activeExerciseTitle : 'Mode Eksplorasi Bebas'}
          </p>
        </div>
      </div>

      {/* Center: Progress Metric */}
      <div className="hidden lg:flex items-center gap-3 bg-emerald-900/40 px-3 py-1.5 rounded-lg border border-emerald-600/40">
        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
        <div className="text-xs">
          <span className="text-emerald-200">Progress Latihan: </span>
          <span className="font-semibold text-white">{completedCount}</span>
          <span className="text-emerald-200"> / {totalExercises} Selesai</span>
        </div>
        <div className="w-20 bg-emerald-950/60 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Right: Quick Tools */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenShortcuts}
          title="Pintasan Keyboard Excel"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-50 hover:bg-emerald-800/80 rounded-md transition-colors"
        >
          <Keyboard className="w-4 h-4" />
          <span className="hidden sm:inline">Pintasan</span>
        </button>

        <button
          onClick={onResetSheet}
          title="Reset lembar kerja ke kondisi awal"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-50 hover:bg-emerald-800/80 rounded-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          onClick={onExportCsv}
          title="Unduh data sebagai file CSV"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-50 hover:bg-emerald-800/80 rounded-md transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ekspor</span>
        </button>

        <button
          onClick={onOpenHelp}
          title="Panduan Belajar"
          className="p-1.5 text-emerald-100 hover:text-white hover:bg-emerald-800/80 rounded-md transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { 
  CheckCircle, 
  Lightbulb, 
  Eye, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  Compass,
  Sparkles
} from 'lucide-react';
import { ExerciseItem } from '../types/spreadsheet';

interface TaskPanelProps {
  currentExercise: ExerciseItem | null;
  onCheckAnswer: () => void;
  onSelectNextExercise?: () => void;
  isCompleted?: boolean;
}

export const TaskPanel: React.FC<TaskPanelProps> = ({
  currentExercise,
  onCheckAnswer,
  onSelectNextExercise,
  isCompleted,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  if (!currentExercise) {
    return (
      <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900 shrink-0">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <b>Mode Bebas:</b> Pilih salah satu modul di tab <b>Latihan Interaktif</b> di panel kiri untuk memulai tantangan terarah dengan koreksi otomatis.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200/90 px-4 py-2.5 flex flex-col gap-2 shrink-0 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Task instruction */}
        <div className="flex items-start gap-2.5 flex-1 min-w-[280px]">
          <div className="mt-0.5 p-1 bg-amber-100 text-amber-800 rounded">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 text-sm">{currentExercise.title}</span>
              <span className="text-[11px] font-medium px-2 py-0.5 bg-amber-100/90 text-amber-800 rounded border border-amber-300/50">
                Target: {currentExercise.targetCells.join(', ')}
              </span>
              {isCompleted && (
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-300 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Selesai
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
              {currentExercise.instruction}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Petunjuk</span>
            {showHint ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            <span>Kunci Rumus</span>
          </button>

          <button
            onClick={onCheckAnswer}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#107c41] hover:bg-[#0b5a2f] active:scale-98 rounded shadow-xs transition-all cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Cek Jawaban</span>
          </button>
        </div>
      </div>

      {/* Expandable Hint Accordion */}
      {showHint && (
        <div className="bg-amber-100/70 border border-amber-300/80 rounded-md p-2.5 text-xs text-amber-950 flex items-start gap-2 transition-all">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-900">Tips Pengerjaan: </span>
            {currentExercise.hint}
          </div>
        </div>
      )}

      {/* Expandable Solution Accordion */}
      {showSolution && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-2.5 text-xs text-blue-950 flex items-start gap-2 transition-all">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed flex-1">
            <div className="font-semibold text-blue-900 mb-1">
              Rumus Solusi: <code className="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-mono font-bold">{currentExercise.solutionFormula}</code>
            </div>
            <div className="text-slate-600">{currentExercise.solutionExplanation}</div>
          </div>
        </div>
      )}
    </div>
  );
};

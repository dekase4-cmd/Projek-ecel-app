import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  Trophy
} from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  feedback: string;
  solutionFormula?: string;
  onClose: () => void;
  onNextExercise?: () => void;
  hasNextExercise?: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  isCorrect,
  feedback,
  solutionFormula,
  onClose,
  onNextExercise,
  hasNextExercise,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header Banner */}
        <div className={`p-5 flex items-center gap-3 ${
          isCorrect 
            ? 'bg-gradient-to-r from-emerald-600 to-[#107c41] text-white' 
            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
        }`}>
          <div className="p-2.5 bg-white/20 rounded-full">
            {isCorrect ? (
              <Trophy className="w-6 h-6 text-yellow-300" />
            ) : (
              <XCircle className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-snug">
              {isCorrect ? 'Jawaban Kamu Tepat!' : 'Perlu Sedikit Perbaikan'}
            </h3>
            <p className="text-xs text-white/90">
              {isCorrect ? 'Evaluasi rumus dan hasil perhitungan berhasil.' : 'Simak umpan balik berikut untuk menyelesaikan tantangan.'}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            {feedback}
          </div>

          {solutionFormula && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs">
              <span className="text-emerald-800 font-semibold block mb-1">
                Kunci Rumus Excel:
              </span>
              <code className="font-mono bg-white text-emerald-900 px-2 py-1 rounded border border-emerald-300 block font-bold text-xs select-all">
                {solutionFormula}
              </code>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {isCorrect ? 'Tutup' : 'Coba Lagi'}
          </button>

          {isCorrect && hasNextExercise && (
            <button
              onClick={() => {
                onClose();
                if (onNextExercise) onNextExercise();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#107c41] hover:bg-[#0b5a2f] rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>Lanjut Latihan Berikutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

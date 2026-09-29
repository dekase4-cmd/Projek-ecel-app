import React from 'react';
import { HelpCircle, X, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="p-4 bg-[#107c41] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base">Panduan Belajar Excel LearnHub</h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-[11px]">
              1
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-0.5">Eksplorasi Kamus Rumus</p>
              <p>Buka tab <b>Kamus Fungsi</b> di sidebar sebelah kiri untuk melihat penjelasan, sintaks resmi, dan contoh praktis rumus-rumus populer seperti SUM, AVERAGE, IF, VLOOKUP, INDEX, MATCH, dan lainnya.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-[11px]">
              2
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-0.5">Kerjakan Latihan Interaktif</p>
              <p>Pilih salah satu latihan di tab <b>Latihan Interaktif</b>. Perhatikan instruksi pada banner atas dan sel target yang disorot (misal sel <b>B6</b>).</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-[11px]">
              3
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-0.5">Ketik Rumus & Cek Jawaban</p>
              <p>Ketik rumus diawali tanda sama dengan (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded font-bold">=</code>) langsung di sel atau formula bar, lalu tekan tombol <b>Cek Jawaban</b> untuk mendapatkan verifikasi instan.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-[11px]">
              4
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-0.5">Ekspor & Eksplorasi Bebas</p>
              <p>Gunakan tombol <b>Ekspor CSV</b> di kanan atas untuk mengunduh hasil spreadsheet Anda ke komputer, atau gunakan template bisnis siap pakai.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#107c41] hover:bg-[#0b5a2f] rounded-lg transition-colors cursor-pointer"
          >
            Mulai Belajar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

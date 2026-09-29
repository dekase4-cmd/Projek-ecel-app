import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Enter', action: 'Konfirmasi rumus / pindah ke sel bawah' },
    { key: 'Shift + Enter', action: 'Pindah ke sel atas' },
    { key: 'Tab', action: 'Konfirmasi rumus / pindah ke sel kanan' },
    { key: 'Shift + Tab', action: 'Pindah ke sel kiri' },
    { key: 'Panah (↑ ↓ ← →)', action: 'Navigasi antar sel tabel' },
    { key: 'F2 / Klik Ganda', action: 'Masuk ke mode edit isi sel aktif' },
    { key: 'Escape (Esc)', action: 'Batalkan input rumus yang sedang diedit' },
    { key: 'Backspace / Delete', action: 'Kosongkan isi sel yang dipilih' },
    { key: '=', action: 'Mulai mengetik rumus / formula matematika' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Pintasan Keyboard Excel</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto divide-y divide-slate-100">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-700">{item.action}</span>
              <kbd className="px-2.5 py-1 bg-slate-100 text-slate-800 font-mono font-semibold rounded border border-slate-300 shadow-2xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

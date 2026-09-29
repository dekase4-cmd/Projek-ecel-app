import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Award, 
  FileText, 
  Play, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowUpRight,
  Sparkles,
  Info
} from 'lucide-react';
import { FormulaDocItem, ExerciseItem } from '../types/spreadsheet';
import { TemplateItem } from '../data/templates';

interface SidebarProps {
  dictionary: FormulaDocItem[];
  exercises: ExerciseItem[];
  templates: TemplateItem[];
  currentExerciseId: number | null;
  completedExerciseIds: number[];
  onSelectExercise: (id: number) => void;
  onLoadDictionarySample: (item: FormulaDocItem) => void;
  onLoadTemplate: (template: TemplateItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  dictionary,
  exercises,
  templates,
  currentExerciseId,
  completedExerciseIds,
  onSelectExercise,
  onLoadDictionarySample,
  onLoadTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'kamus' | 'latihan' | 'template'>('kamus');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Semua');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Copy formula syntax to clipboard
  const handleCopyFormula = (syntax: string) => {
    navigator.clipboard.writeText(syntax);
    setCopiedFormula(syntax);
    setTimeout(() => setCopiedFormula(null), 1800);
  };

  // Filter dictionary items
  const filteredDictionary = dictionary.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.syntax.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter exercises
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.instruction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff =
      selectedDifficulty === 'Semua' || ex.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  // Filter templates
  const filteredTemplates = templates.filter((tpl) =>
    tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tpl.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['Semua', 'Matematika', 'Statistik', 'Logika', 'Lookup', 'Teks', 'Tanggal'];
  const difficulties = ['Semua', 'Pemula', 'Menengah', 'Lanjutan'];

  return (
    <aside className="w-84 md:w-96 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 select-none shadow-sm z-10">
      {/* Sidebar Header */}
      <div className="p-4 bg-slate-900 text-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <h1 className="font-bold text-base tracking-tight">Katalog Modul Excel</h1>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            v2026.1
          </span>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari rumus / latihan (misal: SUM, IF)..."
            className="w-full bg-slate-800 text-xs text-white placeholder-slate-400 pl-9 pr-3 py-2 rounded-md border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
        <button
          onClick={() => setActiveTab('kamus')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'kamus'
              ? 'bg-white text-[#107c41] border-b-2 border-[#107c41] shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Kamus Fungsi</span>
        </button>

        <button
          onClick={() => setActiveTab('latihan')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'latihan'
              ? 'bg-white text-[#107c41] border-b-2 border-[#107c41] shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Latihan Interaktif</span>
        </button>

        <button
          onClick={() => setActiveTab('template')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'template'
              ? 'bg-white text-[#107c41] border-b-2 border-[#107c41] shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Template</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
        {/* TAB 1: KAMUS FUNGSI */}
        {activeTab === 'kamus' && (
          <div>
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] rounded-md font-medium shrink-0 transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#107c41] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredDictionary.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                Tidak ada rumus yang cocok dengan "{searchQuery}".
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDictionary.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white border border-slate-200 rounded-lg p-3 hover:border-emerald-300 transition-all shadow-2xs group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#107c41] font-mono tracking-tight">
                          {item.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {item.category}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyFormula(item.syntax)}
                        title="Salin sintaks rumus"
                        className="text-slate-400 hover:text-slate-700 p-1 rounded"
                      >
                        {copiedFormula === item.syntax ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Syntax box */}
                    <div className="bg-slate-900 text-emerald-300 font-mono text-[11px] p-2 rounded mb-2 overflow-x-auto select-text">
                      {item.syntax}
                    </div>

                    {/* Example & Try Button */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500 italic truncate max-w-[170px]">
                        Contoh: {item.example}
                      </span>

                      {item.sampleSheetData && (
                        <button
                          onClick={() => onLoadDictionarySample(item)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#107c41] hover:text-[#0b5a2f] hover:underline"
                        >
                          <span>Coba di Tabel</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LATIHAN INTERAKTIF */}
        {activeTab === 'latihan' && (
          <div>
            {/* Difficulty Filter Chips */}
            <div className="flex items-center gap-1 pb-2 mb-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 text-[11px] rounded-md font-medium shrink-0 transition-colors ${
                    selectedDifficulty === diff
                      ? 'bg-[#107c41] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {filteredExercises.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                Tidak ada latihan yang cocok dengan kriteria.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExercises.map((ex) => {
                  const isCurrent = currentExerciseId === ex.id;
                  const isCompleted = completedExerciseIds.includes(ex.id);

                  return (
                    <div
                      key={ex.id}
                      className={`bg-white border rounded-lg p-3 transition-all ${
                        isCurrent
                          ? 'border-[#107c41] ring-1 ring-[#107c41] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs text-slate-900">
                              {ex.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                            <span>Kategori: {ex.category}</span>
                            <span>•</span>
                            <span>Level: {ex.difficulty}</span>
                            <span>•</span>
                            <span className="text-amber-700 font-semibold font-mono">
                              Sel: {ex.targetCells.join(', ')}
                            </span>
                          </div>
                        </div>

                        {isCompleted && (
                          <div className="p-1 text-emerald-600 bg-emerald-50 rounded-full shrink-0" title="Sudah Selesai">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                        {ex.instruction}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">
                          {isCurrent ? '● Sedang Dikerjakan' : ''}
                        </span>

                        <button
                          onClick={() => onSelectExercise(ex.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-colors ${
                            isCurrent
                              ? 'bg-slate-100 text-slate-800 border border-slate-300'
                              : 'bg-[#107c41] hover:bg-[#0b5a2f] text-white shadow-2xs'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isCurrent ? 'Reset Soal' : 'Muat Soal'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TEMPLATE DATA */}
        {activeTab === 'template' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-600 mb-1">
              Gunakan lembar kerja preset berikut untuk bereksperimen dengan berbagai skenario data nyata:
            </div>

            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white border border-slate-200 rounded-lg p-3 hover:border-emerald-300 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">{tpl.name}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {tpl.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {tpl.description}
                </p>
                <button
                  onClick={() => onLoadTemplate(tpl)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-[#107c41] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Gunakan Lembar Ini</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

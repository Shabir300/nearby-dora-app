
import React, { useState, useEffect } from 'react';
import { QuranService } from '../../services/quran';
import { Icons } from '../../constants';

interface QuranIndexProps {
    onSelect: (mode: 'juz' | 'surah', id: number) => void;
    onClose: () => void;
}

export const QuranIndex: React.FC<QuranIndexProps> = ({ onSelect, onClose }) => {
    const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'bookmarks'>('surah');
    const [chapters, setChapters] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [lastRead, setLastRead] = useState<{ mode: 'surah' | 'juz', id: number, name: string, detail: string } | null>(null);

    useEffect(() => {
        // Load Chapters
        QuranService.getChapters().then(data => {
            console.log("QuranIndex: Loaded chapters", data?.length); // Debug log
            setChapters(data || []);
        }).catch(err => {
            console.error("QuranIndex: Failed to load chapters", err);
            setChapters([]);
        });

        // Load Last Read
        const saved = localStorage.getItem('quran_last_read');
        if (saved) {
            setLastRead(JSON.parse(saved));
        }
    }, []);

    const filteredChapters = (chapters || []).filter(c =>
        c.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name_arabic.includes(searchQuery)
    );

    const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="flex flex-col h-full bg-[#fdfcf6]">
            {/* Header & Search */}
            <div className="pt-12 px-6 pb-4">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={onClose}><Icons.ChevronLeft /></button>
                    <h2 className="text-2xl font-black text-[#0f172a]">The Noble Quran</h2>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icons.Search />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Surah, Ayah or Keyword"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 text-[#0f172a]"
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 custom-scroll">
                {/* Last Read Banner */}
                {lastRead && !searchQuery && (
                    <div
                        onClick={() => onSelect(lastRead.mode, lastRead.id)}
                        className="mb-8 rounded-xl bg-[#064e3b] p-6 relative overflow-hidden shadow-xl group cursor-pointer transition-transform active:scale-[0.98]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-colors"></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded-md bg-white/20 text-emerald-50 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                                        Continue Reading
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1 font-urdu">{lastRead.name}</h3>
                                <p className="text-emerald-100/80 text-xs font-medium">{lastRead.detail}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform">
                                <Icons.Play />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {(['surah', 'juz', 'bookmarks'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-[#064e3b] text-white shadow-lg shadow-emerald-900/20'
                                : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Surah List */}
                {activeTab === 'surah' && (
                    <div className="space-y-3">
                        {filteredChapters.map((surah) => (
                            <div
                                key={surah.id}
                                onClick={() => onSelect('surah', surah.id)}
                                className="group bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-[#064e3b]/30 hover:shadow-md transition-all active:scale-[0.99]"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#f8fafc] text-[#1e293b] flex items-center justify-center text-sm font-bold font-mono group-hover:bg-[#064e3b] group-hover:text-white transition-colors relative overflow-hidden">
                                    <span className="relative z-10">{surah.id}</span>
                                    <div className="absolute inset-0 bg-repeat opacity-5 pattern-grid"></div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-base font-bold text-[#0f172a] group-hover:text-[#064e3b] transition-colors">{surah.name_simple}</h4>
                                    <p className="text-xs text-slate-400 font-medium">{surah.verses_count} Verses • {surah.revelation_place}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-[#064e3b] font-urdu leading-none mb-1 opacity-80 group-hover:opacity-100">{surah.name_arabic}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{surah.name_complex}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Juz Grid */}
                {activeTab === 'juz' && (
                    <div className="grid grid-cols-3 gap-3">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                            <button
                                key={juz}
                                onClick={() => onSelect('juz', juz)}
                                className="aspect-square bg-white rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-[#064e3b] hover:bg-[#f1fcf5] transition-all group active:scale-95"
                            >
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider group-hover:text-[#064e3b]">Juz</span>
                                <span className="text-2xl font-black text-[#0f172a] group-hover:text-[#1a4d2e]">{juz}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Bookmarks Tab */}
                {activeTab === 'bookmarks' && (
                    <div className="space-y-3">
                        {(() => {
                            const bookmarks: string[] = JSON.parse(localStorage.getItem('quran_bookmarks') || '[]');
                            if (bookmarks.length === 0) {
                                return (
                                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                                            <Icons.Bookmark className="w-8 h-8" />
                                        </div>
                                        <p className="text-slate-500 font-bold">No bookmarks yet</p>
                                        <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                                            Bookmark your favorite ayahs to see them here.
                                        </p>
                                    </div>
                                );
                            }

                            // Import CHAPTERS here if needed or use from a globally accessible place
                            // Since it's a simple file, I'll just map manually or hope CHAPTERS is available
                            // Actually, chapters state already has the info.
                            return bookmarks.map((key) => {
                                const [sId, aId] = key.split(':').map(Number);
                                const surah = chapters.find(c => c.id === sId);
                                return (
                                    <div
                                        key={key}
                                        onClick={() => onSelect('surah', sId)}
                                        className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-[#064e3b]/30 hover:shadow-md transition-all active:scale-[0.99]"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold shadow-sm">
                                            {aId}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-[#0f172a]">{surah?.name_simple || `Surah ${sId}`}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ayah {aId}</p>
                                        </div>
                                        <div className="text-right">
                                            <Icons.ChevronRight className="text-slate-300 w-4 h-4" />
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

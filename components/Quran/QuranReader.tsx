
import React, { useEffect, useState, useRef } from 'react';
import { QuranService } from '../../services/quran';
import { Icons } from '../../constants';

interface QuranReaderProps {
    mode: 'juz' | 'surah';
    id: number;
    onBack: () => void;
    onNavigate?: (mode: 'juz' | 'surah', id: number) => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({ mode, id, onBack, onNavigate }) => {
    const [verses, setVerses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [headerInfo, setHeaderInfo] = useState({ title: "", subtitle: "" });
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [showJump, setShowJump] = useState(false);
    const [jumpId, setJumpId] = useState('');

    const scrollRef = useRef<HTMLDivElement>(null);
    const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    // Load Bookmarks
    useEffect(() => {
        const saved = localStorage.getItem('quran_bookmarks');
        if (saved) setBookmarks(JSON.parse(saved));
    }, []);

    const toggleBookmark = (verseKey: string) => {
        const newBookmarks = bookmarks.includes(verseKey)
            ? bookmarks.filter(b => b !== verseKey)
            : [...bookmarks, verseKey];
        setBookmarks(newBookmarks);
        localStorage.setItem('quran_bookmarks', JSON.stringify(newBookmarks));
    };

    const handleShare = async (verse: any) => {
        const text = `${verse.text_arabic}\n\n${verse.text_urdu}\n\n[${verse.surah_name} ${verse.ayah_id}]`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Quran Verse ${verse.verse_key}`,
                    text: text,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            await navigator.clipboard.writeText(text);
            alert('Verse copied to clipboard!');
        }
    };

    const handleJump = (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseInt(jumpId);
        if (num && ayahRefs.current[num]) {
            ayahRefs.current[num]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setShowJump(false);
            setJumpId('');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                let data = [];
                let name = "";
                let detail = "";

                if (mode === 'juz') {
                    data = await QuranService.getJuz(id);
                    name = `Juz ${id}`;
                    detail = "The Noble Quran";
                } else {
                    data = await QuranService.getSurah(id);
                    name = data[0]?.surah_name || `Surah ${id}`;
                    detail = `${id} . ${data.length} Ayahs`;
                }

                setVerses(data);
                setHeaderInfo({ title: name, subtitle: detail });

                // Save Last Read
                localStorage.setItem('quran_last_read', JSON.stringify({
                    mode,
                    id,
                    name: name,
                    detail: detail
                }));

            } catch (err) {
                console.error("Failed to load Quran data:", err);
            } finally {
                setLoading(false);
            }

            if (scrollRef.current) scrollRef.current.scrollTop = 0;
        };
        loadData();
    }, [mode, id]);

    return (
        <div className="flex flex-col h-full bg-[#fdfcf6]">

            <button>Back</button>
            {/* Header - Matching Image Header style */}
            <div className="bg-white pt-12 pb-4 px-4 shrink-0 shadow-sm border-b border-slate-100 flex items-center justify-between z-20 sticky top-0">
                <div className="flex items-center gap-1">
                    <button
                        onClick={onBack}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
                    >
                        <Icons.ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Next/Prev Surah Controls */}
                    {mode === 'surah' && (
                        <div className="hidden md:flex items-center gap-1 ml-2">
                            <button
                                onClick={() => id > 1 && onNavigate?.('surah', id - 1)}
                                className={`p-1.5 rounded-xl ${id > 1 ? 'text-[#064e3b] hover:bg-emerald-50' : 'text-slate-200'}`}
                            >
                                <Icons.ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => id < 114 && onNavigate?.('surah', id + 1)}
                                className={`p-1.5 rounded-xl ${id < 114 ? 'text-[#064e3b] hover:bg-emerald-50' : 'text-slate-200'}`}
                            >
                                <Icons.ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="text-center flex-1 mx-2 overflow-hidden">
                    {!showJump ? (
                        <div className="group">
                            <h2 className="text-lg font-bold text-[#064e3b] leading-tight">
                                {mode === 'surah' ? `Surah ${headerInfo.title}` : headerInfo.title}
                            </h2>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                                {headerInfo.subtitle}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleJump} className="flex items-center justify-center gap-2">
                            <input
                                autoFocus
                                type="number"
                                placeholder="Go to Ayah..."
                                value={jumpId}
                                onChange={(e) => setJumpId(e.target.value)}
                                className="w-24 bg-slate-50 border border-emerald-100 rounded-xl px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
                            />
                            <button type="button" onClick={() => setShowJump(false)} className="text-slate-400 p-1 hover:text-slate-600">
                                <Icons.Close className="w-4 h-4" />
                            </button>
                        </form>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Mobile Surah Nav */}
                    {mode === 'surah' && (
                        <div className="md:hidden flex items-center gap-0.5 mr-1">
                            <button onClick={() => id > 1 && onNavigate?.('surah', id - 1)} className={`p-1 ${id > 1 ? 'text-slate-400' : 'text-slate-200'}`}><Icons.ChevronLeft className="w-5 h-5" /></button>
                            <button onClick={() => id < 114 && onNavigate?.('surah', id + 1)} className={`p-1 ${id < 114 ? 'text-slate-400' : 'text-slate-200'}`}><Icons.ChevronRight className="w-5 h-5" /></button>
                        </div>
                    )}

                    {/* Search/Jump Button Replacing Play Button */}
                    <button
                        onClick={() => setShowJump(!showJump)}
                        className={`p-2 rounded-xl transition-all shadow-sm active:scale-95 ${showJump ? 'bg-[#064e3b] text-white' : 'bg-[#f1f5f9] text-[#064e3b] hover:bg-[#e2e8f0]'}`}
                    >
                        {showJump ? <Icons.Close className="w-5 h-5" /> : <Icons.Search className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                    <div className="w-10 h-10 border-4 border-[#064e3b] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium animate-pulse text-[#064e3b]">Loading Divine Words...</p>
                </div>
            )}

            {/* Reader Body */}
            {!loading && (
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 pb-24 custom-scroll">
                    {verses.length === 0 ? (
                        <div className="text-center p-12 text-red-500 font-medium bg-red-50 rounded-xl mx-4 my-10 border border-red-100">
                            Failed to load content. Please check your connection.
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto">
                            {/* Centered Bismillah consistently at top of content */}
                            <div className="text-center py-12 mb-4">
                                <h1
                                    className="text-4xl text-slate-800"
                                    style={{ fontFamily: "'AlMushaf', serif" }}
                                >
                                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                </h1>
                            </div>

                            <div className="space-y-12">
                                {verses.map((verse, index) => (
                                    <div
                                        key={index}
                                        ref={el => ayahRefs.current[verse.ayah_id] = el}
                                        className="flex flex-row-reverse items-start gap-4 scroll-mt-24"
                                    >

                                        {/* Right Side Column: Texts (Arabic and Translation) */}
                                        <div className="flex-1 text-right pt-1">
                                            {/* Arabic Text */}
                                            <p
                                                className="text-right text-[2.4rem] leading-[1.8] text-slate-800 mb-6"
                                                style={{ fontFamily: "'AlMushaf', serif" }}
                                                dir="rtl"
                                            >
                                                {/* Strip Bismillah if it's the first ayah of a surah in the text (except Fatiha) */}
                                                {verse.ayah_id === 1 && verse.surah_id !== 1 && verse.text_arabic.includes("بِسْمِ ٱللَّهِ") ?
                                                    verse.text_arabic.split("حِيمِ").slice(1).join("حِيمِ").trim() || verse.text_arabic
                                                    : verse.text_arabic
                                                }
                                            </p>

                                            {/* Translation Text (Urdu) */}
                                            <p
                                                className="text-right text-lg leading-[1.7] text-slate-500 font-medium font-urdu"
                                                dir="rtl"
                                            >
                                                {verse.text_urdu}
                                            </p>
                                        </div>

                                        {/* Left Side Side Panel - Ayah Number and Features */}
                                        <div className="flex flex-col items-center gap-5 w-10 sticky top-28 mt-2">
                                            {/* Ayah Number Circle */}
                                            <div className="w-8 h-8 rounded-full bg-[#faefe1] text-[#b4926a] flex items-center justify-center text-[10px] font-bold shadow-sm ring-4 ring-[#fdfcf6]">
                                                {verse.ayah_id}
                                            </div>

                                            {/* Feature Icons Column */}
                                            <div className="flex flex-col items-center gap-6">
                                                <button
                                                    onClick={() => toggleBookmark(`${verse.surah_id}:${verse.ayah_id}`)}
                                                    className={`transition-all hover:scale-110 active:scale-90 ${bookmarks.includes(`${verse.surah_id}:${verse.ayah_id}`) ? 'text-amber-500' : 'text-slate-300 hover:text-[#064e3b]'}`}
                                                >
                                                    <Icons.Bookmark className="w-4 h-4 fill-current" />
                                                </button>
                                                <button className="text-slate-300 hover:text-[#064e3b] transition-all hover:scale-110 active:scale-90">
                                                    <Icons.List className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleShare(verse)}
                                                    className="text-slate-300 hover:text-[#064e3b] transition-all hover:scale-110 active:scale-90"
                                                >
                                                    <Icons.Share className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

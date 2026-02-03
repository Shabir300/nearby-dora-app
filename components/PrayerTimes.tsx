import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getPrayerTimes, PrayerTimings, AladhanResponse } from '../src/services/aladhan';
import { Icons } from '../constants';

interface PrayerTimesProps {
    location: { lat: number; lng: number; name?: string } | null;
}

export const PrayerTimes: React.FC<PrayerTimesProps> = ({ location }) => {
    const [timings, setTimings] = useState<PrayerTimings | null>(null);
    const [hijriDate, setHijriDate] = useState<string>('');
    const [nextEvent, setNextEvent] = useState<{ name: string; time: string; timeLeft: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [calendarMonth, setCalendarMonth] = useState(new Date()); // For navigating months in calendar view

    const dateListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTimings = async () => {
            if (!location) return;
            setLoading(true);
            // We need the full response to get the Hijri date
            // The service currently returns 'data' which contains timings and date
            // I need to adjust the logic slightly because the getPrayerTimes return type was simplified in the service
            // But looking at the service code, it returns json.data which looks like { timings: ..., date: ... }
            // So I can cast the result

            try {
                // Re-using the service but we need to verify if it returns the full object
                // The service returns `Promise<AladhanResponse['data'] | null>`
                // AladhanResponse['data'] has { timings: ..., date: ... }
                const data = await getPrayerTimes(location.lat, location.lng, selectedDate);

                if (data) {
                    setTimings(data.timings);
                    // Format Hijri Date
                    const h = data.date.hijri;
                    setHijriDate(`${h.day} ${h.month.en} ${h.year}`);
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };

        fetchTimings();
    }, [location, selectedDate]);

    useEffect(() => {
        const isToday = selectedDate.toDateString() === new Date().toDateString();

        if (!timings || !isToday) {
            if (!isToday && timings) {
                setNextEvent(null);
            }
            return;
        }

        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = (time: string) => {
                const [h, m] = time.split(':');
                const d = new Date();
                d.setHours(parseInt(h), parseInt(m), 0, 0);
                return d;
            };

            const prayers = [
                { name: 'Fajr', time: timings.Fajr },
                { name: 'Dhuhr', time: timings.Dhuhr },
                { name: 'Asr', time: timings.Asr },
                { name: 'Maghrib', time: timings.Maghrib },
                { name: 'Isha', time: timings.Isha },
            ];

            let upcoming = null;
            for (const p of prayers) {
                const pTime = timeStr(p.time);
                if (pTime > now) {
                    upcoming = p;
                    break;
                }
            }

            if (upcoming) {
                const target = timeStr(upcoming.time);
                const diff = target.getTime() - now.getTime();
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                setNextEvent({
                    name: upcoming.name,
                    time: upcoming.time,
                    timeLeft: `IN ${hours}H ${minutes}M`
                });
            } else {
                setNextEvent({ name: 'Fajr', time: timings.Fajr, timeLeft: 'TOMORROW' });
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [timings, selectedDate]);

    // Generators for Calendar
    const weekDates = useMemo(() => {
        const dates = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // Generate dates around selected date for week view (or just centered on today)
        // Let's keep the user's previous requested logic (-5 to +25 days) for uniformity
        for (let i = -5; i <= 25; i++) {
            const d = new Date();
            d.setDate(new Date().getDate() + i);
            dates.push({
                dateObj: d,
                dayName: days[d.getDay()],
                dayNum: d.getDate(),
                fullDate: d.toDateString(),
                isToday: d.toDateString() === new Date().toDateString()
            });
        }
        return dates;
    }, []); // Static reference based on 'today'

    const monthDates = useMemo(() => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 = Sun

        const days = [];

        // Padding for prev month
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Days of month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }, [calendarMonth]);

    const changeMonth = (delta: number) => {
        const newMonth = new Date(calendarMonth);
        newMonth.setMonth(newMonth.getMonth() + delta);
        setCalendarMonth(newMonth);
    };

    if (!location) return null;

    const prayerConfig = [
        { key: 'Fajr', label: 'Fajr', sub: 'Dawn Prayer', iconBg: 'bg-blue-50', iconColor: 'text-blue-500', icon: Icons.Crescent },
        { key: 'Dhuhr', label: 'Dhuhr', sub: 'Noon Prayer', iconBg: 'bg-orange-50', iconColor: 'text-orange-500', icon: Icons.Lantern },
        { key: 'Asr', label: 'Asr', sub: 'Afternoon Prayer', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', icon: Icons.Crescent },
        { key: 'Maghrib', label: 'Maghrib', sub: 'Sunset Prayer', iconBg: 'bg-rose-50', iconColor: 'text-rose-500', icon: Icons.Lantern },
        { key: 'Isha', label: 'Isha', sub: 'Night Prayer', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', icon: Icons.Crescent },
    ];

    const headerDateStr = viewMode === 'week'
        ? selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })
        : calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">

            {/* --- HEADER SECTION --- */}
            <div className={`bg-[#1a4d2e] pt-6 px-0 transition-all duration-300 z-20 shrink-0 relative flex flex-col ${viewMode === 'month' ? 'pb-4 rounded-b-[2rem]' : 'pb-6 rounded-b-[2rem]'} shadow-xl`}>

                {/* Top Row: Title, Location, Hijri */}
                <div className="px-6 flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-white mb-0.5">Prayer Timings</h1>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-white/90 text-xs font-medium">
                                <Icons.MapPin />
                                <span className="opacity-90">{location.name || 'Unknown Location'}</span>
                            </div>
                            {/* Hijri Date Display */}
                            {hijriDate && (
                                <div className="text-[#a5d6a7] text-[11px] font-medium tracking-wide mt-0.5">
                                    {hijriDate}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-[#143a22] rounded-lg p-0.5">
                        <button
                            onClick={() => setViewMode('week')}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'week' ? 'bg-white text-[#1a4d2e] shadow-sm' : 'text-white/60 hover:text-white'}`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => {
                                setViewMode('month');
                                setCalendarMonth(selectedDate); // Sync calendar to selected date
                            }}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'month' ? 'bg-white text-[#1a4d2e] shadow-sm' : 'text-white/60 hover:text-white'}`}
                        >
                            Month
                        </button>
                    </div>
                </div>

                {/* Month Label & Navigation */}
                <div className="px-6 mb-3 flex items-center justify-between text-white">
                    {viewMode === 'month' && (
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><Icons.ChevronLeft /></button>
                    )}
                    <span className={`text-sm font-bold tracking-wide opacity-90 ${viewMode === 'week' ? '' : 'mx-auto'}`}>
                        {headerDateStr}
                    </span>
                    {viewMode === 'month' && (
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><Icons.ChevronRight /></button>
                    )}
                </div>

                {/* Calendar Content */}
                {viewMode === 'week' ? (
                    /* Week Strip */
                    <div className="overflow-x-auto pb-2 px-6 custom-scroll snap-x flex gap-4" ref={dateListRef}>
                        {weekDates.map((date, idx) => {
                            const isSelected = selectedDate.toDateString() === date.fullDate;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDate(date.dateObj)}
                                    className={`flex-shrink-0 flex flex-col items-center gap-1.5 snap-center transition-all group ${isSelected ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
                                >
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-[#a5d6a7]' : 'text-white'}`}>
                                        {date.isToday ? 'TDY' : date.dayName}
                                    </span>
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all shadow-sm ${isSelected ? 'bg-white text-[#1a4d2e] shadow-md' : 'text-white group-hover:bg-white/10'}`}>
                                        {date.dayNum}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    /* Month Grid */
                    <div className="px-6 pb-2">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 mb-2 text-center">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <div key={i} className="text-[10px] font-bold text-white/50">{d}</div>
                            ))}
                        </div>
                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-y-2 place-items-center">
                            {monthDates.map((date, idx) => {
                                if (!date) return <div key={idx} />;
                                const isSelected = selectedDate.toDateString() === date.toDateString();
                                const isToday = date.toDateString() === new Date().toDateString();

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedDate(date);
                                            // wrapper will fetch new data
                                        }}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-all
                                    ${isSelected ? 'bg-white text-[#1a4d2e] font-bold shadow-md' : 'text-white hover:bg-white/10'}
                                    ${isToday && !isSelected ? 'border border-[#a5d6a7] text-[#a5d6a7]' : ''}
                                `}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* --- PRAYER LIST SECTION --- */}
            <div className="flex-1 flex flex-col justify-start -mt-4 pt-8 pb-32 px-5 space-y-3 z-10 overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 animate-pulse">
                        <div className="w-8 h-8 border-4 border-[#1a4d2e]/20 border-t-[#1a4d2e] rounded-full animate-spin mb-2"></div>
                        <p className="text-[#1a4d2e] font-medium text-xs">Loading timings...</p>
                    </div>
                ) : timings ? (
                    <>
                        {prayerConfig.map((p) => {
                            const time = timings[p.key as keyof PrayerTimings];
                            const isNext = nextEvent?.name === p.key;

                            // Active State Design (Balanced)
                            if (isNext) {
                                return (
                                    <div key={p.key} className="bg-[#1a4d2e] rounded-2xl p-4 shadow-lg shadow-[#1a4d2e]/20 text-white transform scale-[1.02] transition-all relative overflow-hidden group shrink-0">
                                        {/* Background Decoration */}
                                        <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:bg-white/15 transition-colors"></div>

                                        <div className="flex justify-between items-center relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm border border-white/10">
                                                    <p.icon />
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="font-bold text-lg bg-transparent">{p.label}</h3>
                                                    <p className="text-green-100/80 text-[10px] font-medium uppercase tracking-wide">{p.sub}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <div className="bg-[#4ade80] text-[#064e3b] px-2 py-0.5 rounded text-[10px] font-black uppercase mb-1 inline-block tracking-wider shadow-sm">Next</div>
                                                <p className="font-bold text-2xl tracking-tight leading-none">{time}</p>
                                                <p className="text-[10px] font-bold text-[#4ade80] tracking-widest uppercase mt-1">{nextEvent.timeLeft}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // Standard State Design (Balanced)
                            return (
                                <div key={p.key} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-xl ${p.iconBg} ${p.iconColor} flex items-center justify-center`}>
                                            <p.icon />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-[#1e293b] text-lg">{p.label}</h3>
                                            <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wide">{p.sub}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-[#1a4d2e] text-xl tracking-tight">{time}</p>
                                </div>
                            );
                        })}

                        {/* Info Box */}
                        <div className="mt-2 p-3 bg-[#e8f5e9] rounded-xl border border-[#c8e6c9] flex items-center gap-3 shrink-0">
                            <div className="w-5 h-5 rounded-full bg-[#4caf50] flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-serif font-bold italic text-[10px]">i</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-[#2e7d32] font-medium leading-normal">
                                    Calculated via <strong>Univ. of Islamic Sciences, Karachi</strong>.
                                </p>
                            </div>
                        </div>
                    </>

                ) : (
                    <div className="text-center py-10 text-slate-400">Unable to load timings.</div>
                )}

                <div className="h-20 shrink-0"></div> {/* Spacer for bottom nav */}
            </div>
        </div>
    );
};

import React from 'react';
import { Icons } from '../constants';

export const AboutPage: React.FC = () => {
    const LOGO_URL = "https://crm.pcirealestate.site/wp-content/uploads/2026/01/Logo-DTQ-app.png";
    const HEAD_IMAGE = "https://crm.pcirealestate.site/wp-content/uploads/2026/01/BG-Image-DTQ.png";

    return (
        <div className="flex-1 h-full overflow-y-auto bg-[#fdfcf6] custom-scroll pb-24">
            {/* Hero Section */}
            <div className="relative bg-[#064e3b] pt-12 pb-20 px-6 overflow-hidden min-h-[400px] flex flex-col justify-center">
                {/* Background Image - Using the same as card headers */}
                <img
                    src={HEAD_IMAGE}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b] via-[#064e3b]/40 to-transparent"></div>

                <div className="max-w-3xl mx-auto relative z-10 text-center">
                    {/* Dora Quran Logo instead of name - Resized and Whihtened */}
                    <div className="flex justify-center mb-8 animate-in fade-in zoom-in duration-1000">
                        <img src={LOGO_URL} alt="Dora Tarjuma Quran" className="h-16 w-auto drop-shadow-2xl brightness-0 invert opacity-90" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md border border-white/10">
                        <Icons.Info className="w-3 h-3" />
                        About Dora Tarjuma-e-Quran
                    </div>
                    <h1 className="text-4xl font-black text-white mb-6 leading-tight">The Guiding Light</h1>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-xl mb-8">
                        <p className="text-xl font-medium text-emerald-50 leading-relaxed font-urdu" dir="rtl">
                            فرمانِ نبوی ﷺ: "جس نے قرآن کو سمجھ کر اپنا امام بنایا، وہ اسے جنت تک لے جائے گا، اور جو شخص اسے پس پشت ڈال دے گا یہ اسے جہنم کی طرف لے جائے گا۔"
                        </p>
                        <p className="text-emerald-200/60 text-xs mt-3 font-bold uppercase tracking-tighter">(صحيح الجامع: 4443)</p>
                    </div>

                    <p className="text-emerald-100/80 text-lg leading-relaxed max-w-2xl mx-auto">
                        This App is your gateway to making the Quran your Imam (Leader). Our mission is to transform your relationship with the Divine Word from mere recitation to deep, soulful understanding.
                    </p>
                </div>
            </div>

            {/* Coverage Section */}
            <div className="max-w-3xl mx-auto px-6 -mt-12 relative z-20">
                <div className="bg-white rounded-xl shadow-xl p-8 border border-slate-50">
                    <h2 className="text-2xl font-black text-[#0f172a] mb-6 flex items-center gap-3">
                        What is Dora Tarjuma-e-Quran?
                    </h2>
                    <p className="text-slate-500 leading-relaxed mb-8">
                        It is an intensive, 30-day spiritual immersion held every Ramadan. We believe that to truly "Experience the Quran," one must journey through its entirety.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: "Complete Coverage", desc: "30 Paras explained in 30 days.", icon: "CheckCircle" },
                            { title: "Fahm-ul-Quran", desc: "Focus on the central message, themes, and commands of Allah.", icon: "Lantern" },
                            { title: "Soulful Reflection", desc: "A journey of self-correction and spiritual awakening.", icon: "Crescent" },
                            { title: "Family Bonding", desc: "A platform for families to sit, learn, and grow together.", icon: "User" }
                        ].map((item, idx) => (
                            <div key={idx} className="p-5 rounded-xl bg-slate-50 border border-slate-100 group hover:bg-[#064e3b] transition-all hover:-translate-y-1">
                                <div className="text-[#064e3b] group-hover:text-white mb-3 transition-colors">
                                    {(Icons as any)[item.icon] ? React.createElement((Icons as any)[item.icon]) : null}
                                </div>
                                <h3 className="font-bold text-[#0f172a] group-hover:text-white transition-colors mb-1">{item.title}</h3>
                                <p className="text-xs text-slate-500 group-hover:text-emerald-100/70 transition-colors leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dr. Israr Tribute */}
            <div className="max-w-3xl mx-auto px-6 py-16">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1">
                        <h2 className="text-2xl font-black text-[#0f172a] mb-4">The Legacy of <br /><span className="text-[#064e3b]">Dr. Israr Ahmed (RA)</span></h2>
                        <p className="text-slate-500 leading-relaxed">
                            The Dora was pioneered by the legendary Dr. Israr Ahmed, the founder of Tanzeem-e-Islami. His life’s work was dedicated to the "Ruju-il-Quran" (Return to the Quran) movement—reminding the Ummah that our success lies only in following this Book.
                        </p>
                    </div>
                    <div className="w-56 h-56 rounded-xl bg-[#f8fafc] border-4 border-white shadow-xl rotate-3 overflow-hidden group hover:rotate-0 transition-all duration-500">
                        <img
                            src="/src/assets/images/drisrarahmed.jpg"
                            alt="Dr. Israr Ahmed"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            onError={(e) => {
                                // Default fallback to a high-quality placeholder until uploaded
                                e.currentTarget.src = "https://ui-avatars.com/api/?name=Dr+Israr+Ahmed&background=064e3b&color=fff&size=512";
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-[#064e3b] py-24 px-6 relative overflow-hidden">
                {/* Background Pattern for Timeline */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="max-w-3xl mx-auto text-center mb-20 relative z-10">
                    <span className="text-[#d4af37] text-xs font-black uppercase tracking-[0.3em] mb-3 block">Evolution</span>
                    <h2 className="text-4xl font-black text-white mb-4">Journey Through Time</h2>
                    <div className="w-16 h-1.5 bg-[#d4af37] mx-auto rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div>
                </div>

                <div className="max-w-2xl mx-auto space-y-10 relative z-10">
                    {/* Timeline Line with Gradient */}
                    <div className="absolute left-[15px] top-4 bottom-4 w-[3px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

                    {[
                        { time: "Late 1960s", title: "The Origin", icon: "BookOpen", desc: "Dr. Israr Ahmed begins intensive Quranic study circles in Lahore to simplify complex meanings for the common man." },
                        { time: "1975", title: "Official Launch", icon: "Clock", desc: "The Dora becomes a formalized annual Ramadan program following the establishment of Tanzeem-e-Islami." },
                        { time: "1978", title: "National Impact", icon: "Share", desc: "The program reaches millions through the iconic PTV series Al-Kitab, making Dr. Israr a household name for Quranic education." },
                        { time: "1998", title: "The Golden Standard", icon: "CheckCircle", desc: "The 1998 session is recorded; it remains the most-watched and widely translated Quranic series globally to this day." },
                        { time: "Today", title: "Digital Era", icon: "Navigation", desc: "From local masjids to this very app—bringing the light of the Quran to your fingertips, wherever you are." }
                    ].map((step, idx) => (
                        <div key={idx} className="relative pl-12 group animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                            {/* Animated Dot */}
                            <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#064e3b] border-[3px] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)] z-10 flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-7 rounded-2xl group-hover:bg-white/[0.15] transition-all duration-500 hover:-translate-y-1 shadow-xl">
                                <div className="flex items-start justify-between mb-3 gap-4">
                                    <div className="flex-1">
                                        <span className="text-[#d4af37] text-[11px] font-black uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded-md inline-block mb-2">{step.time}</span>
                                        <h3 className="text-2xl font-bold text-white leading-tight">{step.title}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200 group-hover:bg-[#d4af37] group-hover:text-[#064e3b] transition-all duration-500 transform group-hover:rotate-12">
                                        {(Icons as any)[step.icon] ? React.createElement((Icons as any)[step.icon], { className: "w-6 h-6" }) : null}
                                    </div>
                                </div>
                                <p className="text-emerald-100/70 text-base leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final Call to Action */}
            <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-[#064e3b] mx-auto mb-8 shadow-sm">
                    <Icons.Info className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-[#0f172a] mb-6">Why Join Us This Ramadan?</h2>
                <p className="text-slate-500 text-lg mb-10">
                    Ramadan is the "Spring of the Hearts." This year, don't just complete the recitation—understand the conversation.
                </p>

                <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 p-8 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#064e3b]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <p className="text-xl font-medium text-[#064e3b] leading-relaxed italic relative z-10">
                        "Experience the Qur’an through translation and brief explanation, to understand its message and apply its guidance in our daily lives."
                    </p>
                </div>

                <div className="mt-12 pt-12 border-t border-slate-100">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Connect With Us</p>
                    <a href="https://www.tanzeem.org" target="_blank" rel="noopener noreferrer" className="text-2xl font-black text-[#064e3b] hover:underline decoration-emerald-200 underline-offset-8 transition-all">
                        www.tanzeem.org
                    </a>
                </div>
            </div>
        </div>
    );
};


import React from 'react';
import { Program } from '../types';
import { Icons } from '../constants';

interface ProgramDetailProps {
  program: Program;
  onClose: () => void;
}

export const ProgramDetail: React.FC<ProgramDetailProps> = ({ program, onClose }) => {
  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      <div className="bg-[#fdfcf6] w-full max-w-xl md:rounded-[40px] rounded-t-[40px] h-[94vh] md:h-auto md:max-h-[92vh] overflow-hidden relative shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500">

        {/* Close Button Header */}
        <div className="absolute top-6 left-6 z-30">
          <button
            onClick={onClose}
            className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl text-white border border-white/20 hover:bg-[#065f46] transition-all active:scale-90"
          >
            <Icons.ChevronLeft />
          </button>
        </div>

        {/* Hero Section - Custom Branded Image */}
        <div className="relative h-72 md:h-96 bg-[#065f46] flex-shrink-0">
          <img
            src="https://crm.pcirealestate.site/wp-content/uploads/2026/01/BG-Image-DTQ.png"
            alt="Dora Quran Program"
            className="w-full h-full object-cover"
          />

          {/* Deep Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent opacity-90"></div>

          <div className="absolute bottom-8 left-8 right-8 text-center md:text-left">
            <div className="flex justify-center md:justify-start gap-2 mb-4">
              <span className="px-3 py-1 bg-[#d4af37] text-white text-[10px] font-black rounded-full uppercase tracking-[0.15em] shadow-lg shadow-[#d4af37]/20">
                {program.category}
              </span>
              {program.distance !== undefined && (
                <span className="px-3 py-1 bg-white/10 backdrop-blur text-white text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/20">
                  {program.distance.toFixed(1)} km away
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg leading-tight">
              {program.name}
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-8 scroll-smooth pt-6">
          <section className="animate-in slide-in-from-bottom delay-100 duration-500">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Location & Venue</h2>
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-[#065f46]/10 text-[#065f46] rounded-2xl">
                  <Icons.MapPin />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">{program.venue}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{program.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-slate-50">
                <div className="p-4 bg-[#d4af37]/10 text-[#d4af37] rounded-2xl">
                  <Icons.Clock />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Timing</p>
                  <p className="text-sm text-[#065f46] font-semibold">{program.timing || 'Daily Ramadan Program'}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="animate-in slide-in-from-bottom delay-200 duration-500">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Organizer Details</h2>
            <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center font-bold text-[#d4af37]">
                  <Icons.Crescent />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{program.organizer}</p>
                  <p className="text-sm text-slate-400">{program.contact}</p>
                </div>
              </div>
              <a
                href={`tel:${program.contact}`}
                className="p-4 bg-[#065f46] text-white rounded-2xl hover:bg-[#044a36] shadow-lg shadow-[#065f46]/20 transition-all active:scale-90"
              >
                <Icons.Phone />
              </a>
            </div>
          </section>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom delay-300 duration-500">
            <a
              href={program.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-5 bg-[#0f172a] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
            >
              <Icons.Navigation />
              Open in Google Maps
            </a>
            <button
              onClick={() => {
                import('../services/notifications').then(({ subscribeToProgram }) => {
                  subscribeToProgram(program.id);
                  alert('You will now receive alerts for this program!');
                });
              }}
              className="flex items-center justify-center gap-3 py-5 bg-[#d4af37] text-white font-bold rounded-2xl hover:bg-[#b8962e] transition-all shadow-xl shadow-[#d4af37]/20 active:scale-95"
            >
              <Icons.Crescent /> {/* Reusing Crescent or maybe Bell if available, sticking to existing Icons for now */}
              Get Alerts
            </button>
          </div>
          <div className="pt-2 animate-in slide-in-from-bottom delay-300 duration-500">
            <button
              onClick={onClose}
              className="w-full py-5 bg-white text-[#0f172a] font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Back to Discovery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

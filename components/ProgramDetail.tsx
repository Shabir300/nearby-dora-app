import React from 'react';
import { Program } from '../types';
import { Icons } from '../constants';

interface ProgramDetailProps {
  program: Program;
  onClose: () => void;
}

export const ProgramDetail: React.FC<ProgramDetailProps> = ({ program, onClose }) => {
  const displayName = program.name.replace(/dora\s*quran/gi, '').replace(/^[-\s]+/, '').trim() || program.name;

  const whatsappMessage = encodeURIComponent(`Assalam-o-Alaikum, I want to inquire about the Dora Quran program at ${displayName}.`);
  const whatsappLink = `https://wa.me/${program.contact?.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-500 ease-out">

      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:zoom-in-95 z-10">

        {/* Close Button */}
        <div className="absolute top-3 right-3 z-30">
          <button
            onClick={onClose}
            className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all backdrop-blur-md active:scale-90"
          >
            <Icons.Close />
          </button>
        </div>

        {/* Hero / Header Section - Themed Green with Image */}
        <div className="relative h-40 md:h-48 bg-[#004d33] flex-shrink-0">
          <img
            src="https://crm.pcirealestate.site/wp-content/uploads/2026/01/BG-Image-DTQ.png"
            alt="Dora Quran Program"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#004d33] via-transparent to-transparent"></div>

          <div className="absolute bottom-4 left-0 right-0 text-center px-4">
            <h2 className="text-white/80 font-bold tracking-widest text-[10px] md:text-xs uppercase mb-1">Ramadan 2026</h2>
            <h1 className="text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md uppercase">
              {displayName}
            </h1>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 md:space-y-5 bg-[#fdfcf6]">

          {/* Time & Date Block */}
          <div className="text-center space-y-1">
            <div className="inline-block bg-[#004d33]/10 px-3 py-1 rounded-full mb-1">
              <h3 className="text-[10px] md:text-xs font-bold text-[#004d33] uppercase tracking-wider">From 1st Ramadan</h3>
            </div>
            <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-black text-[#004d33]">
              <Icons.Clock /> 08:00 PM
            </div>
            <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">Every Night</p>
          </div>

          {/* Facilities Strip */}
          <div className="bg-[#004d33] text-white rounded-xl p-3 md:p-4 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="font-bold uppercase tracking-wide text-xs md:text-sm border-b border-white/20 pb-2 w-full">
                Separate Arrangement for Ladies
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-[10px] md:text-xs font-medium text-white/90">
                <span className="flex items-center gap-1"><Icons.Child /> Kids Activities</span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span className="flex items-center gap-1"><Icons.Coffee /> Refreshments</span>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="flex items-start gap-3 md:gap-4 text-left bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100">
            <div className="mt-1 text-[#004d33] min-w-[20px] md:min-w-[24px]"><Icons.MapPin /></div>
            <div>
              <h4 className="font-bold text-[#004d33] text-base md:text-lg leading-tight mb-1">{program.venue}</h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{program.address}</p>
            </div>
          </div>

          {/* Action Buttons - Stack on mobile */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 pt-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:flex-1 bg-[#25D366] hover:bg-[#1ebc57] text-white font-bold py-3 md:py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95"
            >
              <Icons.Phone /> WhatsApp
            </a>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  import('../services/notifications').then(({ subscribeToProgram }) => {
                    subscribeToProgram(program.id);
                  });
                }}
                className="flex-1 bg-[#eab308] hover:bg-[#ca9a04] text-white font-bold py-3 md:py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95"
              >
                <Icons.Bell /> Alert Me
              </button>
              <a
                href={program.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#004d33] hover:bg-[#003824] text-white font-bold py-3 md:py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95"
              >
                <Icons.Navigation /> Map
              </a>
            </div>
          </div>

          {/* Spacer for bottom safe area on mobile */}
          <div className="h-6 md:h-0"></div>

        </div>

        {/* Footer Branding */}
        <div className="bg-[#0f172a] p-2 md:p-3 text-center">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Organized by Tanzeem-e-Islami</p>
        </div>

      </div>
    </div>
  );
};

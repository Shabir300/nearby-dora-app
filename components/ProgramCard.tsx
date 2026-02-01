
import React from 'react';
import { Program } from '../types';
import { Icons } from '../constants';

interface ProgramCardProps {
  program: Program;
  isActive?: boolean;
  onViewOnMap: (program: Program) => void;
  onOpenDetails: (program: Program) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, isActive, onViewOnMap, onOpenDetails }) => {
  return (
    <div 
      className={`group relative bg-white rounded-3xl p-5 mb-4 border transition-all duration-300 cursor-pointer overflow-hidden ${
        isActive 
          ? 'border-[#d4af37] shadow-[0_10px_40px_-10px_rgba(212,175,55,0.25)] scale-[1.02]' 
          : 'border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] hover:border-[#065f46]/20'
      }`}
      onClick={() => onOpenDetails(program)}
    >
      <div className="absolute top-0 right-0 w-24 h-24 islamic-pattern pointer-events-none rounded-bl-[60px]"></div>

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div>
          <span className="inline-block px-2.5 py-1 bg-[#065f46]/10 text-[#065f46] text-[10px] font-bold rounded-full mb-2 uppercase tracking-widest">
            {program.category}
          </span>
          <h3 className="text-lg font-bold text-slate-800 leading-tight pr-4 group-hover:text-[#065f46] transition-colors">
            {program.name}
          </h3>
        </div>
        {program.distance !== undefined && (
          <span className="text-xs font-bold text-[#d4af37] bg-white border border-[#d4af37]/30 px-3 py-1.5 rounded-2xl whitespace-nowrap shadow-sm">
            {program.distance.toFixed(1)} km
          </span>
        )}
      </div>
      
      <div className="space-y-2 mb-5 relative z-10">
        <div className="flex items-center text-slate-500 text-sm">
          <div className="w-6 flex justify-center text-[#d4af37] mr-1"><Icons.Lantern /></div>
          <span className="truncate font-medium">{program.venue}</span>
        </div>
        {program.timing && (
          <div className="flex items-center text-slate-500 text-sm">
            <div className="w-6 flex justify-center text-[#065f46] mr-1"><Icons.Crescent /></div>
            <span className="font-semibold">{program.timing}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 relative z-10" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => onViewOnMap(program)}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 text-slate-700 text-xs font-bold rounded-2xl hover:bg-[#065f46] hover:text-white transition-all duration-300"
        >
          <Icons.Navigation />
          Location
        </button>
        <a 
          href={`tel:${program.contact}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#065f46] text-white text-xs font-bold rounded-2xl hover:bg-[#044a36] shadow-lg shadow-[#065f46]/20 transition-all active:scale-95"
        >
          <Icons.Phone />
          Contact
        </a>
      </div>
    </div>
  );
};

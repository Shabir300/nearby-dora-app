
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
      className={`group relative bg-white rounded-2xl p-4 md:p-5 mb-3 border transition-all duration-300 cursor-pointer overflow-hidden ${isActive
        ? 'border-[#065f46] shadow-lg ring-1 ring-[#065f46]/20'
        : 'border-slate-100 shadow-sm hover:border-[#065f46]/30 hover:shadow-md'
        }`}
      onClick={() => onOpenDetails(program)}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#065f46]/5 to-transparent rounded-bl-[100px] pointer-events-none"></div>

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-2 mb-2">

            {program.distance !== undefined && (
              <span className="flex items-center text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                <span className="w-1 h-1 bg-slate-400 rounded-full mr-1"></span>
                {program.distance.toFixed(1)} km
              </span>
            )}
          </div>
          <h3 className="text-base md:text-lg font-black text-[#0f172a] leading-tight group-hover:text-[#065f46] transition-colors">
            {program.name}
          </h3>
        </div>
      </div>

      <div className="space-y-2 mb-4 relative z-10">
        <div className="flex items-start text-slate-500 text-xs md:text-sm">
          <div className="w-5 flex-shrink-0 text-[#065f46]/70 mt-0.5"><Icons.MapPin /></div>
          <span className="font-medium leading-snug line-clamp-2">{program.venue}</span>
        </div>
        {program.timing && (
          <div className="flex items-center text-slate-500 text-xs md:text-sm">
            <div className="w-5 flex-shrink-0 text-[#065f46]/70"><Icons.Clock /></div>
            <span className="font-semibold">{program.timing}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 relative z-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onViewOnMap(program)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
        >
          <Icons.Navigation />
          Location
        </button>
        <div className="w-px bg-slate-100"></div>
        <a
          href={`tel:${program.contact}`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#065f46] text-white text-xs font-bold rounded-lg hover:bg-[#054f3b] shadow-sm transition-all active:scale-95"
        >
          <Icons.Phone />
          Contact
        </a>
      </div>
    </div>
  );
};

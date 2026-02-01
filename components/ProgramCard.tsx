
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
      className={`group bg-white rounded-xl p-4 mb-3 border transition-all duration-200 cursor-pointer hover:bg-slate-50 flex items-center justify-between ${isActive
        ? 'border-[#065f46] shadow-md ring-1 ring-[#065f46]/10 bg-slate-50'
        : 'border-slate-100 shadow-sm hover:border-slate-200'
        } active:scale-[0.99]`}
      onClick={() => onOpenDetails(program)}
    >
      <div className="flex-1 min-w-0 pr-4">
        <h3 className={`text-base font-bold leading-tight mb-1 truncate ${isActive ? 'text-[#065f46]' : 'text-slate-800'}`}>
          {program.name}
        </h3>
        <div className="flex items-center text-slate-500 text-xs">
          <span className="truncate">{program.venue}</span>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center">
        {program.distance !== undefined && (
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${isActive ? 'bg-[#065f46] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
            {program.distance.toFixed(1)} km
          </span>
        )}
        <div className="ml-3 text-slate-300 transform transition-transform group-hover:translate-x-1 rotate-180">
          <Icons.ChevronLeft />
        </div>
      </div>
    </div>
  );
};


import React from 'react';

interface TimerUnitProps {
  value: number;
  label: string;
}

const TimerUnit: React.FC<TimerUnitProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 min-w-[80px] sm:min-w-[120px] md:min-w-[160px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl transition-transform hover:scale-105">
      <span className="text-4xl sm:text-6xl md:text-8xl font-black font-oswald text-yellow-500 glow-text tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-gray-400 mt-1 sm:mt-2">
        {label}
      </span>
    </div>
  );
};

export default TimerUnit;

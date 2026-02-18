
import React from 'react';

interface PrisonCalendarProps {
  startDate: string;
  targetDate: string;
}

const PrisonCalendar: React.FC<PrisonCalendarProps> = ({ targetDate }) => {
  const target = new Date(targetDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const years = [2023, 2024, 2025, 2026];

  const isDayPassed = (day: Date) => {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);
    return d < now;
  };

  const isToday = (day: Date) => {
    return day.getTime() === now.getTime();
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto mt-12 px-4 pb-20">
      <div className="flex items-center justify-center gap-2 mb-10">
        <div className="h-[1px] w-12 bg-yellow-500/30"></div>
        <h3 className="text-yellow-500 text-sm font-bold uppercase tracking-[0.4em]">
          Diário da Detenção
        </h3>
        <div className="h-[1px] w-12 bg-yellow-500/30"></div>
      </div>
      
      <div className="flex flex-col gap-8">
        {years.map((year) => (
          <div key={year} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white/10 font-oswald italic">{year}</span>
              <div className="h-[1px] flex-grow bg-white/5"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2">
              {Array.from({ length: 12 }).map((_, monthIdx) => {
                const monthDate = new Date(year, monthIdx, 1);
                // No ano final (2026), só mostramos até o mês do target (Abril)
                if (year === target.getFullYear() && monthIdx > target.getMonth()) return null;

                const monthLabel = monthDate.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
                const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
                
                return (
                  <div key={`${year}-${monthIdx}`} className="bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <span className="text-[10px] font-black text-gray-500 mb-2 block border-b border-white/5 pb-1 text-center">
                      {monthLabel}
                    </span>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayDate = new Date(year, monthIdx, i + 1);
                        const passed = isDayPassed(dayDate);
                        const today = isToday(dayDate);
                        const afterTarget = dayDate > target;

                        if (afterTarget) return <div key={i} className="w-3 h-3" />;

                        return (
                          <div 
                            key={i} 
                            className={`relative w-3.5 h-3.5 flex items-center justify-center text-[7px] font-mono
                              ${passed ? 'text-orange-500/80' : today ? 'text-yellow-400 font-bold scale-125' : 'text-gray-600'}
                            `}
                          >
                            {passed ? (
                              <span className="font-black select-none leading-none scale-150 transform -rotate-12">X</span>
                            ) : (
                              <span className="opacity-50">{i + 1}</span>
                            )}
                            {today && (
                              <div className="absolute inset-0 border border-yellow-500/50 rounded-sm animate-pulse" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrisonCalendar;

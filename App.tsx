
import React, { useState, useEffect, useCallback } from 'react';
import TimerUnit from './components/TimerUnit.tsx';
import { TimeRemaining } from './types.ts';
import { fetchHypeMessage } from './services/aiService.ts';

const TARGET_DATE = "2026-04-30T00:00:00";

const HOLIDAYS_2026 = [
  '2026-01-01', // Ano Novo
  '2026-02-16', // Carnaval
  '2026-02-17', // Carnaval
  '2026-04-03', // Sexta-feira Santa
  '2026-04-21', // Tiradentes
];

const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  curDate.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(endDate.getTime());
  targetDate.setHours(0, 0, 0, 0);

  // Começamos a contar a partir do próximo dia
  while (curDate < targetDate) {
    curDate.setDate(curDate.getDate() + 1);
    
    if (curDate > targetDate) break;

    const dayOfWeek = curDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Domingo, 6 = Sábado
    
    // Format YYYY-MM-DD manually to avoid timezone issues with toISOString
    const y = curDate.getFullYear();
    const m = String(curDate.getMonth() + 1).padStart(2, '0');
    const d = String(curDate.getDate()).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;
    
    const isHoliday = HOLIDAYS_2026.includes(dateString);

    if (!isWeekend && !isHoliday) {
      count++;
    }
  }
  return count;
};

const App: React.FC = () => {
  const calculateTimeRemaining = useCallback((): TimeRemaining => {
    const target = new Date(TARGET_DATE);
    const now = new Date();
    const total = target.getTime() - now.getTime();
    
    const seconds = Math.max(0, Math.floor((total / 1000) % 60));
    const minutes = Math.max(0, Math.floor((total / 1000 / 60) % 60));
    const hours = Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24));
    const days = Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24)));
    const weeks = Math.max(0, Math.floor(days / 7));
    const businessDays = Math.max(0, calculateBusinessDays(now, target));

    return { total, days, weeks, businessDays, hours, minutes, seconds };
  }, []);

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining());
  const [hypeMessage, setHypeMessage] = useState<string>("");
  const [isLoadingHype, setIsLoadingHype] = useState(false);

  useEffect(() => {
    const getHype = async () => {
      setIsLoadingHype(true);
      try {
        const msg = await fetchHypeMessage(timeLeft.days);
        setHypeMessage(msg);
      } catch (err) {
        console.error("Erro ao carregar frase:", err);
      } finally {
        setIsLoadingHype(false);
      }
    };

    if (timeLeft.total > 0) {
      getHype();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeRemaining]);

  const isFinished = timeLeft.total <= 0;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />

      {/* Header */}
      <header className="z-10 text-center mb-8 md:mb-12 px-4 animate-pulse-slow">
        <h2 className="text-yellow-500 font-bold tracking-[0.3em] uppercase text-sm md:text-base mb-2">
          Contagem Regressiva
        </h2>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-oswald uppercase glow-text">
          Vem ni Mim <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            30 de Abril
          </span>
        </h1>
      </header>

      {/* Main Timer Display */}
      <main className="z-10 flex flex-col items-center gap-8 md:gap-12 px-4">
        {isFinished ? (
          <div className="text-center animate-bounce max-w-2xl px-6">
            <h2 className="text-6xl md:text-8xl font-black text-yellow-500 font-oswald glow-text mb-4">LIBERDADE!</h2>
            <p className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider mb-8">
              O dia da Independência Financeira chegou! 🚀
            </p>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-yellow-500/20 shadow-2xl">
              <p className="text-lg md:text-xl italic text-gray-200 leading-relaxed">
                "Acabou a tortura! Agora vai ser difícil fingir motivação na daily, né? Já pode começar a pesquisar o CEP da praia, 
                escolher o cursinho pro concurso ou simplesmente avisar que agora você só trabalha 'por esporte'. 
                O boleto perdeu o poder, o mundo é seu e a carga horária é você quem manda!"
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8">
              <TimerUnit value={timeLeft.days} label="Dias" />
              <TimerUnit value={timeLeft.hours} label="Horas" />
              <TimerUnit value={timeLeft.minutes} label="Minutos" />
              <TimerUnit value={timeLeft.seconds} label="Segundos" />
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 opacity-90 scale-90 sm:scale-95">
              <TimerUnit value={timeLeft.weeks} label="Semanas" />
              <TimerUnit value={timeLeft.businessDays} label="Dias Úteis" />
            </div>

            {/* AI Hype Section */}
            <div className="mt-4 md:mt-8 max-w-md mx-auto text-center px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 hover:bg-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Transmissão do Futuro
                </p>
              </div>
              <p className="text-base md:text-lg font-medium text-gray-100 italic">
                {isLoadingHype ? (
                  <span className="opacity-50 animate-pulse">Sintonizando a frequência...</span>
                ) : (
                  hypeMessage ? `"${hypeMessage}"` : "O relógio não para! 🚀"
                )}
              </p>
            </div>
          </>
        )}
      </main>

      {/* Footer Info */}
      <footer className="z-10 mt-12 md:mt-16 text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs md:text-sm font-medium tracking-widest uppercase text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Em tempo real • 30/04/2026
        </div>
        
        <p className="mt-8 text-gray-500 text-[10px] md:text-xs max-w-xs mx-auto opacity-50">
          Prepare-se para o evento mais esperado da década. O relógio não para.
        </p>
      </footer>

      {/* Background noise texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
    </div>
  );
};

export default App;

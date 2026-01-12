import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface GameTimerProps {
  phase: 'day' | 'night';
  duration: number;
  onPhaseEnd: () => void;
}

const GameTimer = ({ phase, duration, onPhaseEnd }: GameTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = (timeLeft / duration) * 100;

  useEffect(() => {
    setTimeLeft(duration);
  }, [phase, duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onPhaseEnd();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onPhaseEnd]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isDay = phase === 'day';

  return (
    <div className={`glass p-8 rounded-3xl transition-all duration-1000 border-2 ${
      isDay 
        ? 'bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30' 
        : 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-1000 ${
            isDay 
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/50' 
              : 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50'
          }`}>
            {isDay ? (
              <Icon name="Sun" size={24} className="text-white" />
            ) : (
              <Icon name="Moon" size={24} className="text-white" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold">
              {isDay ? '☀️ День' : '🌙 Ночь'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isDay ? 'Город обсуждает подозреваемых' : 'Мафия выбирает жертву'}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-4xl font-black transition-all duration-300 ${
            timeLeft < 10 ? 'text-red-500 animate-pulse' : isDay ? 'text-orange-500' : 'text-blue-400'
          }`}>
            {formatTime(timeLeft)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">осталось</p>
        </div>
      </div>

      <div className="relative">
        <Progress 
          value={progress} 
          className={`h-3 transition-all duration-300 ${
            isDay ? '[&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500' : '[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-600'
          }`}
        />
        {timeLeft < 10 && (
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className={`p-3 rounded-xl transition-all duration-1000 ${
          isDay 
            ? 'bg-orange-500/10 border border-orange-500/20' 
            : 'bg-gray-500/10 border border-gray-500/20'
        }`}>
          <p className="text-xs text-muted-foreground mb-1">Следующая фаза</p>
          <p className="font-semibold">{isDay ? '🌙 Ночь' : '☀️ День'}</p>
        </div>
        <div className={`p-3 rounded-xl transition-all duration-1000 ${
          !isDay 
            ? 'bg-blue-500/10 border border-blue-500/20' 
            : 'bg-gray-500/10 border border-gray-500/20'
        }`}>
          <p className="text-xs text-muted-foreground mb-1">Длительность</p>
          <p className="font-semibold">{duration} сек</p>
        </div>
      </div>
    </div>
  );
};

export default GameTimer;
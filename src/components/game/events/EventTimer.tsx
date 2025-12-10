import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/gameStore';
import { GiMagicSwirl } from 'react-icons/gi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EVENT_INTERVAL } from '@/data/events';

export function EventTimer() {
  const { eventCooldown, tickEventCooldown, tickActiveEffects, showEventModal } = useGameStore();

  // 每秒更新倒计时和效果
  useEffect(() => {
    const interval = setInterval(() => {
      tickEventCooldown();
      tickActiveEffects();
    }, 1000);

    return () => clearInterval(interval);
  }, [tickEventCooldown, tickActiveEffects]);

  const progress = (eventCooldown / EVENT_INTERVAL) * 100;
  const isNearTrigger = eventCooldown <= 10;

  if (showEventModal) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'relative w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-primary/20 border border-primary/50',
              'cursor-pointer hover:bg-primary/30 transition-colors',
              isNearTrigger && 'animate-pulse'
            )}
          >
            <GiMagicSwirl
              className={cn(
                'text-xl text-primary',
                isNearTrigger && 'animate-spin'
              )}
            />

            {/* Circular progress */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 40 40"
            >
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted/30"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${progress} 100`}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000"
              />
            </svg>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">
            下次随机事件: <span className="font-bold text-primary">{eventCooldown}秒</span>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

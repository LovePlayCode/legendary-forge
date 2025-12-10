import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/gameStore';
import {
  GiAnvilImpact,
  GiGoldBar,
  GiMineralPearls,
  GiFireBowl,
  GiHammerNails,
  GiCrystalGrowth,
  GiLaurelsTrophy,
  GiCompass,
  GiSparkles,
} from 'react-icons/gi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GiAnvilImpact,
  GiGoldBar,
  GiMineralPearls,
  GiFireBowl,
  GiHammerNails,
  GiCrystalGrowth,
  GiLaurelsTrophy,
  GiCompass,
  GiSparkles,
};

export function ActiveEffects() {
  const { activeEffects } = useGameStore();

  if (activeEffects.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {activeEffects.map((effect) => {
          const Icon = iconMap[effect.icon] || GiSparkles;
          const progress = effect.remainingTime
            ? (effect.remainingTime / 60) * 100
            : effect.remainingUsage
            ? (effect.remainingUsage / 3) * 100
            : 100;

          return (
            <Tooltip key={effect.id}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'relative w-10 h-10 rounded-xl flex items-center justify-center',
                    'bg-amber-500/20 border border-amber-500/50',
                    'cursor-pointer hover:bg-amber-500/30 transition-colors'
                  )}
                >
                  <Icon className="text-xl text-amber-400" />

                  {/* Progress indicator */}
                  <div className="absolute -bottom-1 left-1 right-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-1000"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-48">
                <p className="font-bold text-amber-400">{effect.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {effect.remainingTime !== undefined && (
                    <>剩余 {effect.remainingTime} 秒</>
                  )}
                  {effect.remainingUsage !== undefined && (
                    <>剩余 {effect.remainingUsage} 次</>
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

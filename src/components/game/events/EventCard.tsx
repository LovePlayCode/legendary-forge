import { cn } from '@/lib/utils';
import { EventCard as EventCardType } from '@/types/game';
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

interface EventCardProps {
  card: EventCardType;
  onClick: () => void;
  delay?: number;
}

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

const rarityColors = {
  common: {
    border: 'border-slate-400',
    bg: 'bg-slate-500/10',
    glow: 'hover:shadow-slate-400/30',
    badge: 'bg-slate-500 text-white',
    icon: 'text-slate-400',
  },
  rare: {
    border: 'border-blue-400',
    bg: 'bg-blue-500/10',
    glow: 'hover:shadow-blue-400/30',
    badge: 'bg-blue-500 text-white',
    icon: 'text-blue-400',
  },
  epic: {
    border: 'border-purple-400',
    bg: 'bg-purple-500/10',
    glow: 'hover:shadow-purple-400/30',
    badge: 'bg-purple-500 text-white',
    icon: 'text-purple-400',
  },
};

const rarityNames = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
};

export function EventCardComponent({ card, onClick, delay = 0 }: EventCardProps) {
  const Icon = iconMap[card.icon] || GiSparkles;
  const colors = rarityColors[card.rarity];

  const getDurationText = () => {
    if (card.duration) {
      return `持续 ${card.duration} 秒`;
    }
    if (card.usageCount) {
      return `${card.usageCount} 次使用`;
    }
    return '立即生效';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-48 h-72 rounded-2xl border-2 transition-all duration-300',
        'hover:scale-105 hover:-translate-y-2 hover:shadow-xl',
        'flex flex-col items-center p-4 cursor-pointer',
        'animate-card-enter',
        colors.border,
        colors.bg,
        colors.glow
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Rarity Badge */}
      <span
        className={cn(
          'absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold',
          colors.badge
        )}
      >
        {rarityNames[card.rarity]}
      </span>

      {/* Icon */}
      <div
        className={cn(
          'w-20 h-20 rounded-2xl flex items-center justify-center mb-4 mt-2',
          'bg-background/50 border border-border'
        )}
      >
        <Icon className={cn('text-5xl', colors.icon)} />
      </div>

      {/* Name */}
      <h3 className="text-base font-bold text-foreground mb-2 text-center">
        {card.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground text-center flex-1 leading-relaxed">
        {card.description}
      </p>

      {/* Duration/Usage */}
      <div
        className={cn(
          'mt-3 px-3 py-1.5 rounded-lg text-xs font-medium',
          'bg-background/50 border border-border text-foreground'
        )}
      >
        {getDurationText()}
      </div>
    </button>
  );
}

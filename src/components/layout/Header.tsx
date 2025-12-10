import { GiAnvil, GiTwoCoins, GiLaurelsTrophy, GiSunrise } from 'react-icons/gi';
import { Settings, Volume2 } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EventTimer, ActiveEffects } from '@/components/game/events';
import { Icon3DToggle } from '@/components/game/common/EquipmentIconWrapper';

export function Header() {
  const { gold, reputation, level, day } = useGameStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur border-b-3 border-border z-50 flex items-center justify-between px-6 shadow-md transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center gap-4 group">
        <div className="w-12 h-12 bg-primary/20 flex items-center justify-center rounded-xl border-2 border-primary/50 shadow-sm group-hover:scale-105 transition-transform duration-200">
          <GiAnvil className="text-2xl text-primary drop-shadow-md" />
        </div>
        <span className="text-sm font-pixel text-foreground tracking-wider group-hover:text-primary transition-colors">
          传说铁匠铺
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        {/* Day */}
        <div className="flex items-center gap-3 bg-muted rounded-xl border-2 border-border px-4 py-2 shadow-inner">
          <GiSunrise className="text-xl text-forge-orange" />
          <span className="text-xs text-muted-foreground">第 <span className="text-foreground font-bold">{day}</span> 天</span>
        </div>

        {/* Gold */}
        <div className="flex items-center gap-3 bg-muted rounded-xl border-2 border-border px-4 py-2 shadow-inner">
          <GiTwoCoins className="text-xl text-yellow-500" />
          <span className="text-xs text-foreground font-bold">{gold}</span>
        </div>

        {/* Reputation */}
        <div className="flex items-center gap-3 bg-muted rounded-xl border-2 border-border px-4 py-2 shadow-inner">
          <GiLaurelsTrophy className="text-xl text-purple-400" />
          <span className="text-xs text-foreground">{reputation}</span>
          <Badge className="bg-primary text-primary-foreground border border-primary-foreground/20 text-[10px] px-2 rounded-lg">
            Lv.{level}
          </Badge>
        </div>

        {/* Event Timer & Active Effects */}
        <div className="flex items-center gap-2 ml-2 pl-4 border-l-2 border-border">
          <EventTimer />
          <ActiveEffects />
        </div>
      </div>

      {/* Settings */}
      <div className="flex items-center gap-3">
        <Icon3DToggle />
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl border-2 border-transparent hover:border-border w-10 h-10 transition-all"
        >
          <Volume2 className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl border-2 border-transparent hover:border-border w-10 h-10 transition-all"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}

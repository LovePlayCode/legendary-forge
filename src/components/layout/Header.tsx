import { GiAnvil, GiTwoCoins, GiLaurelsTrophy, GiSunrise } from 'react-icons/gi';
import { Settings, Volume2 } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Header() {
  const { gold, reputation, level, day } = useGameStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-forge-cream border-b-3 border-forge-brown z-50 flex items-center justify-between px-4 shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-forge-peach flex items-center justify-center rounded-xl border-3 border-forge-brown shadow-md">
          <GiAnvil className="text-2xl text-forge-dark" />
        </div>
        <span className="text-sm font-pixel text-forge-dark tracking-wider">
          传说铁匠铺
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        {/* Day */}
        <div className="flex items-center gap-2 bg-pixel-mint rounded-xl border-3 border-forge-brown px-3 py-2 shadow-sm">
          <GiSunrise className="text-xl text-forge-dark" />
          <span className="text-xs text-forge-dark">第 {day} 天</span>
        </div>

        {/* Gold */}
        <div className="flex items-center gap-2 bg-pixel-lemon rounded-xl border-3 border-forge-brown px-3 py-2 shadow-sm">
          <GiTwoCoins className="text-xl text-forge-dark" />
          <span className="text-xs text-forge-dark font-bold">{gold}</span>
        </div>

        {/* Reputation */}
        <div className="flex items-center gap-2 bg-pixel-lavender rounded-xl border-3 border-forge-brown px-3 py-2 shadow-sm">
          <GiLaurelsTrophy className="text-xl text-forge-dark" />
          <span className="text-xs text-forge-dark">{reputation}</span>
          <Badge className="bg-forge-orange text-white border-2 border-forge-brown text-[10px] px-2 rounded-lg">
            Lv.{level}
          </Badge>
        </div>
      </div>

      {/* Settings */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-forge-dark hover:bg-pixel-pink rounded-xl border-2 border-forge-brown w-10 h-10"
        >
          <Volume2 className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-forge-dark hover:bg-pixel-sky rounded-xl border-2 border-forge-brown w-10 h-10"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}

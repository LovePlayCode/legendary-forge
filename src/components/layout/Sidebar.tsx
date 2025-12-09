import { GiAnvilImpact, GiScrollUnfurled, GiKnapsack, GiTreasureMap, GiUpgrade } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type GameView = 'workshop' | 'orders' | 'inventory' | 'exploration' | 'upgrades';

interface SidebarProps {
  currentView: GameView;
  onViewChange: (view: GameView) => void;
}

const navItems: { id: GameView; icon: React.ElementType; label: string }[] = [
  { id: 'workshop', icon: GiAnvilImpact, label: '锻造工坊' },
  { id: 'orders', icon: GiScrollUnfurled, label: '订单柜台' },
  { id: 'inventory', icon: GiKnapsack, label: '仓库管理' },
  { id: 'exploration', icon: GiTreasureMap, label: '探险采购' },
  { id: 'upgrades', icon: GiUpgrade, label: '店铺升级' },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <TooltipProvider>
      <aside className="fixed left-0 top-16 bottom-0 w-20 bg-forge-sand border-r-3 border-forge-brown z-40 flex flex-col items-center py-4 gap-3 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    'w-14 h-14 transition-all duration-150 rounded-xl border-3',
                    isActive
                      ? 'bg-forge-peach border-forge-brown shadow-md'
                      : 'bg-forge-light border-forge-brown/50 hover:bg-pixel-mint hover:border-forge-brown'
                  )}
                >
                  <Icon
                    className={cn(
                      'text-3xl transition-colors',
                      isActive ? 'text-forge-dark animate-soft-bounce' : 'text-forge-brown'
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="rounded-xl bg-forge-cream border-2 border-forge-brown shadow-md">
                <p className="text-xs text-forge-dark">{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </aside>
    </TooltipProvider>
  );
}

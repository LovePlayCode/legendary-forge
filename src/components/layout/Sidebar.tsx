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
      <aside className="fixed left-0 top-16 bottom-0 w-20 bg-muted/30 backdrop-blur border-r-3 border-border z-40 flex flex-col items-center py-6 gap-4 shadow-lg transition-colors duration-300">
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
                    'w-12 h-12 transition-all duration-200 rounded-xl border-2',
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary-foreground/30 shadow-md scale-110'
                      : 'bg-card text-muted-foreground border-transparent hover:bg-muted hover:text-foreground hover:border-border hover:scale-105'
                  )}
                >
                  <Icon
                    className={cn(
                      'text-2xl transition-transform duration-200',
                      isActive ? 'animate-soft-bounce' : ''
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="rounded-xl bg-popover text-popover-foreground border-2 border-border shadow-md px-3 py-1.5">
                <p className="text-xs font-pixel">{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </aside>
    </TooltipProvider>
  );
}

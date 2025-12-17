import { GiSparkles, GiAnvilImpact } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Equipment, Quality } from '@/types/game';
import { EquipmentIconWrapper } from '@/components/game/common/EquipmentIconWrapper';

interface ResultDialogProps {
  open: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  extraEquipments?: Equipment[];
}

// 品质配置 - 像素游戏暖石风格
const qualityColors: Record<Quality, string> = {
  poor: 'bg-stone-600/50 border-stone-500',
  common: 'bg-stone-500/50 border-stone-400',
  uncommon: 'bg-emerald-900/40 border-emerald-600',
  rare: 'bg-blue-900/40 border-blue-500',
  epic: 'bg-purple-900/40 border-purple-500',
  legendary: 'bg-amber-900/40 border-amber-500',
  mythic: 'bg-red-900/40 border-red-500',
};

const qualityLabels: Record<Quality, string> = {
  poor: '粗糙',
  common: '普通',
  uncommon: '精良',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
  mythic: '神话',
};

const qualityBadgeColors: Record<Quality, string> = {
  poor: 'bg-stone-500 text-stone-100 border-stone-400',
  common: 'bg-stone-600 text-stone-100 border-stone-500',
  uncommon: 'bg-emerald-600 text-emerald-100 border-emerald-500',
  rare: 'bg-blue-600 text-blue-100 border-blue-500',
  epic: 'bg-purple-600 text-purple-100 border-purple-500',
  legendary: 'bg-amber-500 text-amber-950 border-amber-400',
  mythic: 'bg-red-600 text-red-100 border-red-500',
};

const qualityIconBg: Record<Quality, string> = {
  poor: 'bg-stone-500 border-stone-400',
  common: 'bg-stone-600 border-stone-500',
  uncommon: 'bg-emerald-600 border-emerald-500',
  rare: 'bg-blue-600 border-blue-500',
  epic: 'bg-purple-600 border-purple-500',
  legendary: 'bg-amber-500 border-amber-400',
  mythic: 'bg-red-600 border-red-500',
};

// 品质发光效果
const qualityGlow: Record<Quality, string> = {
  poor: '',
  common: '',
  uncommon: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
  rare: 'shadow-[0_0_12px_rgba(59,130,246,0.4)] animate-pulse-slow',
  epic: 'shadow-[0_0_16px_rgba(168,85,247,0.5)] animate-pulse-slow',
  legendary: 'shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-glow',
  mythic: 'shadow-[0_0_24px_rgba(239,68,68,0.6)] animate-glow',
};

function EquipmentCard({ equipment, compact = false }: { equipment: Equipment; compact?: boolean }) {
  const isHighQuality = ['epic', 'legendary', 'mythic'].includes(equipment.quality);
  
  return (
    <div
      className={cn(
        'w-full rounded-2xl border-3 animate-bounce-in pixel-border',
        'bg-gradient-to-b from-stone-700/80 to-stone-800/90',
        qualityColors[equipment.quality],
        qualityGlow[equipment.quality],
        compact ? 'p-3' : 'p-4'
      )}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={cn(
            'rounded-xl flex items-center justify-center border-3 relative',
            compact ? 'w-14 h-14' : 'w-20 h-20',
            qualityIconBg[equipment.quality],
            isHighQuality && 'animate-soft-pulse'
          )}
        >
          <EquipmentIconWrapper
            type={equipment.type}
            quality={equipment.quality}
            size={compact ? 40 : 56}
            seed={equipment.id}
          />
          {/* 高品质光晕 */}
          {isHighQuality && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/20 pointer-events-none" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className={cn(
              'text-foreground pixel-text',
              compact ? 'text-xs' : 'text-sm'
            )}>
              {equipment.name}
            </h3>
            <Badge className={cn(
              'border-2 text-[10px] rounded-lg',
              qualityBadgeColors[equipment.quality]
            )}>
              {qualityLabels[equipment.quality]}
            </Badge>
          </div>

          {/* Stats */}
          <div className={cn('space-y-1', compact ? 'text-[10px]' : 'text-xs')}>
            {equipment.attack && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">攻击力:</span>
                <span className="text-red-400 font-bold pixel-text">+{equipment.attack}</span>
              </div>
            )}
            {equipment.defense && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">防御力:</span>
                <span className="text-blue-400 font-bold pixel-text">+{equipment.defense}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">售价:</span>
              <span className="text-amber-400 font-bold pixel-text">{equipment.sellPrice} 金币</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResultDialog({ open, onClose, equipment, extraEquipments = [] }: ResultDialogProps) {
  if (!equipment) return null;

  const allEquipments = [equipment, ...extraEquipments];
  const hasMultiple = allEquipments.length > 1;
  const hasHighQuality = allEquipments.some((e) => e.quality === 'legendary' || e.quality === 'mythic' || e.quality === 'epic');
  const hasMythic = allEquipments.some((e) => e.quality === 'mythic');
  const hasLegendary = allEquipments.some((e) => e.quality === 'legendary');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn(
        'rounded-2xl border-3 border-pixel-border',
        '!bg-gradient-to-b !from-stone-700 !to-stone-800',
        'shadow-[5px_5px_0_0_rgba(28,25,23,0.5)]',
        hasMultiple ? 'max-w-lg' : 'max-w-md',
        hasMythic && '!shadow-[5px_5px_0_0_rgba(28,25,23,0.5),0_0_30px_rgba(239,68,68,0.4)]',
        hasLegendary && !hasMythic && '!shadow-[5px_5px_0_0_rgba(28,25,23,0.5),0_0_25px_rgba(245,158,11,0.4)]'
      )}>
        <DialogHeader>
          <DialogTitle className="text-center text-sm text-foreground flex items-center justify-center gap-3 pixel-text">
            <GiAnvilImpact className={cn(
              'text-xl',
              hasMythic ? 'text-red-400 animate-sparkle' : hasLegendary ? 'text-amber-400 animate-sparkle' : 'text-amber-500'
            )} />
            {hasMultiple ? `锻造完成! ×${allEquipments.length}` : '锻造完成!'}
            <GiAnvilImpact className={cn(
              'text-xl',
              hasMythic ? 'text-red-400 animate-sparkle' : hasLegendary ? 'text-amber-400 animate-sparkle' : 'text-amber-500'
            )} />
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          {/* Multiple items banner */}
          {hasMultiple && (
            <div className="w-full mb-4 p-3 bg-amber-900/40 border-3 border-amber-600/60 rounded-xl text-center pixel-border">
              <span className="text-xs text-amber-300 font-bold pixel-text">
                多倍锻造效果触发！获得 {allEquipments.length} 件物品！
              </span>
            </div>
          )}

          {/* Item Cards */}
          <div className={cn(
            'w-full space-y-3',
            hasMultiple && 'max-h-80 overflow-y-auto pr-2'
          )}>
            {allEquipments.map((eq, index) => (
              <div
                key={eq.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EquipmentCard 
                  equipment={eq} 
                  compact={hasMultiple}
                />
              </div>
            ))}
          </div>

          {/* Sparkle effects for high quality */}
          {hasHighQuality && (
            <div className="flex gap-3 mt-4">
              {[...Array(5)].map((_, i) => (
                <GiSparkles
                  key={i}
                  className={cn(
                    'text-2xl animate-sparkle',
                    hasMythic ? 'text-red-400' : hasLegendary ? 'text-amber-400' : 'text-purple-400'
                  )}
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={onClose}
          className={cn(
            'w-full h-12 text-sm rounded-xl border-3 pixel-btn',
            'bg-gradient-to-b from-amber-500 to-amber-600',
            'hover:from-amber-400 hover:to-amber-500',
            'text-amber-950 font-bold',
            'shadow-[3px_3px_0_0_rgba(0,0,0,0.4)]',
            'transition-all'
          )}
        >
          太棒了!
        </Button>
      </DialogContent>
    </Dialog>
  );
}

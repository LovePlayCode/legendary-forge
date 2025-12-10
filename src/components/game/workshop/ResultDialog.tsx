import { GiSparkles } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Equipment, Quality } from '@/types/game';
import { EquipmentIcon } from '@/components/game/common/EquipmentIcon';

interface ResultDialogProps {
  open: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  extraEquipments?: Equipment[];
}

// 品质配置
const qualityColors: Record<Quality, string> = {
  poor: 'bg-gray-100 border-gray-400',
  common: 'bg-forge-sand border-quality-common',
  uncommon: 'bg-green-50 border-green-500',
  rare: 'bg-blue-50 border-blue-500',
  epic: 'bg-purple-50 border-purple-500',
  legendary: 'bg-amber-50 border-amber-500',
  mythic: 'bg-red-50 border-red-500',
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
  poor: 'bg-gray-400 text-white',
  common: 'bg-quality-common text-white',
  uncommon: 'bg-green-500 text-white',
  rare: 'bg-blue-500 text-white',
  epic: 'bg-purple-500 text-white',
  legendary: 'bg-amber-500 text-amber-950',
  mythic: 'bg-red-500 text-white',
};

const qualityIconBg: Record<Quality, string> = {
  poor: 'bg-gray-400 border-gray-500',
  common: 'bg-quality-common border-gray-400',
  uncommon: 'bg-green-500 border-green-600',
  rare: 'bg-blue-500 border-blue-600',
  epic: 'bg-purple-500 border-purple-600',
  legendary: 'bg-amber-500 border-amber-600',
  mythic: 'bg-red-500 border-red-600',
};

function EquipmentCard({ equipment, compact = false }: { equipment: Equipment; compact?: boolean }) {
  return (
    <div
      className={cn(
        'w-full p-4 rounded-2xl border-3 animate-bounce-in shadow-md',
        qualityColors[equipment.quality],
        compact && 'p-3'
      )}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={cn(
            'rounded-xl flex items-center justify-center border-3',
            compact ? 'w-14 h-14' : 'w-20 h-20',
            qualityIconBg[equipment.quality]
          )}
        >
          <EquipmentIcon
            type={equipment.type}
            quality={equipment.quality}
            size={compact ? 40 : 56}
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className={cn('text-forge-dark', compact ? 'text-xs' : 'text-sm')}>{equipment.name}</h3>
            <Badge className={cn('border-2 border-forge-brown/50 text-[10px] rounded-lg', qualityBadgeColors[equipment.quality])}>
              {qualityLabels[equipment.quality]}
            </Badge>
          </div>

          {/* Stats */}
          <div className={cn('space-y-1', compact ? 'text-[10px]' : 'text-xs')}>
            {equipment.attack && (
              <div className="flex items-center gap-2">
                <span className="text-forge-brown">攻击力:</span>
                <span className="text-red-500 font-bold">+{equipment.attack}</span>
              </div>
            )}
            {equipment.defense && (
              <div className="flex items-center gap-2">
                <span className="text-forge-brown">防御力:</span>
                <span className="text-blue-500 font-bold">+{equipment.defense}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-forge-brown">售价:</span>
              <span className="text-amber-600 font-bold">{equipment.sellPrice} 金币</span>
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn(
        'rounded-2xl bg-forge-cream border-3 border-forge-brown shadow-xl',
        hasMultiple ? 'max-w-lg' : 'max-w-md'
      )}>
        <DialogHeader>
          <DialogTitle className="text-center text-sm text-forge-dark flex items-center justify-center gap-2">
            <GiSparkles className="text-quality-legendary animate-sparkle" />
            {hasMultiple ? `锻造完成! ×${allEquipments.length}` : '锻造完成!'}
            <GiSparkles className="text-quality-legendary animate-sparkle" />
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          {/* Multiple items banner */}
          {hasMultiple && (
            <div className="w-full mb-4 p-2 bg-amber-500/20 border-2 border-amber-500/50 rounded-xl text-center">
              <span className="text-xs text-amber-600 font-bold">
                多倍锻造效果触发！获得 {allEquipments.length} 件物品！
              </span>
            </div>
          )}

          {/* Item Cards */}
          <div className={cn('w-full space-y-3', hasMultiple && 'max-h-80 overflow-y-auto pr-2')}>
            {allEquipments.map((eq) => (
              <EquipmentCard 
                key={eq.id} 
                equipment={eq} 
                compact={hasMultiple}
              />
            ))}
          </div>

          {/* Sparkle effects for high quality */}
          {hasHighQuality && (
            <div className="flex gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <GiSparkles
                  key={i}
                  className="text-2xl text-quality-legendary animate-sparkle"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={onClose}
          className="w-full h-12 text-sm rounded-xl border-3 border-forge-brown bg-forge-peach hover:bg-forge-orange text-forge-dark hover:text-white shadow-md transition-all"
        >
          太棒了!
        </Button>
      </DialogContent>
    </Dialog>
  );
}

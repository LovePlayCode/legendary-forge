import { GiPointySword, GiBroadsword, GiRoundShield, GiLeatherArmor, GiWizardStaff, GiVisoredHelm, GiSparkles } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Equipment } from '@/types/game';

interface ResultDialogProps {
  open: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  extraEquipments?: Equipment[];
}

const iconMap: Record<string, React.ElementType> = {
  GiPointySword,
  GiBroadsword,
  GiRoundShield,
  GiLeatherArmor,
  GiWizardStaff,
  GiVisoredHelm,
};

const qualityColors = {
  common: 'bg-forge-sand border-quality-common',
  rare: 'bg-pixel-sky/50 border-quality-rare',
  legendary: 'bg-pixel-lemon/50 border-quality-legendary',
};

const qualityLabels = {
  common: '普通',
  rare: '稀有',
  legendary: '传说',
};

const qualityBadgeColors = {
  common: 'bg-quality-common',
  rare: 'bg-quality-rare',
  legendary: 'bg-quality-legendary',
};

function EquipmentCard({ equipment, compact = false }: { equipment: Equipment; compact?: boolean }) {
  const Icon = iconMap[equipment.icon] || GiPointySword;

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
            equipment.quality === 'legendary'
              ? 'bg-quality-legendary border-yellow-500 animate-soft-pulse'
              : equipment.quality === 'rare'
              ? 'bg-quality-rare border-blue-400'
              : 'bg-quality-common border-gray-400'
          )}
        >
          <Icon className={cn('text-white', compact ? 'text-3xl' : 'text-5xl')} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className={cn('text-forge-dark', compact ? 'text-xs' : 'text-sm')}>{equipment.name}</h3>
            <Badge className={cn('border-2 border-forge-brown/50 text-white text-[10px] rounded-lg', qualityBadgeColors[equipment.quality])}>
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
  const hasLegendary = allEquipments.some((e) => e.quality === 'legendary');

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
                🎉 多倍锻造效果触发！获得 {allEquipments.length} 件物品！
              </span>
            </div>
          )}

          {/* Item Cards */}
          <div className={cn('w-full space-y-3', hasMultiple && 'max-h-80 overflow-y-auto pr-2')}>
            {allEquipments.map((eq, index) => (
              <EquipmentCard 
                key={eq.id} 
                equipment={eq} 
                compact={hasMultiple}
              />
            ))}
          </div>

          {/* Sparkle effects for legendary */}
          {hasLegendary && (
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

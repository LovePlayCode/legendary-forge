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

export function ResultDialog({ open, onClose, equipment }: ResultDialogProps) {
  if (!equipment) return null;

  const Icon = iconMap[equipment.icon] || GiPointySword;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl bg-forge-cream border-3 border-forge-brown shadow-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-sm text-forge-dark flex items-center justify-center gap-2">
            <GiSparkles className="text-quality-legendary animate-sparkle" />
            锻造完成!
            <GiSparkles className="text-quality-legendary animate-sparkle" />
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          {/* Item Card */}
          <div
            className={cn(
              'w-full p-6 rounded-2xl border-3 animate-bounce-in shadow-md',
              qualityColors[equipment.quality]
            )}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={cn(
                  'w-20 h-20 rounded-xl flex items-center justify-center border-3',
                  equipment.quality === 'legendary'
                    ? 'bg-quality-legendary border-yellow-500 animate-soft-pulse'
                    : equipment.quality === 'rare'
                    ? 'bg-quality-rare border-blue-400'
                    : 'bg-quality-common border-gray-400'
                )}
              >
                <Icon className="text-5xl text-white" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-sm text-forge-dark">{equipment.name}</h3>
                  <Badge className={cn('border-2 border-forge-brown/50 text-white text-[10px] rounded-lg', qualityBadgeColors[equipment.quality])}>
                    {qualityLabels[equipment.quality]}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="space-y-1 text-xs">
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
                    <span className="text-forge-brown">耐久度:</span>
                    <span className="text-green-600 font-bold">{equipment.durability}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-forge-brown">售价:</span>
                    <span className="text-amber-600 font-bold">{equipment.sellPrice} 金币</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sparkle effects for legendary */}
          {equipment.quality === 'legendary' && (
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

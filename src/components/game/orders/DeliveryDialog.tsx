import { useState } from 'react';
import { GiPointySword, GiBroadsword, GiRoundShield, GiLeatherArmor, GiWizardStaff, GiVisoredHelm, GiTwoCoins, GiDiceSixFacesSix } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Order, Equipment } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import { useToast } from '@/hooks/use-toast';

interface DeliveryDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  equipments: Equipment[];
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
  common: 'border-gray-400',
  rare: 'border-blue-400',
  legendary: 'border-amber-400',
};

export function DeliveryDialog({ open, onClose, order, equipments }: DeliveryDialogProps) {
  const { completeOrder, removeItem, loseReputation } = useGameStore();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [isHaggling, setIsHaggling] = useState(false);

  if (!order) return null;

  const checkMatch = (item: Equipment): { matches: boolean; score: number } => {
    let score = 50;
    let matches = true;

    if (order.specificType && item.type !== order.specificType) {
      matches = false;
      score -= 30;
    }

    if (order.minAttack && (!item.attack || item.attack < order.minAttack)) {
      matches = false;
      score -= 20;
    }

    if (order.minDefense && (!item.defense || item.defense < order.minDefense)) {
      matches = false;
      score -= 20;
    }

    if (item.quality === 'legendary') score += 30;
    else if (item.quality === 'rare') score += 15;

    return { matches, score: Math.max(0, Math.min(100, score)) };
  };

  const handleDeliver = () => {
    if (!selectedItem) return;

    const { matches, score } = checkMatch(selectedItem);
    const rewardMultiplier = matches ? 1 : 0.5;
    const finalReward = Math.floor(order.reward * rewardMultiplier);
    const finalRep = matches ? order.reputationReward : Math.floor(order.reputationReward * 0.5);

    removeItem(selectedItem.id);
    completeOrder(order.id, finalReward, finalRep);

    toast({
      title: matches ? '交付成功!' : '勉强接受...',
      description: `获得 ${finalReward} 金币，声望 +${finalRep}`,
    });

    setSelectedItem(null);
    onClose();
  };

  const handleHaggle = () => {
    setIsHaggling(true);

    setTimeout(() => {
      const success = Math.random() < 0.5;

      if (success) {
        if (!selectedItem) return;

        const { matches } = checkMatch(selectedItem);
        const bonusReward = Math.floor(order.reward * 0.2);
        const finalReward = order.reward + bonusReward;
        const finalRep = matches ? order.reputationReward : Math.floor(order.reputationReward * 0.5);

        removeItem(selectedItem.id);
        completeOrder(order.id, finalReward, finalRep);

        toast({
          title: '讨价还价成功!',
          description: `获得 ${finalReward} 金币 (+${bonusReward} 额外)`,
        });
      } else {
        loseReputation(5);
        toast({
          title: '讨价还价失败!',
          description: '顾客不满意离开了，声望 -5',
          variant: 'destructive',
        });

        completeOrder(order.id, 0, 0);
      }

      setIsHaggling(false);
      setSelectedItem(null);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl bg-forge-cream border-3 border-forge-brown shadow-xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-forge-dark">
            选择交付物品
          </DialogTitle>
        </DialogHeader>

        {/* Order Requirements */}
        <div className="bg-forge-light rounded-xl p-4 border-3 border-forge-brown/50 mb-4">
          <p className="text-xs text-forge-dark mb-2">顾客需求:</p>
          <p className="text-[10px] text-forge-brown">{order.requirement}</p>
          {order.minAttack && (
            <Badge className="mt-2 mr-2 bg-pixel-pink border-2 border-red-400 text-red-600 text-[10px] rounded-lg">
              攻击力 ≥ {order.minAttack}
            </Badge>
          )}
          {order.minDefense && (
            <Badge className="mt-2 bg-pixel-sky border-2 border-blue-400 text-blue-600 text-[10px] rounded-lg">
              防御力 ≥ {order.minDefense}
            </Badge>
          )}
        </div>

        {/* Equipment List */}
        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-2 gap-3 pr-4">
            {equipments.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-forge-brown/50 text-xs">
                仓库中没有装备，去锻造一些吧！
              </div>
            ) : (
              equipments.map((item) => {
                const Icon = iconMap[item.icon] || GiPointySword;
                const { matches, score } = checkMatch(item);
                const isSelected = selectedItem?.id === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={cn(
                      'p-3 rounded-xl border-3 transition-all text-left shadow-sm',
                      isSelected
                        ? 'border-forge-orange bg-forge-peach shadow-md scale-[1.02]'
                        : 'border-forge-brown/50 bg-forge-light hover:bg-forge-cream',
                      qualityColors[item.quality]
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-lg flex items-center justify-center border-2',
                          item.quality === 'legendary'
                            ? 'bg-quality-legendary border-yellow-500'
                            : item.quality === 'rare'
                            ? 'bg-quality-rare border-blue-400'
                            : 'bg-quality-common border-gray-400'
                        )}
                      >
                        <Icon className="text-2xl text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-forge-dark">{item.name}</p>
                        <div className="flex gap-2 text-[10px]">
                          {item.attack && <span className="text-red-500">攻+{item.attack}</span>}
                          {item.defense && <span className="text-blue-500">防+{item.defense}</span>}
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          'border-2 text-[10px] rounded-lg',
                          matches ? 'bg-pixel-mint border-green-400 text-green-700' : 'bg-pixel-pink border-red-400 text-red-600'
                        )}
                      >
                        {score}%
                      </Badge>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleDeliver}
            disabled={!selectedItem || isHaggling}
            className="flex-1 h-12 rounded-xl border-3 border-forge-brown bg-forge-peach hover:bg-forge-orange text-forge-dark hover:text-white shadow-md transition-all text-xs"
          >
            <GiTwoCoins className="mr-2 text-xl" />
            交付 ({order.reward} 金币)
          </Button>
          <Button
            onClick={handleHaggle}
            disabled={!selectedItem || isHaggling}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-3 border-forge-brown bg-forge-light hover:bg-pixel-lemon text-forge-dark text-xs"
          >
            <GiDiceSixFacesSix className={cn('mr-2 text-xl', isHaggling && 'animate-spin')} />
            {isHaggling ? '讨价中...' : '讨价还价'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

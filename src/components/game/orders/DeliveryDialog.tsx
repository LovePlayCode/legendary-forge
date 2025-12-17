import { useState } from 'react';
import { GiTwoCoins, GiDiceSixFacesSix } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Order, Equipment, Quality } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import { useToast } from '@/hooks/use-toast';
import { EquipmentIconWrapper } from '@/components/game/common/EquipmentIconWrapper';

interface DeliveryDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  equipments: Equipment[];
}

// 品质边框颜色 - 深色主题
const qualityBorderColors: Record<Quality, string> = {
  poor: 'border-stone-500',
  common: 'border-stone-400',
  uncommon: 'border-emerald-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-amber-500',
  mythic: 'border-red-500',
};

// 品质图标背景 - 深色主题
const qualityIconBg: Record<Quality, string> = {
  poor: 'bg-stone-500 border-stone-400',
  common: 'bg-stone-600 border-stone-500',
  uncommon: 'bg-emerald-600 border-emerald-500',
  rare: 'bg-blue-600 border-blue-500',
  epic: 'bg-purple-600 border-purple-500',
  legendary: 'bg-amber-500 border-amber-400',
  mythic: 'bg-red-600 border-red-500',
};

// 品质分数加成
const qualityScoreBonus: Record<Quality, number> = {
  poor: -10,
  common: 0,
  uncommon: 10,
  rare: 20,
  epic: 30,
  legendary: 40,
  mythic: 50,
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

    // 根据品质加分
    score += qualityScoreBonus[item.quality];

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
      <DialogContent className="rounded-2xl !bg-gradient-to-b !from-stone-700 !to-stone-800 border-3 border-pixel-border shadow-[5px_5px_0_0_rgba(28,25,23,0.5)] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-foreground pixel-text">
            选择交付物品
          </DialogTitle>
        </DialogHeader>

        {/* Order Requirements */}
        <div className="bg-stone-800/60 rounded-xl p-4 border-3 border-stone-600/50 mb-4">
          <p className="text-xs text-foreground mb-2">顾客需求:</p>
          <p className="text-[10px] text-muted-foreground">{order.requirement}</p>
          {order.minAttack && (
            <Badge className="mt-2 mr-2 bg-red-900/50 border-2 border-red-500 text-red-300 text-[10px] rounded-lg">
              攻击力 ≥ {order.minAttack}
            </Badge>
          )}
          {order.minDefense && (
            <Badge className="mt-2 bg-blue-900/50 border-2 border-blue-500 text-blue-300 text-[10px] rounded-lg">
              防御力 ≥ {order.minDefense}
            </Badge>
          )}
        </div>

        {/* Equipment List */}
        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-2 gap-3 pr-4">
            {equipments.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-muted-foreground text-xs">
                仓库中没有装备，去锻造一些吧！
              </div>
            ) : (
              equipments.map((item) => {
                const { matches, score } = checkMatch(item);
                const isSelected = selectedItem?.id === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={cn(
                      'p-3 rounded-xl border-3 transition-all text-left',
                      'bg-gradient-to-b from-stone-700/80 to-stone-800/90',
                      isSelected
                        ? 'border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-[1.02]'
                        : 'border-stone-600 hover:border-stone-500',
                      qualityBorderColors[item.quality]
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-lg flex items-center justify-center border-2',
                          qualityIconBg[item.quality]
                        )}
                      >
                        <EquipmentIconWrapper
                          type={item.type}
                          quality={item.quality}
                          size={32}
                          seed={item.id}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-foreground">{item.name}</p>
                        <div className="flex gap-2 text-[10px]">
                          {item.attack && <span className="text-red-400">攻+{item.attack}</span>}
                          {item.defense && <span className="text-blue-400">防+{item.defense}</span>}
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          'border-2 text-[10px] rounded-lg',
                          matches 
                            ? 'bg-emerald-900/50 border-emerald-500 text-emerald-300' 
                            : 'bg-red-900/50 border-red-500 text-red-300'
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
            className={cn(
              'flex-1 h-12 rounded-xl border-3 pixel-btn text-xs',
              'bg-gradient-to-b from-amber-500 to-amber-600',
              'hover:from-amber-400 hover:to-amber-500',
              'text-amber-950 font-bold',
              'shadow-[3px_3px_0_0_rgba(0,0,0,0.4)]'
            )}
          >
            <GiTwoCoins className="mr-2 text-xl" />
            交付 ({order.reward} 金币)
          </Button>
          <Button
            onClick={handleHaggle}
            disabled={!selectedItem || isHaggling}
            variant="outline"
            className={cn(
              'flex-1 h-12 rounded-xl border-3 pixel-btn text-xs',
              'bg-gradient-to-b from-stone-600 to-stone-700',
              'hover:from-stone-500 hover:to-stone-600',
              'text-foreground border-stone-500',
              'shadow-[3px_3px_0_0_rgba(0,0,0,0.4)]'
            )}
          >
            <GiDiceSixFacesSix className={cn('mr-2 text-xl', isHaggling && 'animate-spin')} />
            {isHaggling ? '讨价中...' : '讨价还价'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

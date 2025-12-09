import { useState, useEffect } from 'react';
import { GiSwordman, GiWizardStaff, GiWheat, GiGoldBar, GiHood, GiPointyHat, GiSkullCrossedBones, GiPerson } from 'react-icons/gi';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

interface OrderCardProps {
  order: Order;
  onSelect: () => void;
}

const avatarMap: Record<string, React.ElementType> = {
  GiKnight: GiSwordman,
  GiWizardFace: GiWizardStaff,
  GiFarmer: GiWheat,
  GiMoneyStack: GiGoldBar,
  GiCowled: GiHood,
  GiWitch: GiPointyHat,
  GiCrownedSkull: GiSkullCrossedBones,
  GiPerson,
};

const professionColors: Record<string, string> = {
  knight: 'bg-pixel-pink',
  mage: 'bg-pixel-lavender',
  villager: 'bg-pixel-mint',
  merchant: 'bg-pixel-lemon',
  adventurer: 'bg-pixel-sky',
};

const professionLabels: Record<string, string> = {
  knight: '骑士',
  mage: '法师',
  villager: '村民',
  merchant: '商人',
  adventurer: '冒险家',
};

export function OrderCard({ order, onSelect }: OrderCardProps) {
  const { removeOrder, loseReputation } = useGameStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const Avatar = avatarMap[order.npc.avatar] || GiPerson;

  useEffect(() => {
    if (!order.timeLimit) return;

    const updateTime = () => {
      const elapsed = Date.now() - order.createdAt;
      const remaining = order.timeLimit! - elapsed;

      if (remaining <= 0) {
        removeOrder(order.id);
        loseReputation(10);
        return;
      }

      setTimeLeft(remaining);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [order, removeOrder, loseReputation]);

  const timeProgress = order.timeLimit && timeLeft
    ? (timeLeft / order.timeLimit) * 100
    : 100;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card
      className={cn(
        'bg-forge-light rounded-2xl border-3 shadow-md transition-all hover:shadow-lg hover:-translate-y-1',
        order.isUrgent ? 'border-red-400' : 'border-forge-brown'
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div
            className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center border-3 border-forge-brown',
              professionColors[order.npc.profession]
            )}
          >
            <Avatar className="text-3xl text-forge-dark" />
          </div>

          {/* NPC Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs text-forge-dark">{order.npc.name}</h3>
              {order.isUrgent && (
                <Badge className="bg-pixel-pink border-2 border-red-400 text-red-600 animate-soft-pulse text-[10px] rounded-lg">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  加急
                </Badge>
              )}
            </div>
            <Badge className="bg-forge-sand border-2 border-forge-brown/50 mt-1 text-[10px] text-forge-dark rounded-lg">
              {professionLabels[order.npc.profession]}
            </Badge>
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="relative bg-forge-cream rounded-xl p-3 mb-3 border-2 border-forge-brown/50">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-forge-cream border-l-2 border-t-2 border-forge-brown/50 transform rotate-45" />
          <p className="text-[10px] text-forge-dark leading-relaxed">{order.requirement}</p>
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-4 mb-3 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="text-forge-brown">报酬:</span>
            <span className="text-amber-600 font-bold">{order.reward} 金币</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-forge-brown">声望:</span>
            <span className="text-blue-500 font-bold">+{order.reputationReward}</span>
          </div>
        </div>

        {/* Time Limit */}
        {order.timeLimit && timeLeft && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1 text-[10px]">
              <div className="flex items-center gap-1 text-red-500">
                <Clock className="w-3 h-3" />
                剩余时间
              </div>
              <span className="text-red-500 font-bold">{formatTime(timeLeft)}</span>
            </div>
            <div className="h-3 bg-forge-sand rounded-lg border-2 border-forge-brown/50 overflow-hidden">
              <div 
                className={cn(
                  'h-full transition-all duration-100 rounded-md',
                  timeProgress < 30 ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-green-400 to-green-500'
                )}
                style={{ width: `${timeProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={onSelect}
          className="w-full rounded-xl border-3 border-forge-brown bg-forge-peach hover:bg-forge-orange text-forge-dark hover:text-white text-xs shadow-md transition-all"
        >
          交付订单
        </Button>
      </CardContent>
    </Card>
  );
}

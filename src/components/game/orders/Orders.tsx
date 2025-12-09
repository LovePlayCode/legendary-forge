import { useState } from 'react';
import { GiScrollUnfurled } from 'react-icons/gi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { useToast } from '@/hooks/use-toast';
import { Order, Equipment } from '@/types/game';
import { npcPool } from '@/data/npcs';
import { OrderCard } from './OrderCard';
import { DeliveryDialog } from './DeliveryDialog';

export function Orders() {
  const { orders, addOrder, maxOrders, inventory, level } = useGameStore();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDelivery, setShowDelivery] = useState(false);

  const equipments = inventory.filter((i) => i.category === 'equipment') as Equipment[];

  const generateOrder = () => {
    if (orders.length >= maxOrders) {
      toast({
        title: '订单已满',
        description: '完成一些订单后再接新的吧！',
        variant: 'destructive',
      });
      return;
    }

    const npc = npcPool[Math.floor(Math.random() * npcPool.length)];
    const isUrgent = Math.random() < 0.2;
    const isSpecific = Math.random() < 0.6;

    const types = ['sword', 'shield', 'armor', 'staff', 'helmet', 'boots'] as const;
    const randomType = types[Math.floor(Math.random() * types.length)];

    const baseReward = 50 + level * 20 + Math.floor(Math.random() * 50);
    const reward = isUrgent ? baseReward * 2 : baseReward;

    const order: Order = {
      id: `order-${Date.now()}`,
      npc,
      requirement: isSpecific
        ? `我需要一把${randomType === 'sword' ? '剑' : randomType === 'shield' ? '盾' : randomType === 'armor' ? '护甲' : randomType === 'staff' ? '法杖' : randomType === 'helmet' ? '头盔' : '靴子'}。`
        : '给我来点能用的装备就行。',
      specificType: isSpecific ? randomType : undefined,
      minAttack: isSpecific && Math.random() < 0.5 ? 10 + level * 2 : undefined,
      minDefense: isSpecific && Math.random() < 0.5 ? 8 + level * 2 : undefined,
      reward,
      reputationReward: Math.floor(reward / 10),
      timeLimit: isUrgent ? 120000 : undefined,
      createdAt: Date.now(),
      isUrgent,
    };

    addOrder(order);
    toast({
      title: '新订单!',
      description: `${npc.name}来访了！`,
    });
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDelivery(true);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-pixel-lemon flex items-center justify-center rounded-2xl border-3 border-forge-brown shadow-md">
            <GiScrollUnfurled className="text-3xl text-forge-dark animate-soft-bounce" />
          </div>
          <h1 className="text-lg text-forge-dark">
            订单柜台
          </h1>
        </div>

        <Button
          onClick={generateOrder}
          disabled={orders.length >= maxOrders}
          className="rounded-xl border-3 border-forge-brown bg-forge-peach hover:bg-forge-orange text-forge-dark hover:text-white text-xs shadow-md transition-all"
        >
          招揽顾客 ({orders.length}/{maxOrders})
        </Button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.length === 0 ? (
          <Card className="col-span-full bg-forge-light rounded-2xl border-3 border-forge-brown shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GiScrollUnfurled className="text-8xl text-forge-brown/40 mb-4 animate-soft-pulse" />
              <p className="text-sm text-forge-brown/60">暂无订单</p>
              <p className="text-xs text-forge-brown/40 mt-2">点击"招揽顾客"接待新顾客</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onSelect={() => handleSelectOrder(order)}
            />
          ))
        )}
      </div>

      {/* Delivery Dialog */}
      <DeliveryDialog
        open={showDelivery}
        onClose={() => setShowDelivery(false)}
        order={selectedOrder}
        equipments={equipments}
      />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { GiTreasureMap, GiForest, GiMining, GiAncientRuins, GiTwoCoins, GiMetalBar, GiWoodPile, GiGoldBar, GiBoots, GiGems, GiCrystalBall, GiRock } from 'react-icons/gi';
import { Clock, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore, generateItemId } from '@/store/gameStore';
import { useToast } from '@/hooks/use-toast';
import { MapType, Expedition, Material } from '@/types/game';
import { materialInfo, mapDrops } from '@/data/materials';

const mapIcons: Record<MapType, React.ElementType> = {
  forest: GiForest,
  mine: GiMining,
  ruins: GiAncientRuins,
};

const mapNames: Record<MapType, string> = {
  forest: '神秘森林',
  mine: '深邃矿洞',
  ruins: '远古遗迹',
};

const mapColors: Record<MapType, string> = {
  forest: 'bg-pixel-mint',
  mine: 'bg-forge-sand',
  ruins: 'bg-pixel-lavender',
};

const materialIcons: Record<string, React.ElementType> = {
  iron: GiMetalBar,
  copper: GiRock,
  gold: GiGoldBar,
  wood: GiWoodPile,
  leather: GiBoots,
  gem: GiGems,
  crystal: GiCrystalBall,
};

export function Exploration() {
  const { gold, expeditions, startExpedition, completeExpedition, addItem, spendGold } = useGameStore();
  const { toast } = useToast();
  const [expeditionProgress, setExpeditionProgress] = useState<Record<string, number>>({});

  // Update expedition progress
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newProgress: Record<string, number> = {};

      expeditions.forEach((exp) => {
        const elapsed = now - exp.startTime;
        const progress = Math.min(100, (elapsed / exp.duration) * 100);
        newProgress[exp.id] = progress;

        if (progress >= 100) {
          handleExpeditionComplete(exp);
        }
      });

      setExpeditionProgress(newProgress);
    }, 1000);

    return () => clearInterval(interval);
  }, [expeditions]);

  const handleExpeditionComplete = (expedition: Expedition) => {
    const drops = expedition.possibleDrops;
    const numDrops = 2 + Math.floor(Math.random() * 3);
    const rewards: { type: string; quantity: number }[] = [];

    for (let i = 0; i < numDrops; i++) {
      const dropType = drops[Math.floor(Math.random() * drops.length)];
      const existing = rewards.find((r) => r.type === dropType);
      if (existing) {
        existing.quantity += 1 + Math.floor(Math.random() * 2);
      } else {
        rewards.push({ type: dropType, quantity: 1 + Math.floor(Math.random() * 2) });
      }
    }

    rewards.forEach((reward) => {
      const info = materialInfo[reward.type as keyof typeof materialInfo];
      const material: Material = {
        id: generateItemId(),
        name: info.name,
        category: 'material',
        type: reward.type as any,
        quality: 'common',
        icon: info.icon,
        description: info.description,
        sellPrice: info.basePrice,
        quantity: reward.quantity,
      };
      addItem(material);
    });

    completeExpedition(expedition.id);

    toast({
      title: '探险归来!',
      description: `获得: ${rewards.map((r) => `${materialInfo[r.type as keyof typeof materialInfo].name} x${r.quantity}`).join(', ')}`,
    });
  };

  const handleStartExpedition = (mapType: MapType) => {
    const cost = mapType === 'forest' ? 20 : mapType === 'mine' ? 30 : 50;
    const duration = mapType === 'forest' ? 60000 : mapType === 'mine' ? 90000 : 120000;

    if (gold < cost) {
      toast({
        title: '金币不足',
        description: `需要 ${cost} 金币雇佣探险队`,
        variant: 'destructive',
      });
      return;
    }

    const expedition: Expedition = {
      id: `exp-${Date.now()}`,
      mapType,
      duration,
      startTime: Date.now(),
      possibleDrops: mapDrops[mapType],
      cost,
    };

    startExpedition(expedition);

    toast({
      title: '探险队出发!',
      description: `前往${mapNames[mapType]}探险`,
    });
  };

  const handleBuyMaterial = (type: string) => {
    const info = materialInfo[type as keyof typeof materialInfo];
    const price = info.basePrice * 2;

    if (!spendGold(price)) {
      toast({
        title: '金币不足',
        description: `需要 ${price} 金币`,
        variant: 'destructive',
      });
      return;
    }

    const material: Material = {
      id: generateItemId(),
      name: info.name,
      category: 'material',
      type: type as any,
      quality: 'common',
      icon: info.icon,
      description: info.description,
      sellPrice: info.basePrice,
      quantity: 1,
    };

    addItem(material);

    toast({
      title: '购买成功',
      description: `获得 ${info.name} x1`,
    });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-pixel-mint flex items-center justify-center rounded-2xl border-3 border-forge-brown shadow-md">
          <GiTreasureMap className="text-3xl text-forge-dark animate-soft-bounce" />
        </div>
        <h1 className="text-lg text-forge-dark">
          探险与采购
        </h1>
      </div>

      <Tabs defaultValue="expedition">
        <TabsList className="rounded-xl bg-forge-cream border-3 border-forge-brown/50">
          <TabsTrigger
            value="expedition"
            className="data-[state=active]:bg-forge-peach data-[state=active]:text-forge-dark rounded-lg text-xs"
          >
            <GiTreasureMap className="mr-2" />
            探险队
          </TabsTrigger>
          <TabsTrigger
            value="market"
            className="data-[state=active]:bg-forge-peach data-[state=active]:text-forge-dark rounded-lg text-xs"
          >
            <ShoppingCart className="mr-2 w-4 h-4" />
            材料商店
          </TabsTrigger>
        </TabsList>

        {/* Expedition Tab */}
        <TabsContent value="expedition" className="mt-4">
          {/* Active Expeditions */}
          {expeditions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm text-forge-dark mb-3">进行中的探险</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expeditions.map((exp) => {
                  const Icon = mapIcons[exp.mapType];
                  const progress = expeditionProgress[exp.id] || 0;
                  const remaining = Math.max(0, exp.duration - (Date.now() - exp.startTime));

                  return (
                    <Card key={exp.id} className="bg-forge-light rounded-2xl border-3 border-forge-brown shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center border-3 border-forge-brown',
                              mapColors[exp.mapType]
                            )}
                          >
                            <Icon className="text-2xl text-forge-dark" />
                          </div>
                          <div>
                            <h4 className="text-xs text-forge-dark">{mapNames[exp.mapType]}</h4>
                            <div className="flex items-center gap-1 text-[10px] text-forge-brown">
                              <Clock className="w-3 h-3" />
                              {formatTime(remaining)}
                            </div>
                          </div>
                        </div>
                        <div className="h-4 bg-forge-sand rounded-lg border-2 border-forge-brown/50 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-md transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map Selection */}
          <h3 className="text-sm text-forge-dark mb-3">选择探险地点</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['forest', 'mine', 'ruins'] as MapType[]).map((mapType) => {
              const Icon = mapIcons[mapType];
              const drops = mapDrops[mapType];
              const cost = mapType === 'forest' ? 20 : mapType === 'mine' ? 30 : 50;
              const duration = mapType === 'forest' ? '1分钟' : mapType === 'mine' ? '1.5分钟' : '2分钟';

              return (
                <Card key={mapType} className="bg-forge-light rounded-2xl border-3 border-forge-brown shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
                  <CardHeader className={cn('border-b-3 border-forge-brown', mapColors[mapType])}>
                    <CardTitle className="flex items-center gap-2 text-forge-dark text-sm">
                      <Icon className="text-3xl" />
                      {mapNames[mapType]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <p className="text-[10px] text-forge-brown mb-2">可能掉落:</p>
                      <div className="flex flex-wrap gap-2">
                        {drops.map((drop) => {
                          const DropIcon = materialIcons[drop];
                          return (
                            <Badge key={drop} className="bg-forge-cream border-2 border-forge-brown/50 text-[8px] text-forge-dark rounded-lg">
                              <DropIcon className="mr-1" />
                              {materialInfo[drop].name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3 text-[10px]">
                      <span className="text-forge-brown">探险时间: {duration}</span>
                      <Badge className="bg-pixel-lemon border-2 border-forge-brown/50 text-forge-dark text-[10px] rounded-lg">
                        <GiTwoCoins className="mr-1" />
                        {cost}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleStartExpedition(mapType)}
                      disabled={gold < cost}
                      className="w-full rounded-xl border-3 border-forge-brown bg-forge-peach hover:bg-forge-orange text-forge-dark hover:text-white text-xs shadow-md transition-all"
                    >
                      派遣探险队
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Market Tab */}
        <TabsContent value="market" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(materialInfo).map(([type, info]) => {
              const Icon = materialIcons[type];
              const price = info.basePrice * 2;

              return (
                <Card key={type} className="bg-forge-light rounded-2xl border-3 border-forge-brown/50 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="w-16 h-16 bg-forge-cream rounded-xl flex items-center justify-center border-3 border-forge-brown/50 mb-2">
                      <Icon className="text-4xl text-forge-orange" />
                    </div>
                    <h4 className="text-[10px] text-center text-forge-dark">{info.name}</h4>
                    <Badge className="my-2 bg-pixel-lemon border-2 border-forge-brown/50 text-forge-dark text-[10px] rounded-lg">
                      <GiTwoCoins className="mr-1" />
                      {price}
                    </Badge>
                    <Button
                      onClick={() => handleBuyMaterial(type)}
                      disabled={gold < price}
                      size="sm"
                      className="w-full rounded-lg border-2 border-forge-brown/50 bg-forge-peach hover:bg-forge-orange text-forge-dark hover:text-white text-[10px] shadow-sm transition-all"
                    >
                      购买
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

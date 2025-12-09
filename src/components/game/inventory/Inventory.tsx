import { useState } from 'react';
import { GiKnapsack, GiPointySword, GiBroadsword, GiRoundShield, GiLeatherArmor, GiWizardStaff, GiVisoredHelm, GiMetalBar, GiWoodPile, GiGoldBar, GiBoots, GiGems, GiCrystalBall, GiRock } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useGameStore } from '@/store/gameStore';
import { useToast } from '@/hooks/use-toast';
import { Equipment, Material, Item } from '@/types/game';

const equipmentIcons: Record<string, React.ElementType> = {
  GiPointySword,
  GiBroadsword,
  GiRoundShield,
  GiLeatherArmor,
  GiWizardStaff,
  GiVisoredHelm,
};

const materialIcons: Record<string, React.ElementType> = {
  GiIronBar: GiMetalBar,
  GiWoodPile,
  GiGoldBar,
  GiLeatherBoot: GiBoots,
  GiGems,
  GiCrystalBall,
  GiCoalWagon: GiRock,
};

const qualityColors = {
  common: 'border-quality-common bg-forge-sand',
  rare: 'border-quality-rare bg-pixel-sky/30',
  legendary: 'border-quality-legendary bg-pixel-lemon/30',
};

export function Inventory() {
  const { inventory, inventoryCapacity, removeItem, addGold } = useGameStore();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const equipments = inventory.filter((i) => i.category === 'equipment') as Equipment[];
  const materials = inventory.filter((i) => i.category === 'material') as Material[];

  const handleItemClick = (item: Item) => {
    if (isMultiSelect) {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(item.id)) {
        newSelected.delete(item.id);
      } else {
        newSelected.add(item.id);
      }
      setSelectedIds(newSelected);
    } else {
      setSelectedItem(item);
    }
  };

  const handleSell = (item: Item) => {
    addGold(item.sellPrice);
    removeItem(item.id);
    toast({
      title: '出售成功',
      description: `获得 ${item.sellPrice} 金币`,
    });
    setSelectedItem(null);
  };

  const handleBatchSell = () => {
    let totalGold = 0;
    selectedIds.forEach((id) => {
      const item = inventory.find((i) => i.id === id);
      if (item) {
        totalGold += item.sellPrice;
        removeItem(id);
      }
    });

    toast({
      title: '批量出售成功',
      description: `共出售 ${selectedIds.size} 件物品，获得 ${totalGold} 金币`,
    });

    setSelectedIds(new Set());
    setIsMultiSelect(false);
  };

  const renderEquipmentGrid = () => (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {equipments.map((item) => {
        const Icon = equipmentIcons[item.icon] || GiPointySword;
        const isSelected = selectedIds.has(item.id);

        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={cn(
              'aspect-square rounded-xl border-3 flex flex-col items-center justify-center p-2 transition-all hover:-translate-y-1 hover:shadow-md',
              qualityColors[item.quality],
              isSelected && 'ring-4 ring-forge-orange'
            )}
          >
            <Icon className="text-3xl text-forge-dark" />
            <span className="text-[8px] mt-1 truncate w-full text-center text-forge-dark">
              {item.name.slice(0, 4)}
            </span>
          </button>
        );
      })}
      {equipments.length === 0 && (
        <div className="col-span-full text-center py-8 text-forge-brown/50 text-xs">
          暂无装备
        </div>
      )}
    </div>
  );

  const renderMaterialGrid = () => (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {materials.map((item) => {
        const Icon = materialIcons[item.icon] || GiMetalBar;

        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="aspect-square rounded-xl border-3 border-forge-brown/50 bg-forge-cream flex flex-col items-center justify-center p-2 transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <Icon className="text-3xl text-forge-orange" />
            <span className="text-[8px] mt-1 text-forge-dark">{item.name.slice(0, 3)}</span>
            <Badge className="mt-1 bg-forge-peach border-2 border-forge-brown/50 text-forge-dark text-[8px] px-1 rounded-md">
              x{item.quantity}
            </Badge>
          </button>
        );
      })}
      {materials.length === 0 && (
        <div className="col-span-full text-center py-8 text-forge-brown/50 text-xs">
          暂无材料
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-pixel-lavender flex items-center justify-center rounded-2xl border-3 border-forge-brown shadow-md">
            <GiKnapsack className="text-3xl text-forge-dark animate-soft-bounce" />
          </div>
          <div>
            <h1 className="text-lg text-forge-dark">
              仓库管理
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-32 h-3 bg-forge-sand rounded-lg border-2 border-forge-brown/50 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-md transition-all"
                  style={{ width: `${(inventory.length / inventoryCapacity) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-forge-brown">
                {inventory.length}/{inventoryCapacity}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              setIsMultiSelect(!isMultiSelect);
              setSelectedIds(new Set());
            }}
            className={cn(
              'rounded-xl border-3 border-forge-brown text-xs shadow-md transition-all',
              isMultiSelect ? 'bg-pixel-pink text-red-600' : 'bg-forge-light text-forge-dark hover:bg-forge-cream'
            )}
          >
            {isMultiSelect ? '取消选择' : '批量选择'}
          </Button>
          {isMultiSelect && selectedIds.size > 0 && (
            <Button
              onClick={handleBatchSell}
              className="rounded-xl border-3 border-red-400 bg-pixel-pink hover:bg-red-400 text-red-600 hover:text-white text-xs shadow-md transition-all"
            >
              批量出售 ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      {/* Inventory Tabs */}
      <Card className="bg-forge-light rounded-2xl border-3 border-forge-brown shadow-lg overflow-hidden">
        <Tabs defaultValue="equipment">
          <CardHeader className="bg-forge-cream border-b-3 border-forge-brown pb-0">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="equipment"
                className="data-[state=active]:bg-forge-peach data-[state=active]:text-forge-dark rounded-xl border-2 border-forge-brown/50 text-xs"
              >
                装备 ({equipments.length})
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="data-[state=active]:bg-forge-peach data-[state=active]:text-forge-dark rounded-xl border-2 border-forge-brown/50 text-xs"
              >
                材料 ({materials.length})
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="p-4 bg-forge-light">
            <TabsContent value="equipment" className="mt-0">
              <ScrollArea className="h-[400px]">
                {renderEquipmentGrid()}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="materials" className="mt-0">
              <ScrollArea className="h-[400px]">
                {renderMaterialGrid()}
              </ScrollArea>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Item Detail Sheet */}
      <Sheet open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <SheetContent className="rounded-l-2xl bg-forge-cream border-3 border-forge-brown">
          <SheetHeader>
            <SheetTitle className="text-sm text-forge-dark">
              物品详情
            </SheetTitle>
          </SheetHeader>

          {selectedItem && (
            <div className="mt-6 space-y-4">
              {/* Item Icon */}
              <div className="flex justify-center">
                <div
                  className={cn(
                    'w-24 h-24 rounded-2xl flex items-center justify-center border-3',
                    selectedItem.quality === 'legendary'
                      ? 'bg-quality-legendary border-yellow-500 animate-soft-pulse'
                      : selectedItem.quality === 'rare'
                      ? 'bg-quality-rare border-blue-400'
                      : 'bg-quality-common border-gray-400'
                  )}
                >
                  {(() => {
                    const Icon =
                      selectedItem.category === 'equipment'
                        ? equipmentIcons[(selectedItem as Equipment).icon] || GiPointySword
                        : materialIcons[(selectedItem as Material).icon] || GiMetalBar;
                    return <Icon className="text-6xl text-white" />;
                  })()}
                </div>
              </div>

              {/* Item Name */}
              <div className="text-center">
                <h3 className="text-xs text-forge-dark">{selectedItem.name}</h3>
                <Badge
                  className={cn(
                    'mt-2 border-2 border-forge-brown/50 text-[10px] rounded-lg text-white',
                    selectedItem.quality === 'legendary'
                      ? 'bg-quality-legendary'
                      : selectedItem.quality === 'rare'
                      ? 'bg-quality-rare'
                      : 'bg-quality-common'
                  )}
                >
                  {selectedItem.quality === 'legendary'
                    ? '传说'
                    : selectedItem.quality === 'rare'
                    ? '稀有'
                    : '普通'}
                </Badge>
              </div>

              {/* Stats */}
              <div className="bg-forge-light rounded-xl p-4 border-3 border-forge-brown/50 space-y-2 text-[10px]">
                {selectedItem.category === 'equipment' && (
                  <>
                    {(selectedItem as Equipment).attack && (
                      <div className="flex justify-between">
                        <span className="text-forge-brown">攻击力</span>
                        <span className="text-red-500 font-bold">
                          +{(selectedItem as Equipment).attack}
                        </span>
                      </div>
                    )}
                    {(selectedItem as Equipment).defense && (
                      <div className="flex justify-between">
                        <span className="text-forge-brown">防御力</span>
                        <span className="text-blue-500 font-bold">
                          +{(selectedItem as Equipment).defense}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-forge-brown">耐久度</span>
                      <span className="text-green-600 font-bold">
                        {(selectedItem as Equipment).durability}/
                        {(selectedItem as Equipment).maxDurability}
                      </span>
                    </div>
                  </>
                )}
                {selectedItem.category === 'material' && (
                  <div className="flex justify-between">
                    <span className="text-forge-brown">数量</span>
                    <span className="text-forge-orange font-bold">
                      {(selectedItem as Material).quantity}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-forge-brown">售价</span>
                  <span className="text-amber-600 font-bold">
                    {selectedItem.sellPrice} 金币
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-forge-brown text-center text-[10px]">{selectedItem.description}</p>

              {/* Actions */}
              <Button
                onClick={() => handleSell(selectedItem)}
                className="w-full h-12 rounded-xl border-3 border-red-400 bg-pixel-pink hover:bg-red-400 text-red-600 hover:text-white text-xs shadow-md transition-all"
              >
                出售 ({selectedItem.sellPrice} 金币)
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

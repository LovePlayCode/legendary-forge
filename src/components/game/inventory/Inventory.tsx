import { useState } from 'react';
import { GiKnapsack, GiMetalBar, GiWoodPile, GiGoldBar, GiBoots, GiGems, GiCrystalBall, GiRock } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useGameStore } from '@/store/gameStore';
import { useToast } from '@/hooks/use-toast';
import { Equipment, Material, Item, Quality } from '@/types/game';
import { EquipmentIconWrapper } from '@/components/game/common/EquipmentIconWrapper';

const materialIcons: Record<string, React.ElementType> = {
  GiIronBar: GiMetalBar,
  GiWoodPile,
  GiGoldBar,
  GiLeatherBoot: GiBoots,
  GiGems,
  GiCrystalBall,
  GiCoalWagon: GiRock,
};

// 品质配置：边框色 + 背景色
const qualityColors: Record<Quality, string> = {
  poor: 'border-gray-400 bg-gray-100',
  common: 'border-quality-common bg-forge-sand',
  uncommon: 'border-green-500 bg-green-50',
  rare: 'border-blue-500 bg-blue-50',
  epic: 'border-purple-500 bg-purple-50',
  legendary: 'border-amber-500 bg-amber-50',
  mythic: 'border-red-500 bg-red-50',
};

// 品质文字颜色
const qualityTextColors: Record<Quality, string> = {
  poor: 'text-gray-600',
  common: 'text-forge-dark',
  uncommon: 'text-green-700',
  rare: 'text-blue-700',
  epic: 'text-purple-700',
  legendary: 'text-amber-700',
  mythic: 'text-red-700',
};

// 品质角标样式
const qualityBadgeStyles: Record<Quality, string> = {
  poor: 'bg-gray-400 text-white border-gray-500',
  common: '',
  uncommon: 'bg-green-500 text-white border-green-600',
  rare: 'bg-blue-500 text-white border-blue-600',
  epic: 'bg-purple-500 text-white border-purple-600',
  legendary: 'bg-amber-500 text-amber-950 border-amber-600',
  mythic: 'bg-red-500 text-white border-red-600',
};

// 品质中文名称
const qualityNames: Record<Quality, string> = {
  poor: '粗糙',
  common: '普通',
  uncommon: '精良',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
  mythic: '神话',
};

// 品质详情背景色
const qualityDetailBg: Record<Quality, string> = {
  poor: 'bg-gray-400 border-gray-500',
  common: 'bg-quality-common border-gray-400',
  uncommon: 'bg-green-500 border-green-600',
  rare: 'bg-blue-500 border-blue-600',
  epic: 'bg-purple-500 border-purple-600',
  legendary: 'bg-amber-500 border-amber-600',
  mythic: 'bg-red-500 border-red-600',
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
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5 p-4 pt-5">
      {equipments.map((item) => {
        const isSelected = selectedIds.has(item.id);

        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={cn(
              'group relative aspect-square rounded-xl border-3 flex flex-col items-center justify-center p-2 transition-all duration-200',
              'hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 hover:border-primary hover:z-10',
              qualityColors[item.quality],
              isSelected && 'ring-4 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-lg shadow-primary/30 border-primary z-10'
            )}
          >
            {/* 选中勾选标记 */}
            {isSelected && (
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background shadow-md z-20">
                <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {/* Hover 光晕效果 */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            <EquipmentIconWrapper
              type={item.type}
              quality={item.quality}
              size={36}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span className={cn(
              'text-[8px] mt-1 truncate w-full text-center transition-colors duration-200 group-hover:text-primary group-hover:font-bold',
              isSelected ? 'text-primary font-bold' : qualityTextColors[item.quality]
            )}>
              {item.name.slice(0, 4)}
            </span>
            {/* 品质标识角标 - 普通品质不显示 */}
            {item.quality !== 'common' && (
              <div className={cn(
                'absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[6px] font-bold border',
                qualityBadgeStyles[item.quality]
              )}>
                {qualityNames[item.quality]}
              </div>
            )}
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
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5 p-4 pt-5">
      {materials.map((item) => {
        const Icon = materialIcons[item.icon] || GiMetalBar;

        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="group aspect-square rounded-xl border-3 border-forge-brown/50 bg-forge-cream flex flex-col items-center justify-center p-2 transition-all duration-200 hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 hover:border-amber-500 hover:bg-amber-50 hover:z-10"
          >
            <Icon className="text-3xl text-forge-orange transition-all duration-200 group-hover:scale-110 group-hover:text-amber-600" />
            <span className="text-[8px] mt-1 text-forge-dark transition-colors duration-200 group-hover:text-amber-700 group-hover:font-bold">{item.name.slice(0, 3)}</span>
            <Badge className="mt-1 bg-forge-peach border-2 border-forge-brown/50 text-forge-dark text-[8px] px-1 rounded-md transition-all duration-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-600">
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
      <Card className="bg-forge-light rounded-2xl border-3 border-forge-brown shadow-lg">
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
              <ScrollArea className="h-[400px] overflow-visible">
                <div className="pr-4">
                  {renderEquipmentGrid()}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="materials" className="mt-0">
              <ScrollArea className="h-[400px] overflow-visible">
                <div className="pr-4">
                  {renderMaterialGrid()}
                </div>
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
                    qualityDetailBg[selectedItem.quality]
                  )}
                >
                  {selectedItem.category === 'equipment' ? (
                    <EquipmentIconWrapper
                      type={(selectedItem as Equipment).type}
                      quality={selectedItem.quality}
                      size={64}
                    />
                  ) : (
                    (() => {
                      const Icon = materialIcons[(selectedItem as Material).icon] || GiMetalBar;
                      return <Icon className="text-6xl text-white" />;
                    })()
                  )}
                </div>
              </div>

              {/* Item Name */}
              <div className="text-center">
                <h3 className="text-xs text-forge-dark">{selectedItem.name}</h3>
                <Badge
                  className={cn(
                    'mt-2 border-2 text-[10px] rounded-lg',
                    qualityBadgeStyles[selectedItem.quality] || 'bg-quality-common text-white border-gray-400'
                  )}
                >
                  {qualityNames[selectedItem.quality]}
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

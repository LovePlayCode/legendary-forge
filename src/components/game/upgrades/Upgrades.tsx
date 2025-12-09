import { GiUpgrade, GiHammerNails, GiShop, GiSpellBook, GiTwoCoins, GiCheckMark, GiPadlock } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useGameStore } from '@/store/gameStore';
import { useToast } from '@/hooks/use-toast';
import { Upgrade } from '@/types/game';

const categoryIcons = {
  tool: GiHammerNails,
  shop: GiShop,
  skill: GiSpellBook,
};

const categoryNames = {
  tool: '工具升级',
  shop: '店铺扩建',
  skill: '技能树',
};

const categoryColors = {
  tool: 'bg-pixel-pink',
  shop: 'bg-pixel-sky',
  skill: 'bg-pixel-lavender',
};

export function Upgrades() {
  const { gold, upgrades, purchaseUpgrade } = useGameStore();
  const { toast } = useToast();

  const groupedUpgrades = {
    tool: upgrades.filter((u) => u.category === 'tool'),
    shop: upgrades.filter((u) => u.category === 'shop'),
    skill: upgrades.filter((u) => u.category === 'skill'),
  };

  const handlePurchase = (upgrade: Upgrade) => {
    if (purchaseUpgrade(upgrade.id)) {
      toast({
        title: '升级成功!',
        description: `已解锁: ${upgrade.name}`,
      });
    } else {
      toast({
        title: '升级失败',
        description: gold < upgrade.cost ? '金币不足' : '条件不满足',
        variant: 'destructive',
      });
    }
  };

  const renderUpgradeCard = (upgrade: Upgrade) => {
    const canPurchase = upgrade.unlocked && !upgrade.purchased && gold >= upgrade.cost;

    return (
      <div
        key={upgrade.id}
        className={cn(
          'p-4 rounded-xl border-3 transition-all',
          upgrade.purchased
            ? 'bg-pixel-mint/50 border-green-400'
            : upgrade.unlocked
            ? 'bg-forge-light border-forge-brown/50 hover:-translate-y-1 hover:shadow-md'
            : 'bg-forge-sand border-forge-brown/30 opacity-60'
        )}
      >
        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs text-forge-dark">{upgrade.name}</h4>
            {upgrade.purchased && (
              <Badge className="bg-pixel-mint border-2 border-green-400 text-green-700 text-[10px] rounded-lg">
                <GiCheckMark className="mr-1" />
                已解锁
              </Badge>
            )}
            {!upgrade.unlocked && (
              <Badge className="bg-forge-sand border-2 border-forge-brown/50 text-forge-brown text-[10px] rounded-lg">
                <GiPadlock className="mr-1" />
                锁定
              </Badge>
            )}
          </div>
          {!upgrade.purchased && (
            <Badge className="bg-pixel-lemon border-2 border-forge-brown/50 text-forge-dark text-[10px] rounded-lg">
              <GiTwoCoins className="mr-1" />
              {upgrade.cost}
            </Badge>
          )}
        </div>

        <p className="text-[10px] text-forge-brown mb-3">{upgrade.description}</p>

        {!upgrade.purchased && (
          <Button
            onClick={() => handlePurchase(upgrade)}
            disabled={!canPurchase}
            className={cn(
              'w-full text-xs rounded-lg border-2 transition-all',
              canPurchase
                ? 'border-forge-brown bg-forge-peach hover:bg-forge-orange text-forge-dark hover:text-white shadow-sm'
                : 'border-forge-brown/30 bg-forge-sand text-forge-brown/50'
            )}
          >
            {!upgrade.unlocked
              ? '需要前置升级'
              : gold < upgrade.cost
              ? '金币不足'
              : '购买升级'}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-pixel-lavender flex items-center justify-center rounded-2xl border-3 border-forge-brown shadow-md">
          <GiUpgrade className="text-3xl text-forge-dark animate-soft-bounce" />
        </div>
        <h1 className="text-lg text-forge-dark">
          店铺升级
        </h1>
      </div>

      {/* Upgrade Categories */}
      <Accordion type="multiple" defaultValue={['tool', 'shop', 'skill']} className="space-y-4">
        {(['tool', 'shop', 'skill'] as const).map((category) => {
          const Icon = categoryIcons[category];
          const categoryUpgrades = groupedUpgrades[category];
          const purchasedCount = categoryUpgrades.filter((u) => u.purchased).length;

          return (
            <AccordionItem
              key={category}
              value={category}
              className="bg-forge-light rounded-2xl border-3 border-forge-brown shadow-md overflow-hidden"
            >
              <AccordionTrigger
                className={cn(
                  'px-4 py-3 hover:no-underline',
                  categoryColors[category]
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center border-2 border-forge-brown/50">
                    <Icon className="text-2xl text-forge-dark" />
                  </div>
                  <span className="text-sm text-forge-dark">
                    {categoryNames[category]}
                  </span>
                  <Badge className="bg-white/30 border-2 border-forge-brown/50 text-forge-dark text-[10px] rounded-lg">
                    {purchasedCount}/{categoryUpgrades.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-forge-light">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryUpgrades.map(renderUpgradeCard)}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

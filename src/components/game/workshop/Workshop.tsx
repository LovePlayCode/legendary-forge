import { useState } from 'react';
import { GiAnvilImpact, GiFireBowl } from 'react-icons/gi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeSelector } from './RecipeSelector';
import { ForgingGame } from './ForgingGame';
import { ResultDialog } from './ResultDialog';
import { useGameStore } from '@/store/gameStore';
import { Recipe, Equipment, Quality } from '@/types/game';
import { generateItemId, calculateQuality } from '@/store/gameStore';

export function Workshop() {
  const { recipes, consumeMaterials, addItem, qualityBonus } = useGameStore();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isForging, setIsForging] = useState(false);
  const [forgeResult, setForgeResult] = useState<Equipment | null>(null);
  const [showResult, setShowResult] = useState(false);

  const unlockedRecipes = recipes.filter((r) => r.unlocked);

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleStartForge = () => {
    if (!selectedRecipe) return;
    
    const canConsume = consumeMaterials(selectedRecipe.materials);
    if (!canConsume) {
      return;
    }
    
    setIsForging(true);
  };

  const handleForgeComplete = (performance: number) => {
    if (!selectedRecipe) return;

    const baseScore = 50 + Math.random() * 30;
    const quality: Quality = calculateQuality(baseScore, performance, qualityBonus);

    const qualityMultiplier = quality === 'legendary' ? 1.5 : quality === 'rare' ? 1.2 : 1;

    const equipment: Equipment = {
      id: generateItemId(),
      name: `${quality === 'legendary' ? '传说' : quality === 'rare' ? '精良' : ''}${selectedRecipe.name}`,
      category: 'equipment',
      type: selectedRecipe.resultType,
      quality,
      icon: selectedRecipe.icon,
      description: `由传说铁匠铺精心锻造的${selectedRecipe.name}`,
      sellPrice: Math.floor((selectedRecipe.baseAttack || selectedRecipe.baseDefense || 10) * 5 * qualityMultiplier),
      attack: selectedRecipe.baseAttack ? Math.floor(selectedRecipe.baseAttack * qualityMultiplier) : undefined,
      defense: selectedRecipe.baseDefense ? Math.floor(selectedRecipe.baseDefense * qualityMultiplier) : undefined,
      durability: Math.floor(selectedRecipe.baseDurability * qualityMultiplier),
      maxDurability: Math.floor(selectedRecipe.baseDurability * qualityMultiplier),
    };

    addItem(equipment);
    setForgeResult(equipment);
    setIsForging(false);
    setShowResult(true);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setForgeResult(null);
    setSelectedRecipe(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-forge-peach flex items-center justify-center rounded-2xl border-3 border-forge-brown shadow-md">
          <GiAnvilImpact className="text-3xl text-forge-dark animate-soft-bounce" />
        </div>
        <h1 className="text-lg text-forge-dark">
          锻造工坊
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipe Selection */}
        <Card className="bg-forge-light rounded-2xl border-3 border-forge-brown shadow-lg overflow-hidden">
          <CardHeader className="bg-pixel-lemon border-b-3 border-forge-brown">
            <CardTitle className="flex items-center gap-2 text-forge-dark text-sm">
              <GiFireBowl className="text-2xl" />
              配方选择
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-forge-light">
            <RecipeSelector
              recipes={unlockedRecipes}
              selectedRecipe={selectedRecipe}
              onSelect={handleSelectRecipe}
              disabled={isForging}
            />
          </CardContent>
        </Card>

        {/* Forging Area */}
        <Card className="bg-forge-light rounded-2xl border-3 border-forge-brown shadow-lg overflow-hidden">
          <CardHeader className="bg-forge-peach border-b-3 border-forge-brown">
            <CardTitle className="flex items-center gap-2 text-forge-dark text-sm">
              <GiAnvilImpact className="text-2xl" />
              锻造台
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-forge-light">
            <ForgingGame
              recipe={selectedRecipe}
              isForging={isForging}
              onStartForge={handleStartForge}
              onForgeComplete={handleForgeComplete}
            />
          </CardContent>
        </Card>
      </div>

      {/* Result Dialog */}
      <ResultDialog
        open={showResult}
        onClose={handleCloseResult}
        equipment={forgeResult}
      />
    </div>
  );
}

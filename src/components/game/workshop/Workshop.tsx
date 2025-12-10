import { useState } from "react";
import { GiAnvilImpact, GiFireBowl, GiSparkles } from "react-icons/gi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeSelector } from "./RecipeSelector";
import { ForgingGame } from "./ForgingGame";
import { ResultDialog } from "./ResultDialog";
import { useGameStore } from "@/store/gameStore";
import { Recipe, Equipment, Quality } from "@/types/game";
import { generateItemId, calculateQuality } from "@/store/gameStore";

export function Workshop() {
  const { recipes, consumeMaterials, addItem, qualityBonus, consumeEffect, getActiveEffect } = useGameStore();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isForging, setIsForging] = useState(false);
  const [forgeResults, setForgeResults] = useState<Equipment[]>([]);
  const [showResult, setShowResult] = useState(false);

  const unlockedRecipes = recipes.filter((r) => r.unlocked);

  // 检查是否有材料节省效果
  const materialSaveEffect = getActiveEffect('materialSave');

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleStartForge = () => {
    if (!selectedRecipe) return;

    // 应用材料节省效果
    let materialsToConsume = selectedRecipe.materials;
    if (materialSaveEffect) {
      materialsToConsume = selectedRecipe.materials.map((mat) => ({
        ...mat,
        quantity: Math.max(1, Math.ceil(mat.quantity * (1 - materialSaveEffect.effectValue))),
      }));
      consumeEffect('materialSave');
    }

    const canConsume = consumeMaterials(materialsToConsume);
    if (!canConsume) {
      return;
    }

    setIsForging(true);
  };

  const handleForgeComplete = (performance: number) => {
    if (!selectedRecipe) return;

    // 检查品质提升效果
    const qualityBoostEffect = consumeEffect('qualityBoost');
    const extraQualityBonus = qualityBoostEffect ? qualityBoostEffect.effectValue : 0;

    // 检查锻造翻倍效果
    const doubleForgeEffect = consumeEffect('doubleForge');
    const forgeCount = doubleForgeEffect ? doubleForgeEffect.effectValue : 1;

    const results: Equipment[] = [];

    for (let i = 0; i < forgeCount; i++) {
      const baseScore = 50 + Math.random() * 30;
      const quality: Quality = calculateQuality(
        baseScore,
        performance,
        qualityBonus + extraQualityBonus
      );

      // 品质倍率映射
      const qualityMultipliers: Record<Quality, number> = {
        poor: 0.6,
        common: 1,
        uncommon: 1.15,
        rare: 1.3,
        epic: 1.5,
        legendary: 1.8,
        mythic: 2.2,
      };

      // 品质前缀映射
      const qualityPrefixes: Record<Quality, string> = {
        poor: '粗糙',
        common: '',
        uncommon: '精良',
        rare: '稀有',
        epic: '史诗',
        legendary: '传说',
        mythic: '神话',
      };

      const qualityMultiplier = qualityMultipliers[quality];
      const prefix = qualityPrefixes[quality];

      const equipment: Equipment = {
        id: generateItemId(),
        name: `${prefix}${selectedRecipe.name}`,
        category: "equipment",
        type: selectedRecipe.resultType,
        quality,
        icon: selectedRecipe.icon,
        description: `由传说铁匠铺精心锻造的${selectedRecipe.name}`,
        sellPrice: Math.floor(
          (selectedRecipe.baseAttack || selectedRecipe.baseDefense || 10) *
            5 *
            qualityMultiplier
        ),
        attack: selectedRecipe.baseAttack
          ? Math.floor(selectedRecipe.baseAttack * qualityMultiplier)
          : undefined,
        defense: selectedRecipe.baseDefense
          ? Math.floor(selectedRecipe.baseDefense * qualityMultiplier)
          : undefined,
        durability: Math.floor(selectedRecipe.baseDurability * qualityMultiplier),
        maxDurability: Math.floor(
          selectedRecipe.baseDurability * qualityMultiplier
        ),
      };

      addItem(equipment);
      results.push(equipment);
    }

    setForgeResults(results);
    setIsForging(false);
    setShowResult(true);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setForgeResults([]);
    setSelectedRecipe(null);
  };

  // 检查当前激活的锻造相关效果
  const doubleForgeEffect = getActiveEffect('doubleForge');
  const qualityBoostEffect = getActiveEffect('qualityBoost');

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-primary/20 flex items-center justify-center rounded-2xl border-2 border-primary/50 shadow-sm">
          <GiAnvilImpact className="text-3xl text-primary animate-soft-bounce" />
        </div>
        <h1 className="text-lg text-foreground font-pixel tracking-wide">
          锻造工坊
        </h1>
      </div>

      {/* Active Forge Effects Banner */}
      {(doubleForgeEffect || qualityBoostEffect || materialSaveEffect) && (
        <div className="flex items-center gap-3 p-3 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl">
          <GiSparkles className="text-xl text-amber-400 animate-pulse" />
          <span className="text-xs text-amber-400">
            当前激活效果：
            {doubleForgeEffect && ` 锻造×${doubleForgeEffect.effectValue}`}
            {qualityBoostEffect && ` 品质+${Math.round(qualityBoostEffect.effectValue * 100)}%`}
            {materialSaveEffect && ` 材料-${Math.round(materialSaveEffect.effectValue * 100)}%`}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipe Selection */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50 border-b-2 border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-foreground text-sm">
              <GiFireBowl className="text-2xl text-orange-500" />
              配方选择
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-card/50">
            <RecipeSelector
              recipes={unlockedRecipes}
              selectedRecipe={selectedRecipe}
              onSelect={handleSelectRecipe}
              disabled={isForging}
            />
          </CardContent>
        </Card>

        {/* Forging Area */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50 border-b-2 border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-foreground text-sm">
              <GiAnvilImpact className="text-2xl text-primary" />
              锻造台
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-card/50">
            <ForgingGame
              recipe={selectedRecipe}
              isForging={isForging}
              onStartForge={handleStartForge}
              onForgeComplete={handleForgeComplete}
            />
          </CardContent>
        </Card>
      </div>

      {/* Result Dialog - 支持多个结果 */}
      <ResultDialog
        open={showResult}
        onClose={handleCloseResult}
        equipment={forgeResults[0] || null}
        extraEquipments={forgeResults.slice(1)}
      />
    </div>
  );
}

import { GiPointySword, GiBroadsword, GiRoundShield, GiLeatherArmor, GiWizardStaff, GiVisoredHelm } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { Recipe, MaterialType } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import { materialInfo } from '@/data/materials';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface RecipeSelectorProps {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  onSelect: (recipe: Recipe) => void;
  disabled?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  GiPointySword,
  GiBroadsword,
  GiRoundShield,
  GiLeatherArmor,
  GiWizardStaff,
  GiVisoredHelm,
};

export function RecipeSelector({ recipes, selectedRecipe, onSelect, disabled }: RecipeSelectorProps) {
  const { getMaterial } = useGameStore();

  const canCraft = (recipe: Recipe): boolean => {
    return recipe.materials.every((mat) => {
      const owned = getMaterial(mat.type);
      return owned && owned.quantity >= mat.quantity;
    });
  };

  const getMaterialStatus = (type: MaterialType, required: number) => {
    const owned = getMaterial(type);
    const ownedQty = owned?.quantity || 0;
    return {
      owned: ownedQty,
      enough: ownedQty >= required,
    };
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="grid grid-cols-1 gap-3">
        {recipes.map((recipe) => {
          const Icon = iconMap[recipe.icon] || GiPointySword;
          const craftable = canCraft(recipe);
          const isSelected = selectedRecipe?.id === recipe.id;

          return (
            <button
              key={recipe.id}
              onClick={() => !disabled && onSelect(recipe)}
              disabled={disabled}
              className={cn(
                'w-full p-4 rounded-xl border-2 transition-all duration-150 text-left shadow-sm group',
                isSelected
                  ? 'bg-primary/20 border-primary shadow-md'
                  : craftable
                  ? 'bg-card border-border hover:bg-muted/50 hover:border-primary/50'
                  : 'bg-muted/30 border-border/50 opacity-60',
                disabled && 'cursor-not-allowed'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-colors',
                    craftable ? 'bg-muted border-border group-hover:border-primary/50' : 'bg-muted/50 border-border/50',
                    isSelected && 'bg-primary border-primary'
                  )}
                >
                  <Icon className={cn('text-3xl transition-colors', 
                    isSelected ? 'text-primary-foreground' : craftable ? 'text-foreground' : 'text-muted-foreground'
                  )} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className={cn("text-xs font-pixel", isSelected ? "text-primary" : "text-foreground")}>
                      {recipe.name}
                    </h3>
                    {recipe.baseAttack && (
                      <Badge className="bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] rounded-lg">
                        攻击 +{recipe.baseAttack}
                      </Badge>
                    )}
                    {recipe.baseDefense && (
                      <Badge className="bg-blue-500/10 border border-blue-500/30 text-blue-500 text-[10px] rounded-lg">
                        防御 +{recipe.baseDefense}
                      </Badge>
                    )}
                  </div>

                  {/* Materials */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recipe.materials.map((mat) => {
                      const info = materialInfo[mat.type];
                      const status = getMaterialStatus(mat.type, mat.quantity);

                      return (
                        <span
                          key={mat.type}
                          className={cn(
                            'text-[10px] px-2 py-1 rounded-lg border',
                            status.enough 
                              ? 'bg-green-500/10 border-green-500/30 text-green-500' 
                              : 'bg-red-500/10 border-red-500/30 text-red-500'
                          )}
                        >
                          {info.name} {status.owned}/{mat.quantity}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

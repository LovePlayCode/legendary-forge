import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Equipment, Material, Order, Expedition, Quality, MaterialType } from '@/types/game';
import { initialRecipes } from '@/data/recipes';
import { initialUpgrades } from '@/data/upgrades';

interface GameActions {
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addReputation: (amount: number) => void;
  loseReputation: (amount: number) => void;
  addItem: (item: Equipment | Material) => boolean;
  removeItem: (itemId: string) => void;
  getMaterial: (type: MaterialType) => Material | undefined;
  consumeMaterials: (materials: { type: MaterialType; quantity: number }[]) => boolean;
  addOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  completeOrder: (orderId: string, reward: number, reputation: number) => void;
  startExpedition: (expedition: Expedition) => void;
  completeExpedition: (expeditionId: string) => void;
  purchaseUpgrade: (upgradeId: string) => boolean;
  nextDay: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  gold: 100,
  reputation: 0,
  level: 1,
  day: 1,
  inventory: [
    { id: 'mat-iron-1', name: '铁矿石', category: 'material', type: 'iron', quality: 'common', icon: 'GiIronBar', description: '基础锻造材料', sellPrice: 5, quantity: 10 },
    { id: 'mat-wood-1', name: '木材', category: 'material', type: 'wood', quality: 'common', icon: 'GiWoodPile', description: '优质木材', sellPrice: 3, quantity: 8 },
    { id: 'mat-copper-1', name: '铜矿石', category: 'material', type: 'copper', quality: 'common', icon: 'GiCoalWagon', description: '柔软金属', sellPrice: 4, quantity: 5 },
    { id: 'mat-leather-1', name: '皮革', category: 'material', type: 'leather', quality: 'common', icon: 'GiLeatherBoot', description: '柔韧皮革', sellPrice: 6, quantity: 4 },
  ] as Material[],
  inventoryCapacity: 30,
  recipes: initialRecipes,
  orders: [],
  maxOrders: 5,
  expeditions: [],
  upgrades: initialUpgrades,
  forgeSpeed: 1,
  qualityBonus: 0,
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),

      spendGold: (amount) => {
        const state = get();
        if (state.gold >= amount) {
          set({ gold: state.gold - amount });
          return true;
        }
        return false;
      },

      addReputation: (amount) => set((state) => {
        const newRep = state.reputation + amount;
        const newLevel = Math.floor(newRep / 100) + 1;
        return { reputation: newRep, level: newLevel };
      }),

      loseReputation: (amount) => set((state) => ({
        reputation: Math.max(0, state.reputation - amount),
      })),

      addItem: (item) => {
        const state = get();
        if (state.inventory.length >= state.inventoryCapacity) {
          return false;
        }
        
        if (item.category === 'material') {
          const existingMaterial = state.inventory.find(
            (i) => i.category === 'material' && (i as Material).type === (item as Material).type
          ) as Material | undefined;
          
          if (existingMaterial) {
            set({
              inventory: state.inventory.map((i) =>
                i.id === existingMaterial.id
                  ? { ...i, quantity: (i as Material).quantity + (item as Material).quantity }
                  : i
              ),
            });
            return true;
          }
        }
        
        set({ inventory: [...state.inventory, item] });
        return true;
      },

      removeItem: (itemId) => set((state) => ({
        inventory: state.inventory.filter((i) => i.id !== itemId),
      })),

      getMaterial: (type) => {
        const state = get();
        return state.inventory.find(
          (i) => i.category === 'material' && (i as Material).type === type
        ) as Material | undefined;
      },

      consumeMaterials: (materials) => {
        const state = get();
        
        for (const mat of materials) {
          const existing = state.inventory.find(
            (i) => i.category === 'material' && (i as Material).type === mat.type
          ) as Material | undefined;
          
          if (!existing || existing.quantity < mat.quantity) {
            return false;
          }
        }
        
        set({
          inventory: state.inventory
            .map((i) => {
              if (i.category !== 'material') return i;
              const material = i as Material;
              const required = materials.find((m) => m.type === material.type);
              if (!required) return i;
              return { ...material, quantity: material.quantity - required.quantity };
            })
            .filter((i) => i.category !== 'material' || (i as Material).quantity > 0),
        });
        return true;
      },

      addOrder: (order) => set((state) => {
        if (state.orders.length >= state.maxOrders) return state;
        return { orders: [...state.orders, order] };
      }),

      removeOrder: (orderId) => set((state) => ({
        orders: state.orders.filter((o) => o.id !== orderId),
      })),

      completeOrder: (orderId, reward, reputation) => {
        const state = get();
        set({
          gold: state.gold + reward,
          reputation: state.reputation + reputation,
          orders: state.orders.filter((o) => o.id !== orderId),
        });
      },

      startExpedition: (expedition) => set((state) => ({
        expeditions: [...state.expeditions, expedition],
        gold: state.gold - expedition.cost,
      })),

      completeExpedition: (expeditionId) => set((state) => ({
        expeditions: state.expeditions.filter((e) => e.id !== expeditionId),
      })),

      purchaseUpgrade: (upgradeId) => {
        const state = get();
        const upgrade = state.upgrades.find((u) => u.id === upgradeId);
        
        if (!upgrade || upgrade.purchased || !upgrade.unlocked) return false;
        if (state.gold < upgrade.cost) return false;
        
        const newUpgrades = state.upgrades.map((u) => {
          if (u.id === upgradeId) return { ...u, purchased: true };
          if (u.requires?.includes(upgradeId)) return { ...u, unlocked: true };
          return u;
        });
        
        const updates: Partial<GameState> = {
          gold: state.gold - upgrade.cost,
          upgrades: newUpgrades,
        };
        
        const effect = upgrade.effect;
        if (effect.startsWith('forgeSpeed+')) {
          updates.forgeSpeed = state.forgeSpeed + parseFloat(effect.split('+')[1]);
        } else if (effect.startsWith('qualityBonus+')) {
          updates.qualityBonus = state.qualityBonus + parseFloat(effect.split('+')[1]);
        } else if (effect.startsWith('inventoryCapacity+')) {
          updates.inventoryCapacity = state.inventoryCapacity + parseInt(effect.split('+')[1]);
        } else if (effect.startsWith('maxOrders+')) {
          updates.maxOrders = state.maxOrders + parseInt(effect.split('+')[1]);
        } else if (effect.startsWith('unlockRecipe:')) {
          const recipeId = effect.split(':')[1];
          updates.recipes = state.recipes.map((r) =>
            r.id === recipeId ? { ...r, unlocked: true } : r
          );
        }
        
        set(updates);
        return true;
      },

      nextDay: () => set((state) => ({ day: state.day + 1 })),

      resetGame: () => set(initialState),
    }),
    {
      name: 'legendary-forge-save',
    }
  )
);

export const calculateQuality = (
  baseScore: number,
  forgePerformance: number,
  qualityBonus: number
): Quality => {
  const finalScore = (baseScore + qualityBonus * 100) * forgePerformance;
  if (finalScore >= 80) return 'legendary';
  if (finalScore >= 50) return 'rare';
  return 'common';
};

export const generateItemId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

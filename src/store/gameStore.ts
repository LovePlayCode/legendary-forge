import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Equipment, Material, Order, Expedition, Quality, MaterialType, EventCard, ActiveEffect, EffectType, NPCQuality } from '@/types/game';
import { initialRecipes } from '@/data/recipes';
import { initialUpgrades } from '@/data/upgrades';
import { getRandomCards, EVENT_INTERVAL } from '@/data/events';
import { getRandomHiredNPC, hireCost } from '@/data/hiredNpcs';

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
  // 事件系统方法
  triggerEvent: () => void;
  selectEventCard: (card: EventCard) => void;
  closeEventModal: () => void;
  tickEventCooldown: () => void;
  tickActiveEffects: () => void;
  consumeEffect: (effectType: EffectType) => ActiveEffect | undefined;
  getActiveEffect: (effectType: EffectType) => ActiveEffect | undefined;
  hasActiveEffect: (effectType: EffectType) => boolean;
  // NPC 雇佣系统方法
  hireNPC: (quality: NPCQuality) => boolean;
  fireNPC: (npcId: string) => void;
  upgradeNPCExperience: (npcId: string) => void;
}

const GAME_VERSION = 3; // 增加版本号用于迁移

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
  // 事件系统初始状态
  activeEffects: [],
  eventCooldown: EVENT_INTERVAL,
  showEventModal: false,
  currentEventCards: [],
  // NPC 雇佣系统初始状态
  hiredNPCs: [],
  maxHiredNPCs: 3,
  version: GAME_VERSION,
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

      // 事件系统方法
      triggerEvent: () => {
        const cards = getRandomCards(3);
        set({
          showEventModal: true,
          currentEventCards: cards,
          eventCooldown: EVENT_INTERVAL,
        });
      },

      selectEventCard: (card: EventCard) => {
        const state = get();

        // 立即生效的效果（如金币奖励）
        if (card.effectType === 'goldBonus') {
          set({
            gold: state.gold + card.effectValue,
            showEventModal: false,
            currentEventCards: [],
          });
          return;
        }

        // 创建激活效果
        const effect: ActiveEffect = {
          id: `effect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          cardId: card.id,
          effectType: card.effectType,
          effectValue: card.effectValue,
          remainingTime: card.duration,
          remainingUsage: card.usageCount,
          startTime: Date.now(),
          icon: card.icon,
          name: card.name,
        };

        set({
          activeEffects: [...state.activeEffects, effect],
          showEventModal: false,
          currentEventCards: [],
        });
      },

      closeEventModal: () => set({
        showEventModal: false,
        currentEventCards: [],
      }),

      tickEventCooldown: () => {
        const state = get();
        if (state.showEventModal) return;

        const newCooldown = state.eventCooldown - 1;
        if (newCooldown <= 0) {
          get().triggerEvent();
        } else {
          set({ eventCooldown: newCooldown });
        }
      },

      tickActiveEffects: () => {
        const state = get();
        const updatedEffects = state.activeEffects
          .map((effect) => {
            if (effect.remainingTime !== undefined) {
              return { ...effect, remainingTime: effect.remainingTime - 1 };
            }
            return effect;
          })
          .filter((effect) => {
            if (effect.remainingTime !== undefined && effect.remainingTime <= 0) {
              return false;
            }
            if (effect.remainingUsage !== undefined && effect.remainingUsage <= 0) {
              return false;
            }
            return true;
          });

        set({ activeEffects: updatedEffects });
      },

      consumeEffect: (effectType: EffectType) => {
        const state = get();
        const effect = state.activeEffects.find((e) => e.effectType === effectType);

        if (!effect) return undefined;

        if (effect.remainingUsage !== undefined) {
          const newUsage = effect.remainingUsage - 1;
          if (newUsage <= 0) {
            set({
              activeEffects: state.activeEffects.filter((e) => e.id !== effect.id),
            });
          } else {
            set({
              activeEffects: state.activeEffects.map((e) =>
                e.id === effect.id ? { ...e, remainingUsage: newUsage } : e
              ),
            });
          }
        }

        return effect;
      },

      getActiveEffect: (effectType: EffectType) => {
        const state = get();
        return state.activeEffects.find((e) => e.effectType === effectType);
      },

      hasActiveEffect: (effectType: EffectType) => {
        const state = get();
        return state.activeEffects.some((e) => e.effectType === effectType);
      },

      hireNPC: (quality: NPCQuality) => {
        const state = get();
        const cost = hireCost[quality];

        // 检查条件
        if (state.hiredNPCs.length >= state.maxHiredNPCs) {
          return false; // 已满员
        }
        if (state.gold < cost) {
          return false; // 金币不足
        }

        // 随机生成 NPC
        const newNPC = getRandomHiredNPC(quality);

        set({
          hiredNPCs: [...state.hiredNPCs, newNPC],
          gold: state.gold - cost,
        });
        return true;
      },

      fireNPC: (npcId: string) => set((state) => ({
        hiredNPCs: state.hiredNPCs.filter((npc) => npc.id !== npcId),
      })),

      upgradeNPCExperience: (npcId: string) => set((state) => ({
        hiredNPCs: state.hiredNPCs.map((npc) => {
          if (npc.id === npcId && npc.experienceLevel < 5) {
            return { ...npc, experienceLevel: npc.experienceLevel + 1 };
          }
          return npc;
        }),
      })),
    }),
    {
      name: 'legendary-forge-save',
      // 版本迁移：如果存储的版本低于当前版本，自动重置为新的初始状态
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Partial<GameState> | undefined;
        if (version < GAME_VERSION) {
          // 保留一些玩家数据，但重置升级列表
          const migratedState = { ...initialState } as GameState & GameActions;
          if (state?.gold) {
            migratedState.gold = Math.min(state.gold, 100000); // 限制上限
          }
          if (state?.reputation) {
            migratedState.reputation = state.reputation;
          }
          if (state?.level) {
            migratedState.level = state.level;
          }
          if (state?.day) {
            migratedState.day = state.day;
          }
          if (state?.inventory) {
            migratedState.inventory = state.inventory;
          }
          migratedState.version = GAME_VERSION;
          return migratedState;
        }
        return persistedState;
      },
    }
  )
);

export const calculateQuality = (
  baseScore: number,
  forgePerformance: number,
  qualityBonus: number
): Quality => {
  const finalScore = (baseScore + qualityBonus * 100) * forgePerformance;
  // 品质阈值：粗糙 < 普通 < 精良 < 稀有 < 史诗 < 传说 < 神话
  if (finalScore >= 95) return 'mythic';
  if (finalScore >= 85) return 'legendary';
  if (finalScore >= 70) return 'epic';
  if (finalScore >= 55) return 'rare';
  if (finalScore >= 40) return 'uncommon';
  if (finalScore >= 20) return 'common';
  return 'poor';
};

export const generateItemId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

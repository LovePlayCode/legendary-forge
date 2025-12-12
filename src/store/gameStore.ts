import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Equipment, Material, Order, Expedition, Quality, MaterialType, EventCard, ActiveEffect, EffectType, NPCQuality, PlayerEquipment, MineState, BattleLog, EquipmentSlot } from '@/types/game';
import { initialRecipes } from '@/data/recipes';
import { initialUpgrades } from '@/data/upgrades';
import { getRandomCards, EVENT_INTERVAL } from '@/data/events';
import { getRandomHiredNPC, hireCost } from '@/data/hiredNpcs';
import { generateMonster, calculateMiningDrops, Monster, materialNames } from '@/data/mine';

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
  // 矿场系统方法
  equipItem: (slot: EquipmentSlot, equipment: Equipment | null) => void;
  unequipItem: (slot: EquipmentSlot) => void;
  getPlayerPower: () => { attack: number; defense: number; total: number };
  enterMine: (level: number) => void;
  spawnMonster: () => void;
  performBattle: () => void;
  performMining: () => void;
  addBattleLog: (message: string, type: BattleLog['type']) => void;
  clearBattleLogs: () => void;
  unlockMineLevel: (level: number) => void;
  updateEquipmentDurability: (slot: EquipmentSlot, amount: number) => void;
}

const GAME_VERSION = 4; // 增加版本号用于迁移

const initialPlayerEquipment: PlayerEquipment = {
  weapon: null,
  armor: null,
  accessory: null,
};

const initialMineState: MineState = {
  currentLevel: 1,
  unlockedLevels: [1],
  currentMonster: null,
  battlePhase: 'idle',
  playerHp: 100,
  maxPlayerHp: 100,
  battleLogs: [],
  canMine: false,
  miningProgress: 0,
};

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
  // 矿场系统初始状态
  playerEquipment: initialPlayerEquipment,
  mineState: initialMineState,
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

      // 矿场系统方法
      equipItem: (slot: EquipmentSlot, equipment: Equipment | null) => {
        const state = get();
        const currentEquipped = state.playerEquipment[slot];
        
        // 如果当前槽位有装备，放回背包
        if (currentEquipped) {
          set({
            inventory: [...state.inventory, currentEquipped],
          });
        }
        
        // 如果要装备新装备，从背包移除
        if (equipment) {
          set((s) => ({
            inventory: s.inventory.filter((i) => i.id !== equipment.id),
            playerEquipment: {
              ...s.playerEquipment,
              [slot]: equipment,
            },
          }));
        } else {
          set((s) => ({
            playerEquipment: {
              ...s.playerEquipment,
              [slot]: null,
            },
          }));
        }
      },

      unequipItem: (slot: EquipmentSlot) => {
        const state = get();
        const equipment = state.playerEquipment[slot];
        if (equipment) {
          set({
            inventory: [...state.inventory, equipment],
            playerEquipment: {
              ...state.playerEquipment,
              [slot]: null,
            },
          });
        }
      },

      getPlayerPower: () => {
        const state = get();
        const { weapon, armor, accessory } = state.playerEquipment;
        let attack = 5; // 基础攻击力
        let defense = 2; // 基础防御力
        
        if (weapon) {
          attack += weapon.attack || 0;
          defense += weapon.defense || 0;
        }
        if (armor) {
          attack += armor.attack || 0;
          defense += armor.defense || 0;
        }
        if (accessory) {
          attack += accessory.attack || 0;
          defense += accessory.defense || 0;
        }
        
        return { attack, defense, total: attack + defense };
      },

      enterMine: (level: number) => {
        const state = get();
        if (!state.mineState.unlockedLevels.includes(level)) return;
        
        set({
          mineState: {
            ...state.mineState,
            currentLevel: level,
            currentMonster: null,
            battlePhase: 'idle',
            playerHp: state.mineState.maxPlayerHp,
            canMine: false,
            miningProgress: 0,
          },
        });
        
        // 自动生成怪物
        get().spawnMonster();
      },

      spawnMonster: () => {
        const state = get();
        const monster = generateMonster(state.mineState.currentLevel);
        
        get().addBattleLog(`${monster.name} 出现了！`, 'info');
        
        set({
          mineState: {
            ...state.mineState,
            currentMonster: monster,
            battlePhase: 'idle',
            canMine: false,
          },
        });
      },

      performBattle: () => {
        const state = get();
        const monster = state.mineState.currentMonster as Monster | null;
        if (!monster || state.mineState.battlePhase === 'fighting') return;
        
        set((s) => ({
          mineState: { ...s.mineState, battlePhase: 'fighting' },
        }));
        
        const { attack: playerAttack, defense: playerDefense } = get().getPlayerPower();
        
        // 玩家攻击
        const playerDamage = Math.max(1, playerAttack - monster.defense);
        const newMonsterHp = monster.hp - playerDamage;
        
        get().addBattleLog(`你对 ${monster.name} 造成了 ${playerDamage} 点伤害！`, 'attack');
        
        if (newMonsterHp <= 0) {
          // 怪物被击败
          get().addBattleLog(`${monster.name} 被击败了！`, 'victory');
          get().addBattleLog(`获得 ${monster.goldReward} 金币！`, 'loot');
          
          // 消耗武器耐久
          if (state.playerEquipment.weapon) {
            get().updateEquipmentDurability('weapon', -2);
          }
          
          set((s) => ({
            gold: s.gold + monster.goldReward,
            mineState: {
              ...s.mineState,
              currentMonster: null,
              battlePhase: 'victory',
              canMine: true,
            },
          }));
          
          // 检查是否解锁下一层
          const currentLevel = state.mineState.currentLevel;
          if (currentLevel < 10 && !state.mineState.unlockedLevels.includes(currentLevel + 1)) {
            get().unlockMineLevel(currentLevel + 1);
          }
          
          return;
        }
        
        // 怪物攻击
        const monsterDamage = Math.max(1, monster.attack - playerDefense);
        const newPlayerHp = state.mineState.playerHp - monsterDamage;
        
        get().addBattleLog(`${monster.name} 对你造成了 ${monsterDamage} 点伤害！`, 'damage');
        
        // 消耗护甲耐久
        if (state.playerEquipment.armor) {
          get().updateEquipmentDurability('armor', -1);
        }
        
        if (newPlayerHp <= 0) {
          // 玩家被击败
          get().addBattleLog('你被击败了，被迫撤退...', 'defeat');
          
          set((s) => ({
            mineState: {
              ...s.mineState,
              playerHp: 0,
              battlePhase: 'defeat',
              currentMonster: null,
            },
          }));
          return;
        }
        
        // 更新状态
        set((s) => ({
          mineState: {
            ...s.mineState,
            currentMonster: { ...monster, hp: newMonsterHp },
            playerHp: newPlayerHp,
            battlePhase: 'idle',
          },
        }));
      },

      performMining: () => {
        const state = get();
        if (!state.mineState.canMine) return;
        
        // 消耗武器耐久（挖矿）
        if (state.playerEquipment.weapon) {
          get().updateEquipmentDurability('weapon', -3);
        }
        
        // 计算掉落
        const drops = calculateMiningDrops(state.mineState.currentLevel);
        
        for (const drop of drops) {
          const material: Material = {
            id: `mat-${drop.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: materialNames[drop.type],
            category: 'material',
            type: drop.type,
            quality: 'common',
            icon: 'GiMineralPearls',
            description: '从矿场获得的材料',
            sellPrice: 5,
            quantity: drop.quantity,
          };
          
          get().addItem(material);
          get().addBattleLog(`获得 ${materialNames[drop.type]} x${drop.quantity}！`, 'loot');
        }
        
        set((s) => ({
          mineState: {
            ...s.mineState,
            canMine: false,
            battlePhase: 'idle',
          },
        }));
        
        // 生成新怪物
        setTimeout(() => {
          get().spawnMonster();
        }, 1000);
      },

      addBattleLog: (message: string, type: BattleLog['type']) => {
        const log: BattleLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message,
          type,
          timestamp: Date.now(),
        };
        
        set((state) => ({
          mineState: {
            ...state.mineState,
            battleLogs: [...state.mineState.battleLogs.slice(-49), log], // 保留最近50条
          },
        }));
      },

      clearBattleLogs: () => set((state) => ({
        mineState: {
          ...state.mineState,
          battleLogs: [],
        },
      })),

      unlockMineLevel: (level: number) => {
        const state = get();
        if (state.mineState.unlockedLevels.includes(level)) return;
        
        get().addBattleLog(`解锁了第 ${level} 层矿场！`, 'info');
        
        set({
          mineState: {
            ...state.mineState,
            unlockedLevels: [...state.mineState.unlockedLevels, level].sort((a, b) => a - b),
          },
        });
      },

      updateEquipmentDurability: (slot: EquipmentSlot, amount: number) => {
        const state = get();
        const equipment = state.playerEquipment[slot];
        if (!equipment) return;
        
        const newDurability = Math.max(0, equipment.durability + amount);
        
        if (newDurability <= 0) {
          // 装备损坏
          get().addBattleLog(`${equipment.name} 已损坏！`, 'info');
          set({
            playerEquipment: {
              ...state.playerEquipment,
              [slot]: null,
            },
          });
        } else {
          set({
            playerEquipment: {
              ...state.playerEquipment,
              [slot]: { ...equipment, durability: newDurability },
            },
          });
        }
      },
    }),
    {
      name: 'legendary-forge-save',
      version: GAME_VERSION,
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

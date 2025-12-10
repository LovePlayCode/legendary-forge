// 品质等级：粗糙 < 普通 < 精良 < 稀有 < 史诗 < 传说 < 神话
export type Quality = 'poor' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export type ItemCategory = 'equipment' | 'material' | 'consumable';

export type EquipmentType = 'sword' | 'shield' | 'staff' | 'armor' | 'helmet' | 'boots';

export type MaterialType = 'iron' | 'copper' | 'gold' | 'wood' | 'leather' | 'gem' | 'crystal';

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  quality: Quality;
  icon: string;
  description: string;
  sellPrice: number;
}

export interface Equipment extends Item {
  category: 'equipment';
  type: EquipmentType;
  attack?: number;
  defense?: number;
  durability: number;
  maxDurability: number;
}

export interface Material extends Item {
  category: 'material';
  type: MaterialType;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  resultType: EquipmentType;
  icon: string;
  materials: { type: MaterialType; quantity: number }[];
  baseAttack?: number;
  baseDefense?: number;
  baseDurability: number;
  unlocked: boolean;
}

export type NPCProfession = 'knight' | 'mage' | 'villager' | 'merchant' | 'adventurer';

export interface NPC {
  id: string;
  name: string;
  profession: NPCProfession;
  avatar: string;
  personality: string;
}

export interface Order {
  id: string;
  npc: NPC;
  requirement: string;
  specificType?: EquipmentType;
  minAttack?: number;
  minDefense?: number;
  maxPrice?: number;
  reward: number;
  reputationReward: number;
  timeLimit?: number;
  createdAt: number;
  isUrgent: boolean;
}

export type MapType = 'forest' | 'mine' | 'ruins';

export interface Expedition {
  id: string;
  mapType: MapType;
  duration: number;
  startTime: number;
  possibleDrops: MaterialType[];
  cost: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  category: 'tool' | 'shop' | 'skill';
  cost: number;
  effect: string;
  unlocked: boolean;
  purchased: boolean;
  requires?: string[];
}

// 随机事件效果类型
export type EffectType = 
  | 'doubleForge'      // 锻造翻倍
  | 'qualityBoost'     // 品质提升
  | 'materialSave'     // 材料节省
  | 'goldBonus'        // 金币奖励
  | 'reputationBoost'  // 声望加成
  | 'expeditionSpeed'  // 探险加速
  | 'tempStable'       // 温度稳定
  | 'qteEasy';         // QTE放宽

export type EventRarity = 'common' | 'rare' | 'epic';

export interface EventCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: EventRarity;
  effectType: EffectType;
  effectValue: number;      // 效果数值（如翻倍次数、百分比等）
  duration?: number;        // 持续时间（秒）
  usageCount?: number;      // 使用次数
}

export interface ActiveEffect {
  id: string;
  cardId: string;
  effectType: EffectType;
  effectValue: number;
  remainingTime?: number;   // 剩余时间（秒）
  remainingUsage?: number;  // 剩余使用次数
  startTime: number;
  icon: string;
  name: string;
}

export interface GameState {
  gold: number;
  reputation: number;
  level: number;
  day: number;
  inventory: (Equipment | Material)[];
  inventoryCapacity: number;
  recipes: Recipe[];
  orders: Order[];
  maxOrders: number;
  expeditions: Expedition[];
  upgrades: Upgrade[];
  forgeSpeed: number;
  qualityBonus: number;
  // 随机事件系统
  activeEffects: ActiveEffect[];
  eventCooldown: number;        // 下次事件倒计时（秒）
  showEventModal: boolean;      // 是否显示事件弹窗
  currentEventCards: EventCard[]; // 当前可选卡片
}

// 品质等级：粗糙 < 普通 < 精良 < 稀有 < 史诗 < 传说 < 神话
export type Quality = 'poor' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export type ItemCategory = 'equipment' | 'material' | 'consumable';

// 装备类型扩展：
// 武器类: sword(剑), dagger(匕首), axe(斧), hammer(锤), bow(弓), staff(法杖), spear(长矛)
// 防具类: shield(盾), armor(护甲), helmet(头盔), boots(靴子), gloves(手套), cloak(披风)
// 饰品类: ring(戒指), amulet(项链), belt(腰带)
export type EquipmentType = 
  // 武器
  | 'sword' | 'dagger' | 'axe' | 'hammer' | 'bow' | 'staff' | 'spear'
  // 防具
  | 'shield' | 'armor' | 'helmet' | 'boots' | 'gloves' | 'cloak'
  // 饰品
  | 'ring' | 'amulet' | 'belt';

// 装备分类
export type EquipmentCategory = 'weapon' | 'armor' | 'accessory';

// 装备类型到分类的映射
export const equipmentCategoryMap: Record<EquipmentType, EquipmentCategory> = {
  sword: 'weapon',
  dagger: 'weapon',
  axe: 'weapon',
  hammer: 'weapon',
  bow: 'weapon',
  staff: 'weapon',
  spear: 'weapon',
  shield: 'armor',
  armor: 'armor',
  helmet: 'armor',
  boots: 'armor',
  gloves: 'armor',
  cloak: 'armor',
  ring: 'accessory',
  amulet: 'accessory',
  belt: 'accessory',
};

// 装备类型中文名
export const equipmentTypeNames: Record<EquipmentType, string> = {
  sword: '剑',
  dagger: '匕首',
  axe: '战斧',
  hammer: '战锤',
  bow: '弓',
  staff: '法杖',
  spear: '长矛',
  shield: '盾牌',
  armor: '护甲',
  helmet: '头盔',
  boots: '靴子',
  gloves: '手套',
  cloak: '披风',
  ring: '戒指',
  amulet: '项链',
  belt: '腰带',
};

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

export type NPCQuality = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type NPCBonus = 
  | 'forgeSpeedBonus'      // 锻造速度加成
  | 'qualityBoost'         // 品质提升
  | 'materialSave'         // 材料节省
  | 'orderRewardBoost'     // 订单报酬加成
  | 'reputationBoost'      // 声望加成
  | 'successRate'          // 成功率提升;

export interface NPC {
  id: string;
  name: string;
  profession: NPCProfession;
  avatar: string;
  personality: string;
  quality?: NPCQuality;      // NPC 品质（通常为雇佣后才有）
  bonus?: NPCBonus;          // NPC 专长
  bonusValue?: number;       // 加成数值（百分比或绝对值）
  salary?: number;           // 月薪
  hired?: boolean;           // 是否被雇佣
  hiredAt?: number;          // 雇佣时间
}

export interface HiredNPC extends NPC {
  hired: true;
  quality: NPCQuality;
  bonus: NPCBonus;
  bonusValue: number;
  salary: number;
  hiredAt: number;
  experienceLevel: number;   // 经验等级（1-5）
  avatarSeed?: string;       // 头像生成种子
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

// 装备槽位类型
export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

// 玩家装备状态
export interface PlayerEquipment {
  weapon: Equipment | null;
  armor: Equipment | null;
  accessory: Equipment | null;
}

// 战斗状态
export type BattlePhase = 'idle' | 'fighting' | 'victory' | 'defeat' | 'mining';

// 战斗日志
export interface BattleLog {
  id: string;
  message: string;
  type: 'attack' | 'defend' | 'damage' | 'victory' | 'defeat' | 'loot' | 'info';
  timestamp: number;
}

// 矿场状态
export interface MineState {
  currentLevel: number;
  unlockedLevels: number[];
  currentMonster: import('@/data/mine').Monster | null;
  battlePhase: BattlePhase;
  playerHp: number;
  maxPlayerHp: number;
  battleLogs: BattleLog[];
  canMine: boolean;
  miningProgress: number;
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
  // NPC 雇佣系统
  hiredNPCs: HiredNPC[];        // 已雇佣的 NPC 列表
  maxHiredNPCs: number;         // 最多能雇佣的 NPC 数量
  // 矿场系统
  playerEquipment: PlayerEquipment;  // 玩家装备
  mineState: MineState;              // 矿场状态
  // 版本控制
  version?: number;
}

export type Quality = 'common' | 'rare' | 'legendary';

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
}

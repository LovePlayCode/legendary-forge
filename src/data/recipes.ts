import { Recipe } from '@/types/game';

export const initialRecipes: Recipe[] = [
  // ===== 武器类 =====
  // 剑
  {
    id: 'iron-sword',
    name: '铁剑',
    resultType: 'sword',
    icon: 'sword',
    materials: [
      { type: 'iron', quantity: 3 },
      { type: 'wood', quantity: 1 },
    ],
    baseAttack: 15,
    baseDurability: 100,
    unlocked: true,
  },
  {
    id: 'copper-sword',
    name: '铜剑',
    resultType: 'sword',
    icon: 'sword',
    materials: [
      { type: 'copper', quantity: 2 },
      { type: 'wood', quantity: 1 },
    ],
    baseAttack: 10,
    baseDurability: 80,
    unlocked: true,
  },
  // 匕首
  {
    id: 'iron-dagger',
    name: '铁匕首',
    resultType: 'dagger',
    icon: 'dagger',
    materials: [
      { type: 'iron', quantity: 2 },
      { type: 'leather', quantity: 1 },
    ],
    baseAttack: 8,
    baseDurability: 60,
    unlocked: true,
  },
  // 战斧
  {
    id: 'iron-axe',
    name: '铁战斧',
    resultType: 'axe',
    icon: 'axe',
    materials: [
      { type: 'iron', quantity: 4 },
      { type: 'wood', quantity: 2 },
    ],
    baseAttack: 20,
    baseDurability: 90,
    unlocked: true,
  },
  // 战锤
  {
    id: 'iron-hammer',
    name: '铁战锤',
    resultType: 'hammer',
    icon: 'hammer',
    materials: [
      { type: 'iron', quantity: 5 },
      { type: 'wood', quantity: 2 },
    ],
    baseAttack: 25,
    baseDurability: 120,
    unlocked: false,
  },
  // 弓
  {
    id: 'wooden-bow',
    name: '木弓',
    resultType: 'bow',
    icon: 'bow',
    materials: [
      { type: 'wood', quantity: 4 },
      { type: 'leather', quantity: 2 },
    ],
    baseAttack: 12,
    baseDurability: 70,
    unlocked: true,
  },
  // 法杖
  {
    id: 'magic-staff',
    name: '法杖',
    resultType: 'staff',
    icon: 'staff',
    materials: [
      { type: 'wood', quantity: 3 },
      { type: 'crystal', quantity: 1 },
    ],
    baseAttack: 18,
    baseDurability: 70,
    unlocked: false,
  },
  // 长矛
  {
    id: 'iron-spear',
    name: '铁长矛',
    resultType: 'spear',
    icon: 'spear',
    materials: [
      { type: 'iron', quantity: 3 },
      { type: 'wood', quantity: 3 },
    ],
    baseAttack: 16,
    baseDurability: 85,
    unlocked: false,
  },

  // ===== 防具类 =====
  // 盾牌
  {
    id: 'round-shield',
    name: '圆盾',
    resultType: 'shield',
    icon: 'shield',
    materials: [
      { type: 'iron', quantity: 2 },
      { type: 'wood', quantity: 2 },
    ],
    baseDefense: 12,
    baseDurability: 120,
    unlocked: true,
  },
  // 护甲
  {
    id: 'leather-armor',
    name: '皮甲',
    resultType: 'armor',
    icon: 'armor',
    materials: [
      { type: 'leather', quantity: 4 },
      { type: 'iron', quantity: 1 },
    ],
    baseDefense: 8,
    baseDurability: 90,
    unlocked: true,
  },
  {
    id: 'iron-armor',
    name: '铁甲',
    resultType: 'armor',
    icon: 'armor',
    materials: [
      { type: 'iron', quantity: 6 },
      { type: 'leather', quantity: 2 },
    ],
    baseDefense: 18,
    baseDurability: 150,
    unlocked: false,
  },
  // 头盔
  {
    id: 'iron-helmet',
    name: '铁头盔',
    resultType: 'helmet',
    icon: 'helmet',
    materials: [
      { type: 'iron', quantity: 3 },
      { type: 'leather', quantity: 1 },
    ],
    baseDefense: 6,
    baseDurability: 100,
    unlocked: true,
  },
  {
    id: 'gold-helmet',
    name: '黄金头盔',
    resultType: 'helmet',
    icon: 'helmet',
    materials: [
      { type: 'gold', quantity: 3 },
      { type: 'gem', quantity: 1 },
    ],
    baseDefense: 20,
    baseDurability: 150,
    unlocked: false,
  },
  // 靴子
  {
    id: 'leather-boots',
    name: '皮靴',
    resultType: 'boots',
    icon: 'boots',
    materials: [
      { type: 'leather', quantity: 3 },
      { type: 'iron', quantity: 1 },
    ],
    baseDefense: 4,
    baseDurability: 80,
    unlocked: true,
  },
  // 手套
  {
    id: 'leather-gloves',
    name: '皮手套',
    resultType: 'gloves',
    icon: 'gloves',
    materials: [
      { type: 'leather', quantity: 2 },
      { type: 'iron', quantity: 1 },
    ],
    baseDefense: 3,
    baseDurability: 70,
    unlocked: true,
  },
  {
    id: 'iron-gloves',
    name: '铁护手',
    resultType: 'gloves',
    icon: 'gloves',
    materials: [
      { type: 'iron', quantity: 3 },
      { type: 'leather', quantity: 1 },
    ],
    baseDefense: 7,
    baseDurability: 100,
    unlocked: false,
  },
  // 披风
  {
    id: 'travelers-cloak',
    name: '旅行披风',
    resultType: 'cloak',
    icon: 'cloak',
    materials: [
      { type: 'leather', quantity: 4 },
      { type: 'crystal', quantity: 1 },
    ],
    baseDefense: 5,
    baseDurability: 60,
    unlocked: false,
  },

  // ===== 饰品类 =====
  // 戒指
  {
    id: 'copper-ring',
    name: '铜戒指',
    resultType: 'ring',
    icon: 'ring',
    materials: [
      { type: 'copper', quantity: 2 },
      { type: 'gem', quantity: 1 },
    ],
    baseAttack: 3,
    baseDefense: 3,
    baseDurability: 50,
    unlocked: true,
  },
  {
    id: 'gold-ring',
    name: '黄金戒指',
    resultType: 'ring',
    icon: 'ring',
    materials: [
      { type: 'gold', quantity: 2 },
      { type: 'gem', quantity: 2 },
    ],
    baseAttack: 8,
    baseDefense: 8,
    baseDurability: 80,
    unlocked: false,
  },
  // 项链
  {
    id: 'crystal-amulet',
    name: '水晶项链',
    resultType: 'amulet',
    icon: 'amulet',
    materials: [
      { type: 'gold', quantity: 1 },
      { type: 'crystal', quantity: 2 },
    ],
    baseAttack: 5,
    baseDefense: 5,
    baseDurability: 60,
    unlocked: false,
  },
  // 腰带
  {
    id: 'leather-belt',
    name: '皮腰带',
    resultType: 'belt',
    icon: 'belt',
    materials: [
      { type: 'leather', quantity: 3 },
      { type: 'iron', quantity: 1 },
    ],
    baseDefense: 4,
    baseDurability: 70,
    unlocked: true,
  },
];

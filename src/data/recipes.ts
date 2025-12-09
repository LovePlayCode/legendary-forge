import { Recipe } from '@/types/game';

export const initialRecipes: Recipe[] = [
  {
    id: 'iron-sword',
    name: '铁剑',
    resultType: 'sword',
    icon: 'GiPointySword',
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
    icon: 'GiBroadsword',
    materials: [
      { type: 'copper', quantity: 2 },
      { type: 'wood', quantity: 1 },
    ],
    baseAttack: 10,
    baseDurability: 80,
    unlocked: true,
  },
  {
    id: 'round-shield',
    name: '圆盾',
    resultType: 'shield',
    icon: 'GiRoundShield',
    materials: [
      { type: 'iron', quantity: 2 },
      { type: 'wood', quantity: 2 },
    ],
    baseDefense: 12,
    baseDurability: 120,
    unlocked: true,
  },
  {
    id: 'leather-armor',
    name: '皮甲',
    resultType: 'armor',
    icon: 'GiLeatherArmor',
    materials: [
      { type: 'leather', quantity: 4 },
      { type: 'iron', quantity: 1 },
    ],
    baseDefense: 8,
    baseDurability: 90,
    unlocked: true,
  },
  {
    id: 'magic-staff',
    name: '法杖',
    resultType: 'staff',
    icon: 'GiWizardStaff',
    materials: [
      { type: 'wood', quantity: 3 },
      { type: 'crystal', quantity: 1 },
    ],
    baseAttack: 18,
    baseDurability: 70,
    unlocked: false,
  },
  {
    id: 'gold-helmet',
    name: '黄金头盔',
    resultType: 'helmet',
    icon: 'GiVisoredHelm',
    materials: [
      { type: 'gold', quantity: 3 },
      { type: 'gem', quantity: 1 },
    ],
    baseDefense: 20,
    baseDurability: 150,
    unlocked: false,
  },
];

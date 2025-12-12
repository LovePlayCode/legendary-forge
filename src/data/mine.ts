import { MaterialType } from '@/types/game';

// 怪物类型
export interface Monster {
  id: string;
  name: string;
  icon: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
}

// 矿场层级配置
export interface MineLevel {
  level: number;
  name: string;
  description: string;
  requiredPower: number; // 推荐战斗力
  monsters: MonsterTemplate[];
  drops: DropConfig[];
  unlocked: boolean;
}

// 怪物模板
export interface MonsterTemplate {
  name: string;
  icon: string;
  hpRange: [number, number];
  attackRange: [number, number];
  defenseRange: [number, number];
  expReward: number;
  goldReward: number;
}

// 掉落配置
export interface DropConfig {
  type: MaterialType;
  chance: number; // 0-1
  quantityRange: [number, number];
}

// 怪物模板库
export const monsterTemplates: Record<number, MonsterTemplate[]> = {
  1: [
    { name: '洞穴蝙蝠', icon: 'GiBat', hpRange: [20, 30], attackRange: [3, 5], defenseRange: [1, 2], expReward: 5, goldReward: 3 },
    { name: '小型史莱姆', icon: 'GiSlime', hpRange: [25, 35], attackRange: [2, 4], defenseRange: [2, 3], expReward: 6, goldReward: 4 },
  ],
  2: [
    { name: '矿洞老鼠', icon: 'GiRat', hpRange: [30, 45], attackRange: [5, 8], defenseRange: [2, 4], expReward: 8, goldReward: 6 },
    { name: '岩石蜘蛛', icon: 'GiSpider', hpRange: [35, 50], attackRange: [6, 9], defenseRange: [3, 5], expReward: 10, goldReward: 8 },
  ],
  3: [
    { name: '地精矿工', icon: 'GiGoblinHead', hpRange: [50, 70], attackRange: [8, 12], defenseRange: [4, 6], expReward: 15, goldReward: 12 },
    { name: '石化蜥蜴', icon: 'GiLizardman', hpRange: [55, 75], attackRange: [10, 14], defenseRange: [5, 8], expReward: 18, goldReward: 15 },
  ],
  4: [
    { name: '矿洞巨虫', icon: 'GiWorm', hpRange: [70, 90], attackRange: [12, 16], defenseRange: [6, 10], expReward: 22, goldReward: 18 },
    { name: '暗影狼', icon: 'GiWolfHead', hpRange: [80, 100], attackRange: [14, 18], defenseRange: [7, 11], expReward: 25, goldReward: 22 },
  ],
  5: [
    { name: '石像鬼', icon: 'GiGargoyle', hpRange: [100, 130], attackRange: [16, 22], defenseRange: [10, 14], expReward: 35, goldReward: 30 },
    { name: '熔岩元素', icon: 'GiFireSpellCast', hpRange: [90, 120], attackRange: [20, 26], defenseRange: [8, 12], expReward: 40, goldReward: 35 },
  ],
  6: [
    { name: '骷髅战士', icon: 'GiSkullCrossedBones', hpRange: [120, 150], attackRange: [22, 28], defenseRange: [12, 16], expReward: 50, goldReward: 45 },
    { name: '深渊蝎子', icon: 'GiScorpion', hpRange: [130, 160], attackRange: [24, 30], defenseRange: [14, 18], expReward: 55, goldReward: 50 },
  ],
  7: [
    { name: '矿洞巨人', icon: 'GiOgre', hpRange: [160, 200], attackRange: [28, 36], defenseRange: [16, 22], expReward: 70, goldReward: 65 },
    { name: '水晶魔像', icon: 'GiCrystalGrowth', hpRange: [180, 220], attackRange: [26, 34], defenseRange: [20, 26], expReward: 80, goldReward: 75 },
  ],
  8: [
    { name: '暗影领主', icon: 'GiDragonHead', hpRange: [200, 250], attackRange: [34, 42], defenseRange: [22, 28], expReward: 100, goldReward: 90 },
    { name: '岩浆巨兽', icon: 'GiMineExplosion', hpRange: [220, 280], attackRange: [36, 44], defenseRange: [24, 30], expReward: 110, goldReward: 100 },
  ],
  9: [
    { name: '远古守护者', icon: 'GiGolem', hpRange: [280, 350], attackRange: [42, 52], defenseRange: [28, 36], expReward: 140, goldReward: 130 },
    { name: '深渊魔龙', icon: 'GiSpikedDragonHead', hpRange: [300, 380], attackRange: [46, 56], defenseRange: [30, 38], expReward: 160, goldReward: 150 },
  ],
  10: [
    { name: '矿王·泰坦', icon: 'GiCrown', hpRange: [400, 500], attackRange: [55, 70], defenseRange: [35, 45], expReward: 250, goldReward: 300 },
    { name: '虚空领主', icon: 'GiDeathSkull', hpRange: [450, 550], attackRange: [60, 75], defenseRange: [38, 48], expReward: 300, goldReward: 350 },
  ],
};

// 各层级掉落配置
export const levelDrops: Record<number, DropConfig[]> = {
  1: [
    { type: 'iron', chance: 0.6, quantityRange: [1, 3] },
    { type: 'copper', chance: 0.4, quantityRange: [1, 2] },
  ],
  2: [
    { type: 'iron', chance: 0.5, quantityRange: [2, 4] },
    { type: 'copper', chance: 0.5, quantityRange: [1, 3] },
    { type: 'wood', chance: 0.2, quantityRange: [1, 2] },
  ],
  3: [
    { type: 'iron', chance: 0.4, quantityRange: [2, 5] },
    { type: 'copper', chance: 0.4, quantityRange: [2, 4] },
    { type: 'leather', chance: 0.3, quantityRange: [1, 2] },
  ],
  4: [
    { type: 'iron', chance: 0.5, quantityRange: [3, 6] },
    { type: 'gold', chance: 0.2, quantityRange: [1, 2] },
    { type: 'leather', chance: 0.3, quantityRange: [1, 3] },
  ],
  5: [
    { type: 'gold', chance: 0.35, quantityRange: [1, 3] },
    { type: 'iron', chance: 0.4, quantityRange: [3, 6] },
    { type: 'gem', chance: 0.15, quantityRange: [1, 1] },
  ],
  6: [
    { type: 'gold', chance: 0.4, quantityRange: [2, 4] },
    { type: 'gem', chance: 0.25, quantityRange: [1, 2] },
    { type: 'leather', chance: 0.25, quantityRange: [2, 4] },
  ],
  7: [
    { type: 'gold', chance: 0.45, quantityRange: [2, 5] },
    { type: 'gem', chance: 0.35, quantityRange: [1, 3] },
    { type: 'crystal', chance: 0.1, quantityRange: [1, 1] },
  ],
  8: [
    { type: 'gem', chance: 0.45, quantityRange: [2, 4] },
    { type: 'crystal', chance: 0.25, quantityRange: [1, 2] },
    { type: 'gold', chance: 0.35, quantityRange: [3, 6] },
  ],
  9: [
    { type: 'gem', chance: 0.5, quantityRange: [2, 5] },
    { type: 'crystal', chance: 0.35, quantityRange: [1, 3] },
    { type: 'gold', chance: 0.3, quantityRange: [4, 8] },
  ],
  10: [
    { type: 'crystal', chance: 0.5, quantityRange: [2, 4] },
    { type: 'gem', chance: 0.5, quantityRange: [3, 6] },
    { type: 'gold', chance: 0.4, quantityRange: [5, 10] },
  ],
};

// 矿场层级配置
export const mineLevels: MineLevel[] = [
  { level: 1, name: '浅层矿洞', description: '入门级矿洞，适合新手冒险者', requiredPower: 10, monsters: monsterTemplates[1], drops: levelDrops[1], unlocked: true },
  { level: 2, name: '蜘蛛巢穴', description: '阴暗潮湿的洞穴，有蜘蛛出没', requiredPower: 20, monsters: monsterTemplates[2], drops: levelDrops[2], unlocked: false },
  { level: 3, name: '地精营地', description: '地精们的秘密据点', requiredPower: 35, monsters: monsterTemplates[3], drops: levelDrops[3], unlocked: false },
  { level: 4, name: '暗影通道', description: '光线难以到达的深处', requiredPower: 55, monsters: monsterTemplates[4], drops: levelDrops[4], unlocked: false },
  { level: 5, name: '熔岩裂隙', description: '地底深处的炽热区域', requiredPower: 80, monsters: monsterTemplates[5], drops: levelDrops[5], unlocked: false },
  { level: 6, name: '亡灵墓穴', description: '古老的地下墓地', requiredPower: 110, monsters: monsterTemplates[6], drops: levelDrops[6], unlocked: false },
  { level: 7, name: '水晶洞窟', description: '闪烁着神秘光芒的洞穴', requiredPower: 150, monsters: monsterTemplates[7], drops: levelDrops[7], unlocked: false },
  { level: 8, name: '深渊裂谷', description: '通往地底深渊的裂缝', requiredPower: 200, monsters: monsterTemplates[8], drops: levelDrops[8], unlocked: false },
  { level: 9, name: '远古遗迹', description: '失落文明的遗迹', requiredPower: 260, monsters: monsterTemplates[9], drops: levelDrops[9], unlocked: false },
  { level: 10, name: '矿王领域', description: '传说中矿王沉睡之地', requiredPower: 350, monsters: monsterTemplates[10], drops: levelDrops[10], unlocked: false },
];

// 生成随机怪物
export function generateMonster(level: number): Monster {
  const templates = monsterTemplates[level] || monsterTemplates[1];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const randomInRange = (range: [number, number]) => 
    Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  
  const hp = randomInRange(template.hpRange);
  
  return {
    id: `monster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    icon: template.icon,
    hp,
    maxHp: hp,
    attack: randomInRange(template.attackRange),
    defense: randomInRange(template.defenseRange),
    expReward: template.expReward,
    goldReward: template.goldReward,
  };
}

// 计算挖矿掉落
export function calculateMiningDrops(level: number): { type: MaterialType; quantity: number }[] {
  const drops = levelDrops[level] || levelDrops[1];
  const result: { type: MaterialType; quantity: number }[] = [];
  
  for (const drop of drops) {
    if (Math.random() < drop.chance) {
      const quantity = Math.floor(Math.random() * (drop.quantityRange[1] - drop.quantityRange[0] + 1)) + drop.quantityRange[0];
      result.push({ type: drop.type, quantity });
    }
  }
  
  // 保证至少掉落一种材料
  if (result.length === 0) {
    const fallback = drops[0];
    result.push({ type: fallback.type, quantity: fallback.quantityRange[0] });
  }
  
  return result;
}

// 材料类型中文名
export const materialNames: Record<MaterialType, string> = {
  iron: '铁矿石',
  copper: '铜矿石',
  gold: '金矿石',
  wood: '木材',
  leather: '皮革',
  gem: '宝石',
  crystal: '水晶',
};

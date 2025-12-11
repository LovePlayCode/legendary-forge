import { HiredNPC, NPCQuality, NPCBonus } from '@/types/game';

// 根据品质获取基础信息
export const qualityConfig = {
  common: { color: '#a0a0a0', name: '普通' },
  uncommon: { color: '#1eff00', name: '精良' },
  rare: { color: '#0070dd', name: '稀有' },
  epic: { color: '#a335ee', name: '史诗' },
  legendary: { color: '#ff8000', name: '传说' },
} as const;

// NPC 池 - 不同品质的候选 NPC
export const hiredNPCPool = {
  common: [
    {
      id: 'hired-knight-1',
      name: '初级骑士',
      profession: 'knight' as const,
      avatar: 'GiKnight',
      personality: '初出茅庐的骑士，正在学习如何工作',
      quality: 'common' as NPCQuality,
      bonus: 'forgeSpeedBonus' as NPCBonus,
      bonusValue: 10,
      salary: 20,
    },
    {
      id: 'hired-mage-1',
      name: '学徒法师',
      profession: 'mage' as const,
      avatar: 'GiWizardFace',
      personality: '初级法师，刚开始学会辅助',
      quality: 'common' as NPCQuality,
      bonus: 'qualityBoost' as NPCBonus,
      bonusValue: 5,
      salary: 25,
    },
  ],
  uncommon: [
    {
      id: 'hired-knight-2',
      name: '训练的骑士',
      profession: 'knight' as const,
      avatar: 'GiCrownedSkull',
      personality: '经验丰富的骑士，能有效加速工作',
      quality: 'uncommon' as NPCQuality,
      bonus: 'forgeSpeedBonus' as NPCBonus,
      bonusValue: 20,
      salary: 60,
    },
    {
      id: 'hired-merchant-1',
      name: '商人学徒',
      profession: 'merchant' as const,
      avatar: 'GiMoneyStack',
      personality: '懂得商业价值，能提升订单报酬',
      quality: 'uncommon' as NPCQuality,
      bonus: 'orderRewardBoost' as NPCBonus,
      bonusValue: 15,
      salary: 50,
    },
    {
      id: 'hired-adventurer-1',
      name: '探险家见习',
      profession: 'adventurer' as const,
      avatar: 'GiCowled',
      personality: '冒险经历让他了解节省资源',
      quality: 'uncommon' as NPCQuality,
      bonus: 'materialSave' as NPCBonus,
      bonusValue: 10,
      salary: 45,
    },
  ],
  rare: [
    {
      id: 'hired-mage-2',
      name: '大法师艾琳',
      profession: 'mage' as const,
      avatar: 'GiWitch',
      personality: '强大的魔法师，大幅提升品质',
      quality: 'rare' as NPCQuality,
      bonus: 'qualityBoost' as NPCBonus,
      bonusValue: 15,
      salary: 150,
    },
    {
      id: 'hired-knight-3',
      name: '精英骑士格雷',
      profession: 'knight' as const,
      avatar: 'GiKnight',
      personality: '真正的精英战士，效率极高',
      quality: 'rare' as NPCQuality,
      bonus: 'forgeSpeedBonus' as NPCBonus,
      bonusValue: 35,
      salary: 140,
    },
    {
      id: 'hired-merchant-2',
      name: '商会副会长',
      profession: 'merchant' as const,
      avatar: 'GiMoneyStack',
      personality: '精明的商人，大幅提升利润',
      quality: 'rare' as NPCQuality,
      bonus: 'orderRewardBoost' as NPCBonus,
      bonusValue: 30,
      salary: 120,
    },
  ],
  epic: [
    {
      id: 'hired-knight-4',
      name: '传奇骑士亚瑟',
      profession: 'knight' as const,
      avatar: 'GiCrownedSkull',
      personality: '真正的传奇人物，极大提升效率',
      quality: 'epic' as NPCQuality,
      bonus: 'forgeSpeedBonus' as NPCBonus,
      bonusValue: 50,
      salary: 350,
    },
    {
      id: 'hired-mage-3',
      name: '魔法大师梅林',
      profession: 'mage' as const,
      avatar: 'GiWizardFace',
      personality: '古老的魔法大师，赋予装备魔力',
      quality: 'epic' as NPCQuality,
      bonus: 'qualityBoost' as NPCBonus,
      bonusValue: 25,
      salary: 380,
    },
    {
      id: 'hired-adventurer-2',
      name: '传奇探险家',
      profession: 'adventurer' as const,
      avatar: 'GiCowled',
      personality: '经历百般磨难，对资源的理解无人能及',
      quality: 'epic' as NPCQuality,
      bonus: 'materialSave' as NPCBonus,
      bonusValue: 25,
      salary: 320,
    },
  ],
  legendary: [
    {
      id: 'hired-knight-5',
      name: '圣骑士莱昂哈特',
      profession: 'knight' as const,
      avatar: 'GiKnight',
      personality: '传说中的圣骑士，所有工作加成+20%',
      quality: 'legendary' as NPCQuality,
      bonus: 'successRate' as NPCBonus,
      bonusValue: 20,
      salary: 800,
    },
    {
      id: 'hired-mage-4',
      name: '魔法之王',
      profession: 'mage' as const,
      avatar: 'GiWitch',
      personality: '统治魔法世界的至高者，赋予最强魔力',
      quality: 'legendary' as NPCQuality,
      bonus: 'qualityBoost' as NPCBonus,
      bonusValue: 35,
      salary: 900,
    },
    {
      id: 'hired-merchant-3',
      name: '商业帝王',
      profession: 'merchant' as const,
      avatar: 'GiMoneyStack',
      personality: '商业世界的统治者，订单利润翻倍',
      quality: 'legendary' as NPCQuality,
      bonus: 'orderRewardBoost' as NPCBonus,
      bonusValue: 50,
      salary: 1000,
    },
  ],
};

// 根据品质和职业随机获取 NPC
export const getRandomHiredNPC = (quality: NPCQuality): HiredNPC => {
  const pool = hiredNPCPool[quality];
  const npc = pool[Math.floor(Math.random() * pool.length)] as any;
  return {
    ...npc,
    hired: true,
    hiredAt: Date.now(),
    experienceLevel: 1,
    avatarSeed: Math.random().toString(36).substring(7) + Date.now().toString(),
  };
};

// 获取 NPC 加成描述
export const getNPCBonusDescription = (bonus: NPCBonus, value: number): string => {
  const descriptions: Record<NPCBonus, string> = {
    forgeSpeedBonus: `锻造速度 +${value}%`,
    qualityBoost: `品质 +${value}%`,
    materialSave: `材料节省 ${value}%`,
    orderRewardBoost: `订单报酬 +${value}%`,
    reputationBoost: `声望获得 +${value}%`,
    successRate: `成功率 +${value}%`,
  };
  return descriptions[bonus];
};

// 不同品质的雇佣费用
export const hireCost = {
  common: 300,
  uncommon: 800,
  rare: 2000,
  epic: 5000,
  legendary: 15000,
} as const;

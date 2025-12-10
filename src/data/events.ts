import { EventCard } from '@/types/game';

// 所有可用的事件卡片池
export const eventCardPool: EventCard[] = [
  // 普通卡片
  {
    id: 'double-forge-1',
    name: '双倍锻造',
    description: '下次锻造将产出2件相同物品',
    icon: 'GiAnvilImpact',
    rarity: 'common',
    effectType: 'doubleForge',
    effectValue: 2,
    usageCount: 1,
  },
  {
    id: 'gold-bonus-1',
    name: '意外之财',
    description: '立即获得50金币',
    icon: 'GiGoldBar',
    rarity: 'common',
    effectType: 'goldBonus',
    effectValue: 50,
  },
  {
    id: 'material-save-1',
    name: '材料节省',
    description: '下次锻造材料消耗减少30%',
    icon: 'GiMineralPearls',
    rarity: 'common',
    effectType: 'materialSave',
    effectValue: 0.3,
    usageCount: 1,
  },
  {
    id: 'temp-stable-1',
    name: '炉火纯青',
    description: '60秒内温度波动减少50%',
    icon: 'GiFireBowl',
    rarity: 'common',
    effectType: 'tempStable',
    effectValue: 0.5,
    duration: 60,
  },
  {
    id: 'qte-easy-1',
    name: '稳定之手',
    description: '60秒内QTE判定时间延长50%',
    icon: 'GiHammerNails',
    rarity: 'common',
    effectType: 'qteEasy',
    effectValue: 0.5,
    duration: 60,
  },

  // 稀有卡片
  {
    id: 'double-forge-2',
    name: '三倍锻造',
    description: '下次锻造将产出3件相同物品',
    icon: 'GiAnvilImpact',
    rarity: 'rare',
    effectType: 'doubleForge',
    effectValue: 3,
    usageCount: 1,
  },
  {
    id: 'quality-boost-1',
    name: '品质提升',
    description: '下2次锻造品质大幅提升',
    icon: 'GiCrystalGrowth',
    rarity: 'rare',
    effectType: 'qualityBoost',
    effectValue: 0.3,
    usageCount: 2,
  },
  {
    id: 'gold-bonus-2',
    name: '金库祝福',
    description: '立即获得150金币',
    icon: 'GiGoldBar',
    rarity: 'rare',
    effectType: 'goldBonus',
    effectValue: 150,
  },
  {
    id: 'reputation-boost-1',
    name: '名声远扬',
    description: '下2次订单声望奖励翻倍',
    icon: 'GiLaurelsTrophy',
    rarity: 'rare',
    effectType: 'reputationBoost',
    effectValue: 2,
    usageCount: 2,
  },
  {
    id: 'expedition-speed-1',
    name: '疾行符咒',
    description: '120秒内探险时间减少50%',
    icon: 'GiCompass',
    rarity: 'rare',
    effectType: 'expeditionSpeed',
    effectValue: 0.5,
    duration: 120,
  },
  {
    id: 'material-save-2',
    name: '材料大师',
    description: '下3次锻造材料消耗减少50%',
    icon: 'GiMineralPearls',
    rarity: 'rare',
    effectType: 'materialSave',
    effectValue: 0.5,
    usageCount: 3,
  },

  // 史诗卡片
  {
    id: 'double-forge-3',
    name: '神匠之力',
    description: '下2次锻造将产出3件相同物品',
    icon: 'GiAnvilImpact',
    rarity: 'epic',
    effectType: 'doubleForge',
    effectValue: 3,
    usageCount: 2,
  },
  {
    id: 'quality-boost-2',
    name: '传说品质',
    description: '下3次锻造必出稀有或传说品质',
    icon: 'GiCrystalGrowth',
    rarity: 'epic',
    effectType: 'qualityBoost',
    effectValue: 0.5,
    usageCount: 3,
  },
  {
    id: 'gold-bonus-3',
    name: '龙之宝藏',
    description: '立即获得300金币',
    icon: 'GiGoldBar',
    rarity: 'epic',
    effectType: 'goldBonus',
    effectValue: 300,
  },
  {
    id: 'all-boost-1',
    name: '铁匠祝福',
    description: '90秒内锻造速度和品质均提升30%',
    icon: 'GiSparkles',
    rarity: 'epic',
    effectType: 'qualityBoost',
    effectValue: 0.3,
    duration: 90,
  },
];

// 根据稀有度权重随机抽取卡片
export const getRandomCards = (count: number = 3): EventCard[] => {
  const rarityWeights = {
    common: 60,
    rare: 30,
    epic: 10,
  };

  const totalWeight = rarityWeights.common + rarityWeights.rare + rarityWeights.epic;
  const selectedCards: EventCard[] = [];
  const usedIds = new Set<string>();

  while (selectedCards.length < count) {
    const roll = Math.random() * totalWeight;
    let rarity: 'common' | 'rare' | 'epic';

    if (roll < rarityWeights.common) {
      rarity = 'common';
    } else if (roll < rarityWeights.common + rarityWeights.rare) {
      rarity = 'rare';
    } else {
      rarity = 'epic';
    }

    const availableCards = eventCardPool.filter(
      (card) => card.rarity === rarity && !usedIds.has(card.id)
    );

    if (availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const selectedCard = availableCards[randomIndex];
      selectedCards.push(selectedCard);
      usedIds.add(selectedCard.id);
    }
  }

  return selectedCards;
};

// 事件触发间隔（秒）
export const EVENT_INTERVAL = 60;

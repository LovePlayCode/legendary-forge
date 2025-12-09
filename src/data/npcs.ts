import { NPC } from '@/types/game';

export const npcPool: NPC[] = [
  {
    id: 'knight-1',
    name: '勇敢的亚瑟',
    profession: 'knight',
    avatar: 'GiKnight',
    personality: '豪爽大方，追求最强装备',
  },
  {
    id: 'knight-2',
    name: '铁壁莱昂',
    profession: 'knight',
    avatar: 'GiCrownedSkull',
    personality: '沉稳可靠，注重防御',
  },
  {
    id: 'mage-1',
    name: '神秘的梅林',
    profession: 'mage',
    avatar: 'GiWizardFace',
    personality: '博学多才，喜欢魔法物品',
  },
  {
    id: 'mage-2',
    name: '火焰艾拉',
    profession: 'mage',
    avatar: 'GiWitch',
    personality: '热情奔放，追求攻击力',
  },
  {
    id: 'villager-1',
    name: '老实的汤姆',
    profession: 'villager',
    avatar: 'GiFarmer',
    personality: '朴实节俭，预算有限',
  },
  {
    id: 'villager-2',
    name: '勤劳的玛丽',
    profession: 'villager',
    avatar: 'GiPerson',
    personality: '温柔善良，需要防身工具',
  },
  {
    id: 'merchant-1',
    name: '精明的杰克',
    profession: 'merchant',
    avatar: 'GiMoneyStack',
    personality: '精打细算，喜欢讨价还价',
  },
  {
    id: 'adventurer-1',
    name: '冒险家雷克斯',
    profession: 'adventurer',
    avatar: 'GiCowled',
    personality: '勇于探索，需要耐久装备',
  },
];

export const orderRequirements = {
  specific: [
    '我需要一把攻击力大于{value}的{type}。',
    '给我打造一件防御力至少{value}的{type}。',
    '我要一把耐久度超过{value}的{type}。',
  ],
  vague: [
    '给我弄点防身的东西，要便宜的。',
    '我需要一件能打怪的装备。',
    '随便来点能用的武器就行。',
    '有什么好货推荐吗？',
  ],
};

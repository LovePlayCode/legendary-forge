import { MaterialType } from '@/types/game';

export interface MaterialInfo {
  type: MaterialType;
  name: string;
  icon: string;
  basePrice: number;
  description: string;
}

export const materialInfo: Record<MaterialType, MaterialInfo> = {
  iron: {
    type: 'iron',
    name: '铁矿石',
    icon: 'GiIronBar',
    basePrice: 10,
    description: '基础的锻造材料，坚固耐用',
  },
  copper: {
    type: 'copper',
    name: '铜矿石',
    icon: 'GiCoalWagon',
    basePrice: 8,
    description: '柔软的金属，易于加工',
  },
  gold: {
    type: 'gold',
    name: '黄金',
    icon: 'GiGoldBar',
    basePrice: 50,
    description: '珍贵的金属，闪闪发光',
  },
  wood: {
    type: 'wood',
    name: '木材',
    icon: 'GiWoodPile',
    basePrice: 5,
    description: '来自古老森林的优质木材',
  },
  leather: {
    type: 'leather',
    name: '皮革',
    icon: 'GiLeatherBoot',
    basePrice: 12,
    description: '柔韧的皮革，适合制作护甲',
  },
  gem: {
    type: 'gem',
    name: '宝石',
    icon: 'GiGems',
    basePrice: 80,
    description: '闪耀的宝石，蕴含魔力',
  },
  crystal: {
    type: 'crystal',
    name: '水晶',
    icon: 'GiCrystalBall',
    basePrice: 60,
    description: '透明的水晶，魔法导体',
  },
};

export const mapDrops: Record<string, MaterialType[]> = {
  forest: ['wood', 'leather'],
  mine: ['iron', 'copper', 'gold'],
  ruins: ['gem', 'crystal'],
};

import { useEffect, useRef } from 'react';
import type { EquipmentType, Quality } from '@/types/game';

interface EquipmentIconProps {
  type: EquipmentType;
  quality?: Quality;
  size?: number;
  className?: string;
}

// 像素风品质颜色 - 更鲜艳的卡通色
const qualityColors: Record<Quality, { primary: string; secondary: string; outline: string; highlight: string }> = {
  poor: { primary: '#a0a0a0', secondary: '#707070', outline: '#404040', highlight: '#d0d0d0' },
  common: { primary: '#c9b896', secondary: '#9a8866', outline: '#5a4836', highlight: '#e8dcc0' },
  uncommon: { primary: '#5fd35f', secondary: '#3aa03a', outline: '#1a601a', highlight: '#90ff90' },
  rare: { primary: '#5a9cff', secondary: '#3070d0', outline: '#1a4080', highlight: '#90c0ff' },
  epic: { primary: '#c77dff', secondary: '#9040d0', outline: '#502080', highlight: '#e0b0ff' },
  legendary: { primary: '#ffb830', secondary: '#e08000', outline: '#804000', highlight: '#ffe080' },
  mythic: { primary: '#ff5050', secondary: '#d02020', outline: '#801010', highlight: '#ff9090' },
};

type DrawFunction = (ctx: CanvasRenderingContext2D, size: number, colors: { primary: string; secondary: string; outline: string; highlight: string }, pixelSize: number) => void;

// 辅助函数：绘制像素方块
const drawPixel = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
};

// 辅助函数：绘制像素矩形
const drawPixelRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
};

// 像素风剑
const drawSword: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 剑刃 - 银色金属
  drawPixelRect(ctx, cx - p, cy - 12 * p, p * 2, p * 16, '#e0e0e0');
  drawPixelRect(ctx, cx - p * 0.5, cy - 12 * p, p, p * 16, '#ffffff');
  drawPixelRect(ctx, cx - p * 2, cy - 10 * p, p, p * 12, '#c0c0c0');
  drawPixelRect(ctx, cx + p, cy - 10 * p, p, p * 12, '#a0a0a0');
  // 剑尖
  drawPixel(ctx, cx - p * 0.5, cy - 13 * p, p, '#ffffff');

  // 护手 - 品质色
  drawPixelRect(ctx, cx - 4 * p, cy + 4 * p, p * 8, p * 2, colors.primary);
  drawPixelRect(ctx, cx - 4 * p, cy + 4 * p, p * 8, p, colors.highlight);
  drawPixelRect(ctx, cx - 5 * p, cy + 4.5 * p, p, p, colors.secondary);
  drawPixelRect(ctx, cx + 4 * p, cy + 4.5 * p, p, p, colors.secondary);

  // 剑柄 - 棕色
  drawPixelRect(ctx, cx - p, cy + 6 * p, p * 2, p * 6, '#8b5a2b');
  drawPixelRect(ctx, cx - p * 0.5, cy + 6 * p, p, p * 6, '#a0522d');
  // 缠绕
  drawPixelRect(ctx, cx - p, cy + 7 * p, p * 2, p, '#654321');
  drawPixelRect(ctx, cx - p, cy + 9 * p, p * 2, p, '#654321');
  drawPixelRect(ctx, cx - p, cy + 11 * p, p * 2, p, '#654321');

  // 剑首 - 品质色宝石
  drawPixelRect(ctx, cx - p * 1.5, cy + 12 * p, p * 3, p * 2, colors.primary);
  drawPixel(ctx, cx - p * 0.5, cy + 12 * p, p, colors.highlight);

  // 描边
  ctx.strokeStyle = colors.outline;
  ctx.lineWidth = 1;
  ctx.strokeRect(cx - p * 2, cy - 12 * p, p * 4, p * 26);
};

// 像素风匕首
const drawDagger: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 短刃
  drawPixelRect(ctx, cx - p, cy - 8 * p, p * 2, p * 10, '#e0e0e0');
  drawPixelRect(ctx, cx - p * 0.5, cy - 8 * p, p, p * 10, '#ffffff');
  drawPixel(ctx, cx - p * 0.5, cy - 9 * p, p, '#ffffff');

  // 护手
  drawPixelRect(ctx, cx - 3 * p, cy + 2 * p, p * 6, p * 2, colors.primary);
  drawPixelRect(ctx, cx - 3 * p, cy + 2 * p, p * 6, p, colors.highlight);

  // 柄
  drawPixelRect(ctx, cx - p, cy + 4 * p, p * 2, p * 5, '#8b5a2b');
  drawPixelRect(ctx, cx - p * 0.5, cy + 4 * p, p, p * 5, '#a0522d');

  // 柄首
  drawPixelRect(ctx, cx - p * 1.5, cy + 9 * p, p * 3, p * 2, colors.secondary);
  drawPixel(ctx, cx - p * 0.5, cy + 9 * p, p, colors.highlight);
};

// 像素风战斧
const drawAxe: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 斧柄
  drawPixelRect(ctx, cx - p, cy - 4 * p, p * 2, p * 18, '#8b5a2b');
  drawPixelRect(ctx, cx - p * 0.5, cy - 4 * p, p, p * 18, '#a0522d');

  // 斧刃 - 左侧
  drawPixelRect(ctx, cx - 6 * p, cy - 8 * p, p * 5, p * 2, '#c0c0c0');
  drawPixelRect(ctx, cx - 7 * p, cy - 6 * p, p * 6, p * 2, '#d0d0d0');
  drawPixelRect(ctx, cx - 8 * p, cy - 4 * p, p * 7, p * 2, '#e0e0e0');
  drawPixelRect(ctx, cx - 8 * p, cy - 2 * p, p * 7, p * 2, '#e0e0e0');
  drawPixelRect(ctx, cx - 7 * p, cy, p * 6, p * 2, '#d0d0d0');
  drawPixelRect(ctx, cx - 6 * p, cy + 2 * p, p * 5, p * 2, '#c0c0c0');

  // 高光
  drawPixelRect(ctx, cx - 7 * p, cy - 4 * p, p, p * 6, '#ffffff');

  // 装饰环
  drawPixelRect(ctx, cx - 2 * p, cy - 2 * p, p * 4, p * 2, colors.primary);
  drawPixelRect(ctx, cx - 2 * p, cy - 2 * p, p * 4, p, colors.highlight);
};

// 像素风战锤
const drawHammer: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 锤柄
  drawPixelRect(ctx, cx - p, cy - 2 * p, p * 2, p * 16, '#8b5a2b');
  drawPixelRect(ctx, cx - p * 0.5, cy - 2 * p, p, p * 16, '#a0522d');

  // 锤头
  drawPixelRect(ctx, cx - 6 * p, cy - 10 * p, p * 12, p * 8, '#909090');
  drawPixelRect(ctx, cx - 5 * p, cy - 9 * p, p * 10, p * 6, '#b0b0b0');
  drawPixelRect(ctx, cx - 4 * p, cy - 8 * p, p * 8, p * 4, '#d0d0d0');

  // 高光
  drawPixelRect(ctx, cx - 4 * p, cy - 9 * p, p * 2, p, '#ffffff');

  // 装饰带
  drawPixelRect(ctx, cx - 6 * p, cy - 6 * p, p * 12, p * 2, colors.primary);
  drawPixelRect(ctx, cx - 6 * p, cy - 6 * p, p * 12, p, colors.highlight);
};

// 像素风弓
const drawBow: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 弓身 - 曲线用像素阶梯表示
  drawPixelRect(ctx, cx - 6 * p, cy - 10 * p, p * 2, p * 3, '#8b5a2b');
  drawPixelRect(ctx, cx - 7 * p, cy - 7 * p, p * 2, p * 3, '#8b5a2b');
  drawPixelRect(ctx, cx - 8 * p, cy - 4 * p, p * 2, p * 8, '#8b5a2b');
  drawPixelRect(ctx, cx - 7 * p, cy + 4 * p, p * 2, p * 3, '#8b5a2b');
  drawPixelRect(ctx, cx - 6 * p, cy + 7 * p, p * 2, p * 3, '#8b5a2b');

  // 弓身高光
  drawPixelRect(ctx, cx - 5 * p, cy - 10 * p, p, p * 3, '#a0522d');
  drawPixelRect(ctx, cx - 6 * p, cy - 7 * p, p, p * 3, '#a0522d');
  drawPixelRect(ctx, cx - 7 * p, cy - 4 * p, p, p * 8, '#a0522d');
  drawPixelRect(ctx, cx - 6 * p, cy + 4 * p, p, p * 3, '#a0522d');
  drawPixelRect(ctx, cx - 5 * p, cy + 7 * p, p, p * 3, '#a0522d');

  // 弓弦
  drawPixelRect(ctx, cx - 4 * p, cy - 10 * p, p, p * 20, '#d0d0d0');

  // 握把
  drawPixelRect(ctx, cx - 8 * p, cy - 2 * p, p * 3, p * 4, colors.primary);
  drawPixelRect(ctx, cx - 7 * p, cy - 2 * p, p, p * 4, colors.highlight);

  // 弓尖装饰
  drawPixelRect(ctx, cx - 5 * p, cy - 11 * p, p * 2, p * 2, colors.secondary);
  drawPixelRect(ctx, cx - 5 * p, cy + 9 * p, p * 2, p * 2, colors.secondary);
};

// 像素风法杖
const drawStaff: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 法杖杆
  drawPixelRect(ctx, cx - p, cy - 4 * p, p * 2, p * 18, '#654321');
  drawPixelRect(ctx, cx - p * 0.5, cy - 4 * p, p, p * 18, '#8b5a2b');

  // 法杖头 - 装饰框
  drawPixelRect(ctx, cx - 4 * p, cy - 10 * p, p * 8, p * 2, colors.secondary);
  drawPixelRect(ctx, cx - 5 * p, cy - 8 * p, p * 2, p * 4, colors.secondary);
  drawPixelRect(ctx, cx + 3 * p, cy - 8 * p, p * 2, p * 4, colors.secondary);
  drawPixelRect(ctx, cx - 4 * p, cy - 4 * p, p * 8, p * 2, colors.secondary);

  // 魔法宝珠
  drawPixelRect(ctx, cx - 3 * p, cy - 8 * p, p * 6, p * 4, colors.primary);
  drawPixelRect(ctx, cx - 2 * p, cy - 7 * p, p * 4, p * 2, colors.highlight);
  drawPixel(ctx, cx - p, cy - 7 * p, p, '#ffffff');

  // 杖底装饰
  drawPixelRect(ctx, cx - 2 * p, cy + 12 * p, p * 4, p * 2, colors.secondary);
};

// 像素风长矛
const drawSpear: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 矛杆
  drawPixelRect(ctx, cx - p, cy - 6 * p, p * 2, p * 20, '#8b5a2b');
  drawPixelRect(ctx, cx - p * 0.5, cy - 6 * p, p, p * 20, '#a0522d');

  // 矛尖
  drawPixelRect(ctx, cx - p, cy - 10 * p, p * 2, p * 4, '#d0d0d0');
  drawPixelRect(ctx, cx - 2 * p, cy - 8 * p, p * 4, p * 2, '#c0c0c0');
  drawPixelRect(ctx, cx - 3 * p, cy - 6 * p, p * 6, p * 2, '#b0b0b0');
  drawPixel(ctx, cx - p * 0.5, cy - 11 * p, p, '#ffffff');
  drawPixel(ctx, cx - p * 0.5, cy - 10 * p, p, '#ffffff');

  // 装饰环
  drawPixelRect(ctx, cx - 2 * p, cy - 4 * p, p * 4, p * 2, colors.primary);
  drawPixelRect(ctx, cx - 2 * p, cy - 4 * p, p * 4, p, colors.highlight);

  // 矛尾装饰
  drawPixelRect(ctx, cx - 2 * p, cy + 12 * p, p * 4, p * 2, colors.secondary);
};

// 像素风盾牌
const drawShield: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 盾牌主体 - 像素化的盾形
  drawPixelRect(ctx, cx - 6 * p, cy - 10 * p, p * 12, p * 2, colors.secondary);
  drawPixelRect(ctx, cx - 8 * p, cy - 8 * p, p * 16, p * 4, colors.primary);
  drawPixelRect(ctx, cx - 8 * p, cy - 4 * p, p * 16, p * 6, colors.primary);
  drawPixelRect(ctx, cx - 7 * p, cy + 2 * p, p * 14, p * 4, colors.primary);
  drawPixelRect(ctx, cx - 5 * p, cy + 6 * p, p * 10, p * 3, colors.primary);
  drawPixelRect(ctx, cx - 3 * p, cy + 9 * p, p * 6, p * 2, colors.primary);
  drawPixelRect(ctx, cx - p, cy + 11 * p, p * 2, p, colors.primary);

  // 高光
  drawPixelRect(ctx, cx - 6 * p, cy - 8 * p, p * 2, p * 8, colors.highlight);
  drawPixelRect(ctx, cx - 4 * p, cy - 6 * p, p, p * 4, colors.highlight);

  // 边框
  drawPixelRect(ctx, cx - 8 * p, cy - 8 * p, p, p * 10, colors.secondary);
  drawPixelRect(ctx, cx + 7 * p, cy - 8 * p, p, p * 10, colors.secondary);

  // 中心装饰 - 十字或宝石
  drawPixelRect(ctx, cx - p, cy - 2 * p, p * 2, p * 6, '#ffd700');
  drawPixelRect(ctx, cx - 3 * p, cy, p * 6, p * 2, '#ffd700');
  drawPixel(ctx, cx - p * 0.5, cy + p * 0.5, p, '#ffffff');
};

// 像素风护甲
const drawArmor: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 护甲主体
  drawPixelRect(ctx, cx - 6 * p, cy - 8 * p, p * 12, p * 2, colors.primary);
  drawPixelRect(ctx, cx - 8 * p, cy - 6 * p, p * 16, p * 4, colors.primary);
  drawPixelRect(ctx, cx - 7 * p, cy - 2 * p, p * 14, p * 8, colors.primary);
  drawPixelRect(ctx, cx - 6 * p, cy + 6 * p, p * 12, p * 4, colors.primary);

  // 领口
  drawPixelRect(ctx, cx - 3 * p, cy - 10 * p, p * 6, p * 2, colors.secondary);
  drawPixelRect(ctx, cx - 2 * p, cy - 10 * p, p * 4, p, colors.primary);

  // 肩甲
  drawPixelRect(ctx, cx - 10 * p, cy - 6 * p, p * 3, p * 4, colors.secondary);
  drawPixelRect(ctx, cx + 7 * p, cy - 6 * p, p * 3, p * 4, colors.secondary);

  // 高光
  drawPixelRect(ctx, cx - 5 * p, cy - 6 * p, p * 2, p * 10, colors.highlight);

  // 中线装饰
  drawPixelRect(ctx, cx - p, cy - 4 * p, p * 2, p * 12, colors.secondary);
  drawPixelRect(ctx, cx - p * 0.5, cy - 4 * p, p, p * 12, colors.highlight);

  // 腰带
  drawPixelRect(ctx, cx - 6 * p, cy + 4 * p, p * 12, p * 2, '#8b5a2b');
  drawPixelRect(ctx, cx - 2 * p, cy + 4 * p, p * 4, p * 2, '#ffd700');
};

// 像素风头盔
const drawHelmet: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 头盔主体
  drawPixelRect(ctx, cx - 4 * p, cy - 10 * p, p * 8, p * 2, colors.primary);
  drawPixelRect(ctx, cx - 6 * p, cy - 8 * p, p * 12, p * 4, colors.primary);
  drawPixelRect(ctx, cx - 7 * p, cy - 4 * p, p * 14, p * 8, colors.primary);
  drawPixelRect(ctx, cx - 6 * p, cy + 4 * p, p * 12, p * 4, colors.primary);

  // 高光
  drawPixelRect(ctx, cx - 5 * p, cy - 8 * p, p * 2, p * 10, colors.highlight);

  // 面罩开口
  drawPixelRect(ctx, cx - 4 * p, cy, p * 8, p * 6, '#2a2a2a');

  // 面罩横条
  drawPixelRect(ctx, cx - 4 * p, cy + p, p * 8, p, colors.secondary);
  drawPixelRect(ctx, cx - 4 * p, cy + 3 * p, p * 8, p, colors.secondary);

  // 顶部装饰
  drawPixelRect(ctx, cx - p, cy - 12 * p, p * 2, p * 3, colors.secondary);
  drawPixel(ctx, cx - p * 0.5, cy - 12 * p, p, colors.highlight);
};

// 像素风靴子
const drawBoots: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 左靴
  drawPixelRect(ctx, cx - 10 * p, cy - 8 * p, p * 6, p * 12, colors.primary);
  drawPixelRect(ctx, cx - 12 * p, cy + 4 * p, p * 10, p * 4, colors.primary);
  drawPixelRect(ctx, cx - 9 * p, cy - 8 * p, p * 2, p * 12, colors.highlight);

  // 右靴
  drawPixelRect(ctx, cx + 4 * p, cy - 8 * p, p * 6, p * 12, colors.primary);
  drawPixelRect(ctx, cx + 2 * p, cy + 4 * p, p * 10, p * 4, colors.primary);
  drawPixelRect(ctx, cx + 5 * p, cy - 8 * p, p * 2, p * 12, colors.highlight);

  // 靴口装饰
  drawPixelRect(ctx, cx - 10 * p, cy - 10 * p, p * 6, p * 2, colors.secondary);
  drawPixelRect(ctx, cx + 4 * p, cy - 10 * p, p * 6, p * 2, colors.secondary);

  // 鞋带/装饰
  drawPixelRect(ctx, cx - 8 * p, cy - 4 * p, p * 2, p, colors.secondary);
  drawPixelRect(ctx, cx - 8 * p, cy - 2 * p, p * 2, p, colors.secondary);
  drawPixelRect(ctx, cx - 8 * p, cy, p * 2, p, colors.secondary);

  drawPixelRect(ctx, cx + 6 * p, cy - 4 * p, p * 2, p, colors.secondary);
  drawPixelRect(ctx, cx + 6 * p, cy - 2 * p, p * 2, p, colors.secondary);
  drawPixelRect(ctx, cx + 6 * p, cy, p * 2, p, colors.secondary);
};

// 像素风手套
const drawGloves: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 左手套
  drawPixelRect(ctx, cx - 12 * p, cy - 2 * p, p * 8, p * 10, colors.primary);
  drawPixelRect(ctx, cx - 11 * p, cy - 2 * p, p * 2, p * 10, colors.highlight);
  // 手指
  drawPixelRect(ctx, cx - 12 * p, cy - 8 * p, p * 2, p * 6, colors.primary);
  drawPixelRect(ctx, cx - 9 * p, cy - 10 * p, p * 2, p * 8, colors.primary);
  drawPixelRect(ctx, cx - 6 * p, cy - 10 * p, p * 2, p * 8, colors.primary);

  // 右手套
  drawPixelRect(ctx, cx + 4 * p, cy - 2 * p, p * 8, p * 10, colors.primary);
  drawPixelRect(ctx, cx + 5 * p, cy - 2 * p, p * 2, p * 10, colors.highlight);
  // 手指
  drawPixelRect(ctx, cx + 10 * p, cy - 8 * p, p * 2, p * 6, colors.primary);
  drawPixelRect(ctx, cx + 7 * p, cy - 10 * p, p * 2, p * 8, colors.primary);
  drawPixelRect(ctx, cx + 4 * p, cy - 10 * p, p * 2, p * 8, colors.primary);

  // 护腕
  drawPixelRect(ctx, cx - 12 * p, cy + 6 * p, p * 8, p * 3, colors.secondary);
  drawPixelRect(ctx, cx + 4 * p, cy + 6 * p, p * 8, p * 3, colors.secondary);
};

// 像素风披风
const drawCloak: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 披风主体
  drawPixelRect(ctx, cx - 8 * p, cy - 10 * p, p * 16, p * 2, colors.primary);
  drawPixelRect(ctx, cx - 10 * p, cy - 8 * p, p * 20, p * 6, colors.primary);
  drawPixelRect(ctx, cx - 10 * p, cy - 2 * p, p * 20, p * 8, colors.primary);
  drawPixelRect(ctx, cx - 8 * p, cy + 6 * p, p * 16, p * 4, colors.primary);
  drawPixelRect(ctx, cx - 6 * p, cy + 10 * p, p * 12, p * 2, colors.primary);

  // 高光
  drawPixelRect(ctx, cx - 8 * p, cy - 8 * p, p * 2, p * 14, colors.highlight);

  // 阴影褶皱
  drawPixelRect(ctx, cx + 4 * p, cy - 6 * p, p, p * 12, colors.secondary);

  // 领扣
  drawPixelRect(ctx, cx - 2 * p, cy - 10 * p, p * 4, p * 3, '#ffd700');
  drawPixel(ctx, cx - p * 0.5, cy - 9 * p, p, '#ffffff');

  // 底部波浪
  drawPixelRect(ctx, cx - 6 * p, cy + 10 * p, p * 2, p * 2, colors.secondary);
  drawPixelRect(ctx, cx - 2 * p, cy + 11 * p, p * 2, p, colors.secondary);
  drawPixelRect(ctx, cx + 2 * p, cy + 10 * p, p * 2, p * 2, colors.secondary);
};

// 像素风戒指
const drawRing: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 戒环 - 像素圆环
  drawPixelRect(ctx, cx - 6 * p, cy, p * 12, p * 3, colors.primary);
  drawPixelRect(ctx, cx - 7 * p, cy + 3 * p, p * 14, p * 4, colors.primary);
  drawPixelRect(ctx, cx - 6 * p, cy + 7 * p, p * 12, p * 3, colors.primary);

  // 内圈空洞
  drawPixelRect(ctx, cx - 4 * p, cy + 2 * p, p * 8, p * 6, '#1a1a2e');

  // 高光
  drawPixelRect(ctx, cx - 5 * p, cy + p, p * 2, p * 6, colors.highlight);

  // 宝石底座
  drawPixelRect(ctx, cx - 4 * p, cy - 6 * p, p * 8, p * 6, colors.secondary);

  // 宝石
  drawPixelRect(ctx, cx - 3 * p, cy - 5 * p, p * 6, p * 4, colors.primary);
  drawPixelRect(ctx, cx - 2 * p, cy - 4 * p, p * 4, p * 2, colors.highlight);
  drawPixel(ctx, cx - p, cy - 4 * p, p, '#ffffff');
};

// 像素风项链
const drawAmulet: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 链条
  drawPixelRect(ctx, cx - 8 * p, cy - 12 * p, p * 2, p * 4, '#ffd700');
  drawPixelRect(ctx, cx - 6 * p, cy - 10 * p, p * 2, p * 4, '#ffd700');
  drawPixelRect(ctx, cx - 4 * p, cy - 8 * p, p * 2, p * 4, '#ffd700');
  drawPixelRect(ctx, cx - 2 * p, cy - 6 * p, p * 4, p * 4, '#ffd700');
  drawPixelRect(ctx, cx + 2 * p, cy - 8 * p, p * 2, p * 4, '#ffd700');
  drawPixelRect(ctx, cx + 4 * p, cy - 10 * p, p * 2, p * 4, '#ffd700');
  drawPixelRect(ctx, cx + 6 * p, cy - 12 * p, p * 2, p * 4, '#ffd700');

  // 吊坠底座
  drawPixelRect(ctx, cx - 5 * p, cy - 2 * p, p * 10, p * 2, colors.secondary);
  drawPixelRect(ctx, cx - 6 * p, cy, p * 12, p * 6, colors.secondary);
  drawPixelRect(ctx, cx - 5 * p, cy + 6 * p, p * 10, p * 2, colors.secondary);
  drawPixelRect(ctx, cx - 3 * p, cy + 8 * p, p * 6, p * 2, colors.secondary);

  // 中心宝石
  drawPixelRect(ctx, cx - 4 * p, cy, p * 8, p * 6, colors.primary);
  drawPixelRect(ctx, cx - 3 * p, cy + p, p * 6, p * 4, colors.highlight);
  drawPixelRect(ctx, cx - 2 * p, cy + 2 * p, p * 2, p * 2, '#ffffff');
};

// 像素风腰带
const drawBelt: DrawFunction = (ctx, size, colors, p) => {
  const cx = size / 2;
  const cy = size / 2;

  // 腰带主体
  drawPixelRect(ctx, cx - 12 * p, cy - 2 * p, p * 24, p * 4, '#8b5a2b');
  drawPixelRect(ctx, cx - 12 * p, cy - p, p * 24, p * 2, '#a0522d');

  // 腰带扣
  drawPixelRect(ctx, cx - 4 * p, cy - 4 * p, p * 8, p * 8, colors.primary);
  drawPixelRect(ctx, cx - 3 * p, cy - 3 * p, p * 6, p * 6, colors.secondary);
  drawPixelRect(ctx, cx - 2 * p, cy - 2 * p, p * 4, p * 4, colors.highlight);

  // 扣针
  drawPixelRect(ctx, cx - p, cy - 3 * p, p * 2, p * 6, '#ffd700');

  // 侧面装饰
  drawPixelRect(ctx, cx - 10 * p, cy - p, p * 3, p * 2, colors.secondary);
  drawPixelRect(ctx, cx + 7 * p, cy - p, p * 3, p * 2, colors.secondary);

  // 腰带孔
  drawPixel(ctx, cx + 5 * p, cy - p * 0.5, p, '#5a3a1a');
  drawPixel(ctx, cx + 7 * p, cy - p * 0.5, p, '#5a3a1a');
  drawPixel(ctx, cx + 9 * p, cy - p * 0.5, p, '#5a3a1a');
};

// 绘制函数映射
const drawFunctions: Record<EquipmentType, DrawFunction> = {
  sword: drawSword,
  dagger: drawDagger,
  axe: drawAxe,
  hammer: drawHammer,
  bow: drawBow,
  staff: drawStaff,
  spear: drawSpear,
  shield: drawShield,
  armor: drawArmor,
  helmet: drawHelmet,
  boots: drawBoots,
  gloves: drawGloves,
  cloak: drawCloak,
  ring: drawRing,
  amulet: drawAmulet,
  belt: drawBelt,
};

export const EquipmentIcon = ({ type, quality = 'common', size = 48, className = '' }: EquipmentIconProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = qualityColors[quality];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 支持高清屏
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // 清空画布
    ctx.clearRect(0, 0, size, size);

    // 关闭抗锯齿以获得像素风效果
    ctx.imageSmoothingEnabled = false;

    // 计算像素大小 - 基于 size 调整
    const pixelSize = Math.max(1, Math.floor(size / 32));

    // 绘制装备图标
    const drawFn = drawFunctions[type];
    if (drawFn) {
      drawFn(ctx, size, colors, pixelSize);
    }
  }, [type, quality, size, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ 
        width: size, 
        height: size,
        imageRendering: 'pixelated',
      }}
    />
  );
};

export default EquipmentIcon;

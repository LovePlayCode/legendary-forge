import { useEffect, useRef } from 'react';
import type { EquipmentType, Quality } from '@/types/game';

interface EquipmentIconProps {
  type: EquipmentType;
  quality?: Quality;
  size?: number;
  className?: string;
}

// 品质对应的主色调
const qualityColors: Record<Quality, { primary: string; secondary: string; glow: string }> = {
  poor: { primary: '#9ca3af', secondary: '#6b7280', glow: 'rgba(156,163,175,0.3)' },
  common: { primary: '#78716c', secondary: '#57534e', glow: 'rgba(120,113,108,0.3)' },
  uncommon: { primary: '#22c55e', secondary: '#16a34a', glow: 'rgba(34,197,94,0.3)' },
  rare: { primary: '#3b82f6', secondary: '#2563eb', glow: 'rgba(59,130,246,0.3)' },
  epic: { primary: '#a855f7', secondary: '#9333ea', glow: 'rgba(168,85,247,0.3)' },
  legendary: { primary: '#f59e0b', secondary: '#d97706', glow: 'rgba(245,158,11,0.3)' },
  mythic: { primary: '#ef4444', secondary: '#dc2626', glow: 'rgba(239,68,68,0.4)' },
};

type DrawFunction = (ctx: CanvasRenderingContext2D, size: number, colors: { primary: string; secondary: string }) => void;

// 绘制剑
const drawSword: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 4);

  // 剑刃
  ctx.beginPath();
  ctx.moveTo(0, -28 * scale);
  ctx.lineTo(6 * scale, -20 * scale);
  ctx.lineTo(6 * scale, 8 * scale);
  ctx.lineTo(0, 12 * scale);
  ctx.lineTo(-6 * scale, 8 * scale);
  ctx.lineTo(-6 * scale, -20 * scale);
  ctx.closePath();

  const bladeGradient = ctx.createLinearGradient(-6 * scale, 0, 6 * scale, 0);
  bladeGradient.addColorStop(0, '#e5e7eb');
  bladeGradient.addColorStop(0.3, '#ffffff');
  bladeGradient.addColorStop(0.5, '#f3f4f6');
  bladeGradient.addColorStop(1, '#d1d5db');
  ctx.fillStyle = bladeGradient;
  ctx.fill();
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // 护手
  ctx.beginPath();
  ctx.roundRect(-12 * scale, 10 * scale, 24 * scale, 6 * scale, 2 * scale);
  ctx.fillStyle = colors.primary;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // 剑柄
  ctx.beginPath();
  ctx.roundRect(-3 * scale, 16 * scale, 6 * scale, 14 * scale, 1 * scale);
  const handleGradient = ctx.createLinearGradient(-3 * scale, 16 * scale, 3 * scale, 16 * scale);
  handleGradient.addColorStop(0, '#92400e');
  handleGradient.addColorStop(0.5, '#b45309');
  handleGradient.addColorStop(1, '#78350f');
  ctx.fillStyle = handleGradient;
  ctx.fill();

  // 剑首
  ctx.beginPath();
  ctx.arc(0, 32 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  ctx.restore();
};

// 绘制匕首
const drawDagger: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 4);

  // 短刃
  ctx.beginPath();
  ctx.moveTo(0, -24 * scale);
  ctx.lineTo(5 * scale, -8 * scale);
  ctx.lineTo(4 * scale, 6 * scale);
  ctx.lineTo(0, 10 * scale);
  ctx.lineTo(-4 * scale, 6 * scale);
  ctx.lineTo(-5 * scale, -8 * scale);
  ctx.closePath();

  const bladeGradient = ctx.createLinearGradient(-5 * scale, 0, 5 * scale, 0);
  bladeGradient.addColorStop(0, '#d1d5db');
  bladeGradient.addColorStop(0.5, '#ffffff');
  bladeGradient.addColorStop(1, '#d1d5db');
  ctx.fillStyle = bladeGradient;
  ctx.fill();
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // 护手
  ctx.beginPath();
  ctx.roundRect(-8 * scale, 8 * scale, 16 * scale, 4 * scale, 1 * scale);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  // 柄
  ctx.beginPath();
  ctx.roundRect(-2.5 * scale, 12 * scale, 5 * scale, 12 * scale, 1 * scale);
  ctx.fillStyle = '#8b4513';
  ctx.fill();

  // 柄首
  ctx.beginPath();
  ctx.arc(0, 26 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fillStyle = colors.secondary;
  ctx.fill();

  ctx.restore();
};

// 绘制战斧
const drawAxe: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 6);

  // 斧柄
  ctx.beginPath();
  ctx.roundRect(-3 * scale, -20 * scale, 6 * scale, 48 * scale, 2 * scale);
  ctx.fillStyle = '#8b4513';
  ctx.fill();

  // 斧刃
  ctx.beginPath();
  ctx.moveTo(3 * scale, -16 * scale);
  ctx.quadraticCurveTo(22 * scale, -12 * scale, 20 * scale, 0);
  ctx.quadraticCurveTo(18 * scale, 12 * scale, 3 * scale, 8 * scale);
  ctx.closePath();

  const axeGradient = ctx.createLinearGradient(3 * scale, 0, 20 * scale, 0);
  axeGradient.addColorStop(0, '#a0a0a0');
  axeGradient.addColorStop(0.5, '#e0e0e0');
  axeGradient.addColorStop(1, '#c0c0c0');
  ctx.fillStyle = axeGradient;
  ctx.fill();
  ctx.strokeStyle = '#808080';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // 装饰环
  ctx.beginPath();
  ctx.roundRect(-5 * scale, -4 * scale, 10 * scale, 3 * scale, 1 * scale);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  ctx.restore();
};

// 绘制战锤
const drawHammer: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 6);

  // 锤柄
  ctx.beginPath();
  ctx.roundRect(-3 * scale, -8 * scale, 6 * scale, 40 * scale, 2 * scale);
  ctx.fillStyle = '#8b4513';
  ctx.fill();

  // 锤头
  ctx.beginPath();
  ctx.roundRect(-14 * scale, -24 * scale, 28 * scale, 18 * scale, 3 * scale);
  const hammerGradient = ctx.createLinearGradient(-14 * scale, -24 * scale, 14 * scale, -6 * scale);
  hammerGradient.addColorStop(0, '#808080');
  hammerGradient.addColorStop(0.5, '#c0c0c0');
  hammerGradient.addColorStop(1, '#a0a0a0');
  ctx.fillStyle = hammerGradient;
  ctx.fill();
  ctx.strokeStyle = '#606060';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 装饰带
  ctx.beginPath();
  ctx.roundRect(-16 * scale, -16 * scale, 32 * scale, 4 * scale, 1 * scale);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  ctx.restore();
};

// 绘制弓
const drawBow: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

  // 弓身
  ctx.beginPath();
  ctx.moveTo(-8 * scale, -26 * scale);
  ctx.quadraticCurveTo(-24 * scale, 0, -8 * scale, 26 * scale);
  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();

  // 弓弦
  ctx.beginPath();
  ctx.moveTo(-8 * scale, -26 * scale);
  ctx.lineTo(-8 * scale, 26 * scale);
  ctx.strokeStyle = '#d4d4d4';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // 握把
  ctx.beginPath();
  ctx.roundRect(-12 * scale, -6 * scale, 8 * scale, 12 * scale, 2 * scale);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  // 弓尖装饰
  ctx.beginPath();
  ctx.arc(-8 * scale, -26 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fillStyle = colors.secondary;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-8 * scale, 26 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fillStyle = colors.secondary;
  ctx.fill();

  ctx.restore();
};

// 绘制法杖
const drawStaff: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 6);

  // 法杖杆
  ctx.beginPath();
  ctx.roundRect(-3 * scale, -12 * scale, 6 * scale, 42 * scale, 2 * scale);
  const staffGradient = ctx.createLinearGradient(-3 * scale, 0, 3 * scale, 0);
  staffGradient.addColorStop(0, '#713f12');
  staffGradient.addColorStop(0.5, '#a16207');
  staffGradient.addColorStop(1, '#713f12');
  ctx.fillStyle = staffGradient;
  ctx.fill();

  // 法杖头部装饰
  ctx.beginPath();
  ctx.moveTo(-8 * scale, -12 * scale);
  ctx.quadraticCurveTo(-12 * scale, -22 * scale, 0, -28 * scale);
  ctx.quadraticCurveTo(12 * scale, -22 * scale, 8 * scale, -12 * scale);
  ctx.closePath();
  ctx.fillStyle = colors.secondary;
  ctx.fill();

  // 魔法宝珠
  ctx.beginPath();
  ctx.arc(0, -20 * scale, 7 * scale, 0, Math.PI * 2);
  const orbGradient = ctx.createRadialGradient(-2 * scale, -22 * scale, 0, 0, -20 * scale, 7 * scale);
  orbGradient.addColorStop(0, '#ffffff');
  orbGradient.addColorStop(0.3, colors.primary);
  orbGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = orbGradient;
  ctx.fill();

  ctx.restore();
};

// 绘制长矛
const drawSpear: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 6);

  // 矛杆
  ctx.beginPath();
  ctx.roundRect(-2.5 * scale, -16 * scale, 5 * scale, 48 * scale, 1 * scale);
  ctx.fillStyle = '#8b4513';
  ctx.fill();

  // 矛尖
  ctx.beginPath();
  ctx.moveTo(0, -32 * scale);
  ctx.lineTo(6 * scale, -16 * scale);
  ctx.lineTo(0, -12 * scale);
  ctx.lineTo(-6 * scale, -16 * scale);
  ctx.closePath();

  const tipGradient = ctx.createLinearGradient(-6 * scale, -24 * scale, 6 * scale, -24 * scale);
  tipGradient.addColorStop(0, '#a0a0a0');
  tipGradient.addColorStop(0.5, '#e0e0e0');
  tipGradient.addColorStop(1, '#a0a0a0');
  ctx.fillStyle = tipGradient;
  ctx.fill();
  ctx.strokeStyle = '#808080';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // 装饰环
  ctx.beginPath();
  ctx.roundRect(-4 * scale, -18 * scale, 8 * scale, 3 * scale, 1 * scale);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  ctx.restore();
};

// 绘制盾牌
const drawShield: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

  // 盾牌主体
  ctx.beginPath();
  ctx.moveTo(0, -26 * scale);
  ctx.bezierCurveTo(22 * scale, -26 * scale, 24 * scale, -10 * scale, 24 * scale, 4 * scale);
  ctx.bezierCurveTo(24 * scale, 18 * scale, 12 * scale, 28 * scale, 0, 30 * scale);
  ctx.bezierCurveTo(-12 * scale, 28 * scale, -24 * scale, 18 * scale, -24 * scale, 4 * scale);
  ctx.bezierCurveTo(-24 * scale, -10 * scale, -22 * scale, -26 * scale, 0, -26 * scale);
  ctx.closePath();

  const shieldGradient = ctx.createRadialGradient(0, -10 * scale, 0, 0, 0, 30 * scale);
  shieldGradient.addColorStop(0, colors.primary);
  shieldGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = shieldGradient;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 中心宝石
  ctx.beginPath();
  ctx.arc(0, 2 * scale, 6 * scale, 0, Math.PI * 2);
  const gemGradient = ctx.createRadialGradient(-1 * scale, 0, 0, 0, 2 * scale, 6 * scale);
  gemGradient.addColorStop(0, '#ffffff');
  gemGradient.addColorStop(0.5, '#ffd700');
  gemGradient.addColorStop(1, '#b8860b');
  ctx.fillStyle = gemGradient;
  ctx.fill();

  ctx.restore();
};

// 绘制护甲
const drawArmor: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

  // 护甲主体
  ctx.beginPath();
  ctx.moveTo(0, -24 * scale);
  ctx.lineTo(18 * scale, -16 * scale);
  ctx.lineTo(20 * scale, -8 * scale);
  ctx.lineTo(16 * scale, 0);
  ctx.lineTo(18 * scale, 8 * scale);
  ctx.lineTo(14 * scale, 24 * scale);
  ctx.lineTo(0, 28 * scale);
  ctx.lineTo(-14 * scale, 24 * scale);
  ctx.lineTo(-18 * scale, 8 * scale);
  ctx.lineTo(-16 * scale, 0);
  ctx.lineTo(-20 * scale, -8 * scale);
  ctx.lineTo(-18 * scale, -16 * scale);
  ctx.closePath();

  const armorGradient = ctx.createLinearGradient(-20 * scale, 0, 20 * scale, 0);
  armorGradient.addColorStop(0, colors.secondary);
  armorGradient.addColorStop(0.5, colors.primary);
  armorGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = armorGradient;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 中线装饰
  ctx.beginPath();
  ctx.moveTo(0, -10 * scale);
  ctx.lineTo(0, 20 * scale);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.restore();
};

// 绘制头盔
const drawHelmet: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

  // 头盔主体
  ctx.beginPath();
  ctx.moveTo(-18 * scale, 10 * scale);
  ctx.quadraticCurveTo(-22 * scale, -8 * scale, -14 * scale, -20 * scale);
  ctx.quadraticCurveTo(0, -28 * scale, 14 * scale, -20 * scale);
  ctx.quadraticCurveTo(22 * scale, -8 * scale, 18 * scale, 10 * scale);
  ctx.lineTo(18 * scale, 20 * scale);
  ctx.lineTo(-18 * scale, 20 * scale);
  ctx.closePath();

  const helmetGradient = ctx.createLinearGradient(-20 * scale, 0, 20 * scale, 0);
  helmetGradient.addColorStop(0, colors.secondary);
  helmetGradient.addColorStop(0.5, colors.primary);
  helmetGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = helmetGradient;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 面罩开口
  ctx.beginPath();
  ctx.roundRect(-10 * scale, 2 * scale, 20 * scale, 14 * scale, 2 * scale);
  ctx.fillStyle = '#1f2937';
  ctx.fill();

  // 面罩横条
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-10 * scale, (5 + i * 4) * scale);
    ctx.lineTo(10 * scale, (5 + i * 4) * scale);
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
  }

  ctx.restore();
};

// 绘制靴子
const drawBoots: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

  const bootGradient = ctx.createLinearGradient(-22 * scale, 0, 22 * scale, 0);
  bootGradient.addColorStop(0, colors.secondary);
  bootGradient.addColorStop(0.5, colors.primary);
  bootGradient.addColorStop(1, colors.secondary);

  // 左靴
  ctx.beginPath();
  ctx.moveTo(-18 * scale, -20 * scale);
  ctx.lineTo(-8 * scale, -20 * scale);
  ctx.lineTo(-6 * scale, 8 * scale);
  ctx.lineTo(-4 * scale, 16 * scale);
  ctx.lineTo(-20 * scale, 16 * scale);
  ctx.lineTo(-22 * scale, 10 * scale);
  ctx.lineTo(-20 * scale, 8 * scale);
  ctx.closePath();
  ctx.fillStyle = bootGradient;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 右靴
  ctx.beginPath();
  ctx.moveTo(8 * scale, -20 * scale);
  ctx.lineTo(18 * scale, -20 * scale);
  ctx.lineTo(20 * scale, 8 * scale);
  ctx.lineTo(22 * scale, 10 * scale);
  ctx.lineTo(20 * scale, 16 * scale);
  ctx.lineTo(4 * scale, 16 * scale);
  ctx.lineTo(6 * scale, 8 * scale);
  ctx.closePath();
  ctx.fillStyle = bootGradient;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 靴口装饰
  ctx.beginPath();
  ctx.roundRect(-19 * scale, -22 * scale, 12 * scale, 4 * scale, 1 * scale);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(7 * scale, -22 * scale, 12 * scale, 4 * scale, 1 * scale);
  ctx.fill();

  ctx.restore();
};

// 绘制手套
const drawGloves: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

  const gloveGradient = ctx.createLinearGradient(-24 * scale, 0, 24 * scale, 0);
  gloveGradient.addColorStop(0, colors.secondary);
  gloveGradient.addColorStop(0.5, colors.primary);
  gloveGradient.addColorStop(1, colors.secondary);

  // 左手套
  ctx.beginPath();
  ctx.roundRect(-24 * scale, -8 * scale, 18 * scale, 20 * scale, 3 * scale);
  ctx.fillStyle = gloveGradient;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 左手指
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.roundRect((-22 + i * 4) * scale, -16 * scale, 3 * scale, 10 * scale, 1 * scale);
    ctx.fillStyle = gloveGradient;
    ctx.fill();
  }

  // 右手套
  ctx.beginPath();
  ctx.roundRect(6 * scale, -8 * scale, 18 * scale, 20 * scale, 3 * scale);
  ctx.fillStyle = gloveGradient;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 右手指
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.roundRect((8 + i * 4) * scale, -16 * scale, 3 * scale, 10 * scale, 1 * scale);
    ctx.fillStyle = gloveGradient;
    ctx.fill();
  }

  // 护腕装饰
  ctx.beginPath();
  ctx.roundRect(-25 * scale, 8 * scale, 20 * scale, 4 * scale, 1 * scale);
  ctx.fillStyle = colors.secondary;
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(5 * scale, 8 * scale, 20 * scale, 4 * scale, 1 * scale);
  ctx.fill();

  ctx.restore();
};

// 绘制披风
const drawCloak: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

  // 披风主体
  ctx.beginPath();
  ctx.moveTo(0, -24 * scale);
  ctx.quadraticCurveTo(24 * scale, -20 * scale, 22 * scale, 10 * scale);
  ctx.quadraticCurveTo(18 * scale, 28 * scale, 0, 28 * scale);
  ctx.quadraticCurveTo(-18 * scale, 28 * scale, -22 * scale, 10 * scale);
  ctx.quadraticCurveTo(-24 * scale, -20 * scale, 0, -24 * scale);
  ctx.closePath();

  const cloakGradient = ctx.createLinearGradient(-22 * scale, 0, 22 * scale, 0);
  cloakGradient.addColorStop(0, colors.secondary);
  cloakGradient.addColorStop(0.5, colors.primary);
  cloakGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = cloakGradient;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 领扣
  ctx.beginPath();
  ctx.arc(0, -20 * scale, 5 * scale, 0, Math.PI * 2);
  const claspGradient = ctx.createRadialGradient(-1 * scale, -21 * scale, 0, 0, -20 * scale, 5 * scale);
  claspGradient.addColorStop(0, '#ffd700');
  claspGradient.addColorStop(1, '#b8860b');
  ctx.fillStyle = claspGradient;
  ctx.fill();

  // 褶皱线
  ctx.beginPath();
  ctx.moveTo(-10 * scale, -16 * scale);
  ctx.quadraticCurveTo(-12 * scale, 5 * scale, -8 * scale, 24 * scale);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(10 * scale, -16 * scale);
  ctx.quadraticCurveTo(12 * scale, 5 * scale, 8 * scale, 24 * scale);
  ctx.stroke();

  ctx.restore();
};

// 绘制戒指
const drawRing: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

  // 戒环
  ctx.beginPath();
  ctx.arc(0, 4 * scale, 16 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 6 * scale;
  ctx.stroke();

  // 戒环内圈
  ctx.beginPath();
  ctx.arc(0, 4 * scale, 16 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 宝石底座
  ctx.beginPath();
  ctx.arc(0, -14 * scale, 8 * scale, 0, Math.PI * 2);
  ctx.fillStyle = colors.secondary;
  ctx.fill();

  // 宝石
  ctx.beginPath();
  ctx.moveTo(0, -22 * scale);
  ctx.lineTo(6 * scale, -14 * scale);
  ctx.lineTo(0, -6 * scale);
  ctx.lineTo(-6 * scale, -14 * scale);
  ctx.closePath();
  const gemGradient = ctx.createRadialGradient(-1 * scale, -16 * scale, 0, 0, -14 * scale, 8 * scale);
  gemGradient.addColorStop(0, '#ffffff');
  gemGradient.addColorStop(0.3, colors.primary);
  gemGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = gemGradient;
  ctx.fill();

  ctx.restore();
};

// 绘制项链
const drawAmulet: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

  // 链条
  ctx.beginPath();
  ctx.moveTo(-18 * scale, -24 * scale);
  ctx.quadraticCurveTo(-20 * scale, -10 * scale, 0, 0);
  ctx.quadraticCurveTo(20 * scale, -10 * scale, 18 * scale, -24 * scale);
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 吊坠底座
  ctx.beginPath();
  ctx.arc(0, 8 * scale, 12 * scale, 0, Math.PI * 2);
  ctx.fillStyle = colors.secondary;
  ctx.fill();
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 中心宝石
  ctx.beginPath();
  ctx.arc(0, 8 * scale, 8 * scale, 0, Math.PI * 2);
  const gemGradient = ctx.createRadialGradient(-2 * scale, 6 * scale, 0, 0, 8 * scale, 8 * scale);
  gemGradient.addColorStop(0, '#ffffff');
  gemGradient.addColorStop(0.3, colors.primary);
  gemGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = gemGradient;
  ctx.fill();

  // 装饰点
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const x = Math.cos(angle) * 10 * scale;
    const y = 8 * scale + Math.sin(angle) * 10 * scale;
    ctx.beginPath();
    ctx.arc(x, y, 2 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
  }

  ctx.restore();
};

// 绘制腰带
const drawBelt: DrawFunction = (ctx, size, colors) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

  // 腰带主体
  ctx.beginPath();
  ctx.roundRect(-28 * scale, -6 * scale, 56 * scale, 12 * scale, 3 * scale);
  ctx.fillStyle = '#8b4513';
  ctx.fill();
  ctx.strokeStyle = '#5d3a1a';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 腰带扣
  ctx.beginPath();
  ctx.roundRect(-8 * scale, -10 * scale, 16 * scale, 20 * scale, 2 * scale);
  ctx.fillStyle = colors.primary;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 扣针
  ctx.beginPath();
  ctx.roundRect(-2 * scale, -6 * scale, 4 * scale, 12 * scale, 1 * scale);
  ctx.fillStyle = '#ffd700';
  ctx.fill();

  // 侧面装饰
  ctx.beginPath();
  ctx.arc(-18 * scale, 0, 4 * scale, 0, Math.PI * 2);
  ctx.fillStyle = colors.secondary;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(18 * scale, 0, 4 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
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

    // 绘制装备图标
    const drawFn = drawFunctions[type];
    if (drawFn) {
      drawFn(ctx, size, { primary: colors.primary, secondary: colors.secondary });
    }
  }, [type, quality, size, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default EquipmentIcon;

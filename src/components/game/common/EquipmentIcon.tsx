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

// 绘制剑
const drawSword = (ctx: CanvasRenderingContext2D, size: number, colors: { primary: string; secondary: string }) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 4); // 45度倾斜

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

  // 剑刃中线
  ctx.beginPath();
  ctx.moveTo(0, -26 * scale);
  ctx.lineTo(0, 10 * scale);
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1.5 * scale;
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

  // 剑柄缠绕
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-3 * scale, (18 + i * 3) * scale);
    ctx.lineTo(3 * scale, (19 + i * 3) * scale);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 0.8 * scale;
    ctx.stroke();
  }

  // 剑首
  ctx.beginPath();
  ctx.arc(0, 32 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fillStyle = colors.primary;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  ctx.restore();
};

// 绘制盾牌
const drawShield = (ctx: CanvasRenderingContext2D, size: number, colors: { primary: string; secondary: string }) => {
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

  // 盾牌边框装饰
  ctx.beginPath();
  ctx.moveTo(0, -20 * scale);
  ctx.bezierCurveTo(16 * scale, -20 * scale, 18 * scale, -6 * scale, 18 * scale, 4 * scale);
  ctx.bezierCurveTo(18 * scale, 14 * scale, 10 * scale, 22 * scale, 0, 24 * scale);
  ctx.bezierCurveTo(-10 * scale, 22 * scale, -18 * scale, 14 * scale, -18 * scale, 4 * scale);
  ctx.bezierCurveTo(-18 * scale, -6 * scale, -16 * scale, -20 * scale, 0, -20 * scale);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 中心装饰
  ctx.beginPath();
  ctx.arc(0, 2 * scale, 8 * scale, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 中心宝石
  ctx.beginPath();
  ctx.arc(0, 2 * scale, 4 * scale, 0, Math.PI * 2);
  const gemGradient = ctx.createRadialGradient(-1 * scale, 0, 0, 0, 2 * scale, 4 * scale);
  gemGradient.addColorStop(0, '#ffffff');
  gemGradient.addColorStop(0.3, colors.primary);
  gemGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = gemGradient;
  ctx.fill();

  ctx.restore();
};

// 绘制法杖
const drawStaff = (ctx: CanvasRenderingContext2D, size: number, colors: { primary: string; secondary: string }) => {
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
  staffGradient.addColorStop(0.3, '#a16207');
  staffGradient.addColorStop(0.7, '#854d0e');
  staffGradient.addColorStop(1, '#422006');
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
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 魔法宝珠
  ctx.beginPath();
  ctx.arc(0, -20 * scale, 7 * scale, 0, Math.PI * 2);
  const orbGradient = ctx.createRadialGradient(-2 * scale, -22 * scale, 0, 0, -20 * scale, 7 * scale);
  orbGradient.addColorStop(0, '#ffffff');
  orbGradient.addColorStop(0.3, colors.primary);
  orbGradient.addColorStop(0.7, colors.secondary);
  orbGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = orbGradient;
  ctx.fill();

  // 宝珠高光
  ctx.beginPath();
  ctx.arc(-2 * scale, -22 * scale, 2 * scale, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fill();

  // 装饰环
  ctx.beginPath();
  ctx.roundRect(-5 * scale, -14 * scale, 10 * scale, 3 * scale, 1 * scale);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(-4 * scale, 0, 8 * scale, 2 * scale, 1 * scale);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  ctx.restore();
};

// 绘制护甲
const drawArmor = (ctx: CanvasRenderingContext2D, size: number, colors: { primary: string; secondary: string }) => {
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
  armorGradient.addColorStop(0.3, colors.primary);
  armorGradient.addColorStop(0.5, colors.primary);
  armorGradient.addColorStop(0.7, colors.primary);
  armorGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = armorGradient;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 领口
  ctx.beginPath();
  ctx.arc(0, -18 * scale, 8 * scale, 0, Math.PI, true);
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

  // 横线装饰
  ctx.beginPath();
  ctx.moveTo(-12 * scale, 0);
  ctx.lineTo(12 * scale, 0);
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-10 * scale, 10 * scale);
  ctx.lineTo(10 * scale, 10 * scale);
  ctx.stroke();

  // 肩甲装饰
  ctx.beginPath();
  ctx.arc(-16 * scale, -12 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(16 * scale, -12 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// 绘制头盔
const drawHelmet = (ctx: CanvasRenderingContext2D, size: number, colors: { primary: string; secondary: string }) => {
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
  helmetGradient.addColorStop(0.4, colors.primary);
  helmetGradient.addColorStop(0.6, colors.primary);
  helmetGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = helmetGradient;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 面罩开口
  ctx.beginPath();
  ctx.moveTo(-10 * scale, 4 * scale);
  ctx.lineTo(-10 * scale, 16 * scale);
  ctx.lineTo(10 * scale, 16 * scale);
  ctx.lineTo(10 * scale, 4 * scale);
  ctx.quadraticCurveTo(0, -2 * scale, -10 * scale, 4 * scale);
  ctx.closePath();
  ctx.fillStyle = '#1f2937';
  ctx.fill();

  // 面罩横条
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-10 * scale, (6 + i * 4) * scale);
    ctx.lineTo(10 * scale, (6 + i * 4) * scale);
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
  }

  // 头盔顶部装饰
  ctx.beginPath();
  ctx.moveTo(0, -24 * scale);
  ctx.lineTo(0, -30 * scale);
  ctx.lineTo(4 * scale, -26 * scale);
  ctx.lineTo(0, -24 * scale);
  ctx.fillStyle = colors.primary;
  ctx.fill();

  // 侧面装饰
  ctx.beginPath();
  ctx.arc(-14 * scale, -4 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(14 * scale, -4 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// 绘制靴子
const drawBoots = (ctx: CanvasRenderingContext2D, size: number, colors: { primary: string; secondary: string }) => {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 64;

  ctx.save();
  ctx.translate(cx, cy);

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

  const bootGradient = ctx.createLinearGradient(-22 * scale, 0, -4 * scale, 0);
  bootGradient.addColorStop(0, colors.secondary);
  bootGradient.addColorStop(0.5, colors.primary);
  bootGradient.addColorStop(1, colors.secondary);
  ctx.fillStyle = bootGradient;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 左靴装饰
  ctx.beginPath();
  ctx.moveTo(-18 * scale, -12 * scale);
  ctx.lineTo(-8 * scale, -12 * scale);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-18 * scale, -4 * scale);
  ctx.lineTo(-8 * scale, -4 * scale);
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

  const bootGradient2 = ctx.createLinearGradient(4 * scale, 0, 22 * scale, 0);
  bootGradient2.addColorStop(0, colors.secondary);
  bootGradient2.addColorStop(0.5, colors.primary);
  bootGradient2.addColorStop(1, colors.secondary);
  ctx.fillStyle = bootGradient2;
  ctx.fill();
  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 右靴装饰
  ctx.beginPath();
  ctx.moveTo(8 * scale, -12 * scale);
  ctx.lineTo(18 * scale, -12 * scale);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(8 * scale, -4 * scale);
  ctx.lineTo(18 * scale, -4 * scale);
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

// 绘制函数映射
const drawFunctions: Record<EquipmentType, (ctx: CanvasRenderingContext2D, size: number, colors: { primary: string; secondary: string }) => void> = {
  sword: drawSword,
  shield: drawShield,
  staff: drawStaff,
  armor: drawArmor,
  helmet: drawHelmet,
  boots: drawBoots,
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

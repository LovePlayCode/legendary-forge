/**
 * 像素艺术精灵生成器
 * 使用 Canvas API 生成高质量的像素风格精灵图
 */

// 颜色调色板 - 像素艺术风格
const PALETTES = {
  knight: {
    armor: ['#4a5568', '#718096', '#a0aec0', '#cbd5e0'],
    skin: ['#d4a574', '#c4956a', '#b4855a'],
    hair: ['#2d1f1a', '#3d2f2a'],
    sword: ['#a0aec0', '#cbd5e0', '#e2e8f0', '#ffd700'],
    cape: ['#2563eb', '#1d4ed8', '#1e40af'],
  },
  slime: {
    body: ['#22c55e', '#16a34a', '#15803d', '#166534'],
    eye: ['#ffffff', '#000000'],
    shine: ['#86efac', '#bbf7d0'],
  },
  skeleton: {
    bone: ['#f5f5f4', '#e7e5e4', '#d6d3d1', '#a8a29e'],
    eye: ['#ef4444', '#dc2626'],
    weapon: ['#78716c', '#57534e'],
  },
  bat: {
    body: ['#44403c', '#292524', '#1c1917'],
    wing: ['#57534e', '#44403c', '#292524'],
    eye: ['#f97316', '#ea580c'],
  },
  goblin: {
    skin: ['#84cc16', '#65a30d', '#4d7c0f'],
    cloth: ['#78350f', '#92400e', '#a16207'],
    eye: ['#fef08a', '#000000'],
  },
  dragon: {
    body: ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
    belly: ['#fbbf24', '#f59e0b', '#d97706'],
    eye: ['#fef08a', '#000000'],
    wing: ['#991b1b', '#7f1d1d', '#450a0a'],
  },
  golem: {
    body: ['#78716c', '#57534e', '#44403c', '#292524'],
    crystal: ['#06b6d4', '#0891b2', '#0e7490'],
    eye: ['#22d3ee', '#06b6d4'],
  },
  ghost: {
    body: ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8'],
    eye: ['#312e81', '#1e1b4b'],
  },
};

// 生成像素化的圆形
function drawPixelCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  pixelSize: number = 2
) {
  ctx.fillStyle = color;
  for (let y = -r; y <= r; y += pixelSize) {
    for (let x = -r; x <= r; x += pixelSize) {
      if (x * x + y * y <= r * r) {
        ctx.fillRect(
          Math.floor((cx + x) / pixelSize) * pixelSize,
          Math.floor((cy + y) / pixelSize) * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
  }
}

// 生成像素化的矩形
function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  pixelSize: number = 2
) {
  ctx.fillStyle = color;
  for (let py = 0; py < h; py += pixelSize) {
    for (let px = 0; px < w; px += pixelSize) {
      ctx.fillRect(
        Math.floor((x + px) / pixelSize) * pixelSize,
        Math.floor((y + py) / pixelSize) * pixelSize,
        pixelSize,
        pixelSize
      );
    }
  }
}

// 生成骑士精灵
export function generateKnightSprite(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const p = PALETTES.knight;
  const ps = 2; // pixel size
  const cx = size / 2;

  // 身体/铠甲
  drawPixelRect(ctx, cx - 12, 24, 24, 28, p.armor[1], ps);
  drawPixelRect(ctx, cx - 10, 26, 20, 24, p.armor[2], ps);
  
  // 胸甲高光
  drawPixelRect(ctx, cx - 6, 28, 12, 8, p.armor[3], ps);
  
  // 头盔
  drawPixelCircle(ctx, cx, 16, 12, p.armor[1], ps);
  drawPixelCircle(ctx, cx, 14, 10, p.armor[2], ps);
  
  // 头盔面罩
  drawPixelRect(ctx, cx - 6, 12, 12, 8, p.armor[0], ps);
  
  // 眼睛发光
  drawPixelRect(ctx, cx - 4, 14, 3, 2, '#60a5fa', ps);
  drawPixelRect(ctx, cx + 1, 14, 3, 2, '#60a5fa', ps);
  
  // 头盔顶饰
  drawPixelRect(ctx, cx - 2, 2, 4, 8, p.armor[2], ps);
  drawPixelRect(ctx, cx - 1, 0, 2, 4, '#ef4444', ps);
  
  // 肩甲
  drawPixelCircle(ctx, cx - 16, 28, 6, p.armor[1], ps);
  drawPixelCircle(ctx, cx + 16, 28, 6, p.armor[1], ps);
  
  // 腿
  drawPixelRect(ctx, cx - 10, 52, 8, 12, p.cape[1], ps);
  drawPixelRect(ctx, cx + 2, 52, 8, 12, p.cape[1], ps);
  
  // 靴子
  drawPixelRect(ctx, cx - 12, 60, 10, 4, p.armor[0], ps);
  drawPixelRect(ctx, cx + 2, 60, 10, 4, p.armor[0], ps);
  
  // 剑
  drawPixelRect(ctx, cx + 20, 10, 4, 40, p.sword[1], ps);
  drawPixelRect(ctx, cx + 21, 12, 2, 36, p.sword[2], ps);
  // 剑尖
  drawPixelRect(ctx, cx + 20, 6, 4, 4, p.sword[2], ps);
  drawPixelRect(ctx, cx + 21, 4, 2, 2, p.sword[2], ps);
  // 护手
  drawPixelRect(ctx, cx + 14, 48, 16, 4, p.sword[3], ps);
  // 剑柄
  drawPixelRect(ctx, cx + 20, 52, 4, 8, '#78350f', ps);
  
  // 盾牌
  drawPixelRect(ctx, cx - 26, 30, 14, 20, '#78350f', ps);
  drawPixelRect(ctx, cx - 24, 32, 10, 16, '#92400e', ps);
  // 盾牌徽章
  drawPixelCircle(ctx, cx - 19, 40, 4, p.sword[3], ps);

  return canvas;
}

// 生成史莱姆精灵
export function generateSlimeSprite(size: number = 48, color?: string[]): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const p = color || PALETTES.slime.body;
  const ps = 2;
  const cx = size / 2;
  const cy = size / 2 + 4;

  // 身体主体
  drawPixelCircle(ctx, cx, cy, 18, p[1], ps);
  drawPixelCircle(ctx, cx, cy - 2, 16, p[0], ps);
  
  // 底部阴影
  drawPixelCircle(ctx, cx, cy + 8, 14, p[2], ps);
  
  // 高光
  drawPixelCircle(ctx, cx - 6, cy - 8, 4, PALETTES.slime.shine[0], ps);
  drawPixelCircle(ctx, cx - 4, cy - 10, 2, PALETTES.slime.shine[1], ps);
  
  // 眼睛
  drawPixelCircle(ctx, cx - 6, cy - 2, 5, '#ffffff', ps);
  drawPixelCircle(ctx, cx + 6, cy - 2, 5, '#ffffff', ps);
  drawPixelCircle(ctx, cx - 5, cy - 1, 3, '#000000', ps);
  drawPixelCircle(ctx, cx + 7, cy - 1, 3, '#000000', ps);
  
  // 嘴巴
  drawPixelRect(ctx, cx - 4, cy + 6, 8, 2, p[3], ps);

  return canvas;
}

// 生成骷髅精灵
export function generateSkeletonSprite(size: number = 56): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const p = PALETTES.skeleton;
  const ps = 2;
  const cx = size / 2;

  // 头骨
  drawPixelCircle(ctx, cx, 14, 10, p.bone[0], ps);
  drawPixelCircle(ctx, cx, 12, 8, p.bone[1], ps);
  
  // 眼眶
  drawPixelCircle(ctx, cx - 4, 12, 3, '#000000', ps);
  drawPixelCircle(ctx, cx + 4, 12, 3, '#000000', ps);
  // 眼睛发光
  drawPixelRect(ctx, cx - 5, 11, 2, 2, p.eye[0], ps);
  drawPixelRect(ctx, cx + 3, 11, 2, 2, p.eye[0], ps);
  
  // 鼻子
  drawPixelRect(ctx, cx - 1, 14, 2, 3, '#000000', ps);
  
  // 牙齿
  drawPixelRect(ctx, cx - 4, 18, 8, 2, p.bone[0], ps);
  for (let i = 0; i < 4; i++) {
    drawPixelRect(ctx, cx - 4 + i * 2, 20, 2, 2, p.bone[0], ps);
  }
  
  // 脊椎
  for (let i = 0; i < 4; i++) {
    drawPixelRect(ctx, cx - 2, 24 + i * 6, 4, 4, p.bone[2], ps);
  }
  
  // 肋骨
  for (let i = 0; i < 3; i++) {
    drawPixelRect(ctx, cx - 10, 26 + i * 6, 8, 2, p.bone[1], ps);
    drawPixelRect(ctx, cx + 2, 26 + i * 6, 8, 2, p.bone[1], ps);
  }
  
  // 手臂骨
  drawPixelRect(ctx, cx - 16, 26, 4, 16, p.bone[1], ps);
  drawPixelRect(ctx, cx + 12, 26, 4, 16, p.bone[1], ps);
  
  // 腿骨
  drawPixelRect(ctx, cx - 6, 48, 4, 12, p.bone[1], ps);
  drawPixelRect(ctx, cx + 2, 48, 4, 12, p.bone[1], ps);
  
  // 武器 - 骨头棒
  drawPixelRect(ctx, cx + 18, 20, 4, 24, p.bone[2], ps);
  drawPixelCircle(ctx, cx + 20, 18, 4, p.bone[0], ps);

  return canvas;
}

// 生成蝙蝠精灵
export function generateBatSprite(size: number = 48): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const p = PALETTES.bat;
  const ps = 2;
  const cx = size / 2;
  const cy = size / 2;

  // 翅膀
  // 左翅
  ctx.fillStyle = p.wing[0];
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy);
  ctx.lineTo(cx - 22, cy - 8);
  ctx.lineTo(cx - 20, cy + 4);
  ctx.lineTo(cx - 16, cy - 2);
  ctx.lineTo(cx - 14, cy + 6);
  ctx.lineTo(cx - 10, cy);
  ctx.closePath();
  ctx.fill();
  
  // 右翅
  ctx.beginPath();
  ctx.moveTo(cx + 6, cy);
  ctx.lineTo(cx + 22, cy - 8);
  ctx.lineTo(cx + 20, cy + 4);
  ctx.lineTo(cx + 16, cy - 2);
  ctx.lineTo(cx + 14, cy + 6);
  ctx.lineTo(cx + 10, cy);
  ctx.closePath();
  ctx.fill();
  
  // 身体
  drawPixelCircle(ctx, cx, cy, 8, p.body[0], ps);
  drawPixelCircle(ctx, cx, cy - 2, 6, p.body[1], ps);
  
  // 耳朵
  drawPixelRect(ctx, cx - 6, cy - 12, 4, 8, p.body[0], ps);
  drawPixelRect(ctx, cx + 2, cy - 12, 4, 8, p.body[0], ps);
  
  // 眼睛
  drawPixelCircle(ctx, cx - 3, cy - 2, 3, p.eye[0], ps);
  drawPixelCircle(ctx, cx + 3, cy - 2, 3, p.eye[0], ps);
  drawPixelRect(ctx, cx - 3, cy - 2, 2, 2, '#000000', ps);
  drawPixelRect(ctx, cx + 2, cy - 2, 2, 2, '#000000', ps);
  
  // 獠牙
  drawPixelRect(ctx, cx - 3, cy + 4, 2, 4, '#ffffff', ps);
  drawPixelRect(ctx, cx + 1, cy + 4, 2, 4, '#ffffff', ps);

  return canvas;
}

// 生成地精精灵
export function generateGoblinSprite(size: number = 52): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const p = PALETTES.goblin;
  const ps = 2;
  const cx = size / 2;

  // 身体
  drawPixelRect(ctx, cx - 8, 24, 16, 18, p.cloth[1], ps);
  
  // 头
  drawPixelCircle(ctx, cx, 14, 10, p.skin[0], ps);
  drawPixelCircle(ctx, cx, 12, 8, p.skin[1], ps);
  
  // 耳朵 - 大尖耳
  ctx.fillStyle = p.skin[0];
  ctx.beginPath();
  ctx.moveTo(cx - 10, 10);
  ctx.lineTo(cx - 20, 4);
  ctx.lineTo(cx - 12, 16);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(cx + 10, 10);
  ctx.lineTo(cx + 20, 4);
  ctx.lineTo(cx + 12, 16);
  ctx.closePath();
  ctx.fill();
  
  // 眼睛
  drawPixelCircle(ctx, cx - 4, 12, 4, p.eye[0], ps);
  drawPixelCircle(ctx, cx + 4, 12, 4, p.eye[0], ps);
  drawPixelCircle(ctx, cx - 3, 13, 2, p.eye[1], ps);
  drawPixelCircle(ctx, cx + 5, 13, 2, p.eye[1], ps);
  
  // 鼻子
  drawPixelCircle(ctx, cx, 16, 3, p.skin[2], ps);
  
  // 嘴巴
  drawPixelRect(ctx, cx - 4, 20, 8, 2, '#000000', ps);
  
  // 手臂
  drawPixelRect(ctx, cx - 14, 26, 6, 12, p.skin[0], ps);
  drawPixelRect(ctx, cx + 8, 26, 6, 12, p.skin[0], ps);
  
  // 腿
  drawPixelRect(ctx, cx - 6, 42, 5, 10, p.skin[0], ps);
  drawPixelRect(ctx, cx + 1, 42, 5, 10, p.skin[0], ps);
  
  // 武器 - 小刀
  drawPixelRect(ctx, cx + 16, 28, 3, 14, '#78716c', ps);
  drawPixelRect(ctx, cx + 16, 24, 3, 4, '#a16207', ps);

  return canvas;
}

// 生成龙精灵
export function generateDragonSprite(size: number = 72): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const p = PALETTES.dragon;
  const ps = 2;
  const cx = size / 2;

  // 翅膀
  ctx.fillStyle = p.wing[0];
  // 左翅
  ctx.beginPath();
  ctx.moveTo(cx - 10, 24);
  ctx.lineTo(cx - 32, 8);
  ctx.lineTo(cx - 28, 20);
  ctx.lineTo(cx - 24, 12);
  ctx.lineTo(cx - 20, 24);
  ctx.lineTo(cx - 16, 16);
  ctx.lineTo(cx - 12, 28);
  ctx.closePath();
  ctx.fill();
  
  // 右翅
  ctx.beginPath();
  ctx.moveTo(cx + 10, 24);
  ctx.lineTo(cx + 32, 8);
  ctx.lineTo(cx + 28, 20);
  ctx.lineTo(cx + 24, 12);
  ctx.lineTo(cx + 20, 24);
  ctx.lineTo(cx + 16, 16);
  ctx.lineTo(cx + 12, 28);
  ctx.closePath();
  ctx.fill();
  
  // 身体
  drawPixelCircle(ctx, cx, 36, 16, p.body[0], ps);
  drawPixelCircle(ctx, cx, 34, 14, p.body[1], ps);
  
  // 腹部
  drawPixelCircle(ctx, cx, 40, 10, p.belly[0], ps);
  
  // 头
  drawPixelCircle(ctx, cx, 18, 12, p.body[0], ps);
  drawPixelCircle(ctx, cx, 16, 10, p.body[1], ps);
  
  // 角
  drawPixelRect(ctx, cx - 10, 4, 4, 10, p.body[2], ps);
  drawPixelRect(ctx, cx + 6, 4, 4, 10, p.body[2], ps);
  
  // 眼睛
  drawPixelCircle(ctx, cx - 5, 16, 4, p.eye[0], ps);
  drawPixelCircle(ctx, cx + 5, 16, 4, p.eye[0], ps);
  drawPixelCircle(ctx, cx - 4, 17, 2, p.eye[1], ps);
  drawPixelCircle(ctx, cx + 6, 17, 2, p.eye[1], ps);
  
  // 鼻孔
  drawPixelRect(ctx, cx - 4, 22, 2, 2, '#000000', ps);
  drawPixelRect(ctx, cx + 2, 22, 2, 2, '#000000', ps);
  
  // 尾巴
  ctx.fillStyle = p.body[1];
  ctx.beginPath();
  ctx.moveTo(cx + 10, 44);
  ctx.lineTo(cx + 28, 52);
  ctx.lineTo(cx + 32, 48);
  ctx.lineTo(cx + 14, 40);
  ctx.closePath();
  ctx.fill();
  // 尾巴尖
  drawPixelRect(ctx, cx + 30, 46, 6, 4, p.body[2], ps);
  
  // 腿
  drawPixelRect(ctx, cx - 12, 48, 8, 12, p.body[1], ps);
  drawPixelRect(ctx, cx + 4, 48, 8, 12, p.body[1], ps);
  
  // 爪子
  drawPixelRect(ctx, cx - 14, 58, 4, 4, p.body[2], ps);
  drawPixelRect(ctx, cx - 8, 58, 4, 4, p.body[2], ps);
  drawPixelRect(ctx, cx + 4, 58, 4, 4, p.body[2], ps);
  drawPixelRect(ctx, cx + 10, 58, 4, 4, p.body[2], ps);

  return canvas;
}

// 生成魔像精灵
export function generateGolemSprite(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const p = PALETTES.golem;
  const ps = 2;
  const cx = size / 2;

  // 身体 - 大块岩石
  drawPixelRect(ctx, cx - 14, 20, 28, 32, p.body[1], ps);
  drawPixelRect(ctx, cx - 12, 22, 24, 28, p.body[0], ps);
  
  // 裂缝纹理
  ctx.fillStyle = p.body[2];
  ctx.fillRect(cx - 8, 26, 2, 12);
  ctx.fillRect(cx + 4, 30, 2, 10);
  ctx.fillRect(cx - 4, 40, 8, 2);
  
  // 头
  drawPixelRect(ctx, cx - 10, 4, 20, 18, p.body[1], ps);
  drawPixelRect(ctx, cx - 8, 6, 16, 14, p.body[0], ps);
  
  // 眼睛 - 发光水晶
  drawPixelCircle(ctx, cx - 4, 12, 4, p.crystal[0], ps);
  drawPixelCircle(ctx, cx + 4, 12, 4, p.crystal[0], ps);
  drawPixelCircle(ctx, cx - 4, 11, 2, p.eye[0], ps);
  drawPixelCircle(ctx, cx + 4, 11, 2, p.eye[0], ps);
  
  // 胸口水晶
  drawPixelCircle(ctx, cx, 32, 6, p.crystal[1], ps);
  drawPixelCircle(ctx, cx, 30, 4, p.crystal[0], ps);
  drawPixelCircle(ctx, cx - 2, 28, 2, p.eye[0], ps);
  
  // 手臂 - 巨大岩石
  drawPixelRect(ctx, cx - 24, 22, 12, 24, p.body[1], ps);
  drawPixelRect(ctx, cx + 12, 22, 12, 24, p.body[1], ps);
  
  // 拳头
  drawPixelCircle(ctx, cx - 18, 48, 8, p.body[0], ps);
  drawPixelCircle(ctx, cx + 18, 48, 8, p.body[0], ps);
  
  // 腿
  drawPixelRect(ctx, cx - 10, 52, 8, 12, p.body[1], ps);
  drawPixelRect(ctx, cx + 2, 52, 8, 12, p.body[1], ps);

  return canvas;
}

// 生成幽灵精灵
export function generateGhostSprite(size: number = 52): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const p = PALETTES.ghost;
  const ps = 2;
  const cx = size / 2;

  // 身体 - 半透明效果
  ctx.globalAlpha = 0.8;
  
  // 主体
  drawPixelCircle(ctx, cx, 20, 14, p.body[1], ps);
  drawPixelCircle(ctx, cx, 18, 12, p.body[0], ps);
  
  // 下摆波浪
  for (let i = 0; i < 5; i++) {
    const x = cx - 12 + i * 6;
    const y = 32 + (i % 2) * 4;
    drawPixelCircle(ctx, x, y, 5, p.body[2], ps);
  }
  
  // 尾部
  drawPixelRect(ctx, cx - 12, 24, 24, 12, p.body[1], ps);
  
  ctx.globalAlpha = 1;
  
  // 眼睛
  drawPixelCircle(ctx, cx - 5, 18, 5, '#ffffff', ps);
  drawPixelCircle(ctx, cx + 5, 18, 5, '#ffffff', ps);
  drawPixelCircle(ctx, cx - 4, 19, 3, p.eye[0], ps);
  drawPixelCircle(ctx, cx + 6, 19, 3, p.eye[0], ps);
  
  // 嘴巴 - 惊讶表情
  drawPixelCircle(ctx, cx, 26, 3, '#000000', ps);

  return canvas;
}

// 生成矿石精灵
export function generateOreSprite(size: number = 64): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const ps = 2;
  const cx = size / 2;

  // 岩石基底
  const rockColors = ['#44403c', '#57534e', '#78716c'];
  
  // 不规则岩石形状
  ctx.fillStyle = rockColors[0];
  ctx.beginPath();
  ctx.moveTo(cx - 24, 48);
  ctx.lineTo(cx - 28, 28);
  ctx.lineTo(cx - 16, 12);
  ctx.lineTo(cx + 8, 8);
  ctx.lineTo(cx + 24, 20);
  ctx.lineTo(cx + 28, 40);
  ctx.lineTo(cx + 16, 52);
  ctx.lineTo(cx - 8, 54);
  ctx.closePath();
  ctx.fill();
  
  // 高光面
  ctx.fillStyle = rockColors[1];
  ctx.beginPath();
  ctx.moveTo(cx - 16, 12);
  ctx.lineTo(cx + 8, 8);
  ctx.lineTo(cx + 24, 20);
  ctx.lineTo(cx + 4, 28);
  ctx.lineTo(cx - 12, 24);
  ctx.closePath();
  ctx.fill();
  
  // 金矿晶体
  const crystalPositions = [
    { x: cx - 8, y: 20, s: 10 },
    { x: cx + 8, y: 16, s: 12 },
    { x: cx + 4, y: 32, s: 8 },
    { x: cx - 12, y: 36, s: 9 },
    { x: cx + 14, y: 28, s: 7 },
  ];
  
  crystalPositions.forEach(({ x, y, s }) => {
    // 晶体阴影
    drawPixelCircle(ctx, x + 1, y + 1, s / 2, '#b45309', ps);
    // 晶体主体
    drawPixelCircle(ctx, x, y, s / 2, '#fbbf24', ps);
    // 晶体高光
    drawPixelRect(ctx, x - s / 4, y - s / 4, s / 3, s / 3, '#fef08a', ps);
  });
  
  // 闪光点
  const sparkles = [
    { x: cx - 6, y: 18 },
    { x: cx + 10, y: 14 },
    { x: cx + 6, y: 30 },
  ];
  
  sparkles.forEach(({ x, y }) => {
    drawPixelRect(ctx, x, y, 2, 2, '#ffffff', ps);
  });

  return canvas;
}

// 生成火焰特效精灵
export function generateFlameSprite(size: number = 32): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const ps = 2;
  const cx = size / 2;

  // 外层火焰
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(cx, 4);
  ctx.lineTo(cx - 10, 28);
  ctx.lineTo(cx - 4, 20);
  ctx.lineTo(cx, 28);
  ctx.lineTo(cx + 4, 20);
  ctx.lineTo(cx + 10, 28);
  ctx.closePath();
  ctx.fill();
  
  // 中层火焰
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(cx, 8);
  ctx.lineTo(cx - 6, 24);
  ctx.lineTo(cx, 18);
  ctx.lineTo(cx + 6, 24);
  ctx.closePath();
  ctx.fill();
  
  // 内层火焰
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(cx, 12);
  ctx.lineTo(cx - 3, 22);
  ctx.lineTo(cx, 16);
  ctx.lineTo(cx + 3, 22);
  ctx.closePath();
  ctx.fill();
  
  // 火焰核心
  drawPixelRect(ctx, cx - 1, 14, 2, 6, '#fef08a', ps);

  return canvas;
}

// 导出所有精灵生成函数
export const SpriteGenerators = {
  knight: generateKnightSprite,
  slime: generateSlimeSprite,
  skeleton: generateSkeletonSprite,
  bat: generateBatSprite,
  goblin: generateGoblinSprite,
  dragon: generateDragonSprite,
  golem: generateGolemSprite,
  ghost: generateGhostSprite,
  ore: generateOreSprite,
  flame: generateFlameSprite,
};

// 根据怪物名称获取对应的精灵生成器
export function getMonsterSpriteGenerator(name: string): (() => HTMLCanvasElement) | null {
  const nameMap: Record<string, keyof typeof SpriteGenerators> = {
    '蝙蝠': 'bat',
    '史莱姆': 'slime',
    '骷髅': 'skeleton',
    '地精': 'goblin',
    '龙': 'dragon',
    '魔像': 'golem',
    '幽灵': 'ghost',
    '巨龙': 'dragon',
    '石魔': 'golem',
  };

  for (const [key, generator] of Object.entries(nameMap)) {
    if (name.includes(key)) {
      return () => SpriteGenerators[generator](64);
    }
  }

  return null;
}

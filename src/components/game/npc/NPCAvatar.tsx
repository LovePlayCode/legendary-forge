import { useEffect, useRef, useMemo } from 'react';
import { NPCProfession, NPCQuality } from '@/types/game';
import { qualityConfig } from '@/data/hiredNpcs';

interface NPCAvatarProps {
  profession: NPCProfession;
  quality: NPCQuality;
  experienceLevel?: number;
  size?: number;
  seed?: string; // 用于生成一致的随机特征
}

// 像素画调色板
const PALETTE = {
  skin: {
    light: ['#f5e0d3', '#eacbb8', '#d9a77a', '#c18a63'], // 亮肤色 -> 暗阴影
    tan: ['#f1c27d', '#e0ac69', '#c68e52', '#a06a38'],   // 棕褐色
    dark: ['#8d5524', '#6e3b15', '#52280d', '#3a1a08'],   // 深色
    pale: ['#fff0e5', '#ead4c6', '#d6b8a8', '#bf9e8f'],  // 苍白
  },
  hair: {
    brown: ['#6a4a3a', '#523629', '#3d251a'],
    blonde: ['#e6c86e', '#cba54b', '#a88332'],
    black: ['#2c2c2c', '#1a1a1a', '#0d0d0d'],
    red: ['#b5523a', '#943b25', '#722613'],
    grey: ['#a8a8a8', '#858585', '#636363'],
    white: ['#f0f0f0', '#dcdcdc', '#c0c0c0'],
  },
  clothes: {
    red: ['#e6482e', '#c12e17', '#961b08'],
    blue: ['#387db8', '#255c8f', '#164069'],
    green: ['#4b9e46', '#357a31', '#23591e'],
    purple: ['#8d4ca8', '#6e3085', '#501d63'],
    brown: ['#8f563b', '#6b3e28', '#4d2a19'],
    grey: ['#8595a1', '#60707d', '#43505c'],
    gold: ['#ffd700', '#d4af37', '#aa8c2c'],
    silver: ['#c0c0c0', '#a9a9a9', '#808080'],
    black: ['#333333', '#222222', '#111111'],
  },
  metal: {
    silver: ['#e6e8eb', '#b0b5bd', '#7a818c', '#4d535c'],
    gold: ['#fff4a3', '#f2cf55', '#d1a62a', '#967114'],
    dark: ['#5c6166', '#3f4347', '#2b2e31', '#1a1c1e'],
  }
};

// 伪随机数生成器
const mulberry32 = (a: number) => {
  return () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// 字符串转数字种子
const stringToSeed = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash + Date.now(); // 简单起见，这里实际上可能需要稳定的种子，如果传入seed则用seed
};

// 绘制单个像素
const drawPixel = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, pixelSize: number) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
};

// 绘制矩形区域
const drawRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, pixelSize: number) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * pixelSize, y * pixelSize, w * pixelSize, h * pixelSize);
};

export const NPCAvatar = ({
  profession,
  quality,
  experienceLevel = 1,
  size = 128,
  seed,
}: NPCAvatarProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 生成稳定的随机特征
  const features = useMemo(() => {
    const s = seed ? stringToSeed(seed) : Math.floor(Math.random() * 1000000);
    const rand = mulberry32(s);
    
    // 随机选择特征
    const skinType = Object.keys(PALETTE.skin)[Math.floor(rand() * Object.keys(PALETTE.skin).length)] as keyof typeof PALETTE.skin;
    const hairColor = Object.keys(PALETTE.hair)[Math.floor(rand() * Object.keys(PALETTE.hair).length)] as keyof typeof PALETTE.hair;
    
    return {
      skinType,
      hairColor,
      hairStyle: Math.floor(rand() * 5),
      hasBeard: rand() > 0.7 && profession !== 'mage', // 法师通常有胡子，单独处理
      eyeColor: rand() > 0.5 ? '#3a2418' : (rand() > 0.5 ? '#2c3e50' : '#27ae60'),
      accessory: rand() > 0.8,
    };
  }, [profession, seed]); // Removed 'quality' from dependency as it doesn't affect physical features directly

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置像素渲染
    ctx.imageSmoothingEnabled = false;

    // 网格系统：32x32 的网格
    const GRID_SIZE = 24; // 使用 24x24 看起来更复古且细节适中
    const pixelSize = size / GRID_SIZE;

    // 清空
    ctx.clearRect(0, 0, size, size);

    // 1. 背景 (基于品质)
    const qualityColor = qualityConfig[quality].color;
    
    // 径向渐变背景
    const bgGradient = ctx.createRadialGradient(size/2, size/2, size/4, size/2, size/2, size/1.2);
    bgGradient.addColorStop(0, '#e8e8e8');
    bgGradient.addColorStop(1, qualityColor + '40'); // 25% 透明度的品质色
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, size, size);

    // 2. 身体绘制辅助函数
    const drawSprite = () => {
      const { skinType, hairColor } = features;
      const skin = PALETTE.skin[skinType];
      const hair = PALETTE.hair[hairColor];
      
      const cx = GRID_SIZE / 2; // 中心 X
      const cy = GRID_SIZE / 2; // 中心 Y

      // --- 身体/衣服 (Layer 1) ---
      let clothesMain, clothesShadow, clothesHighlight;
      
      switch (profession) {
        case 'knight':
          clothesMain = PALETTE.metal.silver[1];
          clothesShadow = PALETTE.metal.silver[2];
          clothesHighlight = PALETTE.metal.silver[0];
          break;
        case 'mage':
          clothesMain = PALETTE.clothes.purple[1];
          clothesShadow = PALETTE.clothes.purple[2];
          clothesHighlight = PALETTE.clothes.purple[0];
          break;
        case 'merchant':
          clothesMain = PALETTE.clothes.red[1];
          clothesShadow = PALETTE.clothes.red[2];
          clothesHighlight = PALETTE.clothes.red[0];
          break;
        case 'adventurer':
          clothesMain = PALETTE.clothes.brown[1];
          clothesShadow = PALETTE.clothes.brown[2];
          clothesHighlight = PALETTE.clothes.brown[0];
          break;
        default:
          clothesMain = PALETTE.clothes.blue[1];
          clothesShadow = PALETTE.clothes.blue[2];
          clothesHighlight = PALETTE.clothes.blue[0];
      }

      // 肩膀/躯干
      drawRect(ctx, cx - 5, cy + 4, 10, 8, clothesMain, pixelSize);
      // 阴影
      drawRect(ctx, cx - 5, cy + 5, 2, 7, clothesShadow, pixelSize); // 左侧阴影
      drawRect(ctx, cx + 3, cy + 5, 2, 7, clothesShadow, pixelSize); // 右侧阴影
      // 高光
      drawRect(ctx, cx - 2, cy + 4, 4, 2, clothesHighlight, pixelSize); // 胸部高光

      // 职业特色服装细节
      if (profession === 'knight') {
        // 肩甲
        drawRect(ctx, cx - 6, cy + 3, 3, 3, PALETTE.metal.gold[1], pixelSize);
        drawRect(ctx, cx + 3, cy + 3, 3, 3, PALETTE.metal.gold[1], pixelSize);
        // 纹章
        drawRect(ctx, cx - 1, cy + 6, 2, 2, PALETTE.clothes.red[1], pixelSize);
      } else if (profession === 'mage') {
        // 长袍领口
        drawRect(ctx, cx - 2, cy + 4, 4, 4, PALETTE.clothes.gold[1], pixelSize);
      } else if (profession === 'merchant') {
        // 项链
        drawRect(ctx, cx - 2, cy + 4, 4, 1, PALETTE.metal.gold[0], pixelSize);
        drawRect(ctx, cx - 1, cy + 5, 2, 1, PALETTE.metal.gold[1], pixelSize);
      } else if (profession === 'adventurer') {
        // 围巾/背带
        drawRect(ctx, cx - 4, cy + 4, 2, 8, PALETTE.clothes.brown[2], pixelSize);
      }

      // --- 头部 (Layer 2) ---
      // 脸部轮廓
      drawRect(ctx, cx - 3, cy - 4, 6, 7, skin[0], pixelSize); // 主肤色
      drawRect(ctx, cx - 4, cy - 3, 8, 5, skin[0], pixelSize); // 宽脸
      
      // 脸部阴影 (下巴)
      drawRect(ctx, cx - 2, cy + 2, 4, 1, skin[1], pixelSize);
      
      // 耳朵
      drawPixel(ctx, cx - 5, cy - 1, skin[1], pixelSize);
      drawPixel(ctx, cx + 4, cy - 1, skin[1], pixelSize);

      // --- 五官 (Layer 3) ---
      // 眼睛
      const eyeColor = features.eyeColor;
      drawPixel(ctx, cx - 2, cy - 1, eyeColor, pixelSize);
      drawPixel(ctx, cx + 1, cy - 1, eyeColor, pixelSize);
      // 眼白/高光
      // drawPixel(ctx, cx - 2, cy - 1, '#ffffff', pixelSize); 
      
      // 眉毛
      drawRect(ctx, cx - 3, cy - 3, 2, 1, hair[1], pixelSize);
      drawRect(ctx, cx + 1, cy - 3, 2, 1, hair[1], pixelSize);

      // 嘴巴
      if (Math.random() > 0.5) {
        drawRect(ctx, cx - 1, cy + 1, 2, 1, '#a06a38', pixelSize); // 微笑
      } else {
        drawPixel(ctx, cx, cy + 1, '#a06a38', pixelSize); // 小嘴
      }

      // 腮红
      drawPixel(ctx, cx - 3, cy, '#ffb6c1', pixelSize);
      drawPixel(ctx, cx + 2, cy, '#ffb6c1', pixelSize);

      // 胡子
      if (features.hasBeard || profession === 'mage') {
        const beardColor = profession === 'mage' ? PALETTE.hair.white[1] : hair[1];
        if (profession === 'mage') {
          // 长胡子
          drawRect(ctx, cx - 2, cy + 2, 4, 3, beardColor, pixelSize);
          drawRect(ctx, cx - 1, cy + 5, 2, 2, beardColor, pixelSize);
        } else {
          // 短胡子
          drawRect(ctx, cx - 3, cy + 1, 6, 2, beardColor, pixelSize);
          drawRect(ctx, cx - 2, cy + 3, 4, 1, beardColor, pixelSize);
        }
      }

      // --- 头发/头盔 (Layer 4) ---
      if (profession === 'knight') {
        // 骑士头盔
        const helmetMain = PALETTE.metal.silver[1];
        const helmetShadow = PALETTE.metal.silver[2];
        const helmetLight = PALETTE.metal.silver[0];
        
        // 头盔主体
        drawRect(ctx, cx - 4, cy - 6, 8, 4, helmetMain, pixelSize);
        drawRect(ctx, cx - 4, cy - 2, 1, 4, helmetMain, pixelSize); // 侧面护甲
        drawRect(ctx, cx + 3, cy - 2, 1, 4, helmetMain, pixelSize); // 侧面护甲

        // 阴影
        drawRect(ctx, cx - 4, cy - 2, 1, 1, helmetShadow, pixelSize);
        drawRect(ctx, cx + 3, cy - 2, 1, 1, helmetShadow, pixelSize);
        
        // 顶饰
        drawRect(ctx, cx - 1, cy - 7, 2, 1, PALETTE.clothes.red[1], pixelSize);
        drawRect(ctx, cx, cy - 8, 1, 1, PALETTE.clothes.red[0], pixelSize);
        
        // 高光
        drawRect(ctx, cx - 2, cy - 5, 2, 2, helmetLight, pixelSize);
        
      } else if (profession === 'mage') {
        // 法师帽
        const hatColor = PALETTE.clothes.purple[2];
        const hatLight = PALETTE.clothes.purple[1];
        
        // 帽檐
        drawRect(ctx, cx - 5, cy - 4, 10, 1, hatColor, pixelSize);
        // 帽锥
        drawRect(ctx, cx - 3, cy - 6, 6, 2, hatColor, pixelSize);
        drawRect(ctx, cx - 2, cy - 8, 4, 2, hatColor, pixelSize);
        drawRect(ctx, cx - 1, cy - 10, 2, 2, hatLight, pixelSize); // 顶部折叠
        
      } else if (profession === 'merchant') {
        // 商人头巾
        const hatColor = PALETTE.clothes.red[1];
        drawRect(ctx, cx - 4, cy - 5, 8, 3, hatColor, pixelSize);
        // 宝石
        drawPixel(ctx, cx, cy - 4, PALETTE.metal.gold[0], pixelSize);
        
      } else if (profession === 'adventurer') {
        // 兜帽/头巾
        const hoodColor = PALETTE.clothes.green[2];
        drawRect(ctx, cx - 4, cy - 5, 8, 2, hoodColor, pixelSize);
        // 两侧头发
        drawRect(ctx, cx - 5, cy - 3, 1, 4, hair[0], pixelSize);
        drawRect(ctx, cx + 4, cy - 3, 1, 4, hair[0], pixelSize);
      } else {
        // 普通发型
        // 顶部
        drawRect(ctx, cx - 4, cy - 5, 8, 2, hair[0], pixelSize);
        // 刘海
        drawRect(ctx, cx - 3, cy - 3, 2, 1, hair[0], pixelSize);
        drawRect(ctx, cx + 2, cy - 3, 1, 1, hair[0], pixelSize);
        // 侧面
        drawRect(ctx, cx - 5, cy - 4, 1, 5, hair[1], pixelSize);
        drawRect(ctx, cx + 4, cy - 4, 1, 5, hair[1], pixelSize);
      }
      
      // 3. 装饰品与光效
      // 轮廓描边 (可选，为了增强清晰度)
      // 使用半透明黑色描绘关键部位的阴影
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      drawRect(ctx, cx - 3, cy + 2, 6, 1, 'rgba(0,0,0,0.1)', pixelSize); // 脖子阴影
    };

    drawSprite();

    // 4. 品质边框和特效
    // 边框
    ctx.strokeStyle = qualityColor;
    ctx.lineWidth = Math.max(2, size / 20);
    ctx.strokeRect(0, 0, size, size);
    
    // 内发光
    if (quality === 'legendary' || quality === 'epic') {
        ctx.globalCompositeOperation = 'overlay';
        const shineGrad = ctx.createLinearGradient(0, 0, size, size);
        shineGrad.addColorStop(0, 'rgba(255,255,255,0)');
        shineGrad.addColorStop(0.5, 'rgba(255,255,255,0.3)');
        shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = shineGrad;
        ctx.fillRect(0, 0, size, size);
        ctx.globalCompositeOperation = 'source-over';
    }

    // 5. 经验等级星星
    if (experienceLevel > 0) {
        const starSize = size / 6;
        const padding = size / 16;
        const starX = size - starSize - padding;
        const starY = padding + starSize/2;
        
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        
        // 画五角星
        ctx.beginPath();
        ctx.fillStyle = '#ffd700'; // 金色
        const spikes = 5;
        const outerRadius = starSize / 2;
        const innerRadius = starSize / 4;
        
        for(let i=0; i<spikes*2; i++){
            const r = (i % 2 === 0) ? outerRadius : innerRadius;
            const angle = (Math.PI / spikes) * i - Math.PI/2;
            const x = starX + Math.cos(angle) * r;
            const y = starY + Math.sin(angle) * r;
            if(i===0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 等级数字
        ctx.fillStyle = '#3d2817';
        ctx.font = `bold ${Math.max(8, starSize * 0.7)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(experienceLevel.toString(), starX, starY + 1);
        
        ctx.restore();
    }

  }, [profession, quality, experienceLevel, size, features]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg shadow-md bg-[#2a2a2a]"
      style={{
        imageRendering: 'pixelated', // 关键 CSS 属性，确保像素清晰不模糊
        width: size,
        height: size,
      }}
    />
  );
};

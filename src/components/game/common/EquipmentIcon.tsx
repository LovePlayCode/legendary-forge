import { useEffect, useRef, useMemo } from 'react';
import type { EquipmentType, Quality } from '@/types/game';

interface EquipmentIconProps {
  type: EquipmentType;
  quality?: Quality;
  size?: number;
  className?: string;
  seed?: string; // Add seed prop for consistent generation
}

// --- Constants & Config ---

const GRID_SIZE = 32; // Standard pixel art icon size

// Enhanced Palettes
const PALETTE = {
  metal: {
    iron: { base: '#8b929c', light: '#c0c5ce', shadow: '#3e4146', outline: '#26292e' },
    steel: { base: '#a1b2c1', light: '#cfdee9', shadow: '#4a5259', outline: '#2f353b' },
    silver: { base: '#e6e8eb', light: '#ffffff', shadow: '#7a818c', outline: '#4d535c' },
    gold: { base: '#f5bd25', light: '#ffeb94', shadow: '#967114', outline: '#664a02' },
    mythril: { base: '#61a6c1', light: '#a9e1f2', shadow: '#1f3640', outline: '#122026' },
    adamantite: { base: '#7a6685', light: '#9b84ab', shadow: '#4a3d52', outline: '#2d2433' },
  },
  wood: {
    oak: { base: '#8a624d', light: '#b38d78', shadow: '#5c4033', outline: '#38261e' },
    mahogany: { base: '#733a26', light: '#9c543b', shadow: '#4a2518', outline: '#2e160e' },
    ebony: { base: '#424242', light: '#5e5e5e', shadow: '#2b2b2b', outline: '#1a1a1a' },
  },
  fabric: {
    rough: { base: '#8a6a4d', light: '#b38e6b', shadow: '#5c4533', outline: '#382a1e' }, // Burlap/Leather
    fine_red: { base: '#b33939', light: '#e66767', shadow: '#7a2626', outline: '#4d1818' },
    fine_blue: { base: '#3960b3', light: '#6791e6', shadow: '#26407a', outline: '#18284d' },
    fine_green: { base: '#39b348', light: '#67e679', shadow: '#267a30', outline: '#184d1e' },
    fine_purple: { base: '#8529cf', light: '#bb6bff', shadow: '#5a1c8a', outline: '#320f4d' },
  },
  gem: {
    ruby: '#ff4d4d',
    sapphire: '#4d79ff',
    emerald: '#4dff88',
    topaz: '#ffdf4d',
    amethyst: '#b34dff',
    diamond: '#e6ffff',
  },
  quality: {
    poor: '#a0a0a0',
    common: '#ffffff',
    uncommon: '#1eff00',
    rare: '#0070dd',
    epic: '#a335ee',
    legendary: '#ff8000',
    mythic: '#ff0000',
  }
};

// Quality to Material Tier Mapping
const getMaterialTier = (quality: Quality, type: 'metal' | 'wood' | 'fabric') => {
  if (type === 'metal') {
    switch (quality) {
      case 'poor': return PALETTE.metal.iron;
      case 'common': return PALETTE.metal.iron;
      case 'uncommon': return PALETTE.metal.steel;
      case 'rare': return PALETTE.metal.silver;
      case 'epic': return PALETTE.metal.gold;
      case 'legendary': return PALETTE.metal.mythril;
      case 'mythic': return PALETTE.metal.adamantite;
    }
  }
  if (type === 'wood') {
    switch (quality) {
      case 'poor': case 'common': return PALETTE.wood.oak;
      case 'uncommon': case 'rare': return PALETTE.wood.mahogany;
      default: return PALETTE.wood.ebony;
    }
  }
  // Default to fabric mapping logic inside generators
  return PALETTE.fabric.rough;
};

// --- Utils ---

// Seeded RNG
const mulberry32 = (a: number) => {
  return () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const stringToSeed = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

// Canvas Helpers
const drawPixel = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
};

const drawRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
};

// Dithering for texture
const dither = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, density: number = 0.3, rand: () => number) => {
  ctx.fillStyle = color;
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      if (rand() < density) {
        ctx.fillRect(Math.floor(i), Math.floor(j), 1, 1);
      }
    }
  }
};

// Outline Helper
const outlineShape = (ctx: CanvasRenderingContext2D, width: number, height: number, color: string) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const newImageData = ctx.createImageData(width, height);
  const newData = newImageData.data;

  const getAlpha = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return 0;
    return data[(y * width + x) * 4 + 3];
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha === 0) {
        // Check neighbors
        if (getAlpha(x + 1, y) > 0 || getAlpha(x - 1, y) > 0 || getAlpha(x, y + 1) > 0 || getAlpha(x, y - 1) > 0) {
          newData[(y * width + x) * 4] = parseInt(color.slice(1, 3), 16);
          newData[(y * width + x) * 4 + 1] = parseInt(color.slice(3, 5), 16);
          newData[(y * width + x) * 4 + 2] = parseInt(color.slice(5, 7), 16);
          newData[(y * width + x) * 4 + 3] = 255;
        }
      }
    }
  }
  
  // Composite outline behind
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  tempCanvas.getContext('2d')?.putImageData(newImageData, 0, 0);
  
  ctx.globalCompositeOperation = 'destination-over';
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
};

// --- Generators ---

// Generic Weapon Generator (Sword, Dagger, Axe, etc.)
const drawWeapon = (ctx: CanvasRenderingContext2D, type: EquipmentType, quality: Quality, rand: () => number) => {
  const metal = getMaterialTier(quality, 'metal');
  const wood = getMaterialTier(quality, 'wood');
  const gemColor = Object.values(PALETTE.gem)[Math.floor(rand() * Object.values(PALETTE.gem).length)];
  
  const cx = 16;
  const cy = 16;

  if (type === 'sword' || type === 'dagger') {
    const isDagger = type === 'dagger';
    const bladeLen = isDagger ? 10 + Math.floor(rand() * 4) : 16 + Math.floor(rand() * 6);
    const bladeWidth = isDagger ? 2 : 2 + Math.floor(rand() * 2);
    const hiltLen = isDagger ? 4 : 5 + Math.floor(rand() * 2);
    
    // Blade
    ctx.fillStyle = metal.base;
    for(let i=0; i<bladeLen; i++) {
        // Tapering
        let w = bladeWidth;
        if (i > bladeLen - 3) w = Math.max(1, w - 1); // Tip
        const bx = cx - w/2 + (rand() * 0.5); // Micro-variation
        drawRect(ctx, Math.floor(bx), cy - hiltLen - i, w, 1, metal.base);
        // Shine/Reflection
        if (i < bladeLen - 2) drawRect(ctx, Math.floor(bx) + 1, cy - hiltLen - i, 1, 1, metal.light);
    }

    // Guard
    const guardWidth = isDagger ? 4 + rand()*2 : 6 + rand()*4;
    const guardY = cy - hiltLen;
    drawRect(ctx, cx - guardWidth/2, guardY, guardWidth, 2, metal.shadow);
    drawRect(ctx, cx - guardWidth/2 + 1, guardY + 0.5, guardWidth - 2, 1, metal.base);

    // Hilt
    drawRect(ctx, cx - 1, cy - hiltLen + 2, 2, hiltLen, wood.base);
    dither(ctx, cx - 1, cy - hiltLen + 2, 2, hiltLen, wood.shadow, 0.3, rand);

    // Pommel
    drawRect(ctx, cx - 1.5, cy, 3, 2, metal.base);
    if (['rare', 'epic', 'legendary', 'mythic'].includes(quality)) {
        drawPixel(ctx, cx, cy + 0.5, gemColor);
    }
  }
  
  if (type === 'axe' || type === 'hammer' || type === 'spear' || type === 'staff') {
     // Pole/Handle
     const poleLen = type === 'spear' || type === 'staff' ? 26 : 20;
     const poleWidth = 2;
     drawRect(ctx, cx - poleWidth/2, cy - poleLen/2 + 4, poleWidth, poleLen, wood.base);
     dither(ctx, cx - poleWidth/2, cy - poleLen/2 + 4, poleWidth, poleLen, wood.shadow, 0.3, rand);
     
     // Head
     if (type === 'axe') {
        const headW = 10;
        const headH = 8;
        const headY = cy - poleLen/2 + 6;
        // Double bit or Single bit
        const doubleBit = rand() > 0.5;
        
        // Right blade
        drawRect(ctx, cx + 1, headY - headH/2, headW/2, headH, metal.base);
        drawRect(ctx, cx + 1 + headW/2 - 1, headY - headH/2, 1, headH, metal.light); // Edge
        
        // Left blade
        if (doubleBit) {
            drawRect(ctx, cx - 1 - headW/2, headY - headH/2, headW/2, headH, metal.base);
            drawRect(ctx, cx - 1 - headW/2, headY - headH/2, 1, headH, metal.light); // Edge
        } else {
             drawRect(ctx, cx - 3, headY - headH/4, 3, headH/2, metal.shadow); // Back
        }
     }
     
     if (type === 'hammer') {
        const headW = 10;
        const headH = 6;
        const headY = cy - poleLen/2 + 6;
        drawRect(ctx, cx - headW/2, headY - headH/2, headW, headH, metal.base);
        drawRect(ctx, cx - headW/2 + 1, headY - headH/2 + 1, headW - 2, headH - 2, metal.light);
        // Bands
        drawRect(ctx, cx - headW/2 + 3, headY - headH/2, 1, headH, metal.shadow);
        drawRect(ctx, cx + headW/2 - 4, headY - headH/2, 1, headH, metal.shadow);
     }

     if (type === 'spear') {
        const tipLen = 8;
        const tipY = cy - poleLen/2 + 4;
        // Tip
        for(let i=0; i<tipLen; i++) {
            const w = Math.max(1, 3 - Math.floor(i/2));
            drawRect(ctx, cx - w/2, tipY - i, w, 1, metal.base);
        }
     }
     
     if (type === 'staff') {
         // Orb or Gem
         const orbSize = 5;
         const orbY = cy - poleLen/2 + 2;
         drawRect(ctx, cx - orbSize/2, orbY - orbSize/2, orbSize, orbSize, gemColor);
         drawPixel(ctx, cx - 1, orbY - 1, '#fff'); // Highlight
         // Prongs
         drawRect(ctx, cx - orbSize/2 - 1, orbY, 1, 4, wood.light);
         drawRect(ctx, cx + orbSize/2, orbY, 1, 4, wood.light);
     }
  }

  if (type === 'bow') {
    const bowLen = 24;
    // Draw Curve
    ctx.fillStyle = wood.base;
    for(let i=0; i<=bowLen; i++) {
        const t = i / bowLen;
        const offset = Math.sin(t * Math.PI) * 6;
        drawPixel(ctx, cx - 6 + offset, cy - bowLen/2 + i, wood.base);
        // String
        drawPixel(ctx, cx - 6, cy - bowLen/2 + i, '#dddddd');
    }
    // Grip
    drawRect(ctx, cx - 6 + 6 - 1, cy - 2, 2, 4, getMaterialTier(quality, 'metal').base); // Metal grip
  }
};

const drawArmor = (ctx: CanvasRenderingContext2D, type: EquipmentType, quality: Quality, rand: () => number) => {
    const metal = getMaterialTier(quality, 'metal');
    const fabric = Object.values(PALETTE.fabric)[Math.floor(rand() * Object.values(PALETTE.fabric).length)];
    const cx = 16;
    const cy = 16;

    if (type === 'shield') {
        const shapes = ['round', 'heater'];
        const shape = shapes[Math.floor(rand() * shapes.length)];
        
        if (shape === 'round') {
            const r = 12;
            // Base
            for(let y=-r; y<=r; y++) {
                for(let x=-r; x<=r; x++) {
                    if (x*x + y*y <= r*r) {
                        drawPixel(ctx, cx+x, cy+y, metal.base);
                    }
                }
            }
            // Rim
            for(let y=-r; y<=r; y++) {
                for(let x=-r; x<=r; x++) {
                    if (x*x + y*y <= r*r && x*x + y*y > (r-2)*(r-2)) {
                        drawPixel(ctx, cx+x, cy+y, metal.shadow);
                    }
                }
            }
            // Emblem
            drawRect(ctx, cx - 4, cy - 4, 8, 8, fabric.base);
        } else {
             // Heater shield
             const w = 18;
             const h = 22;
             drawRect(ctx, cx - w/2, cy - h/2, w, h/2, metal.base);
             // Bottom curve approximation
             for(let i=0; i<h/2; i++) {
                 const currentW = w * (1 - i/(h/2));
                 drawRect(ctx, cx - currentW/2, cy + i, currentW, 1, metal.base);
             }
             // Cross pattern
             drawRect(ctx, cx - 2, cy - h/2 + 2, 4, h - 4, fabric.base);
             drawRect(ctx, cx - w/2 + 2, cy - 2, w - 4, 4, fabric.base);
        }
    }
    
    if (type === 'armor' || type === 'cloak') {
        const isCloak = type === 'cloak';
        const baseColor = isCloak ? fabric.base : metal.base;
        const secColor = isCloak ? fabric.shadow : metal.shadow;
        
        // Shoulders
        drawRect(ctx, cx - 9, cy - 10, 6, 4, secColor);
        drawRect(ctx, cx + 3, cy - 10, 6, 4, secColor);
        
        // Body
        drawRect(ctx, cx - 7, cy - 8, 14, 16, baseColor);
        
        // Detail/Folds
        if (isCloak) {
             drawRect(ctx, cx - 4, cy - 6, 2, 14, secColor);
             drawRect(ctx, cx + 2, cy - 6, 2, 14, secColor);
        } else {
             // Chest plate shine
             drawRect(ctx, cx - 4, cy - 4, 4, 4, metal.light);
        }
    }
    
    if (type === 'helmet') {
        drawRect(ctx, cx - 6, cy - 8, 12, 12, metal.base);
        // Visor
        drawRect(ctx, cx - 6, cy - 2, 12, 1, metal.shadow);
        drawRect(ctx, cx - 2, cy - 2, 4, 6, metal.shadow); // Vertical slit
        // Plume?
        if (rand() > 0.5) {
             drawRect(ctx, cx - 2, cy - 12, 4, 4, fabric.base);
        }
    }

    if (type === 'gloves') {
        const color = metal.base;
        // Left glove
        drawRect(ctx, cx - 10, cy - 6, 6, 8, color); // Palm
        drawRect(ctx, cx - 10, cy + 2, 6, 4, metal.shadow); // Cuff
        drawRect(ctx, cx - 4, cy - 4, 2, 4, color); // Thumb
        
        // Right glove
        drawRect(ctx, cx + 4, cy - 6, 6, 8, color);
        drawRect(ctx, cx + 4, cy + 2, 6, 4, metal.shadow);
        drawRect(ctx, cx + 2, cy - 4, 2, 4, color);
    }

    if (type === 'boots') {
        const color = getMaterialTier(quality, 'wood').base; // Leather
        // Left Boot
        drawRect(ctx, cx - 8, cy - 2, 6, 8, color); // Leg
        drawRect(ctx, cx - 10, cy + 6, 8, 4, color); // Foot
        
        // Right Boot
        drawRect(ctx, cx + 2, cy - 2, 6, 8, color);
        drawRect(ctx, cx + 2, cy + 6, 8, 4, color);
    }
};

const drawAccessory = (ctx: CanvasRenderingContext2D, type: EquipmentType, quality: Quality, rand: () => number) => {
    const metal = getMaterialTier(quality, 'metal');
    const gemColor = Object.values(PALETTE.gem)[Math.floor(rand() * Object.values(PALETTE.gem).length)];
    const cx = 16;
    const cy = 16;
    
    if (type === 'ring') {
        // Band
        for(let i=0; i<360; i+=10) {
            const rad = i * Math.PI / 180;
            const x = cx + Math.cos(rad) * 8;
            const y = cy + Math.sin(rad) * 6; // Ellipse
            drawPixel(ctx, x, y, metal.base);
        }
        // Gem
        drawRect(ctx, cx - 3, cy - 8, 6, 6, gemColor);
        drawRect(ctx, cx - 1, cy - 6, 2, 2, '#fff');
    }
    
    if (type === 'amulet') {
         // Chain
        for(let i=0; i<180; i+=15) {
            const rad = (i + 180) * Math.PI / 180;
            const x = cx + Math.cos(rad) * 10;
            const y = cy + Math.sin(rad) * 10 - 5;
            drawPixel(ctx, x, y, metal.base);
        }
        // Pendant
        drawRect(ctx, cx - 4, cy + 4, 8, 8, metal.shadow);
        drawRect(ctx, cx - 2, cy + 6, 4, 4, gemColor);
    }
    
    if (type === 'belt') {
        drawRect(ctx, cx - 14, cy - 2, 28, 4, PALETTE.wood.oak.base); // Leather
        drawRect(ctx, cx - 3, cy - 3, 6, 6, metal.base); // Buckle
    }
};

export const EquipmentIcon = ({ type, quality = 'common', size = 48, className = '', seed }: EquipmentIconProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a stable seed if not provided, or rely on type + quality if no unique seed
  const finalSeed = useMemo(() => {
     if (seed) return stringToSeed(seed);
     return stringToSeed(type + quality + (Math.random())); // Random if no seed
  }, [type, quality, seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset
    ctx.clearRect(0, 0, GRID_SIZE, GRID_SIZE);
    
    // Setup RNG
    const rand = mulberry32(finalSeed);

    // Draw Base
    const categories = {
        weapon: ['sword', 'dagger', 'axe', 'hammer', 'bow', 'staff', 'spear'],
        armor: ['shield', 'armor', 'helmet', 'boots', 'gloves', 'cloak'],
        accessory: ['ring', 'amulet', 'belt']
    };

    if (categories.weapon.includes(type)) {
        drawWeapon(ctx, type, quality, rand);
    } else if (categories.armor.includes(type)) {
        drawArmor(ctx, type, quality, rand);
    } else {
        drawAccessory(ctx, type, quality, rand);
    }

    // --- Post Processing ---

    // 1. Outline (Black/Dark)
    const outlineColor = getMaterialTier(quality, 'metal').outline;
    outlineShape(ctx, GRID_SIZE, GRID_SIZE, outlineColor);

    // 2. Rim Light (Source Atop)
    // Only for Rare+
    if (['rare', 'epic', 'legendary', 'mythic'].includes(quality)) {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        // Draw a gradient or angled rect
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(GRID_SIZE, 0);
        ctx.lineTo(0, GRID_SIZE);
        ctx.fill();
        
        // Reset
        ctx.globalCompositeOperation = 'source-over';
    }

    // 3. Glow for Mythic/Legendary
    if (['legendary', 'mythic'].includes(quality)) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = PALETTE.quality[quality];
        // Redraw outline to cast shadow
        // Hacky way: draw image over itself with shadow
        const temp = document.createElement('canvas');
        temp.width = GRID_SIZE;
        temp.height = GRID_SIZE;
        temp.getContext('2d')?.drawImage(canvas, 0, 0);
        ctx.drawImage(temp, 0, 0);
        ctx.shadowBlur = 0;
    }

  }, [type, quality, finalSeed]);

  return (
    <canvas
      ref={canvasRef}
      width={GRID_SIZE}
      height={GRID_SIZE}
      className={className}
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated', // Essential for crisp pixels
      }}
    />
  );
};

export default EquipmentIcon;

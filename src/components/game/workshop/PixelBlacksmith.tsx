import { useEffect, useRef, useState } from 'react';

interface PixelBlacksmithProps {
  size?: number;
  isForging?: boolean;
  className?: string;
}

// 扩展的高级色板
const PALETTE = {
  skin: {
    base: '#d4a574',
    shadow: '#a06a38',
    darkShadow: '#6e3b15', // 深层阴影
    highlight: '#eacbb8',
    rim: '#fff0e5', // 边缘光
  },
  hair: {
    base: '#4a3c31',
    shadow: '#2a1d15',
    highlight: '#6b5a4a',
  },
  clothes: {
    base: '#3a4a5e',
    shadow: '#1e2836',
    highlight: '#526680',
    dirty: '#2a3644', // 污渍色
  },
  apron: {
    base: '#8b5a2b',
    shadow: '#5e3a17',
    highlight: '#b37840',
    worn: '#6e4420', // 磨损
    stitch: '#d4a574', // 缝线
  },
  metal: {
    base: '#71797e',
    shadow: '#4a4e52',
    highlight: '#b2b6b9',
    shine: '#eef2f3',
    rune: '#00ffff', // 符文光
    runeDim: '#008b8b',
  },
  fire: {
    base: '#ff4500',
    mid: '#ff8c00',
    core: '#ffff00',
  }
};

export const PixelBlacksmith = ({ size = 120, isForging = false, className = '' }: PixelBlacksmithProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);
  const animationRef = useRef<number>();
  const particlesRef = useRef<{x: number, y: number, vx: number, vy: number, life: number, type: 'spark' | 'smoke' | 'rune'}[]>([]);

  useEffect(() => {
    // 增加动画帧率以获得流畅感
    const fps = isForging ? 18 : 8; 
    const interval = 1000 / fps;
    let lastTime = 0;

    const animate = (time: number) => {
      if (time - lastTime >= interval) {
        setFrame((f) => (f + 1) % 24); // 24帧循环，更细腻的动作
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isForging]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    // 使用 64x64 的超高精度像素网格 (原来是 32x32)
    const GRID = 64; 
    
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    
    ctx.scale(dpr * (size / GRID), dpr * (size / GRID));
    ctx.imageSmoothingEnabled = false;

    // 清空
    ctx.clearRect(0, 0, GRID, GRID);

    // ================== 绘图工具 ==================
    const rect = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
    };
    
    // 绘制单个精细像素
    const dot = (x: number, y: number, color: string) => {
      rect(x, y, 1, 1, color);
    };

    // 绘制杂色/纹理
    const dither = (x: number, y: number, w: number, h: number, color: string, density: number) => {
      ctx.fillStyle = color;
      for(let i=0; i<w; i++) {
        for(let j=0; j<h; j++) {
          if ((i + j) % density === 0) rect(x+i, y+j, 1, 1, color);
        }
      }
    };

    // ================== 动画状态机 (24帧) ==================
    // 0-6: 举起 (慢)
    // 7-10: 蓄力 (顶峰悬停)
    // 11: 猛击 (极快)
    // 12-14: 挤压 (落地变形)
    // 15-23: 恢复 (慢)

    let bodyY = 0;
    let hammerAngle = 0;
    
    if (isForging) {
      if (frame <= 6) { // 举起
        const t = frame / 6;
        hammerAngle = -Math.PI/2 * t; // 举到90度
        bodyY = -1 * t;
      } else if (frame <= 10) { // 蓄力
        const t = (frame - 6) / 4;
        hammerAngle = -Math.PI/2 - 0.5 * t; // 向后多蓄力一点
        bodyY = -1 - 0.5 * t; // 身体后仰
      } else if (frame === 11) { // 猛击
        hammerAngle = 0.2; // 稍微过头一点
        bodyY = 3; // 身体猛烈下沉
      } else if (frame <= 14) { // 缓冲
        hammerAngle = 0;
        bodyY = 2;
      } else { // 恢复
        const t = (frame - 15) / 9;
        hammerAngle = 0;
        bodyY = 2 * (1 - t);
      }
    } else {
      // 细腻的呼吸动画
      bodyY = Math.sin(frame / 24 * Math.PI * 2) * 0.8;
      hammerAngle = Math.PI / 8; // 锤子杵在地上
    }

    // ================== 1. 背景层：精细的火炉 ==================
    // 墙壁纹理
    rect(40, 20, 24, 44, '#2d241b'); // 暗部背景
    dither(40, 20, 24, 44, '#3e3226', 3); // 砖块质感
    
    // 炉膛
    rect(44, 34, 16, 20, '#1a1008'); // 黑洞
    // 炉膛边缘的高光
    rect(43, 33, 18, 1, '#5e4b35');
    
    // 火焰核心 (动态)
    const fireH = 2 + Math.random() * 3;
    rect(46, 48 - fireH, 12, fireH + 6, PALETTE.fire.base);
    rect(48, 50 - fireH, 8, fireH + 4, PALETTE.fire.mid);
    rect(50, 52 - fireH, 4, fireH + 2, PALETTE.fire.core);
    
    // 铁砧 (更立体)
    const ax = 10;
    const ay = 46;
    rect(ax, ay, 20, 18, '#2c2c2c'); // 底座深色
    rect(ax+2, ay-2, 16, 4, '#3d3d3d'); // 中段
    rect(ax, ay-6, 20, 4, '#4a4a4a'); // 顶部侧面
    rect(ax, ay-8, 20, 2, '#666666'); // 顶部亮面
    dot(ax+2, ay-7, '#888888'); // 顶部高光点
    dot(ax+18, ay-7, '#888888');
    
    // 剑胚 (发光特效)
    if (isForging) {
      const glow = frame === 11 ? 2 : (frame > 6 && frame < 11 ? 1 : 0); // 击打时闪光
      rect(ax+4, ay-10, 14, 2, frame === 11 ? '#ffffff' : '#ffaa00');
      // 辉光晕
      if (glow) {
        ctx.fillStyle = `rgba(255, 200, 0, 0.3)`;
        ctx.fillRect(ax+2, ay-12, 18, 6);
      }
    } else {
      rect(ax+4, ay-10, 14, 2, '#5a6169'); // 冷铁
    }

    // ================== 2. 角色绘制 (微像素级) ==================
    const cx = 28; // 角色中心
    const cy = 34 + bodyY; // 角色基准Y
    
    // 阴影投射 (脚底)
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(cx, 60, 12, 3, 0, 0, Math.PI*2);
    ctx.fill();

    // --- 后腿 (右) ---
    rect(cx+2, cy+20, 5, 12, PALETTE.clothes.shadow);
    rect(cx+2, cy+32, 6, 3, '#111'); // 鞋

    // --- 身体 (躯干) ---
    // 衣服底色
    rect(cx-8, cy, 14, 22, PALETTE.clothes.base);
    // 肌肉轮廓 (衣服下的)
    rect(cx-8, cy+2, 2, 8, PALETTE.clothes.shadow); // 侧腹阴影
    
    // --- 围裙 (充满细节) ---
    rect(cx-7, cy+4, 12, 18, PALETTE.apron.base);
    // 围裙磨损
    dot(cx-2, cy+10, PALETTE.apron.worn);
    dot(cx+2, cy+15, PALETTE.apron.worn);
    dither(cx-7, cy+18, 12, 4, PALETTE.apron.shadow, 2); // 底部脏污
    // 围裙带子
    rect(cx-7, cy-2, 2, 6, PALETTE.apron.shadow);
    rect(cx+3, cy-2, 2, 6, PALETTE.apron.shadow);
    // 口袋
    rect(cx-5, cy+12, 4, 4, PALETTE.apron.highlight);
    
    // --- 头部 (精修) ---
    const hx = cx - 2;
    const hy = cy - 8;
    
    // 脖子
    rect(hx+1, hy+6, 4, 2, PALETTE.skin.shadow);
    
    // 脸部轮廓
    rect(hx-2, hy, 10, 9, PALETTE.skin.base);
    // 脸部阴影 (立体感)
    rect(hx-2, hy+1, 1, 8, PALETTE.skin.shadow); 
    rect(hx+7, hy+1, 1, 8, PALETTE.skin.shadow);
    rect(hx-1, hy+8, 8, 1, PALETTE.skin.shadow); // 下巴阴影
    
    // 胡子 (大胡子)
    rect(hx-3, hy+5, 12, 5, PALETTE.hair.base);
    rect(hx-1, hy+9, 8, 2, PALETTE.hair.base); // 胡子尖
    // 胡子杂色/高光
    dot(hx, hy+6, PALETTE.hair.highlight);
    dot(hx+4, hy+6, PALETTE.hair.highlight);
    
    // 眼睛 (有神)
    if (isForging && frame === 11) {
       // 用力闭眼
       rect(hx, hy+3, 3, 1, PALETTE.skin.darkShadow);
       rect(hx+5, hy+3, 3, 1, PALETTE.skin.darkShadow);
    } else {
       // 睁眼
       rect(hx, hy+3, 2, 2, '#111');
       rect(hx+5, hy+3, 2, 2, '#111');
       dot(hx, hy+3, '#fff'); // 眼神光
       dot(hx+5, hy+3, '#fff');
    }
    
    // 眉毛
    rect(hx-1, hy+1, 4, 1, PALETTE.hair.shadow);
    rect(hx+4, hy+1, 4, 1, PALETTE.hair.shadow);
    
    // 头巾/头发
    rect(hx-3, hy-2, 12, 4, '#8b0000'); // 红色头巾
    rect(hx+7, hy, 2, 6, '#8b0000'); // 头巾飘带
    // 头巾纹理
    dither(hx-3, hy-2, 12, 4, '#5c0000', 3);

    // --- 前腿 (左) ---
    rect(cx-6, cy+20, 5, 12, PALETTE.clothes.base);
    // 裤子褶皱
    rect(cx-6, cy+20, 5, 2, PALETTE.clothes.shadow); 
    rect(cx-7, cy+32, 6, 3, '#111'); // 鞋

    // --- 手臂系统 (像素级肌肉) ---
    // 肩膀
    const sx = cx - 5;
    const sy = cy + 2;
    // 肌肉肩膀
    rect(sx-2, sy-2, 6, 6, PALETTE.skin.base);
    dot(sx, sy, PALETTE.skin.highlight); // 三角肌高光
    
    // 手臂动力学
    let ex, ey, hdx, hdy; // Elbow, Hand
    
    if (isForging) {
        // 使用更精确的关节位置
        if (frame <= 6) { // 举起
            const t = frame / 6;
            ex = sx - 4 * t; ey = sy - 4 * t;
            hdx = sx + 2 * t; hdy = sy - 10 * t;
        } else if (frame <= 10) { // 蓄力
            ex = sx - 6; ey = sy - 6;
            hdx = sx + 4; hdy = sy - 14;
        } else if (frame === 11) { // 猛击
            ex = sx - 2; ey = sy + 4;
            hdx = sx + 4; hdy = sy + 8;
        } else { // 缓冲/恢复
            const t = frame <= 14 ? 0 : (frame - 15) / 9;
            ex = sx - 2 * (1-t); ey = sy + 4 * (1-t);
            hdx = sx + 4 * (1-t); hdy = sy + 8 * (1-t);
        }
    } else {
        // 闲置
        ex = sx - 2; ey = sy + 4;
        hdx = sx - 2; hdy = sy + 8;
    }

    // 绘制手臂 (用圆角矩形模拟肌肉)
    // 上臂
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = PALETTE.skin.base;
    ctx.beginPath();
    ctx.moveTo(sx + 2, sy + 2);
    ctx.lineTo(ex + 2, ey + 2);
    ctx.stroke();
    
    // 前臂 (更粗壮)
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(ex + 2, ey + 2);
    ctx.lineTo(hdx + 2, hdy + 2);
    ctx.stroke();
    
    // 手套/手
    rect(hdx, hdy, 5, 5, PALETTE.clothes.shadow); // 深色手套

    // --- 传奇之锤 (细节拉满) ---
    ctx.save();
    ctx.translate(hdx + 2, hdy + 2);
    ctx.rotate(hammerAngle);
    
    // 锤柄
    rect(-2, -2, 4, 16, '#4a3c31'); // 木柄
    dither(-2, -2, 4, 16, '#2a1d15', 3); // 木纹
    // 锤柄缠绕
    rect(-2, 8, 4, 4, '#8b5a2b'); 
    
    // 锤头 (更复杂的形状)
    const hammerColor = isForging && frame > 6 && frame < 11 ? '#8a9bb0' : PALETTE.metal.base; // 蓄力时锤头因能量轻微变亮
    
    // 主体
    rect(-6, -8, 12, 8, hammerColor);
    // 亮面
    rect(-5, -7, 10, 2, PALETTE.metal.highlight);
    rect(-6, -8, 2, 8, PALETTE.metal.shadow); // 侧面阴影
    
    // 符文 (发光)
    if (isForging) {
       ctx.fillStyle = frame % 2 === 0 ? PALETTE.metal.rune : PALETTE.metal.runeDim;
       rect(-2, -6, 4, 4, ctx.fillStyle);
       // 符文辉光
       ctx.shadowColor = PALETTE.metal.rune;
       ctx.shadowBlur = 5;
       ctx.fillRect(-1, -5, 2, 2);
       ctx.shadowBlur = 0;
    } else {
       rect(-2, -6, 4, 4, '#4a4e52'); // 暗淡符文
    }
    
    ctx.restore();

    // ================== 3. 光照与特效 (后期处理) ==================
    
    // 边缘光 (Rim Light) - 来自火炉的橙光
    // 简单模拟：在右侧边缘叠加亮橙色
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(255, 100, 0, 0.2)';
    ctx.fillRect(cx, cy-10, 16, 50); // 照亮右半身
    ctx.globalCompositeOperation = 'source-over';

    // 粒子系统
    if (isForging && frame === 11) {
       // 猛击产生大量火花
       for(let i=0; i<8; i++) {
           particlesRef.current.push({
               x: ax + 10, 
               y: ay - 2,
               vx: (Math.random() - 0.5) * 4,
               vy: -(Math.random() * 4 + 2),
               life: 1.0,
               type: 'spark'
           });
       }
    }
    
    // 符文碎片 (蓄力时掉落)
    if (isForging && frame === 9 && Math.random() > 0.5) {
        particlesRef.current.push({
            x: hdx + 10,
            y: hdy - 10,
            vx: (Math.random() - 0.5),
            vy: 0.5,
            life: 0.8,
            type: 'rune'
        });
    }

    // 更新粒子
    particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        
        if (p.type === 'spark') {
            p.vy += 0.2; // 重力
            if (p.y >= 50) p.vy *= -0.6; // 反弹
            ctx.fillStyle = `rgba(255, 200, 0, ${p.life})`;
            ctx.fillRect(p.x, p.y, 1.5, 1.5);
        } else if (p.type === 'rune') {
            ctx.fillStyle = `rgba(0, 255, 255, ${p.life})`;
            ctx.fillRect(p.x, p.y, 1, 1);
        }
        
        return p.life > 0;
    });

  }, [size, frame, isForging]);

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

export default PixelBlacksmith;

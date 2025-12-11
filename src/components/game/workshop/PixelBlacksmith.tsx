import { useEffect, useRef, useState } from 'react';

interface PixelBlacksmithProps {
  size?: number;
  isForging?: boolean;
  className?: string;
}

export const PixelBlacksmith = ({ size = 120, isForging = false, className = '' }: PixelBlacksmithProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    // 动画帧循环 - 增加帧数实现更平滑的动画
    const fps = isForging ? 12 : 8; // 锻造时更快更流畅
    const interval = 1000 / fps;
    let lastTime = 0;

    const animate = (time: number) => {
      if (time - lastTime >= interval) {
        setFrame((f) => (f + 1) % 8);
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

    // 支持高清屏
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // 关闭抗锯齿
    ctx.imageSmoothingEnabled = false;

    // 清空画布
    ctx.clearRect(0, 0, size, size);

    // 像素大小
    const p = Math.max(1, Math.floor(size / 40));
    const cx = size / 2;
    const cy = size / 2;

    // 辅助函数
    const drawPixelRect = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
    };

    // 使用缓动函数计算流畅的动画偏移
    // frame 0-3: 上升，frame 4-7: 下落
    const normalizedFrame = frame % 8;
    
    // 三角形波形 - 上升和下落
    let easeProgress: number;
    if (normalizedFrame < 4) {
      // 上升 - 缓出
      easeProgress = normalizedFrame / 4;
      easeProgress = 1 - Math.pow(1 - easeProgress, 3);
    } else {
      // 下落 - 缓入
      easeProgress = (normalizedFrame - 4) / 4;
      easeProgress = Math.pow(easeProgress, 2);
    }
    
    // 最大偏移距离
    const maxHammerOffset = -5 * p;
    const maxArmOffset = -3 * p;
    const maxBodyOffset = -1 * p;
    
    const hammerOffset = normalizedFrame < 4 ? maxHammerOffset * easeProgress : maxHammerOffset * (1 - easeProgress);
    const armOffset = normalizedFrame < 4 ? maxArmOffset * easeProgress : maxArmOffset * (1 - easeProgress);
    const bodyOffset = normalizedFrame < 4 ? maxBodyOffset * easeProgress * 0.5 : maxBodyOffset * (1 - easeProgress) * 0.5;
    
    // 火花在敲打时（中间两帧）显示
    const sparkFrame = normalizedFrame === 3 || normalizedFrame === 7;

    // ===== 绘制铁砧 =====
    // 铁砧底座
    drawPixelRect(cx - 12 * p, cy + 14 * p, p * 24, p * 6, '#4a4a4a');
    drawPixelRect(cx - 10 * p, cy + 13 * p, p * 20, p, '#5a5a5a');
    drawPixelRect(cx - 10 * p, cy + 12 * p, p * 20, p, '#6a6a6a');
    // 铁砧主体
    drawPixelRect(cx - 8 * p, cy + 8 * p, p * 16, p * 4, '#6a6a6a');
    drawPixelRect(cx - 7 * p, cy + 7 * p, p * 14, p, '#7a7a7a');
    drawPixelRect(cx - 7 * p, cy + 5 * p, p * 14, p * 2, '#8a8a8a');
    // 铁砧顶部工作面
    drawPixelRect(cx - 6 * p, cy + 5 * p, p * 12, p * 2, '#9a9a9a');
    drawPixelRect(cx - 5 * p, cy + 4 * p, p * 10, p, '#aaaaaa');
    // 铁砧高光（顶部）
    drawPixelRect(cx - 4 * p, cy + 5 * p, p * 3, p, '#c0c0c0');
    drawPixelRect(cx - 2 * p, cy + 6 * p, p, p, '#e0e0e0');
    // 铁砧角部
    drawPixelRect(cx - 10 * p, cy + 10 * p, p * 3, p * 2, '#5a5a5a');
    drawPixelRect(cx + 7 * p, cy + 10 * p, p * 3, p * 2, '#5a5a5a');
    // 铁砧烙印（凹陷）
    drawPixelRect(cx - 3 * p, cy + 6 * p, p * 2, p, '#7a7a7a');
    drawPixelRect(cx + p, cy + 7 * p, p * 2, p, '#7a7a7a');

    // ===== 绘制正在锻造的装备（剑） =====
    if (isForging) {
      // 发光的剑坯 - 更生动
      drawPixelRect(cx - 2 * p, cy + 1 * p, p * 4, p * 4, '#ff3300');
      drawPixelRect(cx - p, cy, p * 2, p * 6, '#ff6600');
      drawPixelRect(cx - p * 0.5, cy + p, p, p * 5, '#ffcc00');
      // 冒烟
      drawPixelRect(cx - 3 * p, cy - 2 * p, p, p, '#ffaa00');
      drawPixelRect(cx + 2 * p, cy - 3 * p, p, p, '#ffaa00');
    } else {
      // 冷却的剑 - 灰色
      drawPixelRect(cx - p, cy + 1 * p, p * 2, p * 5, '#a0a0a0');
      drawPixelRect(cx - p * 0.5, cy + 1 * p, p, p * 5, '#c0c0c0');
      // 冷却剑的描边
      drawPixelRect(cx - 2 * p, cy + 2 * p, p, p * 3, '#808080');
      drawPixelRect(cx + p, cy + 2 * p, p, p * 3, '#808080');
    }

    // ===== 绘制铁匠身体 =====
    // 腿部 - 更细致（轻微摇晃）
    const legOffset = bodyOffset * 0.3;
    drawPixelRect(cx - 18 * p + legOffset, cy + 10 * p, p * 4, p * 8, '#5a4a3a');
    drawPixelRect(cx - 14 * p + legOffset, cy + 10 * p, p * 4, p * 8, '#5a4a3a');
    // 腿部高光
    drawPixelRect(cx - 17 * p + legOffset, cy + 10 * p, p, p * 8, '#6a5a4a');
    drawPixelRect(cx - 13 * p + legOffset, cy + 10 * p, p, p * 8, '#6a5a4a');
    // 靴子 - 更大
    drawPixelRect(cx - 19 * p + legOffset, cy + 18 * p, p * 6, p * 3, '#2a1a0a');
    drawPixelRect(cx - 15 * p + legOffset, cy + 18 * p, p * 6, p * 3, '#2a1a0a');
    // 靴子高光
    drawPixelRect(cx - 18 * p + legOffset, cy + 18 * p, p, p * 3, '#4a3a2a');
    drawPixelRect(cx - 14 * p + legOffset, cy + 18 * p, p, p * 3, '#4a3a2a');

    // 身体底层（肌肤色）- 摇晃
    drawPixelRect(cx - 20 * p + bodyOffset, cy - 2 * p + bodyOffset, p * 12, p * 12, '#d4a574');
    // 身体（工作服 - 深棕）
    drawPixelRect(cx - 20 * p + bodyOffset, cy - 4 * p + bodyOffset, p * 12, p * 14, '#6b4423');
    drawPixelRect(cx - 19 * p + bodyOffset, cy - 3 * p + bodyOffset, p * 10, p * 12, '#8b5a2b');
    // 服装褶皱
    drawPixelRect(cx - 20 * p + bodyOffset, cy - p + bodyOffset, p * 12, p, '#5a3a1a');
    drawPixelRect(cx - 20 * p + bodyOffset, cy + 4 * p + bodyOffset, p * 12, p, '#5a3a1a');
    // 围裙 - 黄棕色
    drawPixelRect(cx - 18 * p + bodyOffset, cy + bodyOffset, p * 8, p * 12, '#c9b896');
    drawPixelRect(cx - 18 * p + bodyOffset, cy + bodyOffset, p * 8, p, '#d4a574');
    // 围裙口袋
    drawPixelRect(cx - 14 * p + bodyOffset, cy + 4 * p + bodyOffset, p * 3, p * 3, '#a08050');
    drawPixelRect(cx - 10 * p + bodyOffset, cy + 4 * p + bodyOffset, p * 3, p * 3, '#a08050');
    // 围裙带 - 绳子
    drawPixelRect(cx - 20 * p + bodyOffset, cy - 5 * p + bodyOffset, p * 12, p * 2, '#654321');
    drawPixelRect(cx - 20 * p + bodyOffset, cy - 4 * p + bodyOffset, p, p * 2, '#3a2a1a');
    drawPixelRect(cx - 9 * p + bodyOffset, cy - 4 * p + bodyOffset, p, p * 2, '#3a2a1a');

    // 头部微动（更生动的表现）
    const headBobOffset = bodyOffset * 1.2;
    const headTiltOffset = normalizedFrame < 4 ? (normalizedFrame / 4) * p * 0.5 : ((8 - normalizedFrame) / 4) * p * 0.5;
    
    drawPixelRect(cx - 18 * p + headTiltOffset, cy - 14 * p + headBobOffset, p * 8, p * 10, '#d4a574');
    // 头部轮廓
    drawPixelRect(cx - 19 * p + headTiltOffset, cy - 13 * p + headBobOffset, p, p * 8, '#b8944a');
    drawPixelRect(cx - 10 * p + headTiltOffset, cy - 13 * p + headBobOffset, p, p * 8, '#b8944a');
    // 头发/帽子 - 黑色毛发
    drawPixelRect(cx - 19 * p + headTiltOffset, cy - 16 * p + headBobOffset, p * 10, p * 4, '#2a1a0a');
    drawPixelRect(cx - 18 * p + headTiltOffset, cy - 14 * p + headBobOffset, p * 2, p * 4, '#2a1a0a');
    drawPixelRect(cx - 9 * p + headTiltOffset, cy - 14 * p + headBobOffset, p * 2, p * 4, '#2a1a0a');
    // 帽子细节 - 工作帽
    drawPixelRect(cx - 17 * p + headTiltOffset, cy - 17 * p + headBobOffset, p * 6, p * 2, '#3a2a1a');

    // 眼睛 - 两只眼睛
    drawPixelRect(cx - 16 * p + headTiltOffset, cy - 10 * p + headBobOffset, p * 2, p * 2, '#2a2a2a');
    drawPixelRect(cx - 12 * p + headTiltOffset, cy - 10 * p + headBobOffset, p * 2, p * 2, '#2a2a2a');
    // 眼睛高光 - 显示专注
    drawPixelRect(cx - 15 * p + headTiltOffset, cy - 9 * p + headBobOffset, p, p, '#ffffff');
    drawPixelRect(cx - 11 * p + headTiltOffset, cy - 9 * p + headBobOffset, p, p, '#ffffff');
    // 眉毛
    drawPixelRect(cx - 16 * p + headTiltOffset, cy - 12 * p + headBobOffset, p * 2, p, '#1a0a0a');
    drawPixelRect(cx - 12 * p + headTiltOffset, cy - 12 * p + headBobOffset, p * 2, p, '#1a0a0a');

    // 鼻子
    drawPixelRect(cx - 14 * p + headTiltOffset, cy - 8 * p + headBobOffset, p * 2, p * 2, '#c49860');

    // 胡子 - 更蓬松
    drawPixelRect(cx - 16 * p + headTiltOffset, cy - 6 * p + headBobOffset, p * 2, p * 2, '#5a4a3a');
    drawPixelRect(cx - 13 * p + headTiltOffset, cy - 6 * p + headBobOffset, p * 2, p * 2, '#5a4a3a');
    drawPixelRect(cx - 16 * p + headTiltOffset, cy - 5 * p + headBobOffset, p * 4, p * 2, '#6a5a4a');
    drawPixelRect(cx - 15 * p + headTiltOffset, cy - 4 * p + headBobOffset, p * 2, p, '#5a4a3a');
    drawPixelRect(cx - 12 * p + headTiltOffset, cy - 4 * p + headBobOffset, p * 2, p, '#5a4a3a');

    // ===== 绘制手臂和锤子 =====
    // 肩膀（跟随身体摇晃）
    drawPixelRect(cx - 21 * p + bodyOffset, cy - 2 * p + bodyOffset, p * 3, p * 4, '#8b5a2b');
    drawPixelRect(cx - 10 * p + bodyOffset, cy - 2 * p + bodyOffset, p * 3, p * 4, '#8b5a2b');

    // 后手臂（固定）- 更长更粗
    drawPixelRect(cx - 20 * p + bodyOffset, cy - 2 * p + bodyOffset, p * 8, p * 4, '#d4a574');
    drawPixelRect(cx - 19 * p + bodyOffset, cy - 2 * p + bodyOffset, p * 2, p * 4, '#b8944a');
    // 手
    drawPixelRect(cx - 13 * p + bodyOffset, cy - p + bodyOffset, p * 2, p * 3, '#d4a574');

    // 前手臂（动画）- 流畅的摆动
    const armY = cy - 8 * p + armOffset + bodyOffset;
    drawPixelRect(cx - 14 * p + bodyOffset, armY, p * 8, p * 4, '#d4a574');
    drawPixelRect(cx - 13 * p + bodyOffset, armY, p * 2, p * 4, '#b8944a');
    // 手
    drawPixelRect(cx - 15 * p + bodyOffset, armY - 3 * p, p * 2, p * 3, '#d4a574');

    // 锤子（动画）- 流畅的摆动
    const hammerY = cy - 14 * p + hammerOffset;
    // 锤柄 - 木质
    drawPixelRect(cx - 6 * p, hammerY, p * 2, p * 14, '#8b5a2b');
    drawPixelRect(cx - 5 * p, hammerY, p, p * 14, '#a0522d');
    // 锤柄缠绕
    drawPixelRect(cx - 6 * p, hammerY + 4 * p, p * 2, p * 2, '#654321');
    drawPixelRect(cx - 6 * p, hammerY + 9 * p, p * 2, p * 2, '#654321');
    // 锤头 - 金属（更大的敲打感）
    const hammerHeadSize = normalizedFrame < 4 ? p * 12 + p * 2 * easeProgress : p * 12 + p * 2 * (1 - easeProgress);
    drawPixelRect(cx - 11 * p, hammerY - 4 * p, hammerHeadSize, p * 4, '#5a5a5a');
    drawPixelRect(cx - 10 * p, hammerY - 3 * p, hammerHeadSize - p * 2, p * 2, '#7a7a7a');
    drawPixelRect(cx - 9 * p, hammerY - 1 * p, hammerHeadSize - p * 4, p * 2, '#9a9a9a');
    // 锤头高光 - 反光面
    drawPixelRect(cx - 8 * p, hammerY - 3 * p, p * 3, p, '#d0d0d0');
    drawPixelRect(cx - 7 * p, hammerY - 2 * p, p, p, '#ffffff');
    // 锤头底部装饰带
    drawPixelRect(cx - 10 * p, hammerY + 2 * p, hammerHeadSize - p * 2, p, '#ffc700');

    // ===== 绘制火花（锻造时） =====
    if (isForging && sparkFrame) {
      const sparkColors = ['#ffff00', '#ff9900', '#ff6600', '#ffffff', '#ffcc00'];
      // 随机火花 - 更多
      for (let i = 0; i < 8; i++) {
        const sx = cx + (Math.random() - 0.5) * 20 * p;
        const sy = cy + (Math.random() - 0.5) * 12 * p;
        const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
        const size = Math.random() > 0.5 ? p : p * 0.5;
        drawPixelRect(sx, sy, size, size, color);
      }
      // 密集火花环
      drawPixelRect(cx + 5 * p, cy - 1 * p, p, p, '#ffff00');
      drawPixelRect(cx + 7 * p, cy + 2 * p, p, p, '#ff9900');
      drawPixelRect(cx - 5 * p, cy - 2 * p, p, p, '#ffffff');
      drawPixelRect(cx + 2 * p, cy - 5 * p, p, p, '#ff6600');
      drawPixelRect(cx - 2 * p, cy + 4 * p, p, p, '#ffcc00');
      drawPixelRect(cx + 8 * p, cy - 3 * p, p * 0.5, p * 0.5, '#ffff00');
      drawPixelRect(cx - 6 * p, cy + 3 * p, p * 0.5, p * 0.5, '#ffffff');
    }

    // ===== 绘制火炉（背景） =====
    // 火炉底座 - 石头
    drawPixelRect(cx + 10 * p, cy + 6 * p, p * 10, p * 14, '#4a3a2a');
    drawPixelRect(cx + 11 * p, cy + 7 * p, p * 8, p * 12, '#3a2a1a');
    // 石头纹理
    drawPixelRect(cx + 12 * p, cy + 8 * p, p * 2, p * 2, '#2a1a0a');
    drawPixelRect(cx + 15 * p, cy + 10 * p, p * 2, p * 2, '#2a1a0a');
    drawPixelRect(cx + 12 * p, cy + 14 * p, p * 2, p * 2, '#2a1a0a');
    // 火炉门 - 黑色
    drawPixelRect(cx + 12 * p, cy + 8 * p, p * 6, p * 8, '#1a1a1a');
    drawPixelRect(cx + 13 * p, cy + 9 * p, p * 4, p * 6, '#0a0a0a');
    // 火炉门边框
    drawPixelRect(cx + 12 * p, cy + 8 * p, p * 6, p, '#5a4a3a');
    drawPixelRect(cx + 12 * p, cy + 15 * p, p * 6, p, '#5a4a3a');

    // 火焰 - 随动画帧波动（更生动的节奏感）
    const fireIntensity = normalizedFrame < 4 ? easeProgress : 1 - easeProgress;
    const fireHeight = p * 6 + p * 2 * fireIntensity;
    
    drawPixelRect(cx + 12 * p + p * fireIntensity, cy + 9 * p - p * fireIntensity, p * 4 + p * fireIntensity, p * 4, '#ff3300');
    drawPixelRect(cx + 13 * p + p * fireIntensity * 0.5, cy + 7 * p - p * fireIntensity * 0.5, p * 2 + p * fireIntensity * 0.5, fireHeight, '#ff6600');
    drawPixelRect(cx + 14 * p, cy + 8 * p - p * fireIntensity * 0.3, p, fireHeight * 0.8, '#ffcc00');
    drawPixelRect(cx + 13 * p + p * fireIntensity * 0.5, cy + 6 * p - p * fireIntensity, p * 2, p * 2 + p * fireIntensity, '#ff9933');

    // 烟囱
    drawPixelRect(cx + 13 * p, cy - 2 * p, p * 4, p * 8, '#5a4a3a');
    drawPixelRect(cx + 14 * p, cy - 2 * p, p * 2, p * 8, '#4a3a2a');
    // 烟囱边框
    drawPixelRect(cx + 13 * p, cy - 3 * p, p * 4, p, '#3a2a1a');

    // 烟雾 - 更平滑的飘动效果
    const smokeWave = Math.sin((frame * Math.PI) / 4) * p;
    drawPixelRect(cx + 14 * p + smokeWave, cy - 5 * p - frame * p * 0.3, p * 2, p * 2, '#808080');
    drawPixelRect(cx + 13 * p - smokeWave * 0.5, cy - 8 * p - frame * p * 0.4, p * 2, p * 2, '#a0a0a0');
    drawPixelRect(cx + 15 * p + smokeWave * 0.3, cy - 10 * p - frame * p * 0.5, p, p, '#c0c0c0');

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

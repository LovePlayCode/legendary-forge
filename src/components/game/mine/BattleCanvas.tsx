import { useRef, useEffect, useCallback, useState } from 'react';
import { Monster } from '@/data/mine';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'spark' | 'rock' | 'gold' | 'blood' | 'dust';
}

interface DamageNumber {
  x: number;
  y: number;
  value: number;
  life: number;
  isPlayerDamage: boolean;
}

interface TorchLight {
  x: number;
  y: number;
  intensity: number;
  flickerOffset: number;
}

interface BattleCanvasProps {
  monster: Monster | null;
  playerHp: number;
  maxPlayerHp: number;
  battlePhase: 'idle' | 'fighting' | 'victory' | 'defeat' | 'mining';
  canMine: boolean;
  onAttack: () => void;
  onMine: () => void;
}

export function BattleCanvas({
  monster,
  playerHp,
  maxPlayerHp,
  battlePhase,
  canMine,
  onAttack,
  onMine,
}: BattleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const damageNumbersRef = useRef<DamageNumber[]>([]);
  const torchLightsRef = useRef<TorchLight[]>([]);
  const timeRef = useRef(0);
  const monsterShakeRef = useRef({ x: 0, y: 0, intensity: 0 });
  const playerShakeRef = useRef({ intensity: 0 });
  const lastMonsterHpRef = useRef(monster?.hp || 0);
  const lastPlayerHpRef = useRef(playerHp);
  const [isHovering, setIsHovering] = useState(false);

  // 初始化火把
  useEffect(() => {
    torchLightsRef.current = [
      { x: 60, y: 80, intensity: 1, flickerOffset: 0 },
      { x: 540, y: 80, intensity: 1, flickerOffset: Math.PI },
      { x: 60, y: 280, intensity: 0.7, flickerOffset: Math.PI / 2 },
      { x: 540, y: 280, intensity: 0.7, flickerOffset: Math.PI * 1.5 },
    ];
  }, []);

  // 检测怪物伤害并添加效果
  useEffect(() => {
    if (monster && monster.hp < lastMonsterHpRef.current) {
      const damage = lastMonsterHpRef.current - monster.hp;
      addDamageNumber(300, 140, damage, false);
      monsterShakeRef.current.intensity = 15;
      createBloodParticles(300, 160);
    }
    lastMonsterHpRef.current = monster?.hp || 0;
  }, [monster?.hp]);

  // 检测玩家伤害
  useEffect(() => {
    if (playerHp < lastPlayerHpRef.current) {
      const damage = lastPlayerHpRef.current - playerHp;
      addDamageNumber(300, 320, damage, true);
      playerShakeRef.current.intensity = 10;
      createBloodParticles(300, 350);
    }
    lastPlayerHpRef.current = playerHp;
  }, [playerHp]);

  const addDamageNumber = (x: number, y: number, value: number, isPlayerDamage: boolean) => {
    damageNumbersRef.current.push({
      x: x + (Math.random() - 0.5) * 40,
      y,
      value,
      life: 60,
      isPlayerDamage,
    });
  };

  const createBloodParticles = (x: number, y: number) => {
    for (let i = 0; i < 12; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 3,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        size: 3 + Math.random() * 4,
        color: `hsl(0, 70%, ${40 + Math.random() * 20}%)`,
        type: 'blood',
      });
    }
  };

  const createMiningParticles = useCallback((x: number, y: number) => {
    // 岩石碎片
    for (let i = 0; i < 8; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 8 - 2,
        life: 40 + Math.random() * 20,
        maxLife: 60,
        size: 4 + Math.random() * 6,
        color: `hsl(30, 20%, ${30 + Math.random() * 20}%)`,
        type: 'rock',
      });
    }
    // 火花
    for (let i = 0; i < 12; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 6 - 4,
        life: 20 + Math.random() * 15,
        maxLife: 35,
        size: 2 + Math.random() * 3,
        color: `hsl(${40 + Math.random() * 20}, 100%, ${60 + Math.random() * 30}%)`,
        type: 'spark',
      });
    }
    // 金色粒子
    if (Math.random() > 0.5) {
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: -Math.random() * 5 - 2,
          life: 50 + Math.random() * 30,
          maxLife: 80,
          size: 3 + Math.random() * 4,
          color: `hsl(45, 100%, ${50 + Math.random() * 30}%)`,
          type: 'gold',
        });
      }
    }
  }, []);

  const createDustParticles = useCallback(() => {
    if (Math.random() > 0.95) {
      particlesRef.current.push({
        x: Math.random() * 600,
        y: 380,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.5 - 0.2,
        life: 100 + Math.random() * 100,
        maxLife: 200,
        size: 2 + Math.random() * 3,
        color: 'hsla(30, 20%, 50%, 0.3)',
        type: 'dust',
      });
    }
  }, []);

  // 绘制洞穴背景
  const drawCave = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // 深色洞穴背景渐变
    const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 400);
    bgGradient.addColorStop(0, '#2a2520');
    bgGradient.addColorStop(0.5, '#1a1815');
    bgGradient.addColorStop(1, '#0d0c0a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 岩石纹理
    ctx.save();
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 25; i++) {
      const x = (i * 73) % width;
      const y = (i * 47) % height;
      const size = 20 + (i % 5) * 10;
      ctx.fillStyle = i % 2 === 0 ? '#3a3530' : '#252320';
      ctx.beginPath();
      ctx.ellipse(x, y, size, size * 0.7, (i * 0.5) % Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 火把光源效果
    torchLightsRef.current.forEach((torch) => {
      const flicker = Math.sin(time * 0.1 + torch.flickerOffset) * 0.15 + 0.85;
      const intensity = torch.intensity * flicker;

      // 火把光晕
      const gradient = ctx.createRadialGradient(torch.x, torch.y, 0, torch.x, torch.y, 150 * intensity);
      gradient.addColorStop(0, `rgba(255, 150, 50, ${0.25 * intensity})`);
      gradient.addColorStop(0.3, `rgba(255, 100, 30, ${0.12 * intensity})`);
      gradient.addColorStop(1, 'rgba(255, 80, 20, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 火把火焰
      ctx.save();
      ctx.translate(torch.x, torch.y);
      const flameHeight = 12 + Math.sin(time * 0.2 + torch.flickerOffset) * 4;
      const flameGradient = ctx.createLinearGradient(0, 0, 0, -flameHeight);
      flameGradient.addColorStop(0, '#ff6600');
      flameGradient.addColorStop(0.5, '#ffaa00');
      flameGradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
      ctx.fillStyle = flameGradient;
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.quadraticCurveTo(-2, -flameHeight * 0.5, 0, -flameHeight);
      ctx.quadraticCurveTo(2, -flameHeight * 0.5, 4, 0);
      ctx.fill();
      ctx.restore();
    });

    // 地面
    const groundGradient = ctx.createLinearGradient(0, height - 40, 0, height);
    groundGradient.addColorStop(0, '#3a3530');
    groundGradient.addColorStop(1, '#252320');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, height - 40, width, 40);

    // 地面纹理
    ctx.strokeStyle = '#4a4540';
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 55, height - 40);
      ctx.lineTo(i * 55 + 25, height);
      ctx.stroke();
    }
  }, []);

  // 绘制怪物
  const drawMonster = useCallback((ctx: CanvasRenderingContext2D, time: number, m: Monster) => {
    const centerX = 300 + monsterShakeRef.current.x;
    const centerY = 150 + monsterShakeRef.current.y;

    // 怪物阴影
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 60, 45, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 怪物身体
    ctx.save();
    ctx.translate(centerX, centerY);

    // 呼吸动画
    const breathScale = 1 + Math.sin(time * 0.05) * 0.03;
    ctx.scale(breathScale, breathScale);

    // 根据怪物名称选择颜色
    let bodyColor = '#4CAF50';
    let accentColor = '#81C784';
    let eyeColor = '#fff';

    if (m.name.includes('蝙蝠')) {
      bodyColor = '#5D4037';
      accentColor = '#795548';
      eyeColor = '#FF5722';
    } else if (m.name.includes('蜘蛛') || m.name.includes('蝎子')) {
      bodyColor = '#37474F';
      accentColor = '#546E7A';
      eyeColor = '#F44336';
    } else if (m.name.includes('地精') || m.name.includes('蜥蜴')) {
      bodyColor = '#8BC34A';
      accentColor = '#AED581';
    } else if (m.name.includes('骷髅') || m.name.includes('亡灵')) {
      bodyColor = '#ECEFF1';
      accentColor = '#CFD8DC';
      eyeColor = '#F44336';
    } else if (m.name.includes('巨人') || m.name.includes('魔像') || m.name.includes('石像')) {
      bodyColor = '#607D8B';
      accentColor = '#78909C';
      eyeColor = '#03A9F4';
    } else if (m.name.includes('龙') || m.name.includes('熔岩') || m.name.includes('岩浆')) {
      bodyColor = '#D32F2F';
      accentColor = '#E57373';
      eyeColor = '#FFEB3B';
    } else if (m.name.includes('领主') || m.name.includes('虚空') || m.name.includes('暗影')) {
      bodyColor = '#4A148C';
      accentColor = '#7B1FA2';
      eyeColor = '#FF1744';
    } else if (m.name.includes('史莱姆')) {
      bodyColor = '#4CAF50';
      accentColor = '#81C784';
    } else if (m.name.includes('狼')) {
      bodyColor = '#424242';
      accentColor = '#616161';
      eyeColor = '#FFEB3B';
    } else if (m.name.includes('虫') || m.name.includes('老鼠')) {
      bodyColor = '#6D4C41';
      accentColor = '#8D6E63';
    } else if (m.name.includes('泰坦') || m.name.includes('矿王')) {
      bodyColor = '#FFD700';
      accentColor = '#FFA000';
      eyeColor = '#FF1744';
    }

    // 怪物主体
    const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
    bodyGradient.addColorStop(0, accentColor);
    bodyGradient.addColorStop(1, bodyColor);
    ctx.fillStyle = bodyGradient;

    // 绘制怪物形状
    ctx.beginPath();
    if (m.name.includes('史莱姆')) {
      // 史莱姆 - 水滴形
      ctx.ellipse(0, 10, 40, 30, 0, 0, Math.PI * 2);
    } else if (m.name.includes('蝙蝠')) {
      // 蝙蝠 - 带翅膀
      ctx.ellipse(0, 0, 25, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      const wingFlap = Math.sin(time * 0.15) * 10;
      ctx.moveTo(-25, 0);
      ctx.quadraticCurveTo(-55, -15 + wingFlap, -45, 10);
      ctx.quadraticCurveTo(-35, 0, -25, 0);
      ctx.moveTo(25, 0);
      ctx.quadraticCurveTo(55, -15 + wingFlap, 45, 10);
      ctx.quadraticCurveTo(35, 0, 25, 0);
    } else if (m.name.includes('龙') || m.name.includes('领主') || m.name.includes('泰坦')) {
      // 大型怪物
      ctx.ellipse(0, 0, 50, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      // 角
      ctx.beginPath();
      ctx.moveTo(-20, -30);
      ctx.lineTo(-30, -55);
      ctx.lineTo(-10, -35);
      ctx.moveTo(20, -30);
      ctx.lineTo(30, -55);
      ctx.lineTo(10, -35);
    } else {
      // 默认 - 圆形
      ctx.ellipse(0, 0, 35, 35, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // 怪物眼睛
    ctx.fillStyle = eyeColor;
    const eyeOffset = Math.sin(time * 0.03) * 2;
    ctx.beginPath();
    ctx.arc(-12 + eyeOffset, -8, 7, 0, Math.PI * 2);
    ctx.arc(12 + eyeOffset, -8, 7, 0, Math.PI * 2);
    ctx.fill();

    // 眼珠
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-12 + eyeOffset + 2, -8, 3, 0, Math.PI * 2);
    ctx.arc(12 + eyeOffset + 2, -8, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 怪物血条
    const hpPercent = m.hp / m.maxHp;
    const barWidth = 90;
    const barHeight = 8;
    const barX = centerX - barWidth / 2;
    const barY = centerY - 70;

    // 血条背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.roundRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4, 4);
    ctx.fill();

    // 血条
    const hpGradient = ctx.createLinearGradient(barX, barY, barX + barWidth * hpPercent, barY);
    hpGradient.addColorStop(0, '#ef4444');
    hpGradient.addColorStop(1, '#dc2626');
    ctx.fillStyle = hpGradient;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth * hpPercent, barHeight, 3);
    ctx.fill();

    // 血条边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, 3);
    ctx.stroke();

    // 怪物名字
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.fillText(m.name, centerX, barY - 8);
    ctx.shadowBlur = 0;

    // HP 数字
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#ccc';
    ctx.fillText(`${m.hp}/${m.maxHp}`, centerX, barY + barHeight + 14);
  }, []);

  // 绘制玩家
  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const centerX = 300;
    const centerY = 350;
    const shake = playerShakeRef.current.intensity > 0 ? (Math.random() - 0.5) * playerShakeRef.current.intensity : 0;

    // 玩家阴影
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 25, 25, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 玩家身体
    ctx.save();
    ctx.translate(centerX + shake, centerY);

    // 身体
    const bodyGradient = ctx.createLinearGradient(0, -25, 0, 25);
    bodyGradient.addColorStop(0, '#64B5F6');
    bodyGradient.addColorStop(1, '#1976D2');
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // 头盔
    ctx.fillStyle = '#78909C';
    ctx.beginPath();
    ctx.arc(0, -22, 15, Math.PI, 0);
    ctx.fill();

    // 剑
    const swordAngle = Math.sin(time * 0.1) * 0.1;
    ctx.save();
    ctx.translate(22, -8);
    ctx.rotate(swordAngle - 0.3);
    ctx.fillStyle = '#B0BEC5';
    ctx.fillRect(-2, -35, 4, 30);
    ctx.fillStyle = '#795548';
    ctx.fillRect(-4, -5, 8, 10);
    ctx.restore();

    // 盾牌
    ctx.save();
    ctx.translate(-22, 0);
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(12, -8);
    ctx.lineTo(12, 12);
    ctx.lineTo(0, 20);
    ctx.lineTo(-12, 12);
    ctx.lineTo(-12, -8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    ctx.arc(0, 4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();

    // 玩家血条
    const hpPercent = playerHp / maxPlayerHp;
    const barWidth = 70;
    const barHeight = 6;
    const barX = centerX - barWidth / 2;
    const barY = centerY + 38;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.roundRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4, 3);
    ctx.fill();

    const hpGradient = ctx.createLinearGradient(barX, barY, barX + barWidth * hpPercent, barY);
    hpGradient.addColorStop(0, '#22c55e');
    hpGradient.addColorStop(1, '#16a34a');
    ctx.fillStyle = hpGradient;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth * hpPercent, barHeight, 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, 2);
    ctx.stroke();
  }, [playerHp, maxPlayerHp]);

  // 绘制挖矿场景
  const drawMiningScene = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const centerX = 300;
    const centerY = 180;

    // 矿石
    ctx.save();
    ctx.translate(centerX, centerY);

    // 矿石主体
    const rockGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 55);
    rockGradient.addColorStop(0, '#5D4037');
    rockGradient.addColorStop(0.7, '#3E2723');
    rockGradient.addColorStop(1, '#1B0000');
    ctx.fillStyle = rockGradient;

    ctx.beginPath();
    ctx.moveTo(-45, 25);
    ctx.lineTo(-55, -10);
    ctx.lineTo(-25, -45);
    ctx.lineTo(18, -50);
    ctx.lineTo(50, -18);
    ctx.lineTo(45, 22);
    ctx.lineTo(8, 35);
    ctx.closePath();
    ctx.fill();

    // 矿石闪光点
    const sparklePositions = [
      { x: -18, y: -18 },
      { x: 12, y: -28 },
      { x: 22, y: 0 },
      { x: -32, y: 5 },
      { x: 0, y: 12 },
    ];

    sparklePositions.forEach((pos, i) => {
      const sparkle = Math.sin(time * 0.1 + i) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 215, 0, ${sparkle * 0.8})`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3 + sparkle * 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();

    // 挖矿提示
    if (canMine) {
      const pulseAlpha = Math.sin(time * 0.08) * 0.3 + 0.7;
      ctx.globalAlpha = pulseAlpha;
      ctx.fillStyle = '#FFC107';
      ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText('点击开始挖矿！', centerX, centerY + 85);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // 镐子图标
      ctx.font = '36px sans-serif';
      ctx.fillText('⛏️', centerX, centerY + 125);
    }
  }, [canMine]);

  // 绘制粒子
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // 重力
      p.life--;

      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;

      if (p.type === 'spark') {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'gold') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.size);
        ctx.lineTo(p.x + p.size * 0.5, p.y);
        ctx.lineTo(p.x, p.y + p.size);
        ctx.lineTo(p.x - p.size * 0.5, p.y);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      return p.life > 0;
    });
  }, []);

  // 绘制伤害数字
  const drawDamageNumbers = useCallback((ctx: CanvasRenderingContext2D) => {
    damageNumbersRef.current = damageNumbersRef.current.filter((d) => {
      d.y -= 1.5;
      d.life--;

      const alpha = d.life / 60;
      const scale = 1 + (60 - d.life) * 0.008;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(d.x, d.y);
      ctx.scale(scale, scale);

      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText(`-${d.value}`, 0, 0);
      ctx.fillStyle = d.isPlayerDamage ? '#ef4444' : '#fbbf24';
      ctx.fillText(`-${d.value}`, 0, 0);

      ctx.restore();

      return d.life > 0;
    });
  }, []);

  // 绘制操作按钮
  const drawActionButton = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    if (battlePhase === 'defeat') return;

    const centerX = 300;
    let buttonY = 260;
    let buttonText = '';
    let buttonColor = '';

    if (monster && battlePhase !== 'victory') {
      buttonText = battlePhase === 'fighting' ? '战斗中...' : '⚔️ 攻击';
      buttonColor = battlePhase === 'fighting' ? '#6b7280' : '#ef4444';
    } else if (canMine) {
      buttonText = '⛏️ 挖矿';
      buttonColor = '#f59e0b';
    }

    if (!buttonText) return;

    const buttonWidth = 110;
    const buttonHeight = 36;
    const buttonX = centerX - buttonWidth / 2;

    const hoverScale = isHovering ? 1.05 : 1;
    const pulseScale = 1 + Math.sin(time * 0.1) * 0.015;

    ctx.save();
    ctx.translate(centerX, buttonY + buttonHeight / 2);
    ctx.scale(hoverScale * pulseScale, hoverScale * pulseScale);
    ctx.translate(-centerX, -(buttonY + buttonHeight / 2));

    // 按钮阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.roundRect(buttonX + 3, buttonY + 3, buttonWidth, buttonHeight, 8);
    ctx.fill();

    // 按钮主体
    const btnGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
    btnGradient.addColorStop(0, buttonColor);
    btnGradient.addColorStop(1, adjustColor(buttonColor, -30));
    ctx.fillStyle = btnGradient;
    ctx.beginPath();
    ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
    ctx.fill();

    // 按钮高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight / 2, [8, 8, 0, 0]);
    ctx.fill();

    // 按钮边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
    ctx.stroke();

    // 按钮文字
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.fillText(buttonText, centerX, buttonY + buttonHeight / 2);
    ctx.shadowBlur = 0;

    ctx.restore();
  }, [monster, battlePhase, canMine, isHovering]);

  const adjustColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
    return `rgb(${r}, ${g}, ${b})`;
  };

  // 绘制失败画面
  const drawDefeatScreen = useCallback((ctx: CanvasRenderingContext2D) => {
    // 暗红色遮罩
    ctx.fillStyle = 'rgba(50, 0, 0, 0.75)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 骷髅图标
    ctx.font = '72px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💀', 300, 160);

    // 失败文字
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 28px "Microsoft YaHei", sans-serif';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.fillText('战斗失败', 300, 220);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px "Microsoft YaHei", sans-serif';
    ctx.fillText('你被击败了，需要恢复后再来', 300, 255);
  }, []);

  // 绘制空闲/探索状态
  const drawIdleState = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const centerX = 300;
    const centerY = 180;

    // 探索图标
    const pulseScale = 1 + Math.sin(time * 0.05) * 0.05;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(pulseScale, pulseScale);
    ctx.font = '60px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔍', 0, 0);
    ctx.restore();

    // 提示文字
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('正在探索矿场...', centerX, centerY + 50);

    // 加载动画点
    const dots = Math.floor(time / 30) % 4;
    let dotText = '';
    for (let i = 0; i < dots; i++) {
      dotText += '.';
    }
    ctx.fillText(dotText, centerX + 60, centerY + 50);
  }, []);

  // 处理点击事件
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 按钮区域检测
    const buttonX = 300 - 55;
    const buttonY = 260;
    const buttonWidth = 110;
    const buttonHeight = 36;

    if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
      if (monster && battlePhase !== 'fighting' && battlePhase !== 'victory') {
        onAttack();
      } else if (canMine) {
        createMiningParticles(300, 180);
        onMine();
      }
    }

    // 挖矿场景点击矿石
    if (canMine && !monster) {
      const mineX = 300;
      const mineY = 180;
      const dist = Math.sqrt(Math.pow(x - mineX, 2) + Math.pow(y - mineY, 2));
      if (dist < 60) {
        createMiningParticles(300, 180);
        onMine();
      }
    }
  }, [monster, battlePhase, canMine, onAttack, onMine, createMiningParticles]);

  // 处理鼠标移动
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 按钮区域检测
    const buttonX = 300 - 55;
    const buttonY = 260;
    const buttonWidth = 110;
    const buttonHeight = 36;

    const isOverButton = x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight;
    setIsHovering(isOverButton);
  }, []);

  // 主渲染循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      timeRef.current++;
      const time = timeRef.current;

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新震动效果
      if (monsterShakeRef.current.intensity > 0) {
        monsterShakeRef.current.x = (Math.random() - 0.5) * monsterShakeRef.current.intensity;
        monsterShakeRef.current.y = (Math.random() - 0.5) * monsterShakeRef.current.intensity;
        monsterShakeRef.current.intensity *= 0.9;
        if (monsterShakeRef.current.intensity < 0.5) {
          monsterShakeRef.current.intensity = 0;
          monsterShakeRef.current.x = 0;
          monsterShakeRef.current.y = 0;
        }
      }

      if (playerShakeRef.current.intensity > 0) {
        playerShakeRef.current.intensity *= 0.9;
        if (playerShakeRef.current.intensity < 0.5) {
          playerShakeRef.current.intensity = 0;
        }
      }

      // 绘制洞穴背景
      drawCave(ctx, time);

      // 创建环境粒子
      createDustParticles();

      // 根据状态绘制内容
      if (battlePhase === 'defeat') {
        drawPlayer(ctx, time);
        drawDefeatScreen(ctx);
      } else if (monster) {
        drawMonster(ctx, time, monster);
        drawPlayer(ctx, time);
        drawActionButton(ctx, time);
      } else if (canMine) {
        drawMiningScene(ctx, time);
        drawPlayer(ctx, time);
        drawActionButton(ctx, time);
      } else {
        drawIdleState(ctx, time);
        drawPlayer(ctx, time);
      }

      // 绘制粒子和伤害数字
      drawParticles(ctx);
      drawDamageNumbers(ctx);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    monster,
    battlePhase,
    canMine,
    drawCave,
    drawMonster,
    drawPlayer,
    drawMiningScene,
    drawParticles,
    drawDamageNumbers,
    drawActionButton,
    drawDefeatScreen,
    drawIdleState,
    createDustParticles,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="w-full h-auto rounded-lg cursor-pointer"
      style={{ imageRendering: 'crisp-edges' }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovering(false)}
    />
  );
}

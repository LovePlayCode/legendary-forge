import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { Monster } from '@/data/mine';
import { 
  generateKnightSprite, 
  generateSlimeSprite, 
  generateSkeletonSprite,
  generateBatSprite,
  generateGoblinSprite,
  generateDragonSprite,
  generateGolemSprite,
  generateGhostSprite,
  generateOreSprite,
} from '@/utils/spriteGenerator';

/* eslint-disable @typescript-eslint/no-unused-vars */

interface PhaserBattleProps {
  monster: Monster | null;
  playerHp: number;
  maxPlayerHp: number;
  battlePhase: 'idle' | 'fighting' | 'victory' | 'defeat' | 'mining';
  canMine: boolean;
  onAttack: () => void;
  onMine: () => void;
}

// 怪物外观配置
interface MonsterAppearance {
  bodyColor: number;
  secondaryColor: number;
  eyeColor: number;
  pupilColor: number;
  size: number;
  hasHorns: boolean;
  hasTail: boolean;
  hasWings: boolean;
  hasSpikes: boolean;
  glowColor: number;
  animationSpeed: number;
}

// 战斗场景类
class BattleScene extends Phaser.Scene {
  private monster: Monster | null = null;
  private playerHp: number = 100;
  private maxPlayerHp: number = 100;
  private battlePhase: string = 'idle';
  private canMine: boolean = false;
  private onAttack: (() => void) | null = null;
  private onMine: (() => void) | null = null;

  // 游戏对象
  private playerSprite!: Phaser.GameObjects.Container;
  private playerSword!: Phaser.GameObjects.Container;
  private playerShield!: Phaser.GameObjects.Container;
  private playerLegs!: Phaser.GameObjects.Container;
  private monsterSprite!: Phaser.GameObjects.Container;
  private monsterBody!: Phaser.GameObjects.Container;
  private oreSprite!: Phaser.GameObjects.Container;
  private actionButton!: Phaser.GameObjects.Container;
  private skillButtons!: Phaser.GameObjects.Container;
  private playerHpBar!: Phaser.GameObjects.Graphics;
  private monsterHpBar!: Phaser.GameObjects.Graphics;
  private monsterNameText!: Phaser.GameObjects.Text;
  private monsterHpText!: Phaser.GameObjects.Text;
  private monsterStatsText!: Phaser.GameObjects.Text;
  private torches: Phaser.GameObjects.Container[] = [];
  private defeatOverlay!: Phaser.GameObjects.Container;
  private idleContainer!: Phaser.GameObjects.Container;
  private comboContainer!: Phaser.GameObjects.Container;
  private comboText!: Phaser.GameObjects.Text;
  private battleLog!: Phaser.GameObjects.Container;

  // 粒子发射器
  private bloodEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private sparkEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private rockEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private magicEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private goldEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private slashEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private healEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private shieldEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  // 状态追踪
  private lastMonsterHp: number = 0;
  private lastPlayerHp: number = 0;
  private comboCount: number = 0;
  private lastAttackTime: number = 0;
  private isAttacking: boolean = false;
  private isBlocking: boolean = false;
  private skillCooldowns: Record<string, number> = {};
  private battleMessages: string[] = [];

  // 原始位置记录
  private playerOriginalX: number = 0;
  private playerOriginalY: number = 0;

  // 环境效果
  private ambientParticles: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  private backgroundGlow!: Phaser.GameObjects.Graphics;

  // 当前怪物外观
  private currentMonsterAppearance: MonsterAppearance | null = null;

  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data: {
    monster: Monster | null;
    playerHp: number;
    maxPlayerHp: number;
    battlePhase: string;
    canMine: boolean;
    onAttack: () => void;
    onMine: () => void;
  }) {
    this.monster = data.monster;
    this.playerHp = data.playerHp;
    this.maxPlayerHp = data.maxPlayerHp;
    this.battlePhase = data.battlePhase;
    this.canMine = data.canMine;
    this.onAttack = data.onAttack;
    this.onMine = data.onMine;
    this.lastMonsterHp = data.monster?.hp || 0;
    this.lastPlayerHp = data.playerHp;
    this.comboCount = 0;
    this.isAttacking = false;
    this.isBlocking = false;
    this.skillCooldowns = { power: 0, block: 0, heal: 0 };
    this.battleMessages = [];
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 创建精灵纹理
    this.createSpriteTextures();

    // 创建粒子纹理
    this.createParticleTextures();

    // 创建洞穴背景
    this.createCaveBackground(width, height);

    // 创建火把
    this.createTorches(width, height);

    // 创建粒子系统
    this.createParticleSystems();

    // 创建灰尘粒子
    this.createDustParticles(width, height);

    // 创建玩家
    this.createPlayer(width, height);

    // 创建怪物
    this.createMonster(width, height);

    // 创建矿石
    this.createOre(width, height);

    // 创建操作按钮
    this.createActionButton(width, height);

    // 创建技能按钮
    this.createSkillButtons(width, height);

    // 创建连击显示
    this.createComboDisplay(width, height);

    // 创建战斗日志
    this.createBattleLog(width, height);

    // 创建失败遮罩
    this.createDefeatOverlay(width, height);

    // 创建空闲状态容器
    this.createIdleContainer(width, height);

    // 更新显示状态
    this.updateVisibility();

    // 添加键盘交互
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.handleAction();
    });

    this.input.keyboard?.on('keydown-Q', () => {
      this.usePowerAttack();
    });

    this.input.keyboard?.on('keydown-W', () => {
      this.useBlock();
    });

    this.input.keyboard?.on('keydown-E', () => {
      this.useHeal();
    });

    // 添加点击任意位置攻击
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // 检查是否点击在按钮区域外
      const btnBounds = this.actionButton.getBounds();
      const skillBounds = this.skillButtons.getBounds();
      if (!btnBounds.contains(pointer.x, pointer.y) && !skillBounds.contains(pointer.x, pointer.y)) {
        if (this.monster && this.battlePhase !== 'fighting' && !this.isAttacking) {
          this.handleAction();
        }
      }
    });

    // 技能冷却更新
    this.time.addEvent({
      delay: 100,
      callback: () => this.updateSkillCooldowns(),
      loop: true,
    });
  }

  // 创建精灵纹理 - 使用像素艺术生成器
  private createSpriteTextures() {
    // 骑士精灵
    if (!this.textures.exists('knight')) {
      const knightCanvas = generateKnightSprite(64);
      this.textures.addCanvas('knight', knightCanvas);
    }

    // 矿石精灵
    if (!this.textures.exists('ore')) {
      const oreCanvas = generateOreSprite(64);
      this.textures.addCanvas('ore', oreCanvas);
    }

    // 怪物精灵
    const monsterSprites = [
      { key: 'slime', generator: () => generateSlimeSprite(48) },
      { key: 'skeleton', generator: () => generateSkeletonSprite(56) },
      { key: 'bat', generator: () => generateBatSprite(48) },
      { key: 'goblin', generator: () => generateGoblinSprite(52) },
      { key: 'dragon', generator: () => generateDragonSprite(72) },
      { key: 'golem', generator: () => generateGolemSprite(64) },
      { key: 'ghost', generator: () => generateGhostSprite(52) },
    ];

    monsterSprites.forEach(({ key, generator }) => {
      if (!this.textures.exists(key)) {
        const canvas = generator();
        this.textures.addCanvas(key, canvas);
      }
    });
  }

  private createParticleTextures() {
    // 基础圆形粒子
    if (!this.textures.exists('particle')) {
      const g1 = this.add.graphics();
      g1.fillStyle(0xffffff);
      g1.fillCircle(8, 8, 8);
      g1.generateTexture('particle', 16, 16);
      g1.destroy();
    }

    // 星形粒子
    if (!this.textures.exists('star')) {
      const g2 = this.add.graphics();
      g2.fillStyle(0xffffff);
      g2.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const x = 8 + Math.cos(angle) * 8;
        const y = 8 + Math.sin(angle) * 8;
        if (i === 0) g2.moveTo(x, y);
        else g2.lineTo(x, y);
        const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
        const ix = 8 + Math.cos(innerAngle) * 3;
        const iy = 8 + Math.sin(innerAngle) * 3;
        g2.lineTo(ix, iy);
      }
      g2.closePath();
      g2.fillPath();
      g2.generateTexture('star', 16, 16);
      g2.destroy();
    }

    // 斜线粒子（用于剑气）
    if (!this.textures.exists('slash')) {
      const g3 = this.add.graphics();
      g3.fillStyle(0xffffff);
      g3.fillRect(0, 6, 32, 4);
      g3.generateTexture('slash', 32, 16);
      g3.destroy();
    }

    // 心形粒子（用于治疗）
    if (!this.textures.exists('heart')) {
      const g4 = this.add.graphics();
      g4.fillStyle(0xffffff);
      g4.fillCircle(5, 5, 4);
      g4.fillCircle(11, 5, 4);
      g4.beginPath();
      g4.moveTo(1, 6);
      g4.lineTo(8, 14);
      g4.lineTo(15, 6);
      g4.closePath();
      g4.fillPath();
      g4.generateTexture('heart', 16, 16);
      g4.destroy();
    }

    // 盾形粒子
    if (!this.textures.exists('shield')) {
      const g5 = this.add.graphics();
      g5.fillStyle(0xffffff);
      g5.beginPath();
      g5.moveTo(8, 0);
      g5.lineTo(16, 4);
      g5.lineTo(16, 10);
      g5.lineTo(8, 16);
      g5.lineTo(0, 10);
      g5.lineTo(0, 4);
      g5.closePath();
      g5.fillPath();
      g5.generateTexture('shield', 16, 16);
      g5.destroy();
    }
  }

  private createCaveBackground(width: number, height: number) {
    // 深色背景渐变
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x2a2520, 0x2a2520, 0x0d0c0a, 0x0d0c0a, 1);
    bg.fillRect(0, 0, width, height);

    // 背景光晕效果
    this.backgroundGlow = this.add.graphics();
    this.backgroundGlow.fillStyle(0xff6600, 0.03);
    this.backgroundGlow.fillCircle(width / 2, height / 2, 200);

    // 岩石纹理 - 更多层次
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(15, 60);
      const alpha = Phaser.Math.FloatBetween(0.08, 0.2);
      const color = Phaser.Math.RND.pick([0x3a3530, 0x4a4540, 0x2a2520]);
      const rock = this.add.ellipse(x, y, size, size * 0.7, color, alpha);
      rock.setAngle(Phaser.Math.Between(0, 360));
    }

    // 洞穴边缘阴影
    const edgeShadow = this.add.graphics();
    edgeShadow.fillStyle(0x000000, 0.4);
    edgeShadow.fillRect(0, 0, 30, height);
    edgeShadow.fillRect(width - 30, 0, 30, height);
    edgeShadow.fillRect(0, 0, width, 20);

    // 地面 - 多层次
    const ground = this.add.graphics();
    ground.fillStyle(0x3a3530);
    ground.fillRect(0, height - 45, width, 45);
    ground.fillStyle(0x4a4540);
    ground.fillRect(0, height - 45, width, 5);

    // 地面纹理线条
    const groundLines = this.add.graphics();
    groundLines.lineStyle(1, 0x5a5550, 0.5);
    for (let i = 0; i < 15; i++) {
      groundLines.beginPath();
      groundLines.moveTo(i * 45, height - 45);
      groundLines.lineTo(i * 45 + 20, height);
      groundLines.strokePath();
    }

    // 地面小石子
    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(20, width - 20);
      const y = Phaser.Math.Between(height - 40, height - 10);
      const size = Phaser.Math.Between(3, 8);
      this.add.ellipse(x, y, size, size * 0.6, 0x5a5550, 0.6);
    }
  }

  private createTorches(width: number, _height: number) {
    const torchPositions = [
      { x: 40, y: 60 },
      { x: width - 40, y: 60 },
      { x: 40, y: 220 },
      { x: width - 40, y: 220 },
    ];

    torchPositions.forEach((pos, index) => {
      const torch = this.add.container(pos.x, pos.y);

      // 火把柄
      const handle = this.add.rectangle(0, 18, 8, 35, 0x5d4037);
      torch.add(handle);

      // 火把顶部
      const top = this.add.rectangle(0, 0, 12, 8, 0x8d6e63);
      torch.add(top);

      // 火焰（多层）
      const flame1 = this.add.ellipse(0, -8, 16, 28, 0xff4400, 0.7);
      const flame2 = this.add.ellipse(0, -12, 12, 22, 0xff6600, 0.8);
      const flame3 = this.add.ellipse(0, -15, 8, 16, 0xffaa00, 0.9);
      const flame4 = this.add.ellipse(0, -18, 4, 10, 0xffff00, 1);
      torch.add([flame1, flame2, flame3, flame4]);

      // 光晕
      const glow = this.add.ellipse(0, 0, 180, 180, 0xff6600, 0.08);
      torch.add(glow);
      torch.sendToBack(glow);

      // 火焰动画 - 更自然
      this.tweens.add({
        targets: [flame1, flame2],
        scaleY: { from: 0.85, to: 1.15 },
        scaleX: { from: 0.9, to: 1.1 },
        duration: 150 + index * 30,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.tweens.add({
        targets: [flame3, flame4],
        scaleY: { from: 0.9, to: 1.2 },
        scaleX: { from: 0.95, to: 1.1 },
        y: { from: flame3.y, to: flame3.y - 3 },
        duration: 120 + index * 20,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // 光晕闪烁
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.06, to: 0.12 },
        scale: { from: 0.95, to: 1.08 },
        duration: 250 + index * 80,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.torches.push(torch);
    });
  }

  private createParticleSystems() {
    // 血液粒子 - 更多细节
    this.bloodEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 120, max: 280 },
      angle: { min: 180, max: 360 },
      scale: { start: 0.8, end: 0 },
      lifespan: 700,
      gravityY: 350,
      tint: [0xff4444, 0xcc3333, 0xff6666],
      emitting: false,
    });

    // 火花粒子
    this.sparkEmitter = this.add.particles(0, 0, 'star', {
      speed: { min: 180, max: 350 },
      angle: { min: 200, max: 340 },
      scale: { start: 0.5, end: 0 },
      lifespan: 500,
      gravityY: 250,
      tint: [0xffaa00, 0xff6600, 0xffff00, 0xffffff],
      rotate: { min: 0, max: 360 },
      emitting: false,
    });

    // 岩石粒子
    this.rockEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 100, max: 220 },
      angle: { min: 180, max: 360 },
      scale: { start: 1, end: 0.3 },
      lifespan: 900,
      gravityY: 450,
      tint: [0x5d4037, 0x795548, 0x8d6e63, 0xa1887f],
      emitting: false,
    });

    // 魔法粒子
    this.magicEmitter = this.add.particles(0, 0, 'star', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.6, end: 0 },
      lifespan: 800,
      alpha: { start: 1, end: 0 },
      tint: [0x00ffff, 0x00ff88, 0x88ffff],
      rotate: { min: 0, max: 360 },
      emitting: false,
    });

    // 金币粒子
    this.goldEmitter = this.add.particles(0, 0, 'star', {
      speed: { min: 80, max: 200 },
      angle: { min: 220, max: 320 },
      scale: { start: 0.7, end: 0 },
      lifespan: 1000,
      gravityY: 200,
      tint: [0xffd700, 0xffcc00, 0xffaa00],
      rotate: { min: 0, max: 360 },
      emitting: false,
    });

    // 剑气粒子
    this.slashEmitter = this.add.particles(0, 0, 'slash', {
      speed: { min: 200, max: 400 },
      angle: { min: -30, max: 30 },
      scale: { start: 1, end: 0.2 },
      lifespan: 300,
      alpha: { start: 0.8, end: 0 },
      tint: [0xaaddff, 0xffffff, 0x88ccff],
      emitting: false,
    });

    // 治疗粒子
    this.healEmitter = this.add.particles(0, 0, 'heart', {
      speed: { min: 30, max: 80 },
      angle: { min: 250, max: 290 },
      scale: { start: 0.5, end: 0.2 },
      lifespan: 1200,
      alpha: { start: 1, end: 0 },
      tint: [0x22c55e, 0x4ade80, 0x86efac],
      emitting: false,
    });

    // 盾牌粒子
    this.shieldEmitter = this.add.particles(0, 0, 'shield', {
      speed: { min: 20, max: 60 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.6, end: 0 },
      lifespan: 800,
      alpha: { start: 0.8, end: 0 },
      tint: [0x3b82f6, 0x60a5fa, 0x93c5fd],
      emitting: false,
    });
  }

  private createDustParticles(width: number, height: number) {
    // 环境灰尘 - 更密集
    this.dustEmitter = this.add.particles(width / 2, height - 60, 'particle', {
      x: { min: -width / 2, max: width / 2 },
      speed: { min: 8, max: 20 },
      angle: { min: 250, max: 290 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.35, end: 0 },
      lifespan: 5000,
      frequency: 300,
      tint: [0x8d8d8d, 0x9d9d9d, 0x7d7d7d],
    });

    // 漂浮的光点
    const floatingParticles = this.add.particles(width / 2, height / 2, 'particle', {
      x: { min: -width / 2, max: width / 2 },
      y: { min: -height / 2, max: height / 2 },
      speed: { min: 2, max: 8 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.2, end: 0.1 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 6000,
      frequency: 800,
      tint: [0xffaa44, 0xff8844],
    });
    this.ambientParticles.push(floatingParticles);
  }

  private createPlayer(width: number, height: number) {
    // 记录原始位置
    this.playerOriginalX = width / 2;
    this.playerOriginalY = height - 85;
    
    this.playerSprite = this.add.container(this.playerOriginalX, this.playerOriginalY);

    // 阴影
    const shadow = this.add.ellipse(0, 35, 60, 20, 0x000000, 0.4);
    this.playerSprite.add(shadow);

    // 使用像素艺术精灵图
    const knightSprite = this.add.image(0, 0, 'knight');
    knightSprite.setScale(1.5);
    knightSprite.setName('knightBody');
    this.playerSprite.add(knightSprite);

    // 创建空的容器用于兼容动画系统
    this.playerLegs = this.add.container(0, 0);
    this.playerSprite.add(this.playerLegs);

    // 剑容器 - 用于攻击动画
    this.playerSword = this.add.container(32, -8);
    
    // 剑 - 像素风格
    const swordGraphics = this.add.graphics();
    // 剑身
    swordGraphics.fillStyle(0x90a4ae);
    swordGraphics.fillRect(-3, -40, 6, 44);
    swordGraphics.fillStyle(0xb0bec5);
    swordGraphics.fillRect(-2, -40, 4, 44);
    // 剑身中线高光
    swordGraphics.fillStyle(0xeceff1);
    swordGraphics.fillRect(-1, -38, 2, 40);
    // 剑尖
    swordGraphics.fillStyle(0xb0bec5);
    swordGraphics.beginPath();
    swordGraphics.moveTo(-3, -40);
    swordGraphics.lineTo(0, -50);
    swordGraphics.lineTo(3, -40);
    swordGraphics.closePath();
    swordGraphics.fillPath();
    // 护手
    swordGraphics.fillStyle(0xffc107);
    swordGraphics.fillRect(-10, 2, 20, 4);
    // 剑柄
    swordGraphics.fillStyle(0x5d4037);
    swordGraphics.fillRect(-2, 6, 4, 14);
    // 剑柄宝石
    swordGraphics.fillStyle(0xe53935);
    swordGraphics.fillCircle(0, 22, 4);
    this.playerSword.add(swordGraphics);
    
    // 剑身光效
    const bladeGlow = this.add.rectangle(0, -20, 2, 36, 0xffffff, 0.3);
    this.playerSword.add(bladeGlow);
    
    this.tweens.add({
      targets: bladeGlow,
      alpha: { from: 0.1, to: 0.5 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    
    this.playerSword.setAngle(-25);
    this.playerSprite.add(this.playerSword);

    // 盾牌容器
    this.playerShield = this.add.container(-32, 0);
    
    const shieldGraphics = this.add.graphics();
    // 盾牌主体
    shieldGraphics.fillStyle(0x5d4037);
    shieldGraphics.beginPath();
    shieldGraphics.moveTo(0, -18);
    shieldGraphics.lineTo(14, -10);
    shieldGraphics.lineTo(14, 12);
    shieldGraphics.lineTo(0, 22);
    shieldGraphics.lineTo(-14, 12);
    shieldGraphics.lineTo(-14, -10);
    shieldGraphics.closePath();
    shieldGraphics.fillPath();
    // 盾牌内部
    shieldGraphics.fillStyle(0x8d6e63);
    shieldGraphics.beginPath();
    shieldGraphics.moveTo(0, -14);
    shieldGraphics.lineTo(10, -7);
    shieldGraphics.lineTo(10, 9);
    shieldGraphics.lineTo(0, 17);
    shieldGraphics.lineTo(-10, 9);
    shieldGraphics.lineTo(-10, -7);
    shieldGraphics.closePath();
    shieldGraphics.fillPath();
    // 盾牌徽章
    shieldGraphics.fillStyle(0xffc107);
    shieldGraphics.fillCircle(0, 2, 8);
    shieldGraphics.fillStyle(0xffeb3b);
    shieldGraphics.fillCircle(0, 2, 5);
    this.playerShield.add(shieldGraphics);
    
    this.playerSprite.add(this.playerShield);

    // 待机动画 - 呼吸效果
    this.tweens.add({
      targets: this.playerSprite,
      scaleY: { from: 1, to: 1.02 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 剑的轻微摆动
    this.tweens.add({
      targets: this.playerSword,
      angle: { from: -28, to: -22 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 盾牌轻微移动
    this.tweens.add({
      targets: this.playerShield,
      y: { from: 0, to: 2 },
      duration: 1300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 玩家血条
    this.playerHpBar = this.add.graphics();
    this.updatePlayerHpBar();
  }

  private createMonster(width: number, _height: number) {
    this.monsterSprite = this.add.container(width / 2, 155);
    this.monsterSprite.setVisible(false);

    // 怪物身体容器
    this.monsterBody = this.add.container(0, 0);
    this.monsterSprite.add(this.monsterBody);

    // 怪物名字
    this.monsterNameText = this.add.text(width / 2, 55, '', {
      fontSize: '18px',
      fontFamily: 'Microsoft YaHei, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // 怪物血条
    this.monsterHpBar = this.add.graphics();

    // 怪物血量文字
    this.monsterHpText = this.add.text(width / 2, 98, '', {
      fontSize: '13px',
      fontFamily: 'sans-serif',
      color: '#cccccc',
    }).setOrigin(0.5);

    // 怪物属性文字
    this.monsterStatsText = this.add.text(width / 2, 115, '', {
      fontSize: '11px',
      fontFamily: 'sans-serif',
      color: '#999999',
    }).setOrigin(0.5);
  }

  // 获取怪物外观配置
  private getMonsterAppearance(name: string): MonsterAppearance {
    const appearances: Record<string, MonsterAppearance> = {
      '蝙蝠': {
        bodyColor: 0x5d4037,
        secondaryColor: 0x3e2723,
        eyeColor: 0xff5722,
        pupilColor: 0x000000,
        size: 65,
        hasHorns: false,
        hasTail: false,
        hasWings: true,
        hasSpikes: false,
        glowColor: 0xff5722,
        animationSpeed: 0.8,
      },
      '史莱姆': {
        bodyColor: 0x4caf50,
        secondaryColor: 0x388e3c,
        eyeColor: 0xffffff,
        pupilColor: 0x000000,
        size: 70,
        hasHorns: false,
        hasTail: false,
        hasWings: false,
        hasSpikes: false,
        glowColor: 0x4caf50,
        animationSpeed: 1.2,
      },
      '老鼠': {
        bodyColor: 0x6d4c41,
        secondaryColor: 0x4e342e,
        eyeColor: 0xff1744,
        pupilColor: 0x000000,
        size: 55,
        hasHorns: false,
        hasTail: true,
        hasWings: false,
        hasSpikes: false,
        glowColor: 0x6d4c41,
        animationSpeed: 1.5,
      },
      '蜘蛛': {
        bodyColor: 0x37474f,
        secondaryColor: 0x263238,
        eyeColor: 0xf44336,
        pupilColor: 0x000000,
        size: 70,
        hasHorns: false,
        hasTail: false,
        hasWings: false,
        hasSpikes: true,
        glowColor: 0xf44336,
        animationSpeed: 1.0,
      },
      '地精': {
        bodyColor: 0x8bc34a,
        secondaryColor: 0x689f38,
        eyeColor: 0xffeb3b,
        pupilColor: 0x000000,
        size: 75,
        hasHorns: false,
        hasTail: false,
        hasWings: false,
        hasSpikes: false,
        glowColor: 0x8bc34a,
        animationSpeed: 1.0,
      },
      '蜥蜴': {
        bodyColor: 0x7cb342,
        secondaryColor: 0x558b2f,
        eyeColor: 0xffeb3b,
        pupilColor: 0x000000,
        size: 75,
        hasHorns: true,
        hasTail: true,
        hasWings: false,
        hasSpikes: true,
        glowColor: 0x7cb342,
        animationSpeed: 0.9,
      },
      '巨虫': {
        bodyColor: 0x795548,
        secondaryColor: 0x5d4037,
        eyeColor: 0xffc107,
        pupilColor: 0x000000,
        size: 80,
        hasHorns: false,
        hasTail: false,
        hasWings: false,
        hasSpikes: true,
        glowColor: 0x795548,
        animationSpeed: 0.7,
      },
      '狼': {
        bodyColor: 0x424242,
        secondaryColor: 0x212121,
        eyeColor: 0xffeb3b,
        pupilColor: 0x000000,
        size: 75,
        hasHorns: false,
        hasTail: true,
        hasWings: false,
        hasSpikes: false,
        glowColor: 0x424242,
        animationSpeed: 1.2,
      },
      '石像鬼': {
        bodyColor: 0x607d8b,
        secondaryColor: 0x455a64,
        eyeColor: 0x03a9f4,
        pupilColor: 0x000000,
        size: 85,
        hasHorns: true,
        hasTail: false,
        hasWings: true,
        hasSpikes: true,
        glowColor: 0x03a9f4,
        animationSpeed: 0.6,
      },
      '熔岩': {
        bodyColor: 0xd32f2f,
        secondaryColor: 0xb71c1c,
        eyeColor: 0xffeb3b,
        pupilColor: 0xff6f00,
        size: 85,
        hasHorns: true,
        hasTail: false,
        hasWings: false,
        hasSpikes: true,
        glowColor: 0xff6f00,
        animationSpeed: 0.8,
      },
      '骷髅': {
        bodyColor: 0xeceff1,
        secondaryColor: 0xcfd8dc,
        eyeColor: 0xf44336,
        pupilColor: 0x000000,
        size: 75,
        hasHorns: false,
        hasTail: false,
        hasWings: false,
        hasSpikes: false,
        glowColor: 0xf44336,
        animationSpeed: 0.9,
      },
      '蝎子': {
        bodyColor: 0x4e342e,
        secondaryColor: 0x3e2723,
        eyeColor: 0xff5722,
        pupilColor: 0x000000,
        size: 80,
        hasHorns: false,
        hasTail: true,
        hasWings: false,
        hasSpikes: true,
        glowColor: 0xff5722,
        animationSpeed: 1.0,
      },
      '巨人': {
        bodyColor: 0x607d8b,
        secondaryColor: 0x455a64,
        eyeColor: 0x03a9f4,
        pupilColor: 0x000000,
        size: 95,
        hasHorns: false,
        hasTail: false,
        hasWings: false,
        hasSpikes: false,
        glowColor: 0x03a9f4,
        animationSpeed: 0.5,
      },
      '魔像': {
        bodyColor: 0x9c27b0,
        secondaryColor: 0x7b1fa2,
        eyeColor: 0x00e5ff,
        pupilColor: 0x000000,
        size: 90,
        hasHorns: false,
        hasTail: false,
        hasWings: false,
        hasSpikes: true,
        glowColor: 0x00e5ff,
        animationSpeed: 0.4,
      },
      '领主': {
        bodyColor: 0x4a148c,
        secondaryColor: 0x311b92,
        eyeColor: 0xff1744,
        pupilColor: 0x000000,
        size: 100,
        hasHorns: true,
        hasTail: true,
        hasWings: true,
        hasSpikes: true,
        glowColor: 0xff1744,
        animationSpeed: 0.7,
      },
      '龙': {
        bodyColor: 0xc62828,
        secondaryColor: 0x8e0000,
        eyeColor: 0xffd600,
        pupilColor: 0x000000,
        size: 95,
        hasHorns: true,
        hasTail: true,
        hasWings: true,
        hasSpikes: true,
        glowColor: 0xffd600,
        animationSpeed: 0.6,
      },
      '守护者': {
        bodyColor: 0x1565c0,
        secondaryColor: 0x0d47a1,
        eyeColor: 0x00e5ff,
        pupilColor: 0x000000,
        size: 100,
        hasHorns: true,
        hasTail: false,
        hasWings: false,
        hasSpikes: true,
        glowColor: 0x00e5ff,
        animationSpeed: 0.4,
      },
      '泰坦': {
        bodyColor: 0xffd700,
        secondaryColor: 0xffa000,
        eyeColor: 0xff1744,
        pupilColor: 0x000000,
        size: 105,
        hasHorns: true,
        hasTail: false,
        hasWings: false,
        hasSpikes: true,
        glowColor: 0xff1744,
        animationSpeed: 0.3,
      },
      '虚空': {
        bodyColor: 0x1a1a2e,
        secondaryColor: 0x0f0f1a,
        eyeColor: 0xe040fb,
        pupilColor: 0x000000,
        size: 100,
        hasHorns: true,
        hasTail: true,
        hasWings: true,
        hasSpikes: true,
        glowColor: 0xe040fb,
        animationSpeed: 0.5,
      },
    };

    // 查找匹配的外观
    for (const [key, appearance] of Object.entries(appearances)) {
      if (name.includes(key)) {
        return appearance;
      }
    }

    // 默认外观
    return {
      bodyColor: 0x4caf50,
      secondaryColor: 0x388e3c,
      eyeColor: 0xffffff,
      pupilColor: 0x000000,
      size: 75,
      hasHorns: false,
      hasTail: false,
      hasWings: false,
      hasSpikes: false,
      glowColor: 0x4caf50,
      animationSpeed: 1.0,
    };
  }

  // 获取怪物对应的精灵纹理名称
  private getMonsterSpriteKey(name: string): string | null {
    const spriteMap: Record<string, string> = {
      '蝙蝠': 'bat',
      '史莱姆': 'slime',
      '骷髅': 'skeleton',
      '地精': 'goblin',
      '龙': 'dragon',
      '巨龙': 'dragon',
      '魔像': 'golem',
      '石魔': 'golem',
      '幽灵': 'ghost',
      '鬼魂': 'ghost',
    };

    for (const [key, spriteKey] of Object.entries(spriteMap)) {
      if (name.includes(key)) {
        return spriteKey;
      }
    }
    return null;
  }

  // 绘制详细的怪物
  private drawDetailedMonster(appearance: MonsterAppearance) {
    const width = this.cameras.main.width;
    
    // 清除旧的怪物身体
    this.monsterBody.removeAll(true);

    const { size, glowColor } = appearance;

    // 阴影
    const shadow = this.add.ellipse(0, size * 0.7, size * 1.2, size * 0.3, 0x000000, 0.4);
    this.monsterBody.add(shadow);

    // 光晕效果
    const glow = this.add.ellipse(0, 0, size * 1.4, size * 1.4, glowColor, 0.15);
    this.monsterBody.add(glow);
    
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.1, to: 0.25 },
      scale: { from: 1, to: 1.1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // 尝试使用精灵图
    const spriteKey = this.monster ? this.getMonsterSpriteKey(this.monster.name) : null;
    
    if (spriteKey && this.textures.exists(spriteKey)) {
      // 使用精灵图
      const monsterImage = this.add.image(0, 0, spriteKey);
      const scale = size / 48; // 基于48像素的基础尺寸计算缩放
      monsterImage.setScale(scale * 1.5);
      monsterImage.setName('monsterImage');
      this.monsterBody.add(monsterImage);

      // 呼吸动画
      this.tweens.add({
        targets: monsterImage,
        scaleY: { from: scale * 1.5, to: scale * 1.6 },
        scaleX: { from: scale * 1.5, to: scale * 1.55 },
        duration: 1000 * appearance.animationSpeed,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // 左右摇晃
      this.tweens.add({
        targets: this.monsterSprite,
        x: { from: width / 2 - 5, to: width / 2 + 5 },
        duration: 2000 * appearance.animationSpeed,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else {
      // 回退到程序化绘制
      this.drawProgrammaticMonster(appearance, width);
    }
  }

  // 程序化绘制怪物（回退方案）
  private drawProgrammaticMonster(appearance: MonsterAppearance, width: number) {
    const { bodyColor, secondaryColor, eyeColor, pupilColor, size, hasHorns, hasTail, hasWings, hasSpikes } = appearance;

    // 翅膀（如果有）
    if (hasWings) {
      const leftWing = this.add.graphics();
      leftWing.fillStyle(secondaryColor, 0.8);
      leftWing.beginPath();
      leftWing.moveTo(-size * 0.4, -size * 0.1);
      leftWing.lineTo(-size * 0.9, -size * 0.5);
      leftWing.lineTo(-size * 0.8, 0);
      leftWing.lineTo(-size * 0.6, size * 0.2);
      leftWing.closePath();
      leftWing.fillPath();
      leftWing.setName('leftWing');
      this.monsterBody.add(leftWing);

      const rightWing = this.add.graphics();
      rightWing.fillStyle(secondaryColor, 0.8);
      rightWing.beginPath();
      rightWing.moveTo(size * 0.4, -size * 0.1);
      rightWing.lineTo(size * 0.9, -size * 0.5);
      rightWing.lineTo(size * 0.8, 0);
      rightWing.lineTo(size * 0.6, size * 0.2);
      rightWing.closePath();
      rightWing.fillPath();
      rightWing.setName('rightWing');
      this.monsterBody.add(rightWing);

      // 翅膀动画
      this.tweens.add({
        targets: [leftWing, rightWing],
        scaleY: { from: 1, to: 0.8 },
        duration: 200,
        yoyo: true,
        repeat: -1,
      });
    }

    // 尾巴（如果有）
    if (hasTail) {
      const tail = this.add.graphics();
      tail.fillStyle(bodyColor);
      tail.beginPath();
      tail.moveTo(size * 0.3, size * 0.3);
      tail.lineTo(size * 0.5, size * 0.4);
      tail.lineTo(size * 0.7, size * 0.2);
      tail.lineTo(size * 0.6, size * 0.1);
      tail.lineTo(size * 0.4, size * 0.25);
      tail.lineTo(size * 0.3, size * 0.35);
      tail.closePath();
      tail.fillPath();
      // 尾巴尖端
      tail.fillStyle(secondaryColor);
      tail.fillCircle(size * 0.65, size * 0.15, 6);
      tail.setName('tail');
      this.monsterBody.add(tail);

      this.tweens.add({
        targets: tail,
        angle: { from: -5, to: 5 },
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    }

    // 主体
    const body = this.add.graphics();
    body.fillStyle(bodyColor);
    body.fillEllipse(0, 0, size, size * 0.9);
    // 高光
    body.fillStyle(0xffffff, 0.15);
    body.fillEllipse(-size * 0.15, -size * 0.15, size * 0.4, size * 0.3);
    this.monsterBody.add(body);

    // 次要颜色装饰
    const bodyDetail = this.add.graphics();
    bodyDetail.fillStyle(secondaryColor);
    bodyDetail.fillEllipse(0, size * 0.15, size * 0.7, size * 0.5);
    this.monsterBody.add(bodyDetail);

    // 尖刺（如果有）
    if (hasSpikes) {
      const spikes = this.add.graphics();
      spikes.fillStyle(secondaryColor);
      const spikeCount = 5;
      for (let i = 0; i < spikeCount; i++) {
        const angle = (-90 + (i - 2) * 25) * Math.PI / 180;
        const baseX = Math.cos(angle) * size * 0.4;
        const baseY = Math.sin(angle) * size * 0.35 - size * 0.1;
        const tipX = Math.cos(angle) * size * 0.65;
        const tipY = Math.sin(angle) * size * 0.55 - size * 0.1;
        
        spikes.beginPath();
        spikes.moveTo(baseX - 4, baseY);
        spikes.lineTo(tipX, tipY);
        spikes.lineTo(baseX + 4, baseY);
        spikes.closePath();
        spikes.fillPath();
      }
      this.monsterBody.add(spikes);
    }

    // 角（如果有）
    if (hasHorns) {
      const leftHorn = this.add.graphics();
      leftHorn.fillStyle(secondaryColor);
      leftHorn.beginPath();
      leftHorn.moveTo(-size * 0.25, -size * 0.35);
      leftHorn.lineTo(-size * 0.4, -size * 0.7);
      leftHorn.lineTo(-size * 0.15, -size * 0.35);
      leftHorn.closePath();
      leftHorn.fillPath();
      this.monsterBody.add(leftHorn);

      const rightHorn = this.add.graphics();
      rightHorn.fillStyle(secondaryColor);
      rightHorn.beginPath();
      rightHorn.moveTo(size * 0.25, -size * 0.35);
      rightHorn.lineTo(size * 0.4, -size * 0.7);
      rightHorn.lineTo(size * 0.15, -size * 0.35);
      rightHorn.closePath();
      rightHorn.fillPath();
      this.monsterBody.add(rightHorn);
    }

    // 眼睛
    const eyeSpacing = size * 0.22;
    const eyeY = -size * 0.1;
    const eyeSize = size * 0.18;

    // 左眼
    const leftEyeWhite = this.add.ellipse(-eyeSpacing, eyeY, eyeSize, eyeSize, eyeColor);
    const leftPupil = this.add.ellipse(-eyeSpacing + 2, eyeY, eyeSize * 0.5, eyeSize * 0.5, pupilColor);
    leftPupil.setName('leftPupil');
    
    // 右眼
    const rightEyeWhite = this.add.ellipse(eyeSpacing, eyeY, eyeSize, eyeSize, eyeColor);
    const rightPupil = this.add.ellipse(eyeSpacing + 2, eyeY, eyeSize * 0.5, eyeSize * 0.5, pupilColor);
    rightPupil.setName('rightPupil');
    
    this.monsterBody.add([leftEyeWhite, leftPupil, rightEyeWhite, rightPupil]);

    // 眼睛发光
    const leftEyeGlow = this.add.ellipse(-eyeSpacing, eyeY, eyeSize * 0.3, eyeSize * 0.3, 0xffffff, 0.6);
    leftEyeGlow.setPosition(-eyeSpacing - eyeSize * 0.2, eyeY - eyeSize * 0.2);
    const rightEyeGlow = this.add.ellipse(eyeSpacing, eyeY, eyeSize * 0.3, eyeSize * 0.3, 0xffffff, 0.6);
    rightEyeGlow.setPosition(eyeSpacing - eyeSize * 0.2, eyeY - eyeSize * 0.2);
    this.monsterBody.add([leftEyeGlow, rightEyeGlow]);

    // 嘴巴
    const mouth = this.add.graphics();
    mouth.fillStyle(0x000000, 0.8);
    mouth.fillEllipse(0, size * 0.2, size * 0.3, size * 0.12);
    // 牙齿
    mouth.fillStyle(0xffffff);
    mouth.beginPath();
    mouth.moveTo(-size * 0.1, size * 0.15);
    mouth.lineTo(-size * 0.05, size * 0.22);
    mouth.lineTo(0, size * 0.15);
    mouth.lineTo(size * 0.05, size * 0.22);
    mouth.lineTo(size * 0.1, size * 0.15);
    mouth.closePath();
    mouth.fillPath();
    this.monsterBody.add(mouth);

    // 呼吸动画
    this.tweens.add({
      targets: this.monsterBody,
      scaleY: { from: 1, to: 1.05 },
      scaleX: { from: 1, to: 1.03 },
      duration: 1000 * appearance.animationSpeed,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 眼睛跟踪玩家
    this.tweens.add({
      targets: [leftPupil, rightPupil],
      y: eyeY + 4,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 左右摇晃
    this.tweens.add({
      targets: this.monsterSprite,
      x: { from: width / 2 - 5, to: width / 2 + 5 },
      duration: 2000 * appearance.animationSpeed,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createOre(width: number, _height: number) {
    this.oreSprite = this.add.container(width / 2, 175);
    this.oreSprite.setVisible(false);

    // 矿石阴影
    const shadow = this.add.ellipse(0, 50, 100, 25, 0x000000, 0.3);
    this.oreSprite.add(shadow);

    // 使用像素艺术矿石精灵
    const oreImage = this.add.image(0, 0, 'ore');
    oreImage.setScale(1.8);
    this.oreSprite.add(oreImage);

    // 额外闪光效果
    const sparklePositions = [
      { x: -25, y: -30, size: 6 },
      { x: 20, y: -35, size: 8 },
      { x: 30, y: 5, size: 5 },
      { x: -35, y: 10, size: 7 },
    ];

    sparklePositions.forEach((pos, i) => {
      const sparkle = this.add.ellipse(pos.x, pos.y, pos.size, pos.size, 0xffffff, 0.9);
      this.oreSprite.add(sparkle);

      // 闪烁动画
      this.tweens.add({
        targets: sparkle,
        alpha: { from: 0.3, to: 1 },
        scale: { from: 0.5, to: 1.5 },
        duration: 300 + i * 100,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // 挖矿提示文字
    const mineText = this.add.text(0, 85, '✨ 点击挖矿 ✨', {
      fontSize: '18px',
      fontFamily: 'Microsoft YaHei, sans-serif',
      color: '#ffc107',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.oreSprite.add(mineText);

    // 镐子图标
    const pickaxe = this.add.text(0, 120, '⛏️', {
      fontSize: '42px',
    }).setOrigin(0.5);
    this.oreSprite.add(pickaxe);

    // 提示文字脉冲
    this.tweens.add({
      targets: [mineText],
      scale: { from: 1, to: 1.1 },
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: pickaxe,
      y: { from: 120, to: 115 },
      angle: { from: -10, to: 10 },
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 矿石可点击
    this.oreSprite.setSize(130, 120);
    this.oreSprite.setInteractive({ useHandCursor: true });
    this.oreSprite.on('pointerdown', () => {
      if (this.canMine && this.onMine) {
        this.playMiningEffect();
        this.onMine();
      }
    });

    this.oreSprite.on('pointerover', () => {
      this.tweens.add({
        targets: this.oreSprite,
        scale: 1.05,
        duration: 150,
      });
    });

    this.oreSprite.on('pointerout', () => {
      this.tweens.add({
        targets: this.oreSprite,
        scale: 1,
        duration: 150,
      });
    });
  }

  private createActionButton(width: number, _height: number) {
    this.actionButton = this.add.container(width / 2, 320);

    // 按钮阴影
    const btnShadow = this.add.graphics();
    btnShadow.fillStyle(0x000000, 0.3);
    btnShadow.fillRoundedRect(-58, -16, 116, 40, 10);
    this.actionButton.add(btnShadow);

    // 按钮背景
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xef4444);
    btnBg.fillRoundedRect(-55, -18, 110, 38, 10);
    btnBg.setName('btnBg');
    this.actionButton.add(btnBg);

    // 按钮高光
    const btnHighlight = this.add.graphics();
    btnHighlight.fillStyle(0xffffff, 0.25);
    btnHighlight.fillRoundedRect(-55, -18, 110, 19, { tl: 10, tr: 10, bl: 0, br: 0 });
    this.actionButton.add(btnHighlight);

    // 按钮文字
    const btnText = this.add.text(0, 0, '⚔️ 攻击', {
      fontSize: '16px',
      fontFamily: 'Microsoft YaHei, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    btnText.setName('btnText');
    this.actionButton.add(btnText);

    // 交互
    this.actionButton.setSize(110, 38);
    this.actionButton.setInteractive({ useHandCursor: true });

    this.actionButton.on('pointerover', () => {
      this.tweens.add({
        targets: this.actionButton,
        scale: 1.08,
        duration: 100,
      });
    });

    this.actionButton.on('pointerout', () => {
      this.tweens.add({
        targets: this.actionButton,
        scale: 1,
        duration: 100,
      });
    });

    this.actionButton.on('pointerdown', () => {
      this.handleAction();
    });

    // 脉冲动画
    this.tweens.add({
      targets: this.actionButton,
      scale: { from: 1, to: 1.03 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createSkillButtons(width: number, _height: number) {
    this.skillButtons = this.add.container(width / 2, 360);

    const skills = [
      { id: 'power', name: '重击', icon: '💥', color: 0xf59e0b, key: 'Q', cooldown: 3000 },
      { id: 'block', name: '格挡', icon: '🛡️', color: 0x3b82f6, key: 'W', cooldown: 5000 },
      { id: 'heal', name: '治疗', icon: '💚', color: 0x22c55e, key: 'E', cooldown: 8000 },
    ];

    skills.forEach((skill, index) => {
      const x = (index - 1) * 70;
      const skillBtn = this.add.container(x, 0);

      // 按钮背景
      const bg = this.add.graphics();
      bg.fillStyle(skill.color, 0.8);
      bg.fillRoundedRect(-25, -18, 50, 36, 8);
      bg.setName(`${skill.id}Bg`);
      skillBtn.add(bg);

      // 冷却遮罩
      const cooldownMask = this.add.graphics();
      cooldownMask.fillStyle(0x000000, 0.6);
      cooldownMask.fillRoundedRect(-25, -18, 50, 36, 8);
      cooldownMask.setVisible(false);
      cooldownMask.setName(`${skill.id}Cooldown`);
      skillBtn.add(cooldownMask);

      // 图标
      const icon = this.add.text(0, -4, skill.icon, {
        fontSize: '18px',
      }).setOrigin(0.5);
      skillBtn.add(icon);

      // 快捷键
      const keyText = this.add.text(0, 12, skill.key, {
        fontSize: '10px',
        fontFamily: 'sans-serif',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0.5);
      skillBtn.add(keyText);

      // 交互
      skillBtn.setSize(50, 36);
      skillBtn.setInteractive({ useHandCursor: true });
      skillBtn.setName(skill.id);

      skillBtn.on('pointerdown', () => {
        if (skill.id === 'power') this.usePowerAttack();
        else if (skill.id === 'block') this.useBlock();
        else if (skill.id === 'heal') this.useHeal();
      });

      skillBtn.on('pointerover', () => {
        this.tweens.add({
          targets: skillBtn,
          scale: 1.1,
          duration: 100,
        });
        // 显示技能提示
        this.showSkillTooltip(skill.name, x);
      });

      skillBtn.on('pointerout', () => {
        this.tweens.add({
          targets: skillBtn,
          scale: 1,
          duration: 100,
        });
        this.hideSkillTooltip();
      });

      this.skillButtons.add(skillBtn);
    });
  }

  private showSkillTooltip(name: string, x: number) {
    // 移除旧的提示
    this.hideSkillTooltip();
    
    const tooltip = this.add.text(this.cameras.main.width / 2 + x, 390, name, {
      fontSize: '12px',
      fontFamily: 'Microsoft YaHei, sans-serif',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 6, y: 3 },
    }).setOrigin(0.5);
    tooltip.setName('skillTooltip');
  }

  private hideSkillTooltip() {
    const tooltip = this.children.getByName('skillTooltip');
    if (tooltip) tooltip.destroy();
  }

  private updateSkillCooldowns() {
    const now = Date.now();
    const skills = ['power', 'block', 'heal'];
    
    skills.forEach((skillId) => {
      const skillBtn = this.skillButtons.getByName(skillId) as Phaser.GameObjects.Container;
      if (!skillBtn) return;
      
      const cooldownMask = skillBtn.getByName(`${skillId}Cooldown`) as Phaser.GameObjects.Graphics;
      if (!cooldownMask) return;
      
      const cooldownEnd = this.skillCooldowns[skillId] || 0;
      const isOnCooldown = now < cooldownEnd;
      
      cooldownMask.setVisible(isOnCooldown);
    });
  }

  private usePowerAttack() {
    if (!this.monster || this.battlePhase === 'fighting' || this.isAttacking) return;
    
    const now = Date.now();
    if (now < (this.skillCooldowns.power || 0)) {
      this.addBattleMessage('⏳ 重击冷却中...');
      return;
    }
    
    this.skillCooldowns.power = now + 3000;
    this.comboCount += 2; // 重击增加额外连击
    this.addBattleMessage('💥 发动重击！');
    
    // 特殊攻击动画
    this.playPowerAttackAnimation();
    
    this.time.delayedCall(200, () => {
      if (this.onAttack) {
        this.onAttack();
        this.onAttack(); // 双倍伤害
      }
    });
  }

  private useBlock() {
    if (!this.monster || this.isBlocking) return;
    
    const now = Date.now();
    if (now < (this.skillCooldowns.block || 0)) {
      this.addBattleMessage('⏳ 格挡冷却中...');
      return;
    }
    
    this.skillCooldowns.block = now + 5000;
    this.isBlocking = true;
    this.addBattleMessage('🛡️ 举起盾牌格挡！');
    
    // 格挡动画
    this.playBlockAnimation();
    
    // 格挡持续2秒
    this.time.delayedCall(2000, () => {
      this.isBlocking = false;
      this.addBattleMessage('盾牌放下');
    });
  }

  private useHeal() {
    const now = Date.now();
    if (now < (this.skillCooldowns.heal || 0)) {
      this.addBattleMessage('⏳ 治疗冷却中...');
      return;
    }
    
    this.skillCooldowns.heal = now + 8000;
    this.addBattleMessage('💚 使用治疗！');
    
    // 治疗动画
    this.playHealAnimation();
    
    // 治疗效果由外部处理，这里只是视觉效果
    this.healEmitter.setPosition(this.playerSprite.x, this.playerSprite.y - 20);
    this.healEmitter.explode(15);
  }

  private createBattleLog(width: number, _height: number) {
    this.battleLog = this.add.container(width - 10, 130);
    
    // 背景
    const logBg = this.add.graphics();
    logBg.fillStyle(0x000000, 0.5);
    logBg.fillRoundedRect(-120, -60, 120, 120, 6);
    this.battleLog.add(logBg);
    
    // 标题
    const title = this.add.text(-60, -50, '战斗日志', {
      fontSize: '10px',
      fontFamily: 'Microsoft YaHei, sans-serif',
      color: '#888888',
    }).setOrigin(0.5);
    this.battleLog.add(title);
  }

  private addBattleMessage(message: string) {
    this.battleMessages.unshift(message);
    if (this.battleMessages.length > 5) {
      this.battleMessages.pop();
    }
    this.updateBattleLog();
  }

  private updateBattleLog() {
    // 移除旧消息
    this.battleLog.each((child: Phaser.GameObjects.GameObject) => {
      if (child.name?.startsWith('msg')) {
        child.destroy();
      }
    });

    // 添加新消息
    this.battleMessages.forEach((msg, index) => {
      const text = this.add.text(-115, -35 + index * 18, msg, {
        fontSize: '9px',
        fontFamily: 'Microsoft YaHei, sans-serif',
        color: index === 0 ? '#ffffff' : '#888888',
        wordWrap: { width: 110 },
      });
      text.setName(`msg${index}`);
      this.battleLog.add(text);
    });
  }

  private createComboDisplay(width: number, _height: number) {
    this.comboContainer = this.add.container(width - 80, 160);
    this.comboContainer.setVisible(false);
    this.comboContainer.setAlpha(0);

    // 连击背景
    const comboBg = this.add.graphics();
    comboBg.fillStyle(0x000000, 0.6);
    comboBg.fillRoundedRect(-50, -25, 100, 50, 8);
    this.comboContainer.add(comboBg);

    // 连击文字
    this.comboText = this.add.text(0, -8, 'COMBO', {
      fontSize: '12px',
      fontFamily: 'sans-serif',
      color: '#ffaa00',
    }).setOrigin(0.5);
    this.comboContainer.add(this.comboText);

    // 连击数字
    const comboNumber = this.add.text(0, 12, '0', {
      fontSize: '24px',
      fontFamily: 'sans-serif',
      color: '#ffffff',
      stroke: '#ff6600',
      strokeThickness: 2,
    }).setOrigin(0.5);
    comboNumber.setName('comboNumber');
    this.comboContainer.add(comboNumber);
  }

  private createDefeatOverlay(width: number, height: number) {
    this.defeatOverlay = this.add.container(0, 0);
    this.defeatOverlay.setVisible(false);

    // 暗红色遮罩
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x200000, 0.85);
    this.defeatOverlay.add(overlay);

    // 骷髅图标
    const skull = this.add.text(width / 2, 130, '💀', {
      fontSize: '80px',
    }).setOrigin(0.5);
    this.defeatOverlay.add(skull);

    // 失败文字
    const defeatText = this.add.text(width / 2, 220, '战斗失败', {
      fontSize: '32px',
      fontFamily: 'Microsoft YaHei, sans-serif',
      color: '#ef4444',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);
    this.defeatOverlay.add(defeatText);

    // 提示文字
    const hintText = this.add.text(width / 2, 265, '你被击败了，需要恢复后再来', {
      fontSize: '15px',
      fontFamily: 'Microsoft YaHei, sans-serif',
      color: '#9ca3af',
    }).setOrigin(0.5);
    this.defeatOverlay.add(hintText);

    // 骷髅脉冲动画
    this.tweens.add({
      targets: skull,
      scale: { from: 1, to: 1.15 },
      duration: 400,
      yoyo: true,
      repeat: -1,
    });

    // 文字抖动
    this.tweens.add({
      targets: defeatText,
      x: { from: width / 2 - 2, to: width / 2 + 2 },
      duration: 100,
      yoyo: true,
      repeat: -1,
    });
  }

  private createIdleContainer(width: number, _height: number) {
    this.idleContainer = this.add.container(width / 2, 175);
    this.idleContainer.setVisible(false);

    // 探索动画容器
    const searchContainer = this.add.container(0, 0);
    this.idleContainer.add(searchContainer);

    // 探索图标
    const searchIcon = this.add.text(0, 0, '🔦', {
      fontSize: '65px',
    }).setOrigin(0.5);
    searchContainer.add(searchIcon);

    // 光束效果
    const lightBeam = this.add.graphics();
    lightBeam.fillStyle(0xffff88, 0.15);
    lightBeam.beginPath();
    lightBeam.moveTo(0, 30);
    lightBeam.lineTo(-60, 120);
    lightBeam.lineTo(60, 120);
    lightBeam.closePath();
    lightBeam.fillPath();
    searchContainer.add(lightBeam);
    searchContainer.sendToBack(lightBeam);

    // 提示文字
    const idleText = this.add.text(0, 90, '正在探索矿场...', {
      fontSize: '15px',
      fontFamily: 'Microsoft YaHei, sans-serif',
      color: '#9ca3af',
    }).setOrigin(0.5);
    this.idleContainer.add(idleText);

    // 加载点动画
    const dots = this.add.text(65, 90, '', {
      fontSize: '15px',
      fontFamily: 'sans-serif',
      color: '#9ca3af',
    }).setOrigin(0, 0.5);
    this.idleContainer.add(dots);

    let dotCount = 0;
    this.time.addEvent({
      delay: 400,
      callback: () => {
        dotCount = (dotCount + 1) % 4;
        dots.setText('.'.repeat(dotCount));
      },
      loop: true,
    });

    // 探照灯摆动
    this.tweens.add({
      targets: searchContainer,
      angle: { from: -15, to: 15 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 脉冲动画
    this.tweens.add({
      targets: searchIcon,
      scale: { from: 1, to: 1.1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private handleAction() {
    if (this.isAttacking) return;

    if (this.monster && this.battlePhase !== 'fighting' && this.onAttack) {
      this.isAttacking = true;
      this.playAttackAnimation();

      // 更新连击
      const now = Date.now();
      if (now - this.lastAttackTime < 2000) {
        this.comboCount++;
        this.showCombo();
      } else {
        this.comboCount = 1;
        this.showCombo();
      }
      this.lastAttackTime = now;

      // 延迟触发攻击回调
      this.time.delayedCall(150, () => {
        if (this.onAttack) this.onAttack();
        this.isAttacking = false;
      });
    } else if (this.canMine && this.onMine) {
      this.playMiningEffect();
      this.onMine();
    }
  }

  private showCombo() {
    const comboNumber = this.comboContainer.getByName('comboNumber') as Phaser.GameObjects.Text;
    if (comboNumber) {
      comboNumber.setText(this.comboCount.toString());
    }

    this.comboContainer.setVisible(true);
    this.comboContainer.setScale(0.5);
    this.comboContainer.setAlpha(0);

    this.tweens.add({
      targets: this.comboContainer,
      scale: 1.2,
      alpha: 1,
      duration: 150,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: this.comboContainer,
          scale: 1,
          duration: 100,
        });
      },
    });

    // 连击超时隐藏
    this.time.delayedCall(2000, () => {
      if (Date.now() - this.lastAttackTime >= 1900) {
        this.tweens.add({
          targets: this.comboContainer,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            this.comboContainer.setVisible(false);
            this.comboCount = 0;
          },
        });
      }
    });
  }

  private updatePlayerHpBar() {
    const width = this.cameras.main.width;
    const barWidth = 80;
    const barHeight = 8;
    const x = width / 2 - barWidth / 2;
    const y = this.cameras.main.height - 38;
    const hpPercent = Math.max(0, this.playerHp / this.maxPlayerHp);

    this.playerHpBar.clear();

    // 背景
    this.playerHpBar.fillStyle(0x000000, 0.7);
    this.playerHpBar.fillRoundedRect(x - 3, y - 3, barWidth + 6, barHeight + 6, 4);

    // 血条颜色根据血量变化
    let barColor = 0x22c55e;
    if (hpPercent < 0.3) barColor = 0xef4444;
    else if (hpPercent < 0.6) barColor = 0xf59e0b;

    // 血条
    this.playerHpBar.fillStyle(barColor);
    this.playerHpBar.fillRoundedRect(x, y, barWidth * hpPercent, barHeight, 3);

    // 高光
    this.playerHpBar.fillStyle(0xffffff, 0.3);
    this.playerHpBar.fillRoundedRect(x, y, barWidth * hpPercent, barHeight / 2, { tl: 3, tr: 3, bl: 0, br: 0 });

    // 边框
    this.playerHpBar.lineStyle(2, 0xffffff, 0.6);
    this.playerHpBar.strokeRoundedRect(x, y, barWidth, barHeight, 3);
  }

  private updateMonsterHpBar() {
    if (!this.monster) return;

    const width = this.cameras.main.width;
    const barWidth = 100;
    const barHeight = 10;
    const x = width / 2 - barWidth / 2;
    const y = 78;
    const hpPercent = Math.max(0, this.monster.hp / this.monster.maxHp);

    this.monsterHpBar.clear();

    // 背景
    this.monsterHpBar.fillStyle(0x000000, 0.7);
    this.monsterHpBar.fillRoundedRect(x - 3, y - 3, barWidth + 6, barHeight + 6, 5);

    // 血条颜色
    let barColor = 0xef4444;
    if (hpPercent < 0.3) barColor = 0x991b1b;

    // 血条
    this.monsterHpBar.fillStyle(barColor);
    this.monsterHpBar.fillRoundedRect(x, y, barWidth * hpPercent, barHeight, 4);

    // 高光
    this.monsterHpBar.fillStyle(0xffffff, 0.25);
    this.monsterHpBar.fillRoundedRect(x, y, barWidth * hpPercent, barHeight / 2, { tl: 4, tr: 4, bl: 0, br: 0 });

    // 边框
    this.monsterHpBar.lineStyle(2, 0xffffff, 0.5);
    this.monsterHpBar.strokeRoundedRect(x, y, barWidth, barHeight, 4);

    // 更新文字
    this.monsterNameText.setText(this.monster.name);
    this.monsterHpText.setText(`${this.monster.hp}/${this.monster.maxHp}`);
    this.monsterStatsText.setText(`⚔️${this.monster.attack}  🛡️${this.monster.defense}`);
  }

  private updateMonsterAppearance() {
    if (!this.monster) return;

    const appearance = this.getMonsterAppearance(this.monster.name);
    this.currentMonsterAppearance = appearance;
    this.drawDetailedMonster(appearance);
  }

  private updateVisibility() {
    // 隐藏所有
    this.monsterSprite.setVisible(false);
    this.oreSprite.setVisible(false);
    this.actionButton.setVisible(false);
    this.skillButtons.setVisible(false);
    this.defeatOverlay.setVisible(false);
    this.idleContainer.setVisible(false);
    this.monsterHpBar.setVisible(false);
    this.monsterNameText.setVisible(false);
    this.monsterHpText.setVisible(false);
    this.monsterStatsText.setVisible(false);
    this.battleLog.setVisible(false);

    if (this.battlePhase === 'defeat') {
      this.defeatOverlay.setVisible(true);
      this.comboContainer.setVisible(false);
    } else if (this.monster) {
      this.monsterSprite.setVisible(true);
      this.actionButton.setVisible(true);
      this.skillButtons.setVisible(true);
      this.monsterHpBar.setVisible(true);
      this.monsterNameText.setVisible(true);
      this.monsterHpText.setVisible(true);
      this.monsterStatsText.setVisible(true);
      this.battleLog.setVisible(true);
      this.updateActionButton('attack');
      this.updateMonsterAppearance();
      this.updateMonsterHpBar();
    } else if (this.canMine) {
      this.oreSprite.setVisible(true);
      this.actionButton.setVisible(true);
      this.updateActionButton('mine');
      this.comboContainer.setVisible(false);
    } else {
      this.idleContainer.setVisible(true);
      this.comboContainer.setVisible(false);
    }
  }

  private updateActionButton(type: 'attack' | 'mine') {
    const btnBg = this.actionButton.getByName('btnBg') as Phaser.GameObjects.Graphics;
    const btnText = this.actionButton.getByName('btnText') as Phaser.GameObjects.Text;

    if (!btnBg || !btnText) return;

    btnBg.clear();

    if (type === 'attack') {
      const color = this.battlePhase === 'fighting' ? 0x6b7280 : 0xef4444;
      btnBg.fillStyle(color);
      btnText.setText(this.battlePhase === 'fighting' ? '⏳ 战斗中...' : '⚔️ 攻击');
    } else {
      btnBg.fillStyle(0xf59e0b);
      btnText.setText('⛏️ 挖矿');
    }

    btnBg.fillRoundedRect(-55, -18, 110, 38, 10);
  }

  private playAttackAnimation() {
    // 如果正在动画中，不再触发新动画
    if (this.isAttacking) return;
    
    // 停止所有玩家相关的动画
    this.tweens.killTweensOf(this.playerSprite);
    this.tweens.killTweensOf(this.playerLegs);
    this.tweens.killTweensOf(this.playerSword);
    
    // 重置到原始位置
    this.playerSprite.x = this.playerOriginalX;
    this.playerSprite.y = this.playerOriginalY;
    this.playerSprite.setScale(1);
    
    // 腿部动画
    this.tweens.add({
      targets: this.playerLegs,
      angle: 15,
      duration: 80,
      yoyo: true,
      onComplete: () => {
        this.playerLegs.angle = 0;
      },
    });

    // 向前冲刺
    this.tweens.add({
      targets: this.playerSprite,
      y: this.playerOriginalY - 50,
      duration: 100,
      ease: 'Power2',
      onComplete: () => {
        // 挥剑动画
        this.tweens.add({
          targets: this.playerSword,
          angle: 60,
          duration: 80,
          ease: 'Power3',
          onComplete: () => {
            // 剑气特效
            this.slashEmitter.setPosition(this.playerSprite.x + 30, this.playerSprite.y - 30);
            this.slashEmitter.explode(5);

            // 恢复剑的位置
            this.tweens.add({
              targets: this.playerSword,
              angle: -25,
              duration: 200,
              ease: 'Power2',
            });
          },
        });

        // 返回原位
        this.tweens.add({
          targets: this.playerSprite,
          x: this.playerOriginalX,
          y: this.playerOriginalY,
          duration: 150,
          ease: 'Power2',
          delay: 100,
        });
      },
    });

    // 屏幕震动
    this.cameras.main.shake(120, 0.008);

    // 攻击音效视觉反馈 - 屏幕闪白
    this.cameras.main.flash(50, 255, 255, 255, false);
  }

  private playPowerAttackAnimation() {
    // 如果正在动画中，不再触发
    if (this.isAttacking) return;
    this.isAttacking = true;
    
    // 停止所有玩家相关的动画
    this.tweens.killTweensOf(this.playerSprite);
    this.tweens.killTweensOf(this.playerSword);
    
    // 重置到原始位置
    this.playerSprite.x = this.playerOriginalX;
    this.playerSprite.y = this.playerOriginalY;
    this.playerSprite.setScale(1);

    // 蓄力效果
    this.tweens.add({
      targets: this.playerSprite,
      scale: 1.15,
      duration: 150,
      onComplete: () => {
        // 跳跃攻击
        this.tweens.add({
          targets: this.playerSprite,
          y: this.playerOriginalY - 80,
          duration: 150,
          ease: 'Power2',
          onComplete: () => {
            // 下劈
            this.tweens.add({
              targets: this.playerSword,
              angle: 90,
              duration: 100,
              ease: 'Power4',
            });

            // 落地
            this.tweens.add({
              targets: this.playerSprite,
              x: this.playerOriginalX,
              y: this.playerOriginalY,
              scale: 1,
              duration: 100,
              ease: 'Power4',
              onComplete: () => {
                // 冲击波效果
                this.sparkEmitter.setPosition(this.playerSprite.x, this.playerSprite.y);
                this.sparkEmitter.explode(30);
                
                this.slashEmitter.setPosition(this.monsterSprite.x, this.monsterSprite.y);
                this.slashEmitter.explode(10);

                // 恢复剑位置
                this.tweens.add({
                  targets: this.playerSword,
                  angle: -25,
                  duration: 300,
                });

                this.isAttacking = false;
                
                // 恢复待机动画
                this.restoreIdleAnimations();
              },
            });
          },
        });
      },
    });

    // 强烈屏幕震动
    this.time.delayedCall(300, () => {
      this.cameras.main.shake(200, 0.02);
      this.cameras.main.flash(100, 255, 200, 0, false);
    });
  }

  private playBlockAnimation() {
    // 盾牌举起动画
    this.tweens.add({
      targets: this.playerShield,
      x: -10,
      y: -20,
      scale: 1.3,
      duration: 150,
      ease: 'Power2',
    });

    // 盾牌光效
    this.shieldEmitter.setPosition(this.playerSprite.x - 20, this.playerSprite.y - 20);
    this.shieldEmitter.explode(10);

    // 2秒后放下
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: this.playerShield,
        x: -32,
        y: 0,
        scale: 1,
        duration: 200,
      });
    });
  }

  private playHealAnimation() {
    // 玩家发光
    this.tweens.add({
      targets: this.playerSprite,
      alpha: 0.7,
      duration: 100,
      yoyo: true,
      repeat: 3,
    });

    // 绿色光环
    const healRing = this.add.circle(this.playerSprite.x, this.playerSprite.y, 10, 0x22c55e, 0.5);
    this.tweens.add({
      targets: healRing,
      scale: 5,
      alpha: 0,
      duration: 800,
      onComplete: () => healRing.destroy(),
    });

    // 显示治疗数字
    const healText = this.add.text(this.playerSprite.x, this.playerSprite.y - 40, '+10', {
      fontSize: '24px',
      fontFamily: 'sans-serif',
      color: '#22c55e',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: healText,
      y: this.playerSprite.y - 80,
      alpha: 0,
      duration: 1000,
      onComplete: () => healText.destroy(),
    });
  }

  private playMonsterHitAnimation() {
    const width = this.cameras.main.width;
    const monsterOriginalX = width / 2;

    // 停止怪物位置相关的动画，但保留呼吸等动画
    // 注意：不要停止所有动画，只停止位置相关的

    // 怪物震动 - 更剧烈
    this.tweens.add({
      targets: this.monsterSprite,
      x: { from: monsterOriginalX - 15, to: monsterOriginalX + 15 },
      duration: 40,
      yoyo: true,
      repeat: 4,
      ease: 'Power1',
      onComplete: () => {
        this.monsterSprite.x = monsterOriginalX;
      },
    });

    // 怪物缩小弹回
    this.tweens.add({
      targets: this.monsterSprite,
      scale: 0.85,
      duration: 80,
      yoyo: true,
      ease: 'Power2',
      onComplete: () => {
        this.monsterSprite.setScale(1);
      },
    });

    // 怪物身体变红
    this.tweens.add({
      targets: this.monsterBody,
      alpha: 0.5,
      duration: 60,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.monsterBody.setAlpha(1);
      },
    });

    // 血液粒子
    this.bloodEmitter.setPosition(this.monsterSprite.x, this.monsterSprite.y);
    this.bloodEmitter.explode(20);

    // 闪烁效果
    this.tweens.add({
      targets: this.monsterSprite,
      alpha: 0.4,
      duration: 60,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.monsterSprite.setAlpha(1);
      },
    });

    // 魔法粒子（暴击效果）
    if (this.comboCount >= 3) {
      this.magicEmitter.setPosition(this.monsterSprite.x, this.monsterSprite.y);
      this.magicEmitter.explode(15);
      this.addBattleMessage(`🔥 ${this.comboCount}连击！`);
    }
  }

  private playPlayerHitAnimation() {
    // 检查是否格挡
    if (this.isBlocking) {
      // 格挡成功效果
      this.shieldEmitter.setPosition(this.playerSprite.x - 20, this.playerSprite.y);
      this.shieldEmitter.explode(15);
      
      // 盾牌震动
      this.tweens.add({
        targets: this.playerShield,
        x: { from: -15, to: -5 },
        duration: 30,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          this.playerShield.x = -32;
        },
      });

      // 减少伤害的视觉反馈
      this.addBattleMessage('🛡️ 格挡成功！');
      
      // 轻微屏幕震动
      this.cameras.main.shake(80, 0.005);
      return;
    }

    // 停止玩家移动动画以防冲突
    this.tweens.killTweensOf(this.playerSprite);

    // 玩家震动 - 使用固定的原始位置
    this.tweens.add({
      targets: this.playerSprite,
      x: { from: this.playerOriginalX - 12, to: this.playerOriginalX + 12 },
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.playerSprite.x = this.playerOriginalX;
      },
    });

    // 玩家后退并恢复
    this.tweens.add({
      targets: this.playerSprite,
      y: this.playerOriginalY + 10,
      duration: 100,
      onComplete: () => {
        this.tweens.add({
          targets: this.playerSprite,
          y: this.playerOriginalY,
          duration: 100,
        });
      },
    });

    // 血液粒子
    this.bloodEmitter.setPosition(this.playerSprite.x, this.playerSprite.y - 20);
    this.bloodEmitter.explode(12);

    // 屏幕红闪
    this.cameras.main.flash(250, 150, 0, 0, false);

    // 屏幕震动
    this.cameras.main.shake(150, 0.01);

    this.addBattleMessage('💔 受到攻击！');
  }

  private playMiningEffect() {
    const width = this.cameras.main.width;
    const oreOriginalX = width / 2;
    const oreOriginalY = 175;

    // 停止矿石相关动画
    this.tweens.killTweensOf(this.oreSprite);
    
    // 重置矿石位置
    this.oreSprite.x = oreOriginalX;
    this.oreSprite.y = oreOriginalY;
    this.oreSprite.setScale(1);

    // 矿石震动 - 更剧烈
    this.tweens.add({
      targets: this.oreSprite,
      x: { from: oreOriginalX - 8, to: oreOriginalX + 8 },
      duration: 25,
      yoyo: true,
      repeat: 8,
      onComplete: () => {
        this.oreSprite.x = oreOriginalX;
      },
    });

    // 矿石缩放
    this.tweens.add({
      targets: this.oreSprite,
      scale: 0.9,
      duration: 100,
      yoyo: true,
    });

    // 火花粒子
    this.sparkEmitter.setPosition(this.oreSprite.x, this.oreSprite.y - 20);
    this.sparkEmitter.explode(25);

    // 岩石粒子
    this.rockEmitter.setPosition(this.oreSprite.x, this.oreSprite.y);
    this.rockEmitter.explode(15);

    // 金币粒子
    this.goldEmitter.setPosition(this.oreSprite.x, this.oreSprite.y - 30);
    this.goldEmitter.explode(8);

    // 屏幕震动
    this.cameras.main.shake(180, 0.012);

    // 屏幕闪黄
    this.cameras.main.flash(80, 255, 200, 0, false);
  }

  private showDamageNumber(x: number, y: number, damage: number, isPlayerDamage: boolean) {
    const color = isPlayerDamage ? '#ef4444' : '#fbbf24';
    const prefix = '-';
    const isCrit = this.comboCount >= 5 && !isPlayerDamage;
    const fontSize = isCrit ? '36px' : (this.comboCount >= 3 && !isPlayerDamage ? '30px' : '24px');

    // 主伤害数字
    const damageText = this.add.text(x + Phaser.Math.Between(-25, 25), y, `${prefix}${damage}`, {
      fontSize: fontSize,
      fontFamily: 'sans-serif',
      color: isCrit ? '#ff6600' : color,
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // 暴击文字
    if (isCrit) {
      const critText = this.add.text(x, y - 35, '💥 暴击!', {
        fontSize: '20px',
        fontFamily: 'Microsoft YaHei, sans-serif',
        color: '#ff6600',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5);

      this.tweens.add({
        targets: critText,
        y: y - 90,
        alpha: 0,
        scale: 1.5,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => critText.destroy(),
      });

      // 暴击屏幕效果
      this.cameras.main.flash(80, 255, 150, 0, false);
    }

    // 弹出动画
    damageText.setScale(0.3);
    this.tweens.add({
      targets: damageText,
      scale: isCrit ? 1.4 : 1.2,
      duration: 100,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: damageText,
          y: y - 70,
          alpha: 0,
          scale: 0.8,
          duration: 700,
          ease: 'Power2',
          onComplete: () => damageText.destroy(),
        });
      },
    });

    // 添加战斗日志
    if (!isPlayerDamage) {
      this.addBattleMessage(`⚔️ 造成 ${damage} 点伤害`);
    }
  }

  // 显示获得物品
  private showLootText(text: string) {
    const width = this.cameras.main.width;
    
    // 背景
    const lootBg = this.add.graphics();
    lootBg.fillStyle(0x000000, 0.7);
    lootBg.fillRoundedRect(width / 2 - 80, 270, 160, 40, 8);
    
    const lootText = this.add.text(width / 2, 290, text, {
      fontSize: '16px',
      fontFamily: 'Microsoft YaHei, sans-serif',
      color: '#22c55e',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // 星星效果
    for (let i = 0; i < 5; i++) {
      const star = this.add.text(
        width / 2 + Phaser.Math.Between(-60, 60),
        290 + Phaser.Math.Between(-15, 15),
        '✨',
        { fontSize: '16px' }
      ).setOrigin(0.5);
      
      this.tweens.add({
        targets: star,
        y: star.y - 40,
        alpha: 0,
        scale: 0.5,
        duration: 800,
        delay: i * 100,
        onComplete: () => star.destroy(),
      });
    }

    this.tweens.add({
      targets: [lootBg, lootText],
      y: '-=30',
      alpha: 0,
      duration: 1500,
      delay: 500,
      ease: 'Power2',
      onComplete: () => {
        lootBg.destroy();
        lootText.destroy();
      },
    });

    this.addBattleMessage('🎉 ' + text);
  }

  // 显示经验获得
  private showExpGain(exp: number, gold: number) {
    const width = this.cameras.main.width;
    
    if (exp > 0) {
      const expText = this.add.text(width / 2 - 40, 240, `+${exp} EXP`, {
        fontSize: '18px',
        fontFamily: 'sans-serif',
        color: '#a855f7',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5);

      this.tweens.add({
        targets: expText,
        y: 200,
        alpha: 0,
        duration: 1500,
        onComplete: () => expText.destroy(),
      });
    }

    if (gold > 0) {
      const goldText = this.add.text(width / 2 + 40, 240, `+${gold} 💰`, {
        fontSize: '18px',
        fontFamily: 'sans-serif',
        color: '#fbbf24',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5);

      this.tweens.add({
        targets: goldText,
        y: 200,
        alpha: 0,
        duration: 1500,
        onComplete: () => goldText.destroy(),
      });
    }
  }

  // 外部调用更新方法
  updateState(data: {
    monster: Monster | null;
    playerHp: number;
    maxPlayerHp: number;
    battlePhase: string;
    canMine: boolean;
  }) {
    // 检测怪物伤害
    if (data.monster && data.monster.hp < this.lastMonsterHp) {
      const damage = this.lastMonsterHp - data.monster.hp;
      this.showDamageNumber(this.monsterSprite.x, this.monsterSprite.y - 40, damage, false);
      this.playMonsterHitAnimation();
    }

    // 检测玩家伤害
    if (data.playerHp < this.lastPlayerHp) {
      const damage = this.lastPlayerHp - data.playerHp;
      // 如果在格挡，减少显示的伤害
      const displayDamage = this.isBlocking ? Math.floor(damage * 0.5) : damage;
      this.showDamageNumber(this.playerSprite.x, this.playerSprite.y - 40, displayDamage, true);
      this.playPlayerHitAnimation();
    }

    // 检测怪物死亡
    if (this.monster && !data.monster && data.canMine) {
      this.showLootText('✨ 怪物已击败！');
      this.goldEmitter.setPosition(this.monsterSprite.x, this.monsterSprite.y);
      this.goldEmitter.explode(25);
      
      // 显示经验和金币
      if (this.monster.expReward || this.monster.goldReward) {
        this.showExpGain(this.monster.expReward, this.monster.goldReward);
      }
      
      // 胜利动画
      this.playVictoryAnimation();
      
      this.comboCount = 0;
    }

    // 检测新怪物出现
    if (!this.monster && data.monster) {
      this.addBattleMessage(`⚠️ ${data.monster.name} 出现了！`);
      this.playMonsterAppearAnimation();
    }

    this.monster = data.monster;
    this.playerHp = data.playerHp;
    this.maxPlayerHp = data.maxPlayerHp;
    this.battlePhase = data.battlePhase;
    this.canMine = data.canMine;
    this.lastMonsterHp = data.monster?.hp || 0;
    this.lastPlayerHp = data.playerHp;

    this.updateVisibility();
    this.updatePlayerHpBar();
    if (this.monster) {
      this.updateMonsterHpBar();
    }
  }

  private playVictoryAnimation() {
    // 停止玩家相关动画
    this.tweens.killTweensOf(this.playerSprite);
    this.tweens.killTweensOf(this.playerSword);
    
    // 确保玩家在正确位置
    this.playerSprite.x = this.playerOriginalX;
    this.playerSprite.y = this.playerOriginalY;
    this.playerSprite.setScale(1);
    
    // 玩家胜利姿势
    this.tweens.add({
      targets: this.playerSword,
      angle: -90,
      y: -20,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: this.playerSword,
          angle: -25,
          y: -8,
          duration: 500,
          delay: 500,
          onComplete: () => {
            this.restoreIdleAnimations();
          },
        });
      },
    });

    // 玩家跳跃
    this.tweens.add({
      targets: this.playerSprite,
      y: this.playerOriginalY - 20,
      duration: 200,
      yoyo: true,
      ease: 'Power2',
      onComplete: () => {
        this.playerSprite.y = this.playerOriginalY;
      },
    });
  }

  // 恢复待机动画
  private restoreIdleAnimations() {
    // 确保玩家在正确位置
    this.playerSprite.x = this.playerOriginalX;
    this.playerSprite.y = this.playerOriginalY;
    this.playerSprite.setScale(1);
    
    // 重新添加呼吸动画
    this.tweens.add({
      targets: this.playerSprite,
      scaleY: { from: 1, to: 1.02 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 剑的轻微摆动
    this.tweens.add({
      targets: this.playerSword,
      angle: { from: -28, to: -22 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 盾牌轻微移动
    this.tweens.add({
      targets: this.playerShield,
      y: { from: 0, to: 2 },
      duration: 1300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private playMonsterAppearAnimation() {
    // 怪物出现动画
    this.monsterSprite.setScale(0);
    this.monsterSprite.setAlpha(0);
    
    this.tweens.add({
      targets: this.monsterSprite,
      scale: 1,
      alpha: 1,
      duration: 400,
      ease: 'Back.easeOut',
    });

    // 警告效果
    this.cameras.main.flash(100, 255, 100, 0, false);
  }
}

export function PhaserBattle({
  monster,
  playerHp,
  maxPlayerHp,
  battlePhase,
  canMine,
  onAttack,
  onMine,
}: PhaserBattleProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<BattleScene | null>(null);

  // 初始化游戏
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 600,
      height: 400,
      backgroundColor: '#1a1815',
      scene: BattleScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: {
        antialias: true,
        pixelArt: false,
      },
      input: {
        keyboard: true,
        mouse: true,
        touch: true,
      },
    };

    gameRef.current = new Phaser.Game(config);

    // 场景启动后获取引用并初始化
    gameRef.current.events.once('ready', () => {
      setTimeout(() => {
        if (gameRef.current) {
          const scene = gameRef.current.scene.getScene('BattleScene') as BattleScene;
          if (scene) {
            sceneRef.current = scene;
            scene.scene.restart({
              monster,
              playerHp,
              maxPlayerHp,
              battlePhase,
              canMine,
              onAttack,
              onMine,
            });
          }
        }
      }, 100);
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, []);

  // 更新游戏状态
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.updateState({
        monster,
        playerHp,
        maxPlayerHp,
        battlePhase,
        canMine,
      });
    } else if (gameRef.current) {
      // 如果场景还没准备好，尝试重启
      const scene = gameRef.current.scene.getScene('BattleScene') as BattleScene;
      if (scene) {
        sceneRef.current = scene;
        scene.scene.restart({
          monster,
          playerHp,
          maxPlayerHp,
          battlePhase,
          canMine,
          onAttack,
          onMine,
        });
      }
    }
  }, [monster, playerHp, maxPlayerHp, battlePhase, canMine, onAttack, onMine]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-lg overflow-hidden cursor-pointer"
      style={{ aspectRatio: '600 / 400' }}
    />
  );
}

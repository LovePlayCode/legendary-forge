import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import type { EquipmentType, Quality } from '@/types/game';

interface EquipmentIcon3DProps {
  type: EquipmentType;
  quality?: Quality;
  size?: number;
  className?: string;
  animate?: boolean;
}

// 品质对应的材质颜色
const qualityMaterials: Record<Quality, { primary: number; secondary: number; emissive: number; metalness: number; roughness: number }> = {
  poor: { primary: 0x9ca3af, secondary: 0x6b7280, emissive: 0x000000, metalness: 0.3, roughness: 0.8 },
  common: { primary: 0x78716c, secondary: 0x57534e, emissive: 0x000000, metalness: 0.4, roughness: 0.7 },
  uncommon: { primary: 0x22c55e, secondary: 0x16a34a, emissive: 0x0a3d1a, metalness: 0.5, roughness: 0.5 },
  rare: { primary: 0x3b82f6, secondary: 0x2563eb, emissive: 0x0a1a3d, metalness: 0.6, roughness: 0.4 },
  epic: { primary: 0xa855f7, secondary: 0x9333ea, emissive: 0x1a0a3d, metalness: 0.7, roughness: 0.3 },
  legendary: { primary: 0xf59e0b, secondary: 0xd97706, emissive: 0x3d2a0a, metalness: 0.8, roughness: 0.2 },
  mythic: { primary: 0xef4444, secondary: 0xdc2626, emissive: 0x3d0a0a, metalness: 0.9, roughness: 0.1 },
};

// 创建剑模型
const createSword = (material: THREE.MeshStandardMaterial, handleMaterial: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 剑刃
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.15, 0.3);
  bladeShape.lineTo(0.12, 1.8);
  bladeShape.lineTo(0, 2);
  bladeShape.lineTo(-0.12, 1.8);
  bladeShape.lineTo(-0.15, 0.3);
  bladeShape.closePath();

  const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 };
  const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
  const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xe8e8e8, metalness: 0.9, roughness: 0.2 });
  const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
  blade.position.set(0, 0.3, -0.04);
  group.add(blade);

  // 护手
  const guardGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.15);
  const guard = new THREE.Mesh(guardGeometry, material);
  guard.position.set(0, 0.25, 0);
  group.add(guard);

  // 剑柄
  const handleGeometry = new THREE.CylinderGeometry(0.06, 0.07, 0.5, 8);
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.set(0, -0.05, 0);
  group.add(handle);

  // 剑首
  const pommelGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const pommel = new THREE.Mesh(pommelGeometry, material);
  pommel.position.set(0, -0.35, 0);
  group.add(pommel);

  group.rotation.z = Math.PI / 4;
  return group;
};

// 创建匕首模型
const createDagger = (material: THREE.MeshStandardMaterial, handleMaterial: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 短刃
  const bladeGeometry = new THREE.ConeGeometry(0.12, 1.2, 4);
  const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xd4d4d4, metalness: 0.9, roughness: 0.15 });
  const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
  blade.rotation.z = Math.PI;
  blade.position.set(0, 0.9, 0);
  group.add(blade);

  // 护手
  const guardGeometry = new THREE.BoxGeometry(0.35, 0.08, 0.1);
  const guard = new THREE.Mesh(guardGeometry, material);
  guard.position.set(0, 0.25, 0);
  group.add(guard);

  // 柄
  const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.set(0, 0, 0);
  group.add(handle);

  group.rotation.z = Math.PI / 4;
  return group;
};

// 创建战斧模型
const createAxe = (material: THREE.MeshStandardMaterial, handleMaterial: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 斧刃
  const axeShape = new THREE.Shape();
  axeShape.moveTo(0, 0);
  axeShape.quadraticCurveTo(0.6, 0.3, 0.5, 0.8);
  axeShape.lineTo(0.1, 0.6);
  axeShape.lineTo(0.1, 0.2);
  axeShape.closePath();

  const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 };
  const axeGeometry = new THREE.ExtrudeGeometry(axeShape, extrudeSettings);
  const axeMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.85, roughness: 0.25 });
  const axeHead = new THREE.Mesh(axeGeometry, axeMaterial);
  axeHead.position.set(0, 0.8, -0.05);
  group.add(axeHead);

  // 斧柄
  const handleGeometry = new THREE.CylinderGeometry(0.06, 0.08, 1.6, 8);
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.set(0, 0, 0);
  group.add(handle);

  // 装饰环
  const ringGeometry = new THREE.TorusGeometry(0.09, 0.02, 8, 16);
  const ring = new THREE.Mesh(ringGeometry, material);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 0.6, 0);
  group.add(ring);

  group.rotation.z = Math.PI / 6;
  return group;
};

// 创建战锤模型
const createHammer = (material: THREE.MeshStandardMaterial, handleMaterial: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 锤头
  const headGeometry = new THREE.BoxGeometry(0.5, 0.35, 0.35);
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xa0a0a0, metalness: 0.9, roughness: 0.3 });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(0, 1.1, 0);
  group.add(head);

  // 锤头装饰
  const decorGeometry = new THREE.BoxGeometry(0.55, 0.05, 0.4);
  const decor = new THREE.Mesh(decorGeometry, material);
  decor.position.set(0, 1.1, 0);
  group.add(decor);

  // 锤柄
  const handleGeometry = new THREE.CylinderGeometry(0.07, 0.09, 1.4, 8);
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.set(0, 0.3, 0);
  group.add(handle);

  group.rotation.z = Math.PI / 6;
  return group;
};

// 创建弓模型
const createBow = (material: THREE.MeshStandardMaterial, handleMaterial: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 弓身曲线
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0.6, 0, 0),
    new THREE.Vector3(0, 1, 0)
  );
  const tubeGeometry = new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
  const bow = new THREE.Mesh(tubeGeometry, handleMaterial);
  group.add(bow);

  // 弓弦
  const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 2, 8);
  const stringMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  const bowString = new THREE.Mesh(stringGeometry, stringMaterial);
  bowString.position.set(0.08, 0, 0);
  group.add(bowString);

  // 握把装饰
  const gripGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8);
  const grip = new THREE.Mesh(gripGeometry, material);
  grip.position.set(0.15, 0, 0);
  group.add(grip);

  return group;
};

// 创建法杖模型
const createStaff = (material: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 杖身
  const staffGeometry = new THREE.CylinderGeometry(0.05, 0.07, 2, 8);
  const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.7 });
  const staff = new THREE.Mesh(staffGeometry, woodMaterial);
  group.add(staff);

  // 法球
  const orbGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const orbMaterial = material.clone();
  orbMaterial.transparent = true;
  orbMaterial.opacity = 0.8;
  orbMaterial.emissiveIntensity = 0.5;
  const orb = new THREE.Mesh(orbGeometry, orbMaterial);
  orb.position.set(0, 1.2, 0);
  group.add(orb);

  // 法杖头部装饰
  const crownGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 16);
  const crown = new THREE.Mesh(crownGeometry, material);
  crown.rotation.x = Math.PI / 2;
  crown.position.set(0, 0.95, 0);
  group.add(crown);

  group.rotation.z = -Math.PI / 8;
  return group;
};

// 创建长矛模型
const createSpear = (material: THREE.MeshStandardMaterial, handleMaterial: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 矛尖
  const tipGeometry = new THREE.ConeGeometry(0.1, 0.5, 4);
  const tipMaterial = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.9, roughness: 0.2 });
  const tip = new THREE.Mesh(tipGeometry, tipMaterial);
  tip.rotation.z = Math.PI;
  tip.position.set(0, 1.25, 0);
  group.add(tip);

  // 矛头装饰
  const decorGeometry = new THREE.CylinderGeometry(0.12, 0.08, 0.15, 8);
  const decor = new THREE.Mesh(decorGeometry, material);
  decor.position.set(0, 0.95, 0);
  group.add(decor);

  // 矛杆
  const shaftGeometry = new THREE.CylinderGeometry(0.04, 0.05, 2, 8);
  const shaft = new THREE.Mesh(shaftGeometry, handleMaterial);
  shaft.position.set(0, -0.1, 0);
  group.add(shaft);

  group.rotation.z = Math.PI / 6;
  return group;
};

// 创建盾牌模型
const createShield = (material: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 盾牌主体
  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(0, 0.8);
  shieldShape.quadraticCurveTo(0.6, 0.7, 0.7, 0);
  shieldShape.quadraticCurveTo(0.5, -0.6, 0, -0.8);
  shieldShape.quadraticCurveTo(-0.5, -0.6, -0.7, 0);
  shieldShape.quadraticCurveTo(-0.6, 0.7, 0, 0.8);

  const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 };
  const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
  const shield = new THREE.Mesh(shieldGeometry, material);
  shield.position.set(0, 0, -0.075);
  group.add(shield);

  // 中心装饰
  const bossGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const bossMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
  const boss = new THREE.Mesh(bossGeometry, bossMaterial);
  boss.position.set(0, 0, 0.1);
  group.add(boss);

  // 边框装饰
  const rimGeometry = new THREE.TorusGeometry(0.12, 0.02, 8, 16);
  const rim = new THREE.Mesh(rimGeometry, bossMaterial);
  rim.position.set(0, 0, 0.1);
  group.add(rim);

  return group;
};

// 创建护甲模型
const createArmor = (material: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 胸甲主体
  const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.45, 1, 8, 1, true);
  const body = new THREE.Mesh(bodyGeometry, material);
  group.add(body);

  // 肩甲
  const shoulderGeometry = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI);
  const leftShoulder = new THREE.Mesh(shoulderGeometry, material);
  leftShoulder.position.set(-0.55, 0.35, 0);
  leftShoulder.rotation.z = Math.PI / 4;
  group.add(leftShoulder);

  const rightShoulder = new THREE.Mesh(shoulderGeometry, material);
  rightShoulder.position.set(0.55, 0.35, 0);
  rightShoulder.rotation.z = -Math.PI / 4;
  group.add(rightShoulder);

  // 领口
  const collarGeometry = new THREE.TorusGeometry(0.25, 0.05, 8, 16);
  const collar = new THREE.Mesh(collarGeometry, material);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.5, 0);
  group.add(collar);

  return group;
};

// 创建头盔模型
const createHelmet = (material: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 头盔主体
  const domeGeometry = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeometry, material);
  dome.position.set(0, 0.1, 0);
  group.add(dome);

  // 面罩
  const visorGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.3);
  const visor = new THREE.Mesh(visorGeometry, material);
  visor.position.set(0, -0.1, 0.2);
  group.add(visor);

  // 面罩开口
  const slitGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.35);
  const slitMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const slit = new THREE.Mesh(slitGeometry, slitMaterial);
  slit.position.set(0, -0.05, 0.2);
  group.add(slit);

  // 顶饰
  const crestGeometry = new THREE.BoxGeometry(0.08, 0.3, 0.4);
  const crest = new THREE.Mesh(crestGeometry, material);
  crest.position.set(0, 0.45, 0);
  group.add(crest);

  return group;
};

// 创建靴子模型
const createBoots = (material: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 左靴
  const bootGeometry = new THREE.BoxGeometry(0.25, 0.5, 0.4);
  const leftBoot = new THREE.Mesh(bootGeometry, material);
  leftBoot.position.set(-0.25, -0.1, 0);
  group.add(leftBoot);

  // 左靴脚尖
  const toeGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.2);
  const leftToe = new THREE.Mesh(toeGeometry, material);
  leftToe.position.set(-0.25, -0.3, 0.2);
  group.add(leftToe);

  // 右靴
  const rightBoot = new THREE.Mesh(bootGeometry, material);
  rightBoot.position.set(0.25, -0.1, 0);
  group.add(rightBoot);

  // 右靴脚尖
  const rightToe = new THREE.Mesh(toeGeometry, material);
  rightToe.position.set(0.25, -0.3, 0.2);
  group.add(rightToe);

  // 装饰带
  const strapGeometry = new THREE.BoxGeometry(0.28, 0.06, 0.42);
  const leftStrap = new THREE.Mesh(strapGeometry, material);
  leftStrap.position.set(-0.25, 0.05, 0);
  group.add(leftStrap);

  const rightStrap = new THREE.Mesh(strapGeometry, material);
  rightStrap.position.set(0.25, 0.05, 0);
  group.add(rightStrap);

  return group;
};

// 创建手套模型
const createGloves = (material: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 左手套
  const gloveGeometry = new THREE.BoxGeometry(0.25, 0.35, 0.15);
  const leftGlove = new THREE.Mesh(gloveGeometry, material);
  leftGlove.position.set(-0.3, 0, 0);
  group.add(leftGlove);

  // 左手指
  for (let i = 0; i < 4; i++) {
    const fingerGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.15, 8);
    const finger = new THREE.Mesh(fingerGeometry, material);
    finger.position.set(-0.38 + i * 0.06, 0.22, 0);
    group.add(finger);
  }

  // 右手套
  const rightGlove = new THREE.Mesh(gloveGeometry, material);
  rightGlove.position.set(0.3, 0, 0);
  group.add(rightGlove);

  // 右手指
  for (let i = 0; i < 4; i++) {
    const fingerGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.15, 8);
    const finger = new THREE.Mesh(fingerGeometry, material);
    finger.position.set(0.22 + i * 0.06, 0.22, 0);
    group.add(finger);
  }

  // 护腕装饰
  const cuffGeometry = new THREE.BoxGeometry(0.28, 0.08, 0.18);
  const leftCuff = new THREE.Mesh(cuffGeometry, material);
  leftCuff.position.set(-0.3, -0.2, 0);
  group.add(leftCuff);

  const rightCuff = new THREE.Mesh(cuffGeometry, material);
  rightCuff.position.set(0.3, -0.2, 0);
  group.add(rightCuff);

  return group;
};

// 创建披风模型
const createCloak = (material: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 披风主体
  const cloakShape = new THREE.Shape();
  cloakShape.moveTo(0, 0.6);
  cloakShape.quadraticCurveTo(0.8, 0.4, 0.7, -0.6);
  cloakShape.lineTo(0, -0.8);
  cloakShape.lineTo(-0.7, -0.6);
  cloakShape.quadraticCurveTo(-0.8, 0.4, 0, 0.6);

  const extrudeSettings = { depth: 0.05, bevelEnabled: false };
  const cloakGeometry = new THREE.ExtrudeGeometry(cloakShape, extrudeSettings);
  const cloak = new THREE.Mesh(cloakGeometry, material);
  cloak.position.set(0, 0, -0.025);
  group.add(cloak);

  // 领扣
  const claspGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const claspMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });
  const clasp = new THREE.Mesh(claspGeometry, claspMaterial);
  clasp.position.set(0, 0.5, 0.05);
  group.add(clasp);

  return group;
};

// 创建戒指模型
const createRing = (material: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 戒环
  const ringGeometry = new THREE.TorusGeometry(0.35, 0.08, 16, 32);
  const ring = new THREE.Mesh(ringGeometry, material);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  // 宝石底座
  const settingGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.1, 6);
  const setting = new THREE.Mesh(settingGeometry, material);
  setting.position.set(0, 0.4, 0);
  group.add(setting);

  // 宝石
  const gemGeometry = new THREE.OctahedronGeometry(0.12);
  const gemMaterial = material.clone();
  gemMaterial.transparent = true;
  gemMaterial.opacity = 0.9;
  const gem = new THREE.Mesh(gemGeometry, gemMaterial);
  gem.position.set(0, 0.5, 0);
  gem.rotation.x = Math.PI / 4;
  group.add(gem);

  return group;
};

// 创建项链模型
const createAmulet = (material: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 链条
  const chainCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 0.5, 0),
    new THREE.Vector3(-0.3, 0.3, 0),
    new THREE.Vector3(0, 0.1, 0),
    new THREE.Vector3(0.3, 0.3, 0),
    new THREE.Vector3(0.4, 0.5, 0),
  ]);
  const chainGeometry = new THREE.TubeGeometry(chainCurve, 32, 0.02, 8, false);
  const chainMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });
  const chain = new THREE.Mesh(chainGeometry, chainMaterial);
  group.add(chain);

  // 吊坠底座
  const pendantGeometry = new THREE.CylinderGeometry(0.2, 0.18, 0.08, 8);
  const pendant = new THREE.Mesh(pendantGeometry, material);
  pendant.position.set(0, -0.15, 0);
  group.add(pendant);

  // 中心宝石
  const gemGeometry = new THREE.SphereGeometry(0.12, 32, 32);
  const gemMaterial = material.clone();
  gemMaterial.emissiveIntensity = 0.3;
  const gem = new THREE.Mesh(gemGeometry, gemMaterial);
  gem.position.set(0, -0.15, 0.08);
  group.add(gem);

  return group;
};

// 创建腰带模型
const createBelt = (material: THREE.MeshStandardMaterial): THREE.Group => {
  const group = new THREE.Group();

  // 腰带主体
  const beltGeometry = new THREE.BoxGeometry(1.4, 0.2, 0.08);
  const leatherMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 });
  const belt = new THREE.Mesh(beltGeometry, leatherMaterial);
  group.add(belt);

  // 腰带扣
  const buckleGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.05);
  const buckle = new THREE.Mesh(buckleGeometry, material);
  buckle.position.set(0, 0, 0.06);
  group.add(buckle);

  // 装饰宝石
  const gemGeometry = new THREE.SphereGeometry(0.06, 16, 16);
  const gem = new THREE.Mesh(gemGeometry, material);
  gem.position.set(0, 0, 0.1);
  group.add(gem);

  // 侧面装饰
  const sideDecorGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.22, 8);
  const leftDecor = new THREE.Mesh(sideDecorGeometry, material);
  leftDecor.rotation.z = Math.PI / 2;
  leftDecor.position.set(-0.5, 0, 0.05);
  group.add(leftDecor);

  const rightDecor = new THREE.Mesh(sideDecorGeometry, material);
  rightDecor.rotation.z = Math.PI / 2;
  rightDecor.position.set(0.5, 0, 0.05);
  group.add(rightDecor);

  return group;
};

// 模型创建函数映射
const createModelFunctions: Record<EquipmentType, (material: THREE.MeshStandardMaterial, handleMaterial: THREE.MeshStandardMaterial) => THREE.Group> = {
  sword: createSword,
  dagger: createDagger,
  axe: createAxe,
  hammer: createHammer,
  bow: createBow,
  staff: (m) => createStaff(m),
  spear: createSpear,
  shield: (m) => createShield(m),
  armor: (m) => createArmor(m),
  helmet: (m) => createHelmet(m),
  boots: (m) => createBoots(m),
  gloves: (m) => createGloves(m),
  cloak: (m) => createCloak(m),
  ring: (m) => createRing(m),
  amulet: (m) => createAmulet(m),
  belt: (m) => createBelt(m),
};

export const EquipmentIcon3D = ({ type, quality = 'common', size = 64, className = '', animate = true }: EquipmentIcon3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number>(0);

  const colors = useMemo(() => qualityMaterials[quality], [quality]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 3, 4);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-2, -1, -2);
    scene.add(backLight);

    // 创建材质
    const primaryMaterial = new THREE.MeshStandardMaterial({
      color: colors.primary,
      metalness: colors.metalness,
      roughness: colors.roughness,
      emissive: colors.emissive,
      emissiveIntensity: 0.2,
    });

    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.7,
      metalness: 0.1,
    });

    // 创建模型
    const createFn = createModelFunctions[type];
    const model = createFn(primaryMaterial, handleMaterial);
    model.scale.setScalar(1.2);
    scene.add(model);
    modelRef.current = model;

    // 动画循环
    const animateLoop = () => {
      animationRef.current = requestAnimationFrame(animateLoop);

      if (animate && modelRef.current) {
        modelRef.current.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    };
    animateLoop();

    // 清理
    return () => {
      cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [type, quality, size, colors, animate]);

  return <div ref={containerRef} className={className} style={{ width: size, height: size }} />;
};

export default EquipmentIcon3D;

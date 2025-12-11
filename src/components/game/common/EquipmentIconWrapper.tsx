import { useState, useEffect, useSyncExternalStore } from 'react';
import type { EquipmentType, Quality } from '@/types/game';
import { EquipmentIcon } from './EquipmentIcon';
import { EquipmentIcon3D } from './EquipmentIcon3D';

interface EquipmentIconWrapperProps {
  type: EquipmentType;
  quality?: Quality;
  size?: number;
  className?: string;
  use3D?: boolean;
  animate?: boolean;
  seed?: string; // Add seed prop
}

// 全局状态管理
let globalUse3D = false;
const listeners = new Set<() => void>();

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const getSnapshot = () => globalUse3D;

export const setGlobalUse3D = (value: boolean) => {
  globalUse3D = value;
  listeners.forEach((listener) => listener());
};

export const getGlobalUse3D = () => globalUse3D;

// 使用 useSyncExternalStore 实现响应式全局状态
export const useGlobalUse3D = () => {
  return useSyncExternalStore(subscribe, getSnapshot);
};

export const EquipmentIconWrapper = ({
  type,
  quality = 'common',
  size = 48,
  className = '',
  use3D,
  animate = true,
  seed,
}: EquipmentIconWrapperProps) => {
  const global3D = useGlobalUse3D();
  const shouldUse3D = use3D ?? global3D;

  if (shouldUse3D) {
    return (
      <EquipmentIcon3D
        type={type}
        quality={quality}
        size={size}
        className={className}
        animate={animate}
      />
    );
  }

  return (
    <EquipmentIcon
      type={type}
      quality={quality}
      size={size}
      className={className}
      seed={seed}
    />
  );
};

// 3D 图标切换按钮组件
export const Icon3DToggle = () => {
  const is3D = useGlobalUse3D();

  const toggle = () => {
    setGlobalUse3D(!is3D);
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 text-xs rounded-lg border-2 transition-all font-medium"
      style={{
        backgroundColor: is3D ? '#3b82f6' : '#f3f4f6',
        color: is3D ? 'white' : '#374151',
        borderColor: is3D ? '#2563eb' : '#d1d5db',
      }}
    >
      {is3D ? '3D 图标' : '2D 图标'}
    </button>
  );
};

export default EquipmentIconWrapper;

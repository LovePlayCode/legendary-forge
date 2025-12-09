import { useState, useEffect, useCallback } from 'react';
import { GiAnvilImpact, GiFireBowl, GiHammerNails } from 'react-icons/gi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Recipe } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

interface ForgingGameProps {
  recipe: Recipe | null;
  isForging: boolean;
  onStartForge: () => void;
  onForgeComplete: (performance: number) => void;
}

export function ForgingGame({ recipe, isForging, onStartForge, onForgeComplete }: ForgingGameProps) {
  const { forgeSpeed, getMaterial } = useGameStore();
  const [progress, setProgress] = useState(0);
  const [temperature, setTemperature] = useState(50);
  const [targetTemp, setTargetTemp] = useState(50);
  const [tempScore, setTempScore] = useState(0);
  const [tempCount, setTempCount] = useState(0);
  const [qteActive, setQteActive] = useState(false);
  const [qteSuccess, setQteSuccess] = useState<boolean | null>(null);
  const [qteWindow, setQteWindow] = useState(0);
  const [forgeComplete, setForgeComplete] = useState(false);

  const canCraft = recipe?.materials.every((mat) => {
    const owned = getMaterial(mat.type);
    return owned && owned.quantity >= mat.quantity;
  });

  // Temperature drift
  useEffect(() => {
    if (!isForging) return;

    const interval = setInterval(() => {
      setTemperature((prev) => {
        const drift = (Math.random() - 0.5) * 10;
        return Math.max(0, Math.min(100, prev + drift));
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isForging]);

  // Progress update
  useEffect(() => {
    if (!isForging || forgeComplete) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (2 * forgeSpeed);
        
        // Calculate temperature score
        const tempDiff = Math.abs(temperature - targetTemp);
        const tempPoints = tempDiff < 10 ? 1 : tempDiff < 20 ? 0.5 : 0;
        setTempScore((s) => s + tempPoints);
        setTempCount((c) => c + 1);

        if (newProgress >= 100) {
          setForgeComplete(true);
          setQteActive(true);
          setQteWindow(100);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isForging, forgeSpeed, temperature, targetTemp, forgeComplete]);

  // QTE countdown
  useEffect(() => {
    if (!qteActive || qteSuccess !== null) return;

    const interval = setInterval(() => {
      setQteWindow((prev) => {
        if (prev <= 0) {
          setQteSuccess(false);
          return 0;
        }
        return prev - 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [qteActive, qteSuccess]);

  // Complete forging after QTE
  useEffect(() => {
    if (qteSuccess === null) return;

    const timeout = setTimeout(() => {
      const avgTempScore = tempCount > 0 ? tempScore / tempCount : 0.5;
      const qteBonus = qteSuccess ? 0.2 : 0;
      const performance = 0.8 + (avgTempScore * 0.2) + qteBonus;
      
      onForgeComplete(Math.min(1.2, performance));
      
      // Reset
      setProgress(0);
      setTemperature(50);
      setTempScore(0);
      setTempCount(0);
      setQteActive(false);
      setQteSuccess(null);
      setForgeComplete(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [qteSuccess, tempScore, tempCount, onForgeComplete]);

  const handleQteClick = useCallback(() => {
    if (!qteActive || qteSuccess !== null) return;
    setQteSuccess(qteWindow > 30);
  }, [qteActive, qteSuccess, qteWindow]);

  const handleTempAdjust = (value: number[]) => {
    if (!isForging) return;
    setTemperature(value[0]);
  };

  const getTempZone = () => {
    const diff = Math.abs(temperature - targetTemp);
    if (diff < 10) return 'perfect';
    if (diff < 20) return 'good';
    return 'bad';
  };

  if (!recipe) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center text-center">
        <GiAnvilImpact className="text-8xl text-forge-brown/40 mb-4 animate-soft-pulse" />
        <p className="text-sm text-forge-brown/60">选择一个配方开始锻造</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] flex flex-col">
      {/* Forge Visual */}
      <div className="flex-1 flex items-center justify-center relative">
        <div
          className={cn(
            'w-32 h-32 rounded-3xl flex items-center justify-center transition-all duration-200 border-3 border-forge-brown shadow-lg',
            isForging ? 'animate-soft-pulse' : '',
            getTempZone() === 'perfect'
              ? 'bg-pixel-mint'
              : getTempZone() === 'good'
              ? 'bg-pixel-lemon'
              : 'bg-pixel-pink'
          )}
        >
          <GiFireBowl
            className={cn(
              'text-6xl transition-colors',
              getTempZone() === 'perfect'
                ? 'text-green-600'
                : getTempZone() === 'good'
                ? 'text-amber-600'
                : 'text-red-500'
            )}
          />
        </div>

        {/* QTE Overlay */}
        {qteActive && qteSuccess === null && (
          <div className="absolute inset-0 bg-forge-dark/60 rounded-2xl flex items-center justify-center">
            <button
              onClick={handleQteClick}
              className="w-24 h-24 bg-pixel-lemon rounded-2xl border-3 border-forge-brown shadow-lg flex items-center justify-center hover:bg-forge-yellow transition-colors animate-soft-bounce"
            >
              <GiHammerNails className="text-5xl text-forge-dark" />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="h-4 bg-forge-sand rounded-lg border-2 border-forge-brown overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pixel-pink to-forge-orange transition-all duration-50 rounded-md"
                  style={{ width: `${qteWindow}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* QTE Result */}
        {qteSuccess !== null && (
          <div className="absolute inset-0 bg-forge-dark/60 rounded-2xl flex items-center justify-center">
            <div
              className={cn(
                'text-sm px-6 py-3 rounded-xl border-3 border-forge-brown animate-bounce-in shadow-lg',
                qteSuccess ? 'bg-pixel-mint text-green-700' : 'bg-pixel-pink text-red-600'
              )}
            >
              {qteSuccess ? '⭐ 完美! ⭐' : '💥 失误... 💥'}
            </div>
          </div>
        )}
      </div>

      {/* Temperature Control */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-xs text-forge-dark">炉温控制</span>
          <span
            className={cn(
              'text-xs px-3 py-1 rounded-lg border-2 border-forge-brown',
              getTempZone() === 'perfect'
                ? 'bg-pixel-mint text-green-700'
                : getTempZone() === 'good'
                ? 'bg-pixel-lemon text-amber-700'
                : 'bg-pixel-pink text-red-600'
            )}
          >
            {Math.round(temperature)}°C
          </span>
        </div>
        <div className="relative">
          {/* Target zone indicator */}
          <div
            className="absolute top-0 h-full bg-pixel-mint/50 rounded-lg"
            style={{
              left: `${targetTemp - 10}%`,
              width: '20%',
            }}
          />
          <Slider
            value={[temperature]}
            onValueChange={handleTempAdjust}
            max={100}
            step={1}
            disabled={!isForging}
            className="relative z-10"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-xs text-forge-dark">锻造进度</span>
          <span className="text-xs text-forge-orange font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-6 bg-forge-sand rounded-xl border-2 border-forge-brown overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-forge-peach to-forge-orange transition-all duration-100 rounded-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Start Button */}
      <Button
        onClick={onStartForge}
        disabled={isForging || !canCraft}
        className={cn(
          'w-full h-14 text-sm rounded-xl border-3 border-forge-brown shadow-md transition-all',
          canCraft
            ? 'bg-forge-peach hover:bg-forge-orange text-forge-dark hover:text-white'
            : 'bg-forge-sand text-forge-brown/50'
        )}
      >
        <GiAnvilImpact className="mr-2 text-2xl" />
        {isForging ? '锻造中...' : canCraft ? '开始锻造' : '材料不足'}
      </Button>
    </div>
  );
}

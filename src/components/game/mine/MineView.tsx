import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { mineLevels } from '@/data/mine';
import { Equipment, EquipmentSlot, equipmentCategoryMap, equipmentTypeNames } from '@/types/game';
import { GiSwordman, GiShield, GiRing, GiWarPick, GiCrossedSwords, GiHearts, GiTwoCoins, GiMineExplosion, GiSkullCrossedBones, GiTreasureMap } from 'react-icons/gi';

const qualityColors: Record<string, string> = {
  poor: 'text-gray-400',
  common: 'text-gray-200',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-orange-400',
  mythic: 'text-red-400',
};

const qualityBgColors: Record<string, string> = {
  poor: 'bg-gray-600/30',
  common: 'bg-gray-500/30',
  uncommon: 'bg-green-600/30',
  rare: 'bg-blue-600/30',
  epic: 'bg-purple-600/30',
  legendary: 'bg-orange-600/30',
  mythic: 'bg-red-600/30',
};

export function MineView() {
  const {
    inventory,
    playerEquipment,
    mineState,
    equipItem,
    unequipItem,
    getPlayerPower,
    enterMine,
    performBattle,
    performMining,
    spawnMonster,
  } = useGameStore();

  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showEquipSelect, setShowEquipSelect] = useState<EquipmentSlot | null>(null);

  const { attack, defense, total } = getPlayerPower();
  const currentLevelData = mineLevels.find((l) => l.level === mineState.currentLevel);

  // 首次进入矿场时自动生成怪物
  useEffect(() => {
    if (!mineState.currentMonster && !mineState.canMine && mineState.battlePhase !== 'defeat') {
      spawnMonster();
    }
  }, [mineState.currentMonster, mineState.canMine, mineState.battlePhase, spawnMonster]);

  // 获取可装备的物品
  const getEquippableItems = (slot: EquipmentSlot): Equipment[] => {
    return inventory.filter((item) => {
      if (item.category !== 'equipment') return false;
      const equipment = item as Equipment;
      const category = equipmentCategoryMap[equipment.type];
      return category === slot;
    }) as Equipment[];
  };

  const handleEquip = (slot: EquipmentSlot, equipment: Equipment) => {
    equipItem(slot, equipment);
    setShowEquipSelect(null);
  };

  const renderEquipmentSlot = (slot: EquipmentSlot, label: string, Icon: React.ElementType) => {
    const equipment = playerEquipment[slot];
    const equippableItems = getEquippableItems(slot);

    return (
      <Dialog open={showEquipSelect === slot} onOpenChange={(open) => setShowEquipSelect(open ? slot : null)}>
        <DialogTrigger asChild>
          <div
            className={cn(
              'p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-primary',
              equipment ? `${qualityBgColors[equipment.quality]} border-solid` : 'border-muted-foreground/30 bg-muted/20'
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className="text-2xl text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                {equipment ? (
                  <>
                    <p className={cn('text-sm font-medium truncate', qualityColors[equipment.quality])}>
                      {equipment.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {equipment.attack ? <span>⚔️ {equipment.attack}</span> : null}
                      {equipment.defense ? <span>🛡️ {equipment.defense}</span> : null}
                      <span className="text-yellow-500">
                        {equipment.durability}/{equipment.maxDurability}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">空</p>
                )}
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>选择{label}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-80">
            <div className="space-y-2">
              {equipment && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    unequipItem(slot);
                    setShowEquipSelect(null);
                  }}
                >
                  卸下当前装备
                </Button>
              )}
              {equippableItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">没有可装备的物品</p>
              ) : (
                equippableItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'p-3 rounded-lg cursor-pointer transition-all hover:bg-muted',
                      qualityBgColors[item.quality]
                    )}
                    onClick={() => handleEquip(slot, item)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn('font-medium', qualityColors[item.quality])}>{item.name}</p>
                        <p className="text-xs text-muted-foreground">{equipmentTypeNames[item.type]}</p>
                      </div>
                      <div className="text-right text-sm">
                        {item.attack ? <p>⚔️ +{item.attack}</p> : null}
                        {item.defense ? <p>🛡️ +{item.defense}</p> : null}
                        <p className="text-xs text-yellow-500">
                          耐久: {item.durability}/{item.maxDurability}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* 左侧 - 装备面板 */}
      <div className="col-span-3 space-y-4">
        <Card className="bg-card/80 backdrop-blur border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <GiSwordman className="text-primary" />
              装备栏
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {renderEquipmentSlot('weapon', '武器', GiCrossedSwords)}
            {renderEquipmentSlot('armor', '防具', GiShield)}
            {renderEquipmentSlot('accessory', '饰品', GiRing)}

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">攻击力</span>
                <span className="font-bold text-red-400">⚔️ {attack}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">防御力</span>
                <span className="font-bold text-blue-400">🛡️ {defense}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-1 border-t border-border mt-1">
                <span className="text-muted-foreground">总战斗力</span>
                <span className="font-bold text-yellow-400">💪 {total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 玩家状态 */}
        <Card className="bg-card/80 backdrop-blur border-2">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <GiHearts className="text-red-500 text-xl" />
              <span className="text-sm">生命值</span>
            </div>
            <Progress
              value={(mineState.playerHp / mineState.maxPlayerHp) * 100}
              className="h-3"
            />
            <p className="text-right text-xs text-muted-foreground mt-1">
              {mineState.playerHp} / {mineState.maxPlayerHp}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 中央 - 战斗/挖矿区域 */}
      <div className="col-span-6 space-y-4">
        {/* 层级信息 */}
        <Card className="bg-gradient-to-r from-stone-800/80 to-stone-700/80 backdrop-blur border-2">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GiMineExplosion className="text-3xl text-amber-500" />
                <div>
                  <h2 className="text-xl font-bold">{currentLevelData?.name || '未知矿场'}</h2>
                  <p className="text-sm text-muted-foreground">
                    第 {mineState.currentLevel} 层 · 推荐战斗力: {currentLevelData?.requiredPower || 0}
                  </p>
                </div>
              </div>
              <Dialog open={showLevelSelect} onOpenChange={setShowLevelSelect}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <GiTreasureMap className="mr-2" />
                    切换层级
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>选择矿场层级</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {mineLevels.map((level) => {
                      const isUnlocked = mineState.unlockedLevels.includes(level.level);
                      const isCurrent = mineState.currentLevel === level.level;
                      
                      return (
                        <div
                          key={level.level}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all',
                            isUnlocked
                              ? isCurrent
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50 cursor-pointer'
                              : 'border-muted bg-muted/20 opacity-50 cursor-not-allowed'
                          )}
                          onClick={() => {
                            if (isUnlocked) {
                              enterMine(level.level);
                              setShowLevelSelect(false);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold">{level.name}</h3>
                            <Badge variant={isUnlocked ? 'default' : 'secondary'}>
                              Lv.{level.level}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{level.description}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={total >= level.requiredPower ? 'text-green-400' : 'text-red-400'}>
                              💪 {level.requiredPower}
                            </span>
                            {!isUnlocked && <span className="text-muted-foreground">🔒 未解锁</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* 战斗区域 */}
        <Card className="bg-gradient-to-b from-stone-900/90 to-stone-800/90 backdrop-blur border-2 min-h-[300px]">
          <CardContent className="py-6 flex flex-col items-center justify-center">
            {mineState.battlePhase === 'defeat' ? (
              <div className="text-center space-y-4">
                <GiSkullCrossedBones className="text-6xl text-red-500 mx-auto animate-pulse" />
                <h3 className="text-xl font-bold text-red-400">战斗失败</h3>
                <p className="text-muted-foreground">你被击败了，需要恢复后再来</p>
                <Button onClick={() => enterMine(mineState.currentLevel)}>
                  重新进入矿场
                </Button>
              </div>
            ) : mineState.currentMonster ? (
              <div className="text-center space-y-4 w-full">
                {/* 怪物信息 */}
                <div className="animate-bounce-in">
                  <div className="w-24 h-24 mx-auto bg-red-900/30 rounded-full flex items-center justify-center border-2 border-red-500/50">
                    <GiSkullCrossedBones className="text-5xl text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold mt-3">{mineState.currentMonster.name}</h3>
                  <div className="flex items-center justify-center gap-4 text-sm mt-2">
                    <span className="text-red-400">⚔️ {mineState.currentMonster.attack}</span>
                    <span className="text-blue-400">🛡️ {mineState.currentMonster.defense}</span>
                    <span className="text-yellow-400">
                      <GiTwoCoins className="inline mr-1" />
                      {mineState.currentMonster.goldReward}
                    </span>
                  </div>
                </div>

                {/* 怪物血条 */}
                <div className="w-full max-w-xs mx-auto">
                  <Progress
                    value={(mineState.currentMonster.hp / mineState.currentMonster.maxHp) * 100}
                    className="h-4"
                  />
                  <p className="text-xs text-center mt-1 text-muted-foreground">
                    {mineState.currentMonster.hp} / {mineState.currentMonster.maxHp}
                  </p>
                </div>

                {/* 战斗按钮 */}
                <Button
                  size="lg"
                  className="mt-4"
                  onClick={performBattle}
                  disabled={mineState.battlePhase === 'fighting'}
                >
                  <GiCrossedSwords className="mr-2" />
                  {mineState.battlePhase === 'fighting' ? '战斗中...' : '攻击'}
                </Button>
              </div>
            ) : mineState.canMine ? (
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-amber-900/30 rounded-full flex items-center justify-center border-2 border-amber-500/50 animate-pulse">
                  <GiWarPick className="text-5xl text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-amber-400">可以挖矿了！</h3>
                <p className="text-muted-foreground">击败怪物后可以进行挖矿</p>
                <Button size="lg" onClick={performMining} className="bg-amber-600 hover:bg-amber-700">
                  <GiWarPick className="mr-2" />
                  开始挖矿
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-muted/30 rounded-full flex items-center justify-center border-2 border-muted-foreground/30">
                  <GiMineExplosion className="text-5xl text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">正在探索矿场...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 右侧 - 战斗日志 */}
      <div className="col-span-3">
        <Card className="bg-card/80 backdrop-blur border-2 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">战斗日志</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {mineState.battleLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">暂无战斗记录</p>
                ) : (
                  [...mineState.battleLogs].reverse().map((log) => (
                    <div
                      key={log.id}
                      className={cn(
                        'text-sm p-2 rounded-lg',
                        log.type === 'attack' && 'bg-red-900/20 text-red-300',
                        log.type === 'damage' && 'bg-orange-900/20 text-orange-300',
                        log.type === 'victory' && 'bg-green-900/20 text-green-300',
                        log.type === 'defeat' && 'bg-red-900/30 text-red-400',
                        log.type === 'loot' && 'bg-yellow-900/20 text-yellow-300',
                        log.type === 'info' && 'bg-blue-900/20 text-blue-300'
                      )}
                    >
                      {log.message}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

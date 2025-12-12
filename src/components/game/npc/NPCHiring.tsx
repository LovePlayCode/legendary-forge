import { useState } from 'react';
import { GiPerson, GiTwoCoins, GiCrown, GiSparkles } from 'react-icons/gi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameStore } from '@/store/gameStore';
import { useToast } from '@/hooks/use-toast';
import { NPCQuality } from '@/types/game';
import { qualityConfig, hireCost, getNPCBonusDescription } from '@/data/hiredNpcs';
import { NPCAvatar } from './NPCAvatar';
import { NPCGallery } from './NPCGallery';
import { cn } from '@/lib/utils';

const qualityList: NPCQuality[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

const qualityColors: Record<NPCQuality, string> = {
  common: 'text-gray-300',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-orange-400',
};

const qualityBgColors: Record<NPCQuality, string> = {
  common: 'bg-gray-500/20 border-gray-500/50',
  uncommon: 'bg-green-500/20 border-green-500/50',
  rare: 'bg-blue-500/20 border-blue-500/50',
  epic: 'bg-purple-500/20 border-purple-500/50',
  legendary: 'bg-orange-500/20 border-orange-500/50',
};

export function NPCHiring() {
  const { gold, hiredNPCs, maxHiredNPCs, hireNPC, fireNPC } = useGameStore();
  const { toast } = useToast();
  const [selectedQuality, setSelectedQuality] = useState<NPCQuality>('common');
  const [activeTab, setActiveTab] = useState<'hire' | 'gallery'>('hire');

  const handleHire = () => {
    if (hireNPC(selectedQuality)) {
      toast({
        title: '雇佣成功!',
        description: `成功雇佣了一位${qualityConfig[selectedQuality].name}品质的 NPC`,
      });
    } else {
      toast({
        title: '雇佣失败',
        description: hiredNPCs.length >= maxHiredNPCs
          ? '已达到最大雇佣数量'
          : '金币不足',
        variant: 'destructive',
      });
    }
  };

  const handleFire = (npcId: string) => {
    fireNPC(npcId);
    toast({
      title: '解雇成功',
      description: '已解雇该 NPC',
    });
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-primary/20 flex items-center justify-center rounded-2xl border-2 border-primary/50 shadow-sm">
          <GiPerson className="text-3xl text-primary animate-soft-bounce" />
        </div>
        <div>
          <h1 className="text-lg text-foreground font-pixel tracking-wide">
            NPC 雇佣管理
          </h1>
          <p className="text-sm text-muted-foreground">
            雇佣员工来提升你的锻造效率
          </p>
        </div>
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'hire' | 'gallery')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="hire" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            招聘中心
          </TabsTrigger>
          <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            NPC 画廊
          </TabsTrigger>
        </TabsList>

        {/* 招聘标签页 */}
        <TabsContent value="hire" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 招聘面板 */}
            <Card className="overflow-hidden bg-card/80 backdrop-blur border-2">
              <CardHeader className="bg-muted/50 border-b-2 border-border pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground text-sm">
                  <GiCrown className="text-2xl text-amber-500" />
                  招聘 NPC
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* 品质选择 */}
                <div className="space-y-3">
                  <p className="text-sm text-foreground font-medium">选择品质等级</p>
                  <div className="grid grid-cols-5 gap-2">
                    {qualityList.map((quality) => (
                      <button
                        key={quality}
                        onClick={() => setSelectedQuality(quality)}
                        className={cn(
                          'py-3 px-2 rounded-xl border-2 transition-all text-xs font-bold',
                          selectedQuality === quality
                            ? `${qualityBgColors[quality]} scale-105 shadow-lg`
                            : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/50'
                        )}
                      >
                        <span className={selectedQuality === quality ? qualityColors[quality] : ''}>
                          {qualityConfig[quality].name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 费用显示 */}
                <div className="bg-muted/30 rounded-xl p-4 border-2 border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">雇佣费用</span>
                    <div className="flex items-center gap-2">
                      <GiTwoCoins className="text-xl text-yellow-500" />
                      <span className="text-2xl font-bold text-foreground">
                        {hireCost[selectedQuality]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">当前金币</span>
                    <span className={gold >= hireCost[selectedQuality] ? 'text-green-400' : 'text-red-400'}>
                      {gold}
                    </span>
                  </div>
                </div>

                {/* 品质说明 */}
                <div className="bg-muted/20 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <GiSparkles className={cn('text-lg', qualityColors[selectedQuality])} />
                    <span className={cn('font-medium', qualityColors[selectedQuality])}>
                      {qualityConfig[selectedQuality].name}品质
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    品质越高的 NPC 拥有更强的加成效果，但雇佣费用也更高。
                  </p>
                </div>

                {/* 雇佣按钮 */}
                <Button
                  onClick={handleHire}
                  disabled={gold < hireCost[selectedQuality] || hiredNPCs.length >= maxHiredNPCs}
                  className="w-full"
                  size="lg"
                >
                  <GiPerson className="mr-2" />
                  雇佣 {qualityConfig[selectedQuality].name} NPC
                </Button>

                {hiredNPCs.length >= maxHiredNPCs && (
                  <p className="text-xs text-red-400 text-center">
                    已达到最大雇佣数量 ({maxHiredNPCs})
                  </p>
                )}
              </CardContent>
            </Card>

            {/* 已雇佣 NPC 列表 */}
            <Card className="overflow-hidden bg-card/80 backdrop-blur border-2">
              <CardHeader className="bg-muted/50 border-b-2 border-border pb-4">
                <CardTitle className="flex items-center justify-between text-foreground text-sm">
                  <span className="flex items-center gap-2">
                    <GiPerson className="text-2xl text-primary" />
                    已雇佣的 NPC
                  </span>
                  <Badge variant="secondary">
                    {hiredNPCs.length}/{maxHiredNPCs}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[450px]">
                  {hiredNPCs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <GiPerson className="text-5xl text-muted-foreground/30 mb-4" />
                      <p className="text-sm text-muted-foreground">暂无雇佣的 NPC</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        雇佣 NPC 来获得锻造加成
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {hiredNPCs.map((npc) => (
                        <div
                          key={npc.id}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all hover:shadow-md bg-card/50',
                            qualityBgColors[npc.quality]
                          )}
                        >
                          <div className="flex gap-4">
                            {/* 头像 */}
                            <div className="flex-shrink-0">
                              <NPCAvatar
                                profession={npc.profession}
                                quality={npc.quality}
                                experienceLevel={npc.experienceLevel}
                                size={80}
                                seed={npc.avatarSeed || npc.id}
                              />
                            </div>

                            {/* 信息 */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className={cn('font-bold text-sm', qualityColors[npc.quality])}>
                                    {npc.name}
                                  </h3>
                                  <p className="text-xs text-muted-foreground">{npc.personality}</p>
                                </div>
                                <Badge
                                  className={cn('text-xs', qualityBgColors[npc.quality])}
                                >
                                  {qualityConfig[npc.quality].name}
                                </Badge>
                              </div>

                              {/* 加成效果 */}
                              <div className="bg-muted/30 rounded-lg p-2 mb-3">
                                <p className="text-xs font-medium text-foreground">
                                  {getNPCBonusDescription(npc.bonus, npc.bonusValue)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  月薪: {npc.salary} 金币
                                </p>
                              </div>

                              {/* 经验等级 */}
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-muted-foreground">经验等级</span>
                                <div className="flex gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={cn(
                                        'w-3 h-3 rounded-sm border',
                                        i < npc.experienceLevel
                                          ? 'bg-yellow-500 border-yellow-600'
                                          : 'bg-muted border-muted-foreground/30'
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* 解雇按钮 */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFire(npc.id)}
                                className="w-full text-xs border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              >
                                解雇
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 画廊标签页 */}
        <TabsContent value="gallery" className="mt-4">
          <NPCGallery />
        </TabsContent>
      </Tabs>
    </div>
  );
}

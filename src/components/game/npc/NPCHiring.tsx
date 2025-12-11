import { useState } from 'react';
import { GiPerson, GiMoneyStack } from 'react-icons/gi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '@/store/gameStore';
import { useToast } from '@/hooks/use-toast';
import { NPCQuality } from '@/types/game';
import { qualityConfig, hireCost, getNPCBonusDescription } from '@/data/hiredNpcs';
import { NPCAvatar } from './NPCAvatar';
import { NPCGallery } from './NPCGallery';
import { cn } from '@/lib/utils';

const qualityList: NPCQuality[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export function NPCHiring() {
  const { gold, hiredNPCs, maxHiredNPCs, hireNPC, fireNPC } = useGameStore();
  const { toast } = useToast();
  const [selectedQuality, setSelectedQuality] = useState<NPCQuality>('common');
  const [activeTab, setActiveTab] = useState<'hire' | 'gallery'>('hire');

  const handleHire = () => {
    if (hireNPC(selectedQuality)) {
      toast({
        title: '雇佣成功!',
        description: `成功雇佣了一位${qualityConfig[selectedQuality].name}的 NPC`,
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
      {/* Title */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-pixel-mint flex items-center justify-center rounded-2xl border-3 border-forge-brown shadow-md">
          <GiPerson className="text-3xl text-forge-dark animate-soft-bounce" />
        </div>
        <h1 className="text-lg text-forge-dark">
          NPC 雇佣管理
        </h1>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'hire' | 'gallery')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hire" className="rounded-lg border-2">招聘中心</TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-lg border-2">NPC 画廊</TabsTrigger>
        </TabsList>

        {/* 招聘标签页 */}
        <TabsContent value="hire" className="space-y-6">
          {/* Hiring Section */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-pixel-mint/50 border-b-2 border-border pb-4">
              <CardTitle className="text-sm text-forge-dark">招聘 NPC</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-forge-light/50">
              {/* Quality Selection */}
              <div className="space-y-3">
                <p className="text-sm text-forge-dark font-semibold">选择品质等级</p>
                <div className="grid grid-cols-5 gap-2">
                  {qualityList.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setSelectedQuality(quality)}
                      className={cn(
                        'py-2 px-3 rounded-lg border-2 transition-all text-xs font-bold',
                        selectedQuality === quality
                          ? `border-2 scale-105 shadow-lg`
                          : 'border-forge-brown/30 opacity-70 hover:opacity-100'
                      )}
                      style={selectedQuality === quality ? { borderColor: qualityConfig[quality].color, backgroundColor: qualityConfig[quality].color + '20' } : {}}
                    >
                      {qualityConfig[quality].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Display */}
              <div className="bg-white/30 rounded-lg p-4 border-2 border-forge-brown/20">
                <p className="text-xs text-forge-brown mb-2">雇佣费用</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-forge-dark">
                    {hireCost[selectedQuality]}
                  </span>
                  <GiMoneyStack className="text-3xl text-pixel-lemon" />
                </div>
                <p className="text-xs text-forge-brown/60 mt-2">
                  当前金币: {gold}
                </p>
              </div>

              {/* Hire Button */}
              <Button
                onClick={handleHire}
                disabled={gold < hireCost[selectedQuality] || hiredNPCs.length >= maxHiredNPCs}
                className="w-full rounded-lg border-2 border-forge-brown bg-pixel-mint hover:bg-pixel-mint/80 text-forge-dark font-bold transition-all"
              >
                雇佣 {qualityConfig[selectedQuality].name} 等级 NPC
              </Button>

              {hiredNPCs.length >= maxHiredNPCs && (
                <p className="text-xs text-red-500 text-center">已达到最大雇佣数量 ({maxHiredNPCs})</p>
              )}
            </CardContent>
          </Card>

          {/* Hired NPCs Section */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-pixel-lavender/50 border-b-2 border-border pb-4">
              <CardTitle className="text-sm text-forge-dark">
                已雇佣的 NPC ({hiredNPCs.length}/{maxHiredNPCs})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-forge-light/50">
              {hiredNPCs.length === 0 ? (
                <p className="text-xs text-forge-brown/60 text-center py-8">暂无雇佣的 NPC</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hiredNPCs.map((npc) => (
                    <div
                      key={npc.id}
                      className="p-4 rounded-lg bg-white/40 border-2 transition-all hover:shadow-md"
                      style={{ borderColor: qualityConfig[npc.quality].color }}
                    >
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <NPCAvatar
                          profession={npc.profession}
                          quality={npc.quality}
                          experienceLevel={npc.experienceLevel}
                          size={96}
                          seed={npc.avatarSeed || npc.id}
                        />
                      </div>

                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-forge-dark">{npc.name}</h3>
                          <p className="text-xs text-forge-brown/70">{npc.personality}</p>
                        </div>
                        <Badge
                          className="ml-2 whitespace-nowrap"
                          style={{
                            backgroundColor: qualityConfig[npc.quality].color + '40',
                            borderColor: qualityConfig[npc.quality].color,
                            color: qualityConfig[npc.quality].color,
                          }}
                        >
                          {qualityConfig[npc.quality].name}
                        </Badge>
                      </div>

                      {/* Bonus Info */}
                      <div className="space-y-2 mb-3 pb-3 border-b border-forge-brown/20">
                        <p className="text-xs font-semibold text-forge-dark">
                          {getNPCBonusDescription(npc.bonus, npc.bonusValue)}
                        </p>
                        <p className="text-xs text-forge-brown/60">
                          月薪: {npc.salary} 金币
                        </p>
                      </div>

                      {/* Experience */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-forge-brown">经验等级</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded border border-forge-brown/50"
                              style={{
                                backgroundColor: i < npc.experienceLevel ? '#ffd700' : 'transparent',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Fire Button */}
                      <Button
                        onClick={() => handleFire(npc.id)}
                        className="w-full text-xs rounded-lg border-2 border-red-300 bg-red-200/40 hover:bg-red-200/60 text-red-700 transition-all"
                      >
                        解雇
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 画廊标签页 */}
        <TabsContent value="gallery" className="space-y-6">
          <NPCGallery />
        </TabsContent>
      </Tabs>
    </div>
  );
}

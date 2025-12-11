import { useGameStore } from '@/store/gameStore';
import { NPCAvatar } from './NPCAvatar';
import { qualityConfig, getNPCBonusDescription } from '@/data/hiredNpcs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const NPCStatus = () => {
  const { hiredNPCs } = useGameStore();

  if (hiredNPCs.length === 0) {
    return (
      <Card className="overflow-hidden bg-white/20">
        <CardHeader className="pb-3 border-b-2 border-border">
          <CardTitle className="text-sm text-forge-dark">工坊成员</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-xs text-forge-brown/60 text-center">暂无雇佣的 NPC</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-white/20">
      <CardHeader className="pb-3 border-b-2 border-border">
        <CardTitle className="text-sm text-forge-dark">工坊成员 ({hiredNPCs.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {hiredNPCs.map((npc) => (
            <div
              key={npc.id}
              className="p-3 rounded-lg bg-white/40 border border-forge-brown/20 hover:border-forge-brown/50 transition-all"
              style={{ borderLeftColor: qualityConfig[npc.quality].color, borderLeftWidth: '4px' }}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <NPCAvatar
                    profession={npc.profession}
                    quality={npc.quality}
                    experienceLevel={npc.experienceLevel}
                    size={56}
                    seed={npc.avatarSeed || npc.id}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-forge-dark">{npc.name}</p>
                      <p className="text-xs text-forge-brown/60 mt-0.5">
                        {getNPCBonusDescription(npc.bonus, npc.bonusValue)}
                      </p>
                    </div>
                    <div className="text-xs font-bold px-2 py-1 rounded bg-pixel-lemon/30 text-forge-dark whitespace-nowrap">
                      Lv.{npc.experienceLevel}
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full border border-forge-brown/30"
                        style={{
                          backgroundColor: i < npc.experienceLevel ? qualityConfig[npc.quality].color : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

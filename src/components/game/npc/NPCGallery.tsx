import { hiredNPCPool, qualityConfig } from '@/data/hiredNpcs';
import { NPCQuality } from '@/types/game';
import { NPCAvatar } from './NPCAvatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const NPCGallery = () => {
  const qualities: NPCQuality[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

  return (
    <div className="space-y-6">
      {qualities.map((quality) => {
        const npcList = hiredNPCPool[quality];
        const config = qualityConfig[quality];

        return (
          <Card key={quality} className="overflow-hidden">
            <CardHeader
              className="pb-4 border-b-2"
              style={{ backgroundColor: config.color + '20' }}
            >
              <CardTitle
                className="text-sm"
                style={{ color: config.color }}
              >
                {config.name} NPC 画廊
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {npcList.map((npc) => (
                  <div key={npc.id} className="flex flex-col items-center gap-2">
                    <NPCAvatar
                      profession={npc.profession}
                      quality={quality}
                      experienceLevel={1}
                      size={80}
                      seed={npc.id}
                    />
                    <div className="text-center">
                      <p className="text-xs font-bold text-forge-dark truncate w-full">
                        {npc.name}
                      </p>
                      <p className="text-xs text-forge-brown/60">
                        {npc.profession === 'knight' && '🗡️'}
                        {npc.profession === 'mage' && '🔮'}
                        {npc.profession === 'merchant' && '💰'}
                        {npc.profession === 'adventurer' && '🗺️'}
                        {npc.profession === 'villager' && '🏠'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

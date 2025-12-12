import { hiredNPCPool, qualityConfig } from '@/data/hiredNpcs';
import { NPCQuality } from '@/types/game';
import { NPCAvatar } from './NPCAvatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const qualityColors: Record<NPCQuality, string> = {
  common: 'text-gray-300',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-orange-400',
};

const qualityBgColors: Record<NPCQuality, string> = {
  common: 'bg-gray-500/10 border-gray-500/30',
  uncommon: 'bg-green-500/10 border-green-500/30',
  rare: 'bg-blue-500/10 border-blue-500/30',
  epic: 'bg-purple-500/10 border-purple-500/30',
  legendary: 'bg-orange-500/10 border-orange-500/30',
};

const professionIcons: Record<string, string> = {
  knight: '🗡️',
  mage: '🔮',
  merchant: '💰',
  adventurer: '🗺️',
  villager: '🏠',
};

export const NPCGallery = () => {
  const qualities: NPCQuality[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

  return (
    <div className="space-y-6">
      {qualities.map((quality) => {
        const npcList = hiredNPCPool[quality];
        const config = qualityConfig[quality];

        return (
          <Card key={quality} className="overflow-hidden bg-card/80 backdrop-blur border-2">
            <CardHeader className={cn('pb-4 border-b-2 border-border', qualityBgColors[quality])}>
              <CardTitle className="flex items-center justify-between text-sm">
                <span className={qualityColors[quality]}>
                  {config.name} NPC 画廊
                </span>
                <Badge variant="secondary" className="text-xs">
                  {npcList.length} 位
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-card/30">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {npcList.map((npc) => (
                  <div
                    key={npc.id}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-md',
                      qualityBgColors[quality]
                    )}
                  >
                    <NPCAvatar
                      profession={npc.profession}
                      quality={quality}
                      experienceLevel={1}
                      size={72}
                      seed={npc.id}
                    />
                    <div className="text-center w-full">
                      <p className={cn('text-xs font-bold truncate', qualityColors[quality])}>
                        {npc.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {professionIcons[npc.profession] || '👤'}
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

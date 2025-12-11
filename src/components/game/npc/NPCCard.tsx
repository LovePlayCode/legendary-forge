import { HiredNPC } from '@/types/game';
import { qualityConfig, getNPCBonusDescription } from '@/data/hiredNpcs';
import { NPCAvatar } from './NPCAvatar';
import { Badge } from '@/components/ui/badge';

interface NPCCardProps {
  npc: HiredNPC;
  compact?: boolean;
}

export const NPCCard = ({ npc, compact = false }: NPCCardProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/30 border border-forge-brown/20">
        <NPCAvatar
          profession={npc.profession}
          quality={npc.quality}
          experienceLevel={npc.experienceLevel}
          size={56}
          seed={npc.avatarSeed || npc.id}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-forge-dark truncate">{npc.name}</p>
          <p className="text-xs text-forge-brown/60 truncate">
            {getNPCBonusDescription(npc.bonus, npc.bonusValue)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Badge
              className="text-xs px-2 py-0"
              style={{
                backgroundColor: qualityConfig[npc.quality].color + '40',
                borderColor: qualityConfig[npc.quality].color,
                color: qualityConfig[npc.quality].color,
              }}
            >
              Lv.{npc.experienceLevel}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-lg bg-white/40 border-2 transition-all hover:shadow-md"
      style={{ borderColor: qualityConfig[npc.quality].color }}
    >
      <div className="flex justify-center mb-4">
        <NPCAvatar
          profession={npc.profession}
          quality={npc.quality}
          experienceLevel={npc.experienceLevel}
          size={96}
          seed={npc.avatarSeed || npc.id}
        />
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-sm text-forge-dark">{npc.name}</h3>
          <p className="text-xs text-forge-brown/70">{npc.personality}</p>
        </div>

        <Badge
          className="w-fit"
          style={{
            backgroundColor: qualityConfig[npc.quality].color + '40',
            borderColor: qualityConfig[npc.quality].color,
            color: qualityConfig[npc.quality].color,
          }}
        >
          {qualityConfig[npc.quality].name}
        </Badge>

        <div className="space-y-1 pb-3 border-b border-forge-brown/20">
          <p className="text-xs font-semibold text-forge-dark">
            {getNPCBonusDescription(npc.bonus, npc.bonusValue)}
          </p>
          <p className="text-xs text-forge-brown/60">月薪: {npc.salary} 金币</p>
        </div>

        <div className="flex items-center justify-between">
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
      </div>
    </div>
  );
};

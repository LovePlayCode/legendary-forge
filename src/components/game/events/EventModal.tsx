import { useGameStore } from '@/store/gameStore';
import { EventCardComponent } from './EventCard';
import { GiMagicSwirl } from 'react-icons/gi';

export function EventModal() {
  const { showEventModal, currentEventCards, selectEventCard } = useGameStore();

  if (!showEventModal || currentEventCards.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center animate-bounce-in">
        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <GiMagicSwirl className="text-4xl text-amber-400 animate-spin-slow" />
          <h2 className="text-2xl font-bold text-amber-400 font-pixel tracking-wider">
            命运的抉择
          </h2>
          <GiMagicSwirl className="text-4xl text-amber-400 animate-spin-slow" />
        </div>

        {/* Subtitle */}
        <p className="text-muted-foreground mb-8 text-sm">
          选择一张卡片获得增益效果
        </p>

        {/* Cards */}
        <div className="flex gap-6">
          {currentEventCards.map((card, index) => (
            <EventCardComponent
              key={card.id}
              card={card}
              onClick={() => selectEventCard(card)}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Hint */}
        <p className="mt-8 text-xs text-muted-foreground/60">
          点击卡片进行选择
        </p>
      </div>
    </div>
  );
}

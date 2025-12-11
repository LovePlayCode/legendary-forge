import { useState } from 'react';
import { Header } from './Header';
import { Sidebar, GameView } from './Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Workshop } from '@/components/game/workshop/Workshop';
import { Orders } from '@/components/game/orders/Orders';
import { Inventory } from '@/components/game/inventory/Inventory';
import { Exploration } from '@/components/game/exploration/Exploration';
import { Upgrades } from '@/components/game/upgrades/Upgrades';
import { NPCHiring } from '@/components/game/npc/NPCHiring';
import { EventModal } from '@/components/game/events';

export function GameLayout() {
  const [currentView, setCurrentView] = useState<GameView>('workshop');

  const renderView = () => {
    switch (currentView) {
      case 'workshop':
        return <Workshop />;
      case 'orders':
        return <Orders />;
      case 'inventory':
        return <Inventory />;
      case 'exploration':
        return <Exploration />;
      case 'npc':
        return <NPCHiring />;
      case 'upgrades':
        return <Upgrades />;
      default:
        return <Workshop />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Soft pixel texture background */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #44403c 1px, transparent 1px),
            linear-gradient(0deg, transparent 23px, #292524 24px)
          `,
          backgroundSize: '24px 24px'
        }}
      />
      <Header />
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="pt-20 pl-24 min-h-screen relative transition-all duration-300">
        <div className="p-6 max-w-7xl mx-auto animate-bounce-in">
          {renderView()}
        </div>
      </main>
      <Toaster />
      <EventModal />
    </div>
  );
}

import { useState } from 'react';
import { Header } from './Header';
import { Sidebar, GameView } from './Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Workshop } from '@/components/game/workshop/Workshop';
import { Orders } from '@/components/game/orders/Orders';
import { Inventory } from '@/components/game/inventory/Inventory';
import { Exploration } from '@/components/game/exploration/Exploration';
import { Upgrades } from '@/components/game/upgrades/Upgrades';

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
      case 'upgrades':
        return <Upgrades />;
      default:
        return <Workshop />;
    }
  };

  return (
    <div className="min-h-screen bg-forge-cream">
      {/* Soft dotted background pattern */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #d4a574 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />
      <Header />
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="pt-16 pl-20 min-h-screen relative">
        <div className="p-6">
          {renderView()}
        </div>
      </main>
      <Toaster />
    </div>
  );
}

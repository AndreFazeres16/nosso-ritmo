import React from 'react';
import type { Screen } from '../types';
import { HomeIcon, PlusIcon, FinancesIcon, ShopIcon, HeartIcon } from './icons';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems = [
    { screen: 'home' as Screen, icon: HomeIcon, label: 'Início' },
    { screen: 'memories' as Screen, icon: HeartIcon, label: 'Memórias' },
    { screen: 'add-event' as Screen, icon: PlusIcon, label: 'Adicionar' },
    { screen: 'finances' as Screen, icon: FinancesIcon, label: 'Finanças' },
    { screen: 'shopping-list' as Screen, icon: ShopIcon, label: 'Compras' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 rounded-t-3xl p-2 shadow-lg z-20">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = activeScreen === item.screen;
          if (item.screen === 'add-event') {
            return (
              <button
                key={item.screen}
                onClick={() => setActiveScreen(item.screen)}
                className="w-16 h-16 -mt-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-pink shadow-lg flex items-center justify-center text-white"
                aria-label={item.label}
              >
                <item.icon className="w-8 h-8" />
              </button>
            );
          }
          return (
            <button
              key={item.screen}
              onClick={() => setActiveScreen(item.screen)}
              className="flex flex-col items-center justify-center text-xs w-16"
              aria-label={item.label}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${isActive ? 'bg-gradient-to-br from-primary-blue to-primary-pink' : ''}`}>
                 <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              </div>
              <span className={`mt-1 font-semibold ${isActive ? 'text-text-dark dark:text-white' : 'text-gray-400'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
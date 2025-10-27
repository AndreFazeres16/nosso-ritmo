import React from 'react';
import type { Memory, Screen } from '../types';
import { PlusIcon, HeartIcon } from './icons';

interface MemoriesScreenProps {
  memories: Memory[];
  setActiveScreen: (screen: Screen) => void;
}

const MemoryCard: React.FC<{ memory: Memory }> = ({ memory }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <img src={memory.photo} alt={memory.title} className="w-full h-40 object-cover" />
        <div className="p-4">
            <p className="text-sm text-text-light dark:text-gray-400">{new Date(memory.date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <h3 className="font-bold text-lg text-text-dark dark:text-gray-100 mt-1">{memory.title}</h3>
            <p className="text-sm text-text-dark dark:text-gray-300 mt-2 line-clamp-2">{memory.description}</p>
        </div>
    </div>
);

export const MemoriesScreen: React.FC<MemoriesScreenProps> = ({ memories, setActiveScreen }) => {
    const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="h-full flex flex-col bg-app-bg dark:bg-gray-900 relative">
            <div className="p-6 bg-gradient-to-br from-accent-pink to-orange-300 text-white rounded-b-3xl">
                <h1 className="text-3xl font-bold">As Nossas Memórias</h1>
                <p className="text-white/80">A vossa história, um momento de cada vez.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {sortedMemories.length > 0 ? (
                    sortedMemories.map(memory => <MemoryCard key={memory.id} memory={memory} />)
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 pt-16 flex flex-col items-center">
                        <HeartIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"/>
                        <p className="font-semibold">Nenhuma memória adicionada.</p>
                        <p className="text-sm">Cliquem no '+' para guardar o vosso primeiro momento especial!</p>
                    </div>
                )}
            </div>

             <button onClick={() => setActiveScreen('add-memory')} className="absolute bottom-24 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue to-accent-pink text-white flex items-center justify-center shadow-lg">
                <PlusIcon className="w-8 h-8" />
            </button>
        </div>
    );
};
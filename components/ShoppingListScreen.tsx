import React, { useState } from 'react';
import type { ShoppingListItem } from '../types';
import { SHOPPING_CATEGORIES } from '../constants';
// FIX: Imported ShopIcon to resolve reference error.
import { PlusIcon, TrashIcon, CheckCircleIcon, CircleIcon, ShopIcon } from './icons';

interface ShoppingListScreenProps {
  initialItems: ShoppingListItem[];
  onUpdate: (updatedList: ShoppingListItem[]) => void;
}

const ShoppingListHeader: React.FC = () => (
    <div className="p-6 bg-gradient-to-br from-primary-blue to-primary-pink text-white rounded-b-3xl">
        <h1 className="text-3xl font-bold">Lista de Compras</h1>
        <p className="text-white/80">O que falta comprar?</p>
    </div>
);

const AddItemForm: React.FC<{ onAddItem: (item: Omit<ShoppingListItem, 'id' | 'checked'>) => void; onClose: () => void; }> = ({ onAddItem, onClose }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(SHOPPING_CATEGORIES[0]);

    const handleSubmit = () => {
        if (name.trim()) {
            onAddItem({ name, category });
        }
    };

    return (
         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
                <h2 className="text-xl font-bold text-text-dark dark:text-gray-100">Novo Item</h2>
                <div>
                    <label htmlFor="item-name" className="text-sm font-semibold text-text-light dark:text-gray-400">Nome do Item</label>
                    <input id="item-name" value={name} onChange={e => setName(e.target.value)} type="text" className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-text-dark dark:text-gray-100" placeholder="Ex: Maçãs" />
                </div>
                <div>
                    <label htmlFor="item-category" className="text-sm font-semibold text-text-light dark:text-gray-400">Categoria</label>
                    <select id="item-category" value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-text-dark dark:text-gray-100">
                        {SHOPPING_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-text-dark dark:text-gray-200">Cancelar</button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-header-dark text-white font-semibold">Adicionar</button>
                </div>
            </div>
        </div>
    );
};

export const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({ initialItems, onUpdate }) => {
    const [showAddForm, setShowAddForm] = useState(false);

    const handleAddItem = (item: Omit<ShoppingListItem, 'id' | 'checked'>) => {
        const newItem: ShoppingListItem = { ...item, id: `shop${Date.now()}`, checked: false };
        onUpdate([...initialItems, newItem]);
        setShowAddForm(false);
    };

    const handleToggleItem = (id: string) => {
        const newItems = initialItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
        onUpdate(newItems);
    };
    
    const handleDeleteItem = (id: string) => {
        const newItems = initialItems.filter(item => item.id !== id);
        onUpdate(newItems);
    };
    
    const handleClearChecked = () => {
        const newItems = initialItems.filter(item => !item.checked);
        onUpdate(newItems);
    };

    const groupedItems = initialItems.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {} as Record<string, ShoppingListItem[]>);

    const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
        const indexA = SHOPPING_CATEGORIES.indexOf(a);
        const indexB = SHOPPING_CATEGORIES.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    const hasCheckedItems = initialItems.some(item => item.checked);

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-primary-blue/20 via-app-bg to-app-bg dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative">
            <ShoppingListHeader />
            <div className="px-4 py-4 pb-24 flex-1 overflow-y-auto">
                {hasCheckedItems && (
                    <div className="mb-4 px-2">
                         <button onClick={handleClearChecked} className="w-full text-sm font-semibold text-accent-blue bg-blue-100 dark:bg-blue-900/50 py-2 rounded-lg">
                            Limpar marcados
                        </button>
                    </div>
                )}
                {initialItems.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 pt-16 flex flex-col items-center">
                        <ShopIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"/>
                        <p className="font-semibold">A vossa lista de compras está vazia.</p>
                        <p className="text-sm">Adicionem o primeiro item!</p>
                    </div>
                ) : (
                    sortedCategories.map(category => (
                        <div key={category} className="mb-6">
                            <h2 className="font-bold text-lg text-text-dark dark:text-gray-200 mb-2">{category}</h2>
                            <div className="space-y-2">
                                {groupedItems[category].map(item => (
                                    <div key={item.id} className={`flex items-center p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm ${item.checked ? 'opacity-60' : ''}`}>
                                        <button onClick={() => handleToggleItem(item.id)} className="mr-3">
                                            {item.checked ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <CircleIcon className="w-6 h-6 text-gray-300 dark:text-gray-600" />}
                                        </button>
                                        <p className={`flex-1 font-semibold text-text-dark dark:text-gray-100 ${item.checked ? 'line-through' : ''}`}>{item.name}</p>
                                        <button onClick={() => handleDeleteItem(item.id)} className="text-gray-400 hover:text-red-500">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <button onClick={() => setShowAddForm(true)} className="absolute bottom-24 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue to-accent-pink text-white flex items-center justify-center shadow-lg">
                <PlusIcon className="w-8 h-8" />
            </button>
            {showAddForm && <AddItemForm onAddItem={handleAddItem} onClose={() => setShowAddForm(false)} />}
        </div>
    );
};
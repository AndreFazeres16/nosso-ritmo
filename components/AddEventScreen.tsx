import React, { useState } from 'react';
import type { Category, CalendarEvent, User } from '../types';
import { CATEGORIES } from '../constants';
import { BellIcon } from './icons';

interface AddEventScreenProps {
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onBack: () => void;
}

const CategoryChip: React.FC<{ category: Category; isSelected: boolean; onClick: () => void; }> = ({ category, isSelected, onClick }) => {
  const Icon = category.icon;
  return (
    <button onClick={onClick} className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-semibold transition-all ${isSelected ? `${category.bgColor} ${category.color}` : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
      <Icon className="w-4 h-4" />
      <span>{category.name}</span>
    </button>
  );
};

export const AddEventScreen: React.FC<AddEventScreenProps> = ({ onSave, onBack }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [assignedTo, setAssignedTo] = useState<User>('Nós Dois');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [reminderOn, setReminderOn] = React.useState(true);

  const handleSave = () => {
    if (!title.trim()) {
        alert('Por favor, insira um título.');
        return;
    }
    if (!selectedCategory) {
        alert('Por favor, selecione uma categoria.');
        return;
    }
    onSave({
        title,
        date,
        time,
        assignedTo,
        categoryId: selectedCategory,
        description,
    });
  };

  return (
    <div className="h-full flex flex-col bg-app-bg dark:bg-gray-900">
      <div className="flex items-center justify-between p-4">
        <button onClick={onBack} className="font-semibold text-text-dark dark:text-gray-200">&larr; Voltar</button>
        <h1 className="text-xl font-bold text-text-dark dark:text-gray-100">Novo Evento</h1>
        <button onClick={handleSave} className="font-bold text-white bg-header-dark px-4 py-1.5 rounded-lg">Salvar</button>
      </div>
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <label htmlFor="title" className="text-xs text-gray-500 dark:text-gray-400">Título</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-lg font-semibold text-text-dark dark:text-gray-100 bg-transparent focus:outline-none" placeholder="Ex: Treino de Ginásio"/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <label htmlFor="date" className="text-xs text-gray-500 dark:text-gray-400">Data</label>
            <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full text-md font-semibold text-text-dark dark:text-gray-100 bg-transparent focus:outline-none [color-scheme:dark]"/>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <label htmlFor="time" className="text-xs text-gray-500 dark:text-gray-400">Hora</label>
            <input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full text-md font-semibold text-text-dark dark:text-gray-100 bg-transparent focus:outline-none [color-scheme:dark]"/>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <label htmlFor="assignee" className="text-xs text-gray-500 dark:text-gray-400">Participantes</label>
            <select id="assignee" value={assignedTo} onChange={e => setAssignedTo(e.target.value as User)} className="w-full text-md font-semibold text-text-dark dark:text-gray-100 focus:outline-none bg-transparent">
                <option className="bg-white dark:bg-gray-800" value="Eu">Eu</option>
                <option className="bg-white dark:bg-gray-800" value="Ela">Ela</option>
                <option className="bg-white dark:bg-gray-800" value="Nós Dois">Nós Dois</option>
            </select>
        </div>

        <div>
          <h3 className="font-bold text-text-dark dark:text-gray-200 mb-2">Categorias</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <CategoryChip key={cat.id} category={cat} isSelected={selectedCategory === cat.id} onClick={() => setSelectedCategory(cat.id)} />
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <label htmlFor="description" className="text-xs text-gray-500 dark:text-gray-400">Descrição</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full text-md text-text-dark dark:text-gray-200 bg-transparent focus:outline-none resize-none" placeholder="Adicionar uma descrição..."></textarea>
        </div>

         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <BellIcon className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                <p className="font-semibold text-text-dark dark:text-gray-100">Lembretes</p>
            </div>
            <button onClick={() => setReminderOn(!reminderOn)} className={`w-12 h-6 rounded-full p-1 flex items-center cursor-pointer transition-colors ${reminderOn ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${reminderOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>

      </div>
    </div>
  );
};
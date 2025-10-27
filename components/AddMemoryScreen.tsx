import React, { useState, useRef } from 'react';
import type { Memory } from '../types';
import { ImageIcon } from './icons';

interface AddMemoryScreenProps {
  onSave: (memory: Omit<Memory, 'id'>) => void;
  onBack: () => void;
}

export const AddMemoryScreen: React.FC<AddMemoryScreenProps> = ({ onSave, onBack }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhoto(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!title.trim() || !photo) {
      alert('Por favor, adicione um título e uma foto.');
      return;
    }
    onSave({ title, date, description, photo });
  };

  return (
    <div className="h-full flex flex-col bg-app-bg dark:bg-gray-900">
      <div className="flex items-center justify-between p-4">
        <button onClick={onBack} className="font-semibold text-text-dark dark:text-gray-200">&larr; Voltar</button>
        <h1 className="text-xl font-bold text-text-dark dark:text-gray-100">Nova Memória</h1>
        <button onClick={handleSave} className="font-bold text-white bg-header-dark px-4 py-1.5 rounded-lg">Salvar</button>
      </div>
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        
        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
        <button onClick={triggerFileUpload} className="w-full h-48 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
            {photo ? (
                <img src={photo} alt="Preview" className="w-full h-full object-cover rounded-lg"/>
            ) : (
                <>
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2"/>
                    <p className="font-semibold text-text-dark dark:text-gray-300">Carregar Foto</p>
                    <p className="text-xs text-text-light dark:text-gray-400">Clique para escolher uma imagem</p>
                </>
            )}
        </button>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <label htmlFor="title" className="text-xs text-gray-500 dark:text-gray-400">Título</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-lg font-semibold text-text-dark dark:text-gray-100 bg-transparent focus:outline-none" placeholder="Ex: A nossa primeira viagem"/>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <label htmlFor="date" className="text-xs text-gray-500 dark:text-gray-400">Data</label>
            <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full text-md font-semibold text-text-dark dark:text-gray-100 bg-transparent focus:outline-none [color-scheme:dark]"/>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <label htmlFor="description" className="text-xs text-gray-500 dark:text-gray-400">Descrição</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full text-md text-text-dark dark:text-gray-200 bg-transparent focus:outline-none resize-none" placeholder="Descrevam este momento..."></textarea>
        </div>

      </div>
    </div>
  );
};
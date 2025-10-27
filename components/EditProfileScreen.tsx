import React, { useState, useRef } from 'react';
import type { UserProfile, UserIdentifier } from '../types';
import { SettingsLayout } from './SettingsLayout';
import { EditIcon } from './icons';

interface EditProfileScreenProps {
  currentUserIdentifier: UserIdentifier;
  profile: UserProfile;
  onSave: (identifier: UserIdentifier, updatedProfile: UserProfile) => void;
  onBack: () => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ currentUserIdentifier, profile, onSave, onBack }) => {
  const [name, setName] = useState(profile.name);
  const [pin, setPin] = useState(profile.pin);
  const [avatar, setAvatar] = useState(profile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (name.trim() && pin.length === 4 && /^\d{4}$/.test(pin)) {
      // FIX: Ensure the pin from the state is included when saving
      onSave(currentUserIdentifier, { name: name.trim(), pin, avatar });
      onBack();
    } else {
      alert('Por favor, preencha o nome e um PIN numérico de 4 dígitos.');
    }
  };
  
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <SettingsLayout title="Editar Perfil" onBack={onBack}>
        <div className="flex flex-col items-center p-6 pt-2">
            <div className="relative w-24 h-24 mb-2">
                <img src={avatar} alt={name} className="w-24 h-24 rounded-full object-cover" />
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                <button 
                    onClick={triggerFileUpload}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-gray-900"
                    aria-label="Mudar avatar"
                >
                    <EditIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <label htmlFor="name" className="text-xs text-gray-500 dark:text-gray-400">Nome</label>
        <input 
          id="name" 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full text-lg font-semibold text-text-dark dark:text-gray-100 bg-transparent focus:outline-none" 
          placeholder="O teu nome"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <label htmlFor="pin" className="text-xs text-gray-500 dark:text-gray-400">PIN de Segurança (4 dígitos)</label>
        <input 
          id="pin" 
          type="password"
          maxLength={4}
          value={pin} 
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} 
          className="w-full text-lg font-semibold text-text-dark dark:text-gray-100 bg-transparent focus:outline-none tracking-widest"
          placeholder="****"
        />
      </div>
      
      <div className="mt-6">
        <button 
          onClick={handleSave} 
          className="w-full bg-header-dark text-white p-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
        >
          Salvar Alterações
        </button>
      </div>
    </SettingsLayout>
  );
};

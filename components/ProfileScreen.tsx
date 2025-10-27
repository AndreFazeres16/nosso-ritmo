import React from 'react';
import { ChevronRightIcon, EditIcon, BellIcon, ThemeIcon, PrivacyIcon, InfoIcon, SettingsIcon, SparklesIcon, LogoutIcon } from './icons';
import type { Screen, UserProfile, UserIdentifier } from '../types';

interface ProfileScreenProps {
  currentUserIdentifier: UserIdentifier;
  profiles: { Eu: UserProfile, Ela: UserProfile };
  onLogout: () => void;
  setActiveScreen: (screen: Screen) => void;
}

const ProfileMenuItem: React.FC<{ icon: React.FC<{className?: string}>; label: string; onClick: () => void; }> = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between cursor-pointer text-left">
    <div className="flex items-center space-x-4">
      <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
      <span className="font-semibold text-text-dark dark:text-gray-100">{label}</span>
    </div>
    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
  </button>
);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUserIdentifier, profiles, onLogout, setActiveScreen }) => {
  const currentUserProfile = profiles[currentUserIdentifier];

  return (
    <div className="h-full flex flex-col bg-app-bg dark:bg-gray-900">
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={() => setActiveScreen('home')} 
          className="font-semibold text-text-dark dark:text-gray-200 w-20 text-left"
          aria-label="Voltar para a tela inicial"
        >
          &larr; Voltar
        </button>
        <h1 className="text-xl font-bold text-text-dark dark:text-gray-100">O Meu Perfil</h1>
        <div className="w-20"></div>
      </div>

      <div className="flex flex-col items-center p-6 pt-2">
        <div className="w-24 h-24 rounded-full bg-primary-blue flex items-center justify-center mb-2">
            <img src={currentUserProfile.avatar} alt={currentUserProfile.name} className="w-22 h-22 rounded-full" />
        </div>
        <p className="font-bold text-lg text-text-dark dark:text-gray-100">{currentUserProfile.name}</p>
      </div>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 px-2 uppercase">Definições</h2>
        <ProfileMenuItem icon={EditIcon} label="Editar Perfil" onClick={() => setActiveScreen('edit-profile')} />
        <ProfileMenuItem icon={BellIcon} label="Notificações" onClick={() => setActiveScreen('notifications')} />
        <ProfileMenuItem icon={ThemeIcon} label="Temas do Aplicativo" onClick={() => setActiveScreen('themes')} />
        
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 px-2 uppercase pt-4">Diversão</h2>
        <ProfileMenuItem icon={SparklesIcon} label="Planeador de Encontros IA" onClick={() => setActiveScreen('ai-planner')} />
        
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 px-2 uppercase pt-4">Mais</h2>
        <ProfileMenuItem icon={PrivacyIcon} label="Privacidade" onClick={() => setActiveScreen('privacy')} />
        <ProfileMenuItem icon={InfoIcon} label="Sobre" onClick={() => setActiveScreen('about')} />
      </div>
       <div className="p-4 mt-auto">
          <button 
            onClick={onLogout} 
            className="w-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 p-3 rounded-lg font-bold hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors flex items-center justify-center space-x-2">
              <LogoutIcon className="w-5 h-5" />
              <span>Terminar Sessão</span>
          </button>
      </div>
    </div>
  );
};
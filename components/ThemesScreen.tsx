import React from 'react';
import { SettingsLayout } from './SettingsLayout';
import { ThemeIcon } from './icons';

interface ThemesScreenProps {
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    onBack: () => void;
}

export const ThemesScreen: React.FC<ThemesScreenProps> = ({ isDarkMode, onToggleDarkMode, onBack }) => {
  return (
    <SettingsLayout title="Temas do Aplicativo" onBack={onBack}>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <ThemeIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="font-semibold text-text-dark dark:text-gray-100">Modo Escuro</span>
            </div>
            <button onClick={onToggleDarkMode} className={`w-12 h-6 rounded-full p-1 flex items-center cursor-pointer transition-colors ${isDarkMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
        </div>
        <p className="text-sm text-text-light dark:text-gray-400 mt-2 ml-10">
            Alterne para uma aparência mais escura que é mais agradável aos olhos à noite.
        </p>
      </div>
    </SettingsLayout>
  );
};
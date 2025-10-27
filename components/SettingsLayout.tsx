import React from 'react';

interface SettingsLayoutProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ title, onBack, children }) => (
  <div className="h-full flex flex-col bg-app-bg dark:bg-gray-900 p-4">
    <div className="flex items-center mb-6 relative h-8">
      <button onClick={onBack} className="absolute left-0 text-text-dark dark:text-gray-200 font-semibold p-2 -ml-2 z-10">&larr; Voltar</button>
      <h1 className="flex-1 text-center text-xl font-bold text-text-dark dark:text-gray-100">{title}</h1>
    </div>
    <div className="flex-1 overflow-y-auto space-y-4">
      {children}
    </div>
  </div>
);
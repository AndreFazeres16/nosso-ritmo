import React from 'react';
import type { NotificationSettings } from '../types';
import { SettingsLayout } from './SettingsLayout';
import { BellIcon, TasksIcon, ChatIcon } from './icons';

interface ToggleProps {
    isEnabled: boolean;
    onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleProps> = ({ isEnabled, onToggle }) => (
    <button onClick={onToggle} className={`w-12 h-6 rounded-full p-1 flex items-center cursor-pointer transition-colors ${isEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </button>
);

interface NotificationItemProps {
    icon: React.FC<{ className?: string }>;
    label: string;
    isEnabled: boolean;
    onToggle: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ icon: Icon, label, isEnabled, onToggle }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="font-semibold text-text-dark dark:text-gray-100">{label}</span>
        </div>
        <ToggleSwitch isEnabled={isEnabled} onToggle={onToggle} />
    </div>
);


interface NotificationsScreenProps {
    settings: NotificationSettings;
    onSettingsChange: (newSettings: NotificationSettings) => void;
    onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ settings, onSettingsChange, onBack }) => {

    const toggleSetting = (key: keyof NotificationSettings) => {
        onSettingsChange({ ...settings, [key]: !settings[key] });
    };

    return (
        <SettingsLayout title="Notificações" onBack={onBack}>
            <NotificationItem icon={BellIcon} label="Lembretes de Eventos" isEnabled={settings.eventReminders} onToggle={() => toggleSetting('eventReminders')} />
            <NotificationItem icon={TasksIcon} label="Novas Tarefas Atribuídas" isEnabled={settings.newTasks} onToggle={() => toggleSetting('newTasks')} />
            <NotificationItem icon={ChatIcon} label="Mensagens no Chat" isEnabled={settings.chatMessages} onToggle={() => toggleSetting('chatMessages')} />
        </SettingsLayout>
    );
};
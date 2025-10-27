import type React from 'react';

// FIX: Added all necessary type definitions based on their usage across the application components.
export type Screen = 
  | 'home' 
  | 'memories' 
  | 'add-event' 
  | 'finances' 
  | 'shopping-list'
  | 'calendar'
  | 'tasks'
  | 'chat'
  | 'profile'
  | 'edit-profile'
  | 'notifications'
  | 'themes'
  | 'ai-planner'
  | 'privacy'
  | 'about'
  | 'add-memory';

export type User = 'Eu' | 'Ela' | 'Nós Dois';
export type UserIdentifier = 'Eu' | 'Ela';

export interface UserProfile {
  name: string;
  avatar: string;
  pin: string;
}

export interface Category {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bgColor: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO string
  time: string;
  assignedTo: User;
  categoryId: string;
  description: string;
}

export interface Task {
  id: string;
  title:string;
  assignedTo: User;
  completed: boolean;
}

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    icon: React.FC<{ className?: string }>;
    color: string;
    bgColor: string;
    date: string; // ISO String
}

export interface ShoppingListItem {
    id: string;
    name: string;
    category: string;
    checked: boolean;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: UserIdentifier;
    timestamp: number;
}

export interface Memory {
    id: string;
    title: string;
    description: string;
    date: string; // ISO String
    photo: string; // base64 or URL
}

export interface CoupleQuestion {
    id: number;
    text: string;
    answers: {
        Eu?: string;
        Ela?: string;
    }
}

export interface NotificationSettings {
    eventReminders: boolean;
    newTasks: boolean;
    chatMessages: boolean;
}

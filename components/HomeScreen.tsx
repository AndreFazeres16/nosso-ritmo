import React, { useState } from 'react';
import type { CalendarEvent, Task, Transaction, UserProfile, UserIdentifier, CoupleQuestion, Screen } from '../types';
import { CATEGORIES, COUPLE_QUESTIONS } from '../constants';
import { ChevronRightIcon, UserIcon, BellIcon, HeartIcon, TasksIcon } from './icons';

// FIX: Implemented the HomeScreen component which was missing.
interface HomeScreenProps {
    currentUserIdentifier: UserIdentifier;
    profiles: { Eu: UserProfile, Ela: UserProfile };
    events: CalendarEvent[];
    tasks: Task[];
    transactions: Transaction[];
    coupleQuestion: CoupleQuestion;
    onUpdateCoupleQuestionAnswer: (questionId: number, answer: string) => void;
    setActiveScreen: (screen: Screen) => void;
}

const WelcomeHeader: React.FC<{ profile: UserProfile, onProfileClick: () => void }> = ({ profile, onProfileClick }) => (
    <div className="flex items-center justify-between p-4">
        <div>
            <p className="text-md text-text-light dark:text-gray-400">Bem-vinda de volta,</p>
            <h1 className="text-2xl font-bold text-text-dark dark:text-gray-100">{profile.name.split(' ')[0]}</h1>
        </div>
        <button onClick={onProfileClick}>
            <img src={profile.avatar} alt={profile.name} className="w-12 h-12 rounded-full" />
        </button>
    </div>
);

const CoupleQuestionCard: React.FC<{ 
    question: CoupleQuestion,
    currentUser: UserIdentifier,
    onAnswer: (questionId: number, answer: string) => void
}> = ({ question, currentUser, onAnswer }) => {
    const [answer, setAnswer] = useState(question.answers[currentUser] || '');
    
    const handleSave = () => {
        if(answer.trim()){
            onAnswer(question.id, answer.trim());
        }
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
            <p className="text-sm font-semibold text-accent-pink">Pergunta do Dia</p>
            <p className="text-md font-bold text-text-dark dark:text-gray-100 my-2">{question.text}</p>
            <textarea 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onBlur={handleSave}
                rows={2} 
                className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-sm text-text-dark dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-accent-pink"
                placeholder="A tua resposta..."
            />
        </div>
    );
};

const EventItem: React.FC<{ event: CalendarEvent, onClick: () => void }> = ({ event, onClick }) => {
    const category = CATEGORIES.find(c => c.id === event.categoryId);
    const Icon = category?.icon || BellIcon;
    return (
        <div onClick={onClick} className="flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl min-w-[250px] cursor-pointer">
            <div className={`w-10 h-10 ${category?.bgColor || 'bg-gray-100'} rounded-lg flex items-center justify-center ${category?.color || 'text-gray-500'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="font-bold text-text-dark dark:text-gray-100">{event.title}</p>
                <p className="text-sm text-text-light dark:text-gray-400">{event.time}</p>
            </div>
        </div>
    )
};

const TaskItem: React.FC<{ task: Task, onClick: () => void }> = ({ task, onClick }) => {
    const userColor = task.assignedTo === 'Eu' ? 'border-l-4 border-blue-500' : task.assignedTo === 'Ela' ? 'border-l-4 border-pink-500' : 'border-l-4 border-gray-400';
    return (
        <div onClick={onClick} className={`flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer ${userColor}`}>
            <div className="flex-1">
                <p className="font-semibold text-text-dark dark:text-gray-100">{task.title}</p>
                <p className="text-xs text-text-light dark:text-gray-400">Atribuído a: {task.assignedTo}</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>
    )
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ currentUserIdentifier, profiles, events, tasks, setActiveScreen, coupleQuestion, onUpdateCoupleQuestionAnswer }) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysEvents = events.filter(e => e.date === today).sort((a,b) => a.time.localeCompare(b.time));
    const uncompletedTasks = tasks.filter(t => !t.completed);

    return (
        <div className="h-full flex flex-col bg-app-bg dark:bg-gray-900 pb-20">
            <WelcomeHeader profile={profiles[currentUserIdentifier]} onProfileClick={() => setActiveScreen('profile')} />
            <div className="px-4 flex-1 overflow-y-auto space-y-6">
                <CoupleQuestionCard question={coupleQuestion} currentUser={currentUserIdentifier} onAnswer={onUpdateCoupleQuestionAnswer} />

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-lg text-text-dark dark:text-gray-200">Eventos de Hoje</h2>
                        <button onClick={() => setActiveScreen('calendar')} className="text-sm font-semibold text-accent-blue">Ver todos</button>
                    </div>
                    {todaysEvents.length > 0 ? (
                        <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4">
                            {todaysEvents.map(event => <EventItem key={event.id} event={event} onClick={() => setActiveScreen('calendar')} />)}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-4 bg-white dark:bg-gray-800 rounded-xl">
                            <HeartIcon className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2"/>
                            <p>Dia livre! Aproveitem.</p>
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-lg text-text-dark dark:text-gray-200">Tarefas Pendentes</h2>
                        <button onClick={() => setActiveScreen('tasks')} className="text-sm font-semibold text-accent-blue">Ver todas</button>
                    </div>
                    {uncompletedTasks.length > 0 ? (
                         <div className="space-y-2">
                            {uncompletedTasks.slice(0, 3).map(task => <TaskItem key={task.id} task={task} onClick={() => setActiveScreen('tasks')} />)}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-4 bg-white dark:bg-gray-800 rounded-xl">
                           <TasksIcon className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2"/>
                           <p>Nenhuma tarefa pendente. Bom trabalho!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
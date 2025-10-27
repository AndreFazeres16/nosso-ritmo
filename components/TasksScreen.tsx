import React, { useState } from 'react';
import type { Task, User } from '../types';
import { PlusIcon, CheckCircleIcon, CircleIcon, TrashIcon } from './icons';

interface TasksScreenProps {
  tasks: Task[];
  onUpdateTasks: (updatedTasks: Task[]) => void;
  onBack: () => void;
}

const TaskHeader: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="p-6 bg-header-dark text-white rounded-b-3xl relative">
        <div className="flex items-center justify-between">
            <button onClick={onBack} className="font-semibold absolute left-4 top-1/2 -translate-y-1/2">&larr; Voltar</button>
            <h1 className="text-3xl font-bold text-center w-full">Tarefas</h1>
        </div>
        <p className="text-white/80 text-center mt-1">Vamos organizar o dia.</p>
    </div>
);

const AddTaskForm: React.FC<{ onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void; onClose: () => void; }> = ({ onAddTask, onClose }) => {
    const [title, setTitle] = useState('');
    const [assignedTo, setAssignedTo] = useState<User>('Nós Dois');

    const handleSubmit = () => {
        if (title.trim()) {
            onAddTask({ title, assignedTo });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
                <h2 className="text-xl font-bold text-text-dark dark:text-gray-100">Nova Tarefa</h2>
                <div>
                    <label htmlFor="task-title" className="text-sm font-semibold text-text-light dark:text-gray-400">Título</label>
                    <input id="task-title" value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-text-dark dark:text-gray-100" placeholder="Ex: Comprar pão" />
                </div>
                <div>
                    <label htmlFor="task-assignee" className="text-sm font-semibold text-text-light dark:text-gray-400">Atribuir a</label>
                    <select id="task-assignee" value={assignedTo} onChange={e => setAssignedTo(e.target.value as User)} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-text-dark dark:text-gray-100">
                        <option className="bg-white dark:bg-gray-800" value="Eu">Eu</option>
                        <option className="bg-white dark:bg-gray-800" value="Ela">Ela</option>
                        <option className="bg-white dark:bg-gray-800" value="Nós Dois">Nós Dois</option>
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


export const TasksScreen: React.FC<TasksScreenProps> = ({ tasks, onUpdateTasks, onBack }) => {
    const [showAddForm, setShowAddForm] = useState(false);

    const handleAddTask = (task: Omit<Task, 'id' | 'completed'>) => {
        const newTask: Task = { ...task, id: `task${Date.now()}`, completed: false };
        onUpdateTasks([...tasks, newTask]);
        setShowAddForm(false);
    };

    const handleToggleTask = (id: string) => {
        const newTasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
        onUpdateTasks(newTasks);
    };

    const handleDeleteTask = (id: string) => {
        const newTasks = tasks.filter(task => task.id !== id);
        onUpdateTasks(newTasks);
    };

    const uncompletedTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
        const userColor = task.assignedTo === 'Eu' ? 'border-l-4 border-blue-500' : task.assignedTo === 'Ela' ? 'border-l-4 border-pink-500' : 'border-l-4 border-gray-400';
        return (
            <div className={`flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm ${task.completed ? 'opacity-60' : ''} ${userColor}`}>
                <button onClick={() => handleToggleTask(task.id)} className="mr-3">
                    {task.completed ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <CircleIcon className="w-6 h-6 text-gray-300 dark:text-gray-600" />}
                </button>
                <div className="flex-1">
                    <p className={`font-semibold text-text-dark dark:text-gray-100 ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                    <p className="text-xs text-text-light dark:text-gray-400">Atribuído a: {task.assignedTo}</p>
                </div>
                <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-500">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        )
    };

    return (
        <div className="h-full flex flex-col bg-app-bg dark:bg-gray-900 relative">
            <TaskHeader onBack={onBack} />
            <div className="px-4 py-4 pb-24 flex-1 overflow-y-auto">
                <div className="mb-6">
                    <h2 className="font-bold text-lg text-text-dark dark:text-gray-200 mb-2">A Fazer ({uncompletedTasks.length})</h2>
                    {uncompletedTasks.length > 0 ? (
                        <div className="space-y-2">
                            {uncompletedTasks.map(task => <TaskItem key={task.id} task={task} />)}
                        </div>
                    ) : (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">Tudo em dia!</p>
                    )}
                </div>

                {completedTasks.length > 0 && (
                     <div className="mb-6">
                        <h2 className="font-bold text-lg text-text-dark dark:text-gray-200 mb-2">Concluídas ({completedTasks.length})</h2>
                        <div className="space-y-2">
                            {completedTasks.map(task => <TaskItem key={task.id} task={task} />)}
                        </div>
                    </div>
                )}
            </div>
            <button onClick={() => setShowAddForm(true)} className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue to-accent-pink text-white flex items-center justify-center shadow-lg">
                <PlusIcon className="w-8 h-8" />
            </button>
            {showAddForm && <AddTaskForm onAddTask={handleAddTask} onClose={() => setShowAddForm(false)} />}
        </div>
    );
};
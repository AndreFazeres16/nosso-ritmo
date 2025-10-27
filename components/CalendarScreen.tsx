import React, { useState } from 'react';
import type { CalendarEvent, UserProfile } from '../types';
import { CATEGORIES } from '../constants';

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const CalendarHeader: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="flex items-center justify-between p-4 bg-header-dark text-white rounded-t-3xl">
        <button onClick={onBack} className="font-semibold">&larr; Voltar</button>
        <h1 className="text-xl font-bold">Calendário Completo</h1>
        <div className="w-16"></div>
    </div>
);

const EventItem: React.FC<{ event: CalendarEvent }> = ({ event }) => {
    const category = CATEGORIES.find(c => c.id === event.categoryId);
    if (!category) return null;

    const Icon = category.icon;

    return (
        <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-3 rounded-xl mb-3 shadow-sm">
            <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center ${category.color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <p className="font-bold text-text-dark dark:text-gray-100">{event.title}</p>
                <p className="text-sm text-text-light dark:text-gray-400">{event.time} - {event.assignedTo}</p>
            </div>
            <div className={`p-1 text-xs font-semibold rounded-md ${category.bgColor} ${category.color}`}>
                {category.name}
            </div>
        </div>
    );
};


export const CalendarScreen: React.FC<{ events: CalendarEvent[], onBack: () => void }> = ({ events, onBack }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const eventsByDay: { [day: number]: CalendarEvent[] } = events.reduce((acc, event) => {
        const eventDate = new Date(event.date);
        if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
            const dayOfMonth = eventDate.getDate();
            if (!acc[dayOfMonth]) {
                acc[dayOfMonth] = [];
            }
            acc[dayOfMonth].push(event);
        }
        return acc;
    }, {} as { [day: number]: CalendarEvent[] });

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarDays = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`empty-${i}`}></div>);
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const today = new Date();
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
        const hasEvents = !!eventsByDay[day];

        calendarDays.push(
            <div key={day} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedDate(date)}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${isSelected ? 'bg-header-dark text-white dark:bg-primary-blue' : ''} ${isToday && !isSelected ? 'text-accent-pink font-bold' : ''}`}>
                    {day}
                </div>
                {hasEvents && <div className="w-1.5 h-1.5 bg-accent-pink rounded-full mt-1"></div>}
            </div>
        );
    }
    
    const selectedDayEvents = eventsByDay[selectedDate.getDate()] || [];

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    return (
        <div className="h-full flex flex-col bg-app-bg dark:bg-gray-900">
            <CalendarHeader onBack={onBack} />
            <div className="p-4 flex-1">
                <div className="flex justify-between items-center mb-4 text-text-dark dark:text-gray-200">
                    <button onClick={() => changeMonth(-1)}>&lt;</button>
                    <h2 className="text-xl font-bold">{monthNames[month]} {year}</h2>
                    <button onClick={() => changeMonth(1)}>&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-y-3 text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {daysOfWeek.map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-3 text-center text-text-dark dark:text-gray-300 font-medium">
                    {calendarDays}
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-t-3xl p-4 flex-grow-0 h-[40%] overflow-y-auto">
                <h3 className="font-bold text-lg mb-2 text-text-dark dark:text-gray-100">Eventos para {selectedDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}</h3>
                {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map(event => <EventItem key={event.id} event={event} />)
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 pt-8">Nenhum evento para este dia.</div>
                )}
            </div>
        </div>
    );
};
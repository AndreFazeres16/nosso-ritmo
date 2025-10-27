import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, UserProfile, UserIdentifier } from '../types';
import { SendIcon } from './icons';

interface ChatScreenProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    currentUser: UserIdentifier;
    profiles: { Eu: UserProfile, Ela: UserProfile };
    onBack: () => void;
}

const ChatHeader: React.FC<{ otherUser: UserProfile, onBack: () => void }> = ({ otherUser, onBack }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 text-text-dark dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
        <button onClick={onBack} className="font-semibold text-text-dark dark:text-gray-200 w-20 text-left">&larr; Voltar</button>
        <div className="flex items-center space-x-2">
            <p className="font-semibold">{otherUser.name}</p>
            <img src={otherUser.avatar} alt={otherUser.name} className="w-8 h-8 rounded-full" />
        </div>
    </div>
);

export const ChatScreen: React.FC<ChatScreenProps> = ({ messages, onSendMessage, currentUser, profiles, onBack }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    const otherUserIdentifier = currentUser === 'Eu' ? 'Ela' : 'Eu';
    const otherUserProfile = profiles[otherUserIdentifier];

    return (
        <div className="h-full flex flex-col bg-app-bg dark:bg-gray-900">
            <ChatHeader otherUser={otherUserProfile} onBack={onBack} />
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender === currentUser ? 'bg-primary-blue text-text-dark rounded-br-none' : 'bg-primary-pink text-text-dark rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Escreve uma mensagem..."
                        className="flex-1 bg-transparent px-2 text-text-dark dark:text-gray-100 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button onClick={handleSend} className="w-10 h-10 flex items-center justify-center text-white bg-accent-blue rounded-full">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
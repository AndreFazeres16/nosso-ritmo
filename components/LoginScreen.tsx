import React, { useState, useEffect } from 'react';
import type { UserIdentifier, UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: (user: 'Eu' | 'Ela', pin: string) => void;
  loginError: string | null;
  profiles: Record<UserIdentifier, UserProfile>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, loginError, profiles }) => {
  const [selectedUser, setSelectedUser] = useState<'Eu' | 'Ela' | null>(null);
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePinClick = (digit: string) => {
    if (isSubmitting) return;
    if (digit === 'del') {
      setPin(p => p.slice(0, -1));
    } else if (pin.length < 4) {
      setPin(p => p + digit);
    }
  };
  
  useEffect(() => {
    if (pin.length === 4 && selectedUser) {
        setIsSubmitting(true);
        setTimeout(() => {
            onLogin(selectedUser, pin);
            setPin('');
            setIsSubmitting(false);
        }, 300);
    }
  }, [pin, selectedUser, onLogin]);

  if (!selectedUser) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-blue to-primary-pink p-8 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full filter blur-xl"></div>
        <div className="absolute -bottom-24 -right-16 w-72 h-72 bg-white/10 rounded-full filter blur-xl"></div>
        
        <div className="z-10 text-center">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">Nosso Ritmo</h1>
            <p className="text-white/80 text-lg mb-12">Quem está a entrar?</p>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <button onClick={() => setSelectedUser('Eu')} className="flex flex-col items-center text-white/90 hover:text-white transition-transform duration-300 hover:scale-105 group">
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mb-3 ring-4 ring-white/30 group-hover:ring-white/50 transition-all backdrop-blur-sm">
                  <img src={profiles.Eu.avatar} alt="Eu" className="w-28 h-28 rounded-full shadow-lg object-cover" />
                </div>
                <p className="font-bold text-2xl drop-shadow-sm">Eu</p>
              </button>
              <button onClick={() => setSelectedUser('Ela')} className="flex flex-col items-center text-white/90 hover:text-white transition-transform duration-300 hover:scale-105 group">
                 <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mb-3 ring-4 ring-white/30 group-hover:ring-white/50 transition-all backdrop-blur-sm">
                  <img src={profiles.Ela.avatar} alt="Ela" className="w-28 h-28 rounded-full shadow-lg object-cover" />
                </div>
                <p className="font-bold text-2xl drop-shadow-sm">Ela</p>
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-app-bg dark:bg-gray-900 p-8">
      <div className="text-center w-full">
        <button onClick={() => setSelectedUser(null)} className="text-sm text-text-light dark:text-gray-400 mb-4 float-left">&larr; Voltar</button>
        <div className="pt-10">
             <img src={profiles[selectedUser].avatar} alt={selectedUser} className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
            <p className="text-lg font-bold text-text-dark dark:text-gray-100">Olá, {profiles[selectedUser].name.split(' ')[0]}</p>
            <p className="text-sm text-text-light dark:text-gray-400">Insira o seu PIN de segurança</p>
        </div>
      </div>
      
      <div className={`flex space-x-4 my-6 ${loginError ? 'animate-shake' : ''}`}>
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className={`w-5 h-5 rounded-full transition-all duration-300 ${i < pin.length ? 'bg-header-dark dark:bg-primary-blue scale-110' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        ))}
      </div>
        
      {loginError && <p className="text-red-500 text-sm mb-4 absolute top-1/2 mt-6">{loginError}</p>}

      <div className="grid grid-cols-3 gap-5 w-full max-w-xs">
        {[...Array(9).keys()].map(i => i + 1).map(digit => (
          <button key={digit} onClick={() => handlePinClick(String(digit))} className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow text-3xl font-light text-text-dark dark:text-gray-100 active:bg-gray-100 dark:active:bg-gray-700 transition-colors">
            {digit}
          </button>
        ))}
        <div/>
        <button onClick={() => handlePinClick('0')} className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow text-3xl font-light text-text-dark dark:text-gray-100 active:bg-gray-100 dark:active:bg-gray-700 transition-colors">
          0
        </button>
        <button onClick={() => handlePinClick('del')} className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow flex items-center justify-center text-text-dark dark:text-gray-100 active:bg-gray-100 dark:active:bg-gray-700 transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12"></path></svg>
        </button>
      </div>
    </div>
  );
};
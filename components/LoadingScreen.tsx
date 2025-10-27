import React from 'react';
import { HeartIcon } from './icons';

export const LoadingScreen: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-pink to-primary-blue">
    <div className="text-center text-white">
        <HeartIcon className="w-24 h-24 mx-auto animate-pulse" />
        <h1 className="text-4xl font-bold mt-4">Nosso Ritmo</h1>
        <p className="opacity-80 mt-2">A organizar a vida a dois.</p>
    </div>
  </div>
);
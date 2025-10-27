import React from 'react';
import { SettingsLayout } from './SettingsLayout';

export const AboutScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <SettingsLayout title="Sobre" onBack={onBack}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4 text-text-dark dark:text-gray-300">
            <div className="text-center mb-4">
                 <h2 className="text-2xl font-bold text-header-dark dark:text-primary-pink">Nosso Ritmo</h2>
                 <p className="text-text-light dark:text-gray-400">Versão 1.1.0</p>
            </div>
            <p>
                Este aplicativo foi criado com o objetivo de fortalecer a conexão e a parceria entre casais. Acreditamos que uma vida a dois bem organizada abre mais espaço para os momentos que realmente importam.
            </p>
             <p>
                Com o "Nosso Ritmo", vocês podem sincronizar calendários, dividir tarefas, planejar finanças e, acima de tudo, construir uma rotina harmoniosa juntos.
            </p>
            <p className="mt-6 text-center text-text-light dark:text-gray-400">
                Feito com ❤️ para vocês.
            </p>
        </div>
    </SettingsLayout>
);
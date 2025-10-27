import React from 'react';
import { SettingsLayout } from './SettingsLayout';

export const PrivacyScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <SettingsLayout title="Privacidade" onBack={onBack}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4 text-text-dark dark:text-gray-300">
            <h2 className="text-lg font-bold text-text-dark dark:text-gray-100">Compromisso com sua Privacidade</h2>
            <p>
                No "Nosso Ritmo", sua privacidade é fundamental. Todas as informações que você adiciona — eventos, tarefas, finanças e mensagens — são armazenadas exclusivamente no seu dispositivo, usando o armazenamento local do navegador.
            </p>
            <p>
                Isso significa que nós não temos acesso a nenhum dos seus dados. Eles não são enviados para nenhum servidor ou nuvem. Apenas vocês dois, no mesmo dispositivo, têm acesso às informações compartilhadas.
            </p>
            <h2 className="text-lg font-bold text-text-dark dark:text-gray-100 mt-4">Nenhum Rastreamento</h2>
            <p>
                O aplicativo não utiliza cookies de rastreamento ou qualquer outra ferramenta de análise de dados. Sua utilização é completamente anônima.
            </p>
        </div>
    </SettingsLayout>
);
import React, { useState } from 'react';
import { SettingsLayout } from './SettingsLayout';
import { SparklesIcon } from './icons';

// A simple markdown-to-html renderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n/g, '<br />'); // Newlines
    return <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};


interface AIPlannerScreenProps {
    generateIdeas: (mood: string) => Promise<string>;
    onBack: () => void;
}

const MOOD_OPTIONS = ["Noite tranquila em casa", "Aventura ao ar livre", "Jantar romântico fora", "Cultural e artístico", "Divertido e competitivo"];

export const AIPlannerScreen: React.FC<AIPlannerScreenProps> = ({ generateIdeas, onBack }) => {
    const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [ideas, setIdeas] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setIdeas(null);
        try {
            const result = await generateIdeas(selectedMood);
            setIdeas(result);
        } catch (e) {
            console.error(e);
            setError("Ocorreu um erro ao gerar as ideias. Por favor, tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SettingsLayout title="Planeador de Encontros IA" onBack={onBack}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
                <p className="text-text-light dark:text-gray-400">Não sabem o que fazer? Deixem que a nossa IA vos ajude a planear o próximo encontro inesquecível.</p>
                <div>
                    <label className="text-sm font-semibold text-text-dark dark:text-gray-200">Qual é o vosso mood?</label>
                    <select value={selectedMood} onChange={e => setSelectedMood(e.target.value)} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-text-dark dark:text-gray-100">
                        {MOOD_OPTIONS.map(mood => <option key={mood} value={mood}>{mood}</option>)}
                    </select>
                </div>
                 <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-br from-accent-blue to-accent-pink text-white p-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                    <SparklesIcon className="w-5 h-5" />
                    <span>{isLoading ? "A gerar ideias..." : "Gerar Sugestões"}</span>
                </button>
            </div>

            {isLoading && (
                 <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-4">
                    <p className="text-text-light dark:text-gray-400 animate-pulse">A preparar algo mágico para vocês...</p>
                </div>
            )}
            
            {error && (
                <div className="text-center p-4 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg shadow-sm mt-4">
                    <p>{error}</p>
                </div>
            )}

            {ideas && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mt-4 space-y-4">
                     <h3 className="text-lg font-bold text-text-dark dark:text-gray-100">Aqui ficam algumas ideias:</h3>
                     <div className="p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg text-text-dark dark:text-gray-200">
                        <MarkdownRenderer content={ideas} />
                     </div>
                </div>
            )}
        </SettingsLayout>
    );
};
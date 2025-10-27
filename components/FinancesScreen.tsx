import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Transaction, UserProfile } from '../types';
import { PlusIcon, UserIcon, PiggyBankIcon, RestaurantIcon, CinemaIcon, CartIcon, SparklesIcon, CameraIcon } from './icons';

const transactionCategories = [
    { name: 'Renda', icon: PiggyBankIcon, color: 'text-green-500', bgColor: 'bg-green-100' },
    { name: 'Lazer', icon: RestaurantIcon, color: 'text-orange-500', bgColor: 'bg-orange-100' },
    { name: 'Cinema', icon: CinemaIcon, color: 'text-purple-500', bgColor: 'bg-purple-100' },
    { name: 'Casa', icon: CartIcon, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { name: 'Compras', icon: CartIcon, color: 'text-indigo-500', bgColor: 'bg-indigo-100' },
    { name: 'Outros', icon: SparklesIcon, color: 'text-gray-500', bgColor: 'bg-gray-100' },
];

const ScanReceiptModal: React.FC<{
    onClose: () => void;
    onAnalyze: (base64: string) => void;
    isLoading: boolean;
    error: string | null;
}> = ({ onClose, onAnalyze, isLoading, error }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    
    const handleAnalyzeClick = () => {
        if (preview) {
             const base64Data = preview.split(',')[1];
             onAnalyze(base64Data);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
                 <div className="flex items-center space-x-2">
                    <CameraIcon className="w-6 h-6 text-accent-blue"/>
                    <h2 className="text-xl font-bold text-text-dark dark:text-gray-100">Analisar Recibo</h2>
                </div>
                {preview ? (
                    <img src={preview} alt="Preview do recibo" className="w-full h-48 object-contain rounded-lg bg-gray-100 dark:bg-gray-700"/>
                ) : (
                    <label className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <CameraIcon className="w-10 h-10 text-gray-400"/>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tirar ou escolher foto</p>
                        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden"/>
                    </label>
                )}
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-text-dark dark:text-gray-200">Cancelar</button>
                    <button onClick={handleAnalyzeClick} disabled={!preview || isLoading} className="px-4 py-2 rounded-lg bg-accent-blue text-white font-semibold disabled:opacity-50 flex items-center">
                        {isLoading && <SparklesIcon className="w-4 h-4 mr-2 animate-pulse"/>}
                        {isLoading ? "A analisar..." : "Analisar"}
                    </button>
                </div>
            </div>
        </div>
    );
};


const AddTransactionForm: React.FC<{ initialData?: Partial<Transaction>; onAdd: (t: Omit<Transaction, 'id'>) => void; onClose: () => void; }> = ({ initialData = {}, onAdd, onClose }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [amount, setAmount] = useState(initialData.amount ? String(initialData.amount) : '');
    const [type, setType] = useState<'income' | 'expense'>(initialData.type || 'expense');
    const [categoryName, setCategoryName] = useState(initialData.category || 'Lazer');

    const handleSubmit = () => {
        const numericAmount = parseFloat(amount);
        if (title.trim() && !isNaN(numericAmount) && numericAmount > 0) {
            const category = transactionCategories.find(c => c.name === categoryName) || transactionCategories.find(c => c.name === 'Outros')!;
            onAdd({
                title,
                amount: numericAmount,
                type,
                category: categoryName,
                icon: category.icon,
                color: category.color,
                bgColor: category.bgColor,
                date: new Date().toISOString(),
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
                <h2 className="text-xl font-bold text-text-dark dark:text-gray-100">Nova Transação</h2>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button onClick={() => setType('income')} className={`flex-1 p-2 rounded-md font-semibold text-text-dark dark:text-gray-100 ${type === 'income' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}>Receita</button>
                    <button onClick={() => setType('expense')} className={`flex-1 p-2 rounded-md font-semibold text-text-dark dark:text-gray-100 ${type === 'expense' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}>Despesa</button>
                </div>
                <div>
                    <label className="text-sm font-semibold text-text-light dark:text-gray-400">Título</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-text-dark dark:text-gray-100" placeholder="Ex: Jantar fora" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-text-light dark:text-gray-400">Valor (€)</label>
                    <input value={amount} onChange={e => setAmount(e.target.value)} type="number" className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-text-dark dark:text-gray-100" placeholder="25.00" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-text-light dark:text-gray-400">Categoria</label>
                    <select value={categoryName} onChange={e => setCategoryName(e.target.value)} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-text-dark dark:text-gray-100">
                        {transactionCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
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

export const FinancesScreen: React.FC<{ transactions: Transaction[], onAddTransaction: (t: Omit<Transaction, 'id'>) => void, profiles: { Eu: UserProfile, Ela: UserProfile }, analyzeReceipt: (base64: string) => Promise<Partial<Transaction>> }> = ({ transactions, onAddTransaction, profiles, analyzeReceipt }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [initialTransactionData, setInitialTransactionData] = useState<Partial<Transaction> | undefined>(undefined);
    const [showScanModal, setShowScanModal] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);

    const handleAddTransaction = (t: Omit<Transaction, 'id'>) => {
        onAddTransaction(t);
        setShowAddForm(false);
        setInitialTransactionData(undefined);
    };

    const handleAnalyzeReceipt = async (base64Image: string) => {
        setIsScanning(true);
        setScanError(null);
        try {
            const extractedData = await analyzeReceipt(base64Image);
            setInitialTransactionData({ ...extractedData, type: 'expense' });
            setShowScanModal(false);
            setShowAddForm(true);
        } catch (error) {
            setScanError("Não foi possível analisar o recibo. Tente novamente.");
            console.error(error);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-app-bg dark:bg-gray-900 relative">
             <div className="p-6">
                <h1 className="text-4xl font-bold text-text-dark dark:text-gray-100">Finanças</h1>
            </div>
            
            <div className="grid grid-cols-2 gap-4 px-6 mb-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-text-light dark:text-gray-400">Receitas</p>
                    <p className="text-xl font-bold text-green-500">+€{totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-text-light dark:text-gray-400">Despesas</p>
                    <p className="text-xl font-bold text-red-500">€{Math.abs(totalExpense).toFixed(2)}</p>
                </div>
            </div>

            <div className="px-6 mb-4">
                <button onClick={() => setShowScanModal(true)} className="w-full flex items-center justify-center space-x-2 bg-blue-100 dark:bg-blue-900/50 text-accent-blue font-semibold p-3 rounded-lg">
                    <CameraIcon className="w-5 h-5" />
                    <span>Analisar Recibo com IA</span>
                </button>
            </div>
            
            <div className="px-6 pb-24 flex-1 overflow-y-auto">
                 <h2 className="text-lg font-bold text-text-dark dark:text-gray-200 mb-2">Histórico de Transações</h2>
                 {transactions.length > 0 ? (
                    transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => {
                        const categoryInfo = transactionCategories.find(c => c.name === t.category) || transactionCategories.find(c => c.name === 'Outros')!;
                        const Icon = categoryInfo.icon;
                        const amountColor = t.type === 'income' ? 'text-green-500' : 'text-red-500';
                        const amountPrefix = t.type === 'income' ? '+' : '-';
                        return (
                            <div key={t.id} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-xl mb-3 shadow-sm">
                                <div className={`w-12 h-12 ${categoryInfo.bgColor} rounded-lg flex items-center justify-center ${categoryInfo.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <p className="font-bold text-text-dark dark:text-gray-100">{t.title}</p>
                                    <p className="text-sm text-text-light dark:text-gray-400">{new Date(t.date).toLocaleDateString('pt-PT')}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${amountColor}`}>{amountPrefix}€{Math.abs(t.amount || 0).toFixed(2)}</p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 pt-8">Nenhuma transação registada.</div>
                )}
            </div>
            <button onClick={() => { setInitialTransactionData(undefined); setShowAddForm(true); }} className="absolute bottom-24 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-accent-blue to-accent-pink text-white flex items-center justify-center shadow-lg">
                <PlusIcon className="w-8 h-8" />
            </button>
            {showAddForm && <AddTransactionForm initialData={initialTransactionData} onAdd={handleAddTransaction} onClose={() => { setShowAddForm(false); setInitialTransactionData(undefined); }}/>}
            {showScanModal && <ScanReceiptModal onClose={() => setShowScanModal(false)} onAnalyze={handleAnalyzeReceipt} isLoading={isScanning} error={scanError}/>}
        </div>
    );
};
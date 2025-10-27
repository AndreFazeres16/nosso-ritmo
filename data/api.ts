import { GoogleGenAI, Type } from "@google/genai";
import type { 
    Transaction, Screen, UserIdentifier, UserProfile, CalendarEvent, Task, 
    ShoppingListItem, ChatMessage, Memory, CoupleQuestion, NotificationSettings
} from '../types';

// --- LOCAL STORAGE API ---

const get = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (e) {
        console.error(`Error reading from localStorage for key "${key}":`, e);
        return defaultValue;
    }
};

const save = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Error writing to localStorage for key "${key}":`, e);
    }
};

// Default Profiles
const defaultProfiles: Record<UserIdentifier, UserProfile> = {
    Eu: { name: 'João Silva', avatar: 'https://picsum.photos/96/96?random=1', pin: '2606' },
    Ela: { name: 'Maria Costa', avatar: 'https://picsum.photos/96/96?random=2', pin: '2606' },
};

// Getters
export const getTheme = () => get<boolean>('darkMode', false);
export const getActiveScreen = () => get<Screen>('activeScreen', 'home');
export const getLoggedInUser = () => get<UserIdentifier | null>('loggedInUser', null);
export const getProfiles = () => get<Record<UserIdentifier, UserProfile>>('userProfiles', defaultProfiles);
export const getEvents = () => get<CalendarEvent[]>('calendarEvents', []);
export const getTasks = () => get<Task[]>('tasks', []);
export const getTransactions = () => get<Transaction[]>('transactions', []);
export const getShoppingList = () => get<ShoppingListItem[]>('shoppingList', []);
export const getMessages = () => get<ChatMessage[]>('chatMessages', []);
export const getMemories = () => get<Memory[]>('memories', []);
export const getCoupleQuestion = () => get<CoupleQuestion | null>('coupleQuestion', null);
export const getNotificationSettings = () => get<NotificationSettings>('notificationSettings', { eventReminders: true, newTasks: true, chatMessages: false });

// Setters
export const saveTheme = (value: boolean) => save('darkMode', value);
export const saveActiveScreen = (value: Screen) => save('activeScreen', value);
export const saveLoggedInUser = (value: UserIdentifier | null) => save('loggedInUser', value);
export const saveProfiles = (value: Record<UserIdentifier, UserProfile>) => save('userProfiles', value);
export const saveEvents = (value: CalendarEvent[]) => save('calendarEvents', value);
export const saveTasks = (value: Task[]) => save('tasks', value);
export const saveTransactions = (value: Transaction[]) => save('transactions', value);
export const saveShoppingList = (value: ShoppingListItem[]) => save('shoppingList', value);
export const saveMessages = (value: ChatMessage[]) => save('chatMessages', value);
export const saveMemories = (value: Memory[]) => save('memories', value);
export const saveCoupleQuestion = (value: CoupleQuestion) => save('coupleQuestion', value);
export const saveNotificationSettings = (value: NotificationSettings) => save('notificationSettings', value);


// --- GEMINI AI API ---

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Analyzes a receipt image and extracts transaction details.
 */
export const analyzeReceiptWithAI = async (base64Image: string): Promise<Partial<Transaction>> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    { text: `Analisa este recibo. Extrai o valor total e um título curto e descritivo para a despesa (ex: "Jantar no restaurante X", "Compras no supermercado Y"). Responde apenas com JSON.` }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Um título curto para a despesa." },
                        amount: { type: Type.NUMBER, description: "O valor total da despesa." }
                    },
                    required: ["title", "amount"]
                }
            }
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (typeof result.title === 'string' && typeof result.amount === 'number') {
            return { title: result.title, amount: result.amount };
        } else {
            throw new Error("Formato de resposta da IA inválido.");
        }
    } catch (error) {
        console.error("Erro ao analisar o recibo com IA:", error);
        throw new Error("Não foi possível processar a imagem do recibo.");
    }
};

/**
 * Generates date ideas based on a selected mood.
 */
export const generateDateIdeasWithAI = async (mood: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Age como um especialista em relacionamentos. Gera 3 ideias criativas e detalhadas para um encontro de casal com o mood "${mood}". Formata a resposta com **títulos** para cada ideia e descrições curtas.`,
            config: { temperature: 0.7 },
        });
        
        return response.text;
    } catch (error) {
        console.error("Erro ao gerar ideias de encontros com IA:", error);
        throw new Error("Não foi possível gerar ideias neste momento.");
    }
};

import React, { useState, useEffect } from 'react';

// Import types
import type { 
    Screen, UserIdentifier, UserProfile, CalendarEvent, Task, Transaction, 
    ShoppingListItem, ChatMessage, Memory, CoupleQuestion, NotificationSettings
} from './types';

// Import constants
import { COUPLE_QUESTIONS } from './constants';

// Import API functions
import * as api from './data/api';

// Import Components
import { LoadingScreen } from './components/LoadingScreen';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { BottomNav } from './components/BottomNav';
import { AddEventScreen } from './components/AddEventScreen';
import { FinancesScreen } from './components/FinancesScreen';
import { ShoppingListScreen } from './components/ShoppingListScreen';
import { MemoriesScreen } from './components/MemoriesScreen';
import { AddMemoryScreen } from './components/AddMemoryScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { TasksScreen } from './components/TasksScreen';
import { ChatScreen } from './components/ChatScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { EditProfileScreen } from './components/EditProfileScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { ThemesScreen } from './components/ThemesScreen';
import { PrivacyScreen } from './components/PrivacyScreen';
import { AboutScreen } from './components/AboutScreen';
import { AIPlannerScreen } from './components/AIPlannerScreen';

const getDailyQuestion = (): CoupleQuestion => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const questionTemplate = COUPLE_QUESTIONS[dayOfYear % COUPLE_QUESTIONS.length];
    return {
        ...questionTemplate,
        answers: {} // Start with empty answers for the day
    };
}


function App() {
  // App State
  const [appReady, setAppReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(api.getTheme());
  const [activeScreen, setActiveScreen] = useState<Screen>(api.getActiveScreen());
  const [loggedInUser, setLoggedInUser] = useState<UserIdentifier | null>(api.getLoggedInUser());
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data State - Now uses standard useState
  const [profiles, setProfiles] = useState<Record<UserIdentifier, UserProfile>>({Eu: {name: '', avatar: '', pin: ''}, Ela: {name: '', avatar: '', pin: ''}});
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [coupleQuestion, setCoupleQuestion] = useState<CoupleQuestion>(getDailyQuestion());
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({ eventReminders: true, newTasks: true, chatMessages: false });
  
  // Initial data load from API layer
  useEffect(() => {
    const loadData = () => {
        setProfiles(api.getProfiles());
        setEvents(api.getEvents());
        setTasks(api.getTasks());
        setTransactions(api.getTransactions());
        setShoppingList(api.getShoppingList());
        setMessages(api.getMessages());
        setMemories(api.getMemories());
        setNotificationSettings(api.getNotificationSettings());
        
        // Daily question logic
        const savedQuestion = api.getCoupleQuestion();
        const dailyQuestion = getDailyQuestion();
        if (savedQuestion && savedQuestion.id === dailyQuestion.id) {
            setCoupleQuestion(savedQuestion);
        } else {
            setCoupleQuestion(dailyQuestion);
            api.saveCoupleQuestion(dailyQuestion);
        }
        
        // Wait a bit for a smoother loading experience
        setTimeout(() => setAppReady(true), 1500);
    }
    loadData();
  }, []);

  // Persist state changes via API layer
  useEffect(() => { api.saveTheme(isDarkMode); }, [isDarkMode]);
  useEffect(() => { api.saveActiveScreen(activeScreen); }, [activeScreen]);
  useEffect(() => { api.saveLoggedInUser(loggedInUser); }, [loggedInUser]);

  // Apply dark mode class
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // --- Handlers ---
  const handleLogin = (user: UserIdentifier, pin: string) => {
    const allProfiles = api.getProfiles(); // Get latest profiles
    if (allProfiles[user].pin === pin) {
      setLoggedInUser(user);
      setActiveScreen('home');
      setLoginError(null);
    } else {
      setLoginError('PIN incorreto. Tente novamente.');
      setTimeout(() => setLoginError(null), 2000);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setActiveScreen('home');
  };
  
  const handleUpdateProfile = (identifier: UserIdentifier, updatedProfile: UserProfile) => {
      const newProfiles = { ...profiles, [identifier]: updatedProfile };
      setProfiles(newProfiles);
      api.saveProfiles(newProfiles);
  };

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...event, id: `evt${Date.now()}` };
    const newEvents = [...events, newEvent];
    setEvents(newEvents);
    api.saveEvents(newEvents);
    setActiveScreen('home');
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
      const newTransaction: Transaction = { ...transaction, id: `trn${Date.now()}` };
      const newTransactions = [...transactions, newTransaction];
      setTransactions(newTransactions);
      api.saveTransactions(newTransactions);
  };
  
  const handleSendMessage = (text: string) => {
      if(!loggedInUser) return;
      const newMessage: ChatMessage = { id: `msg${Date.now()}`, text, sender: loggedInUser, timestamp: Date.now() };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      api.saveMessages(newMessages);
  }
  
  const handleUpdateTasks = (newTasks: Task[]) => {
      setTasks(newTasks);
      api.saveTasks(newTasks);
  };

  const handleUpdateShoppingList = (newList: ShoppingListItem[]) => {
      setShoppingList(newList);
      api.saveShoppingList(newList);
  };
  
  const handleAddMemory = (memory: Omit<Memory, 'id'>) => {
      const newMemory: Memory = { ...memory, id: `mem${Date.now()}` };
      const newMemories = [...memories, newMemory];
      setMemories(newMemories);
      api.saveMemories(newMemories);
      setActiveScreen('memories');
  };
  
  const handleUpdateNotificationSettings = (newSettings: NotificationSettings) => {
      setNotificationSettings(newSettings);
      api.saveNotificationSettings(newSettings);
  };

  const handleUpdateCoupleQuestionAnswer = (questionId: number, answer: string) => {
      if(!loggedInUser || questionId !== coupleQuestion.id) return;
      const newQuestionState = {
          ...coupleQuestion,
          answers: { ...coupleQuestion.answers, [loggedInUser]: answer }
      };
      setCoupleQuestion(newQuestionState);
      api.saveCoupleQuestion(newQuestionState);
  };

  // --- Render Logic ---
  if (!appReady) return <LoadingScreen />;
  if (!loggedInUser) return <LoginScreen onLogin={handleLogin} loginError={loginError} profiles={profiles} />;

  const mainScreens = ['home', 'memories', 'finances', 'shopping-list'];
  const showBottomNav = mainScreens.includes(activeScreen) || activeScreen === 'add-event';
  
  const renderScreen = () => {
    switch(activeScreen) {
      case 'home': return <HomeScreen currentUserIdentifier={loggedInUser} profiles={profiles} events={events} tasks={tasks} transactions={transactions} coupleQuestion={coupleQuestion} onUpdateCoupleQuestionAnswer={handleUpdateCoupleQuestionAnswer} setActiveScreen={setActiveScreen} />;
      case 'memories': return <MemoriesScreen memories={memories} setActiveScreen={setActiveScreen} />;
      case 'add-memory': return <AddMemoryScreen onSave={handleAddMemory} onBack={() => setActiveScreen('memories')} />;
      case 'add-event': return <AddEventScreen onSave={handleAddEvent} onBack={() => setActiveScreen('home')} />;
      case 'finances': return <FinancesScreen transactions={transactions} onAddTransaction={handleAddTransaction} profiles={profiles} analyzeReceipt={api.analyzeReceiptWithAI} />;
      case 'shopping-list': return <ShoppingListScreen initialItems={shoppingList} onUpdate={handleUpdateShoppingList} />;
      case 'calendar': return <CalendarScreen events={events} onBack={() => setActiveScreen('home')} />;
      case 'tasks': return <TasksScreen tasks={tasks} onUpdateTasks={handleUpdateTasks} onBack={() => setActiveScreen('home')} />;
      case 'chat': return <ChatScreen messages={messages} onSendMessage={handleSendMessage} currentUser={loggedInUser} profiles={profiles} onBack={() => setActiveScreen('home')} />;
      case 'profile': return <ProfileScreen currentUserIdentifier={loggedInUser} profiles={profiles} onLogout={handleLogout} setActiveScreen={setActiveScreen} />;
      case 'edit-profile': return <EditProfileScreen currentUserIdentifier={loggedInUser} profile={profiles[loggedInUser]} onSave={handleUpdateProfile} onBack={() => setActiveScreen('profile')} />;
      case 'notifications': return <NotificationsScreen settings={notificationSettings} onSettingsChange={handleUpdateNotificationSettings} onBack={() => setActiveScreen('profile')} />;
      case 'themes': return <ThemesScreen isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} onBack={() => setActiveScreen('profile')} />;
      case 'privacy': return <PrivacyScreen onBack={() => setActiveScreen('profile')} />;
      case 'about': return <AboutScreen onBack={() => setActiveScreen('profile')} />;
      case 'ai-planner': return <AIPlannerScreen generateIdeas={api.generateDateIdeasWithAI} onBack={() => setActiveScreen('profile')} />;
      default: return <HomeScreen currentUserIdentifier={loggedInUser} profiles={profiles} events={events} tasks={tasks} transactions={transactions} coupleQuestion={coupleQuestion} onUpdateCoupleQuestionAnswer={handleUpdateCoupleQuestionAnswer} setActiveScreen={setActiveScreen} />;
    }
  }

  return (
    <div className="w-screen h-screen bg-app-bg dark:bg-gray-900 font-sans max-w-lg mx-auto shadow-2xl relative overflow-hidden">
        <main className="h-full w-full">
            {renderScreen()}
        </main>
        {showBottomNav && <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />}
    </div>
  );
}

export default App;

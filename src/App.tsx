import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/views/Dashboard';
import { TasksView } from './components/views/TasksView';
import { HabitsView } from './components/views/HabitsView';
import { DiaryView } from './components/views/DiaryView';
import { HealthView } from './components/views/HealthView';
import { FinanceView } from './components/views/FinanceView';
import { NutritionView } from './components/views/NutritionView';
import { Onboarding } from './components/Onboarding';
import { useApp } from './contexts/AppContext';

function AppContent() {
  const { state } = useApp();
  const isDark = state.theme === 'dark';

  if (state.isOnboarding) {
    return <Onboarding />;
  }

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TasksView />;
      case 'habits':
        return <HabitsView />;
      case 'diary':
        return <DiaryView />;
      case 'health':
        return <HealthView />;
      case 'finance':
        return <FinanceView />;
      case 'nutrition':
        return <NutritionView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`h-screen flex flex-col transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        {renderCurrentView()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
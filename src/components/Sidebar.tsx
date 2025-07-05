import React from 'react';
import { 
  LayoutDashboard,
  CheckSquare, 
  Repeat, 
  BookOpen, 
  Heart, 
  DollarSign, 
  Utensils, 
  Gift,
  Settings,
  HelpCircle 
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  count?: number;
}

export function Sidebar() {
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';
  
  const menuItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare, count: state.tasks.filter(t => !t.completed).length },
    { id: 'habits', label: 'Hábitos', icon: Repeat, count: state.habits.length },
    { id: 'diary', label: 'Diário', icon: BookOpen },
    { id: 'health', label: 'Saúde', icon: Heart },
    { id: 'finance', label: 'Finanças', icon: DollarSign },
    { id: 'nutrition', label: 'Nutrição', icon: Utensils },
    { id: 'rewards', label: 'Recompensas', icon: Gift },
  ];

  const bottomItems: SidebarItem[] = [
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'help', label: 'Ajuda', icon: HelpCircle },
  ];

  const handleNavigation = (viewId: string) => {
    dispatch({ type: 'SET_VIEW', payload: viewId });
  };

  return (
    <div className={`w-72 ${
      isDark 
        ? 'bg-gray-900/50 border-gray-800' 
        : 'bg-white/50 border-gray-100'
    } backdrop-blur-xl border-r flex flex-col transition-all duration-300`}>
      <div className="flex-1 py-6">
        <nav className="px-4">
          <div className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = state.currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all group relative overflow-hidden ${
                    isActive 
                      ? isDark
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 shadow-lg shadow-green-500/20 border border-green-500/30'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800/50 hover:text-green-400'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {isActive && isDark && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 animate-pulse" />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${
                    isActive 
                      ? isDark ? 'text-green-400' : 'text-white'
                      : isDark 
                        ? 'text-gray-400 group-hover:text-green-400' 
                        : 'text-gray-500 group-hover:text-gray-700'
                  } transition-all duration-300`} />
                  <span className="flex-1 font-medium relative z-10">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium relative z-10 ${
                      isActive 
                        ? isDark 
                          ? 'bg-green-400/20 text-green-300 border border-green-400/30' 
                          : 'bg-white/20 text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                    } transition-all duration-300`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <div className={`border-t ${
        isDark ? 'border-gray-800' : 'border-gray-100'
      } p-4`}>
        <div className="space-y-1">
          {bottomItems.map(item => {
            const Icon = item.icon;
            const isActive = state.currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all group ${
                  isActive 
                    ? isDark
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 shadow-lg shadow-green-500/20'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-800/50 hover:text-green-400'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  isActive 
                    ? isDark ? 'text-green-400' : 'text-white'
                    : isDark 
                      ? 'text-gray-400 group-hover:text-green-400' 
                      : 'text-gray-500 group-hover:text-gray-700'
                } transition-all duration-300`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
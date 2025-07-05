import React from 'react';
import { Trophy, Flame, Settings, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { BrainLogo } from './BrainLogo';

export function Header() {
  const { state, dispatch } = useApp();
  const user = state.user;
  const isDark = state.theme === 'dark';

  if (!user) return null;

  return (
    <header className={`${
      isDark 
        ? 'bg-gray-900/80 border-gray-800' 
        : 'bg-white/80 border-gray-100'
    } backdrop-blur-xl border-b px-6 py-4 sticky top-0 z-50 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <BrainLogo size="md" animated />
            <h1 className={`text-2xl font-bold bg-gradient-to-r ${
              isDark 
                ? 'from-white to-green-400' 
                : 'from-gray-900 to-green-600'
            } bg-clip-text text-transparent`}>
              NeuroFlow
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${
              isDark 
                ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30' 
                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            } px-4 py-2 rounded-2xl border backdrop-blur-sm`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
              <span className={`text-sm font-semibold ${
                isDark ? 'text-green-400' : 'text-green-800'
              }`}>
                {user.sparks}
              </span>
              <span className={`text-xs ${
                isDark ? 'text-green-300' : 'text-green-600'
              }`}>
                Sparks
              </span>
            </div>
            
            <div className={`flex items-center space-x-2 ${
              isDark 
                ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30' 
                : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
            } px-4 py-2 rounded-2xl border backdrop-blur-sm`}>
              <Trophy className={`w-4 h-4 ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <span className={`text-sm font-semibold ${
                isDark ? 'text-purple-300' : 'text-purple-800'
              }`}>
                Nível {user.level}
              </span>
            </div>
            
            <div className={`flex items-center space-x-2 ${
              isDark 
                ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/30' 
                : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
            } px-4 py-2 rounded-2xl border backdrop-blur-sm`}>
              <Flame className={`w-4 h-4 ${
                isDark ? 'text-orange-400' : 'text-orange-600'
              }`} />
              <span className={`text-sm font-semibold ${
                isDark ? 'text-orange-300' : 'text-orange-800'
              }`}>
                {user.streak} dias
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            className={`p-2.5 ${
              isDark 
                ? 'text-gray-400 hover:text-green-400 hover:bg-gray-800' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            } rounded-xl transition-all duration-300 hover:shadow-lg ${
              isDark ? 'hover:shadow-green-500/20' : ''
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className={`p-2.5 ${
            isDark 
              ? 'text-gray-400 hover:text-green-400 hover:bg-gray-800' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          } rounded-xl transition-all duration-300 hover:shadow-lg ${
            isDark ? 'hover:shadow-green-500/20' : ''
          }`}>
            <Bell className="w-5 h-5" />
          </button>
          
          <button className={`p-2.5 ${
            isDark 
              ? 'text-gray-400 hover:text-green-400 hover:bg-gray-800' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          } rounded-xl transition-all duration-300 hover:shadow-lg ${
            isDark ? 'hover:shadow-green-500/20' : ''
          }`}>
            <Settings className="w-5 h-5" />
          </button>
          
          <div className={`flex items-center space-x-3 pl-3 border-l ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`w-10 h-10 bg-gradient-to-br ${
              isDark 
                ? 'from-green-400 to-emerald-500' 
                : 'from-green-500 to-emerald-600'
            } rounded-2xl flex items-center justify-center shadow-lg ${
              isDark ? 'shadow-green-500/30' : 'shadow-green-500/20'
            }`}>
              <span className="text-white text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block">
              <p className={`text-sm font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {user.name}
              </p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Nível {user.level}
              </p>
            </div>
          </div>
          
          <button className={`md:hidden p-2.5 ${
            isDark 
              ? 'text-gray-400 hover:text-green-400 hover:bg-gray-800' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          } rounded-xl transition-all duration-300`}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
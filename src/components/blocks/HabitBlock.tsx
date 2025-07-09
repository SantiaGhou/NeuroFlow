import React, { useState } from 'react';
import { Repeat, Plus, Flame, Star, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Habit } from '../../types';

export function HabitBlock() {
  const { state, dispatch } = useApp();
  const { habits, theme } = state;
  const isDark = theme === 'dark';
  const [newHabit, setNewHabit] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleCompleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit && !isCompletedToday(habit)) {
      dispatch({ type: 'ADD_SPARKS', payload: habit.sparksReward });
      dispatch({ type: 'COMPLETE_HABIT', payload: habitId });
    }
  };

  const handleAddHabit = () => {
    if (newHabit.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        title: newHabit,
        frequency: 'daily',
        streak: 0,
        sparksReward: 20,
        color: '#10B981',
        completedDates: []
      };
      dispatch({ type: 'ADD_HABIT', payload: habit });
      setNewHabit('');
      setShowForm(false);
    }
  };

  const isCompletedToday = (habit: Habit) => {
    if (!habit.lastCompleted) return false;
    const today = new Date();
    const lastCompleted = new Date(habit.lastCompleted);
    return today.toDateString() === lastCompleted.toDateString();
  };

  return (
    <div className={`rounded-2xl lg:rounded-3xl shadow-sm border p-4 lg:p-6 h-full transition-all duration-300 ${
      isDark 
        ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
        : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
            <Repeat className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg lg:text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Hábitos
            </h3>
            <p className={`text-xs lg:text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {habits.length} hábitos ativos
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl transition-all ${
            isDark 
              ? 'text-gray-400 hover:text-green-400 hover:bg-green-500/20' 
              : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
          }`}
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>
      </div>

      {showForm && (
        <div className={`mb-4 lg:mb-6 p-3 lg:p-4 rounded-xl lg:rounded-2xl border ${
          isDark 
            ? 'bg-gray-700/50 border-gray-600' 
            : 'bg-gray-50 border-gray-100'
        }`}>
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Novo hábito..."
            className={`w-full p-2 lg:p-3 border rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm lg:text-base ${
              isDark 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
            onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setShowForm(false)}
              className={`px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-gray-200' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleAddHabit}
              className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm bg-green-600 text-white rounded-lg lg:rounded-xl hover:bg-green-700 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {habits.slice(0, 3).map(habit => {
          const completedToday = isCompletedToday(habit);
          
          return (
            <div
              key={habit.id}
              className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border transition-all ${
                completedToday 
                  ? isDark
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-green-50 border-green-200'
                  : isDark
                    ? 'bg-gray-700/30 border-gray-600 hover:border-gray-500 hover:shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: habit.color }}
                  />
                  <div>
                    <h4 className={`font-medium ${
                      completedToday ? 'text-green-800' : 'text-gray-900'
                        ? isDark ? 'text-green-400' : 'text-green-800'
                        : isDark ? 'text-white' : 'text-gray-900'
                    } text-sm lg:text-base`}>{habit.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1 text-orange-600">
                        <Flame className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="text-xs lg:text-sm font-medium">{habit.streak}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <Star className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="text-xs lg:text-sm font-medium">{habit.sparksReward}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleCompleteHabit(habit.id)}
                  disabled={completedToday}
                  className={`p-1.5 lg:p-2 rounded-xl lg:rounded-2xl transition-all ${
                    completedToday
                      ? isDark
                        ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                        : 'bg-green-200 text-green-800 cursor-not-allowed'
                      : isDark
                        ? 'bg-gray-700 text-gray-400 hover:bg-green-500/20 hover:text-green-400 hover:shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 hover:shadow-md'
                  }`}
                >
                  <Check className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
              
              {habit.streak > 0 && (
                <div className={`mt-2 lg:mt-3 pt-2 lg:pt-3 border-t ${
                  isDark ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs ${
                      isDark ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      Sequência
                    </span>
                    <span className={`text-xs font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {habit.streak} dias
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-1 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(habit.streak * 10, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
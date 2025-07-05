import React, { useState } from 'react';
import { Repeat, Plus, Flame, Star, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Habit } from '../../types';

export function HabitBlock() {
  const { state, dispatch } = useApp();
  const { habits } = state;
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
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Repeat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Hábitos</h3>
            <p className="text-sm text-gray-600">{habits.length} hábitos ativos</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Novo hábito..."
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddHabit}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
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
              className={`p-4 rounded-2xl border transition-all ${
                completedToday 
                  ? 'bg-green-50 border-green-200' 
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
                    }`}>
                      {habit.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1 text-orange-600">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-medium">{habit.streak}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">{habit.sparksReward}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleCompleteHabit(habit.id)}
                  disabled={completedToday}
                  className={`p-2 rounded-2xl transition-all ${
                    completedToday
                      ? 'bg-green-200 text-green-800 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 hover:shadow-md'
                  }`}
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
              
              {habit.streak > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Sequência</span>
                    <span className="text-xs font-medium text-gray-900">{habit.streak} dias</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
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
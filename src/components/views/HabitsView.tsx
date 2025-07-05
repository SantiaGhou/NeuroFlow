import React, { useState } from 'react';
import { Plus, Repeat, Flame, Star, Check, Trash2, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Habit } from '../../types';

export function HabitsView() {
  const { state, dispatch } = useApp();
  const { habits } = state;
  const [showForm, setShowForm] = useState(false);
  
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    color: '#3B82F6'
  });

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  const handleAddHabit = () => {
    if (newHabit.title.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        title: newHabit.title,
        description: newHabit.description,
        frequency: newHabit.frequency,
        streak: 0,
        sparksReward: newHabit.frequency === 'daily' ? 20 : newHabit.frequency === 'weekly' ? 50 : 100,
        color: newHabit.color,
        completedDates: []
      };
      dispatch({ type: 'ADD_HABIT', payload: habit });
      setNewHabit({
        title: '',
        description: '',
        frequency: 'daily',
        color: '#3B82F6'
      });
      setShowForm(false);
    }
  };

  const handleCompleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit && !isCompletedToday(habit)) {
      dispatch({ type: 'ADD_SPARKS', payload: habit.sparksReward });
      dispatch({ type: 'COMPLETE_HABIT', payload: habitId });
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: habitId });
  };

  const isCompletedToday = (habit: Habit) => {
    if (!habit.lastCompleted) return false;
    const today = new Date();
    const lastCompleted = new Date(habit.lastCompleted);
    return today.toDateString() === lastCompleted.toDateString();
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-purple-500 to-pink-500';
    if (streak >= 14) return 'from-blue-500 to-purple-500';
    if (streak >= 7) return 'from-green-500 to-blue-500';
    if (streak >= 3) return 'from-yellow-500 to-green-500';
    return 'from-gray-400 to-gray-500';
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Diário';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensal';
      default: return frequency;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Hábitos</h1>
            <p className="text-gray-600">
              {habits.length} hábitos ativos
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Novo Hábito</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <Repeat className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{habits.length}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Hábitos Ativos</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {Math.max(...habits.map(h => h.streak), 0)}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">Maior Sequência</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {habits.filter(h => isCompletedToday(h)).length}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">Concluídos Hoje</p>
          </div>
        </div>

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map(habit => {
            const completedToday = isCompletedToday(habit);
            
            return (
              <div
                key={habit.id}
                className={`bg-white rounded-3xl p-6 shadow-sm border transition-all hover:shadow-md ${
                  completedToday 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: habit.color }}
                  />
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className={`font-semibold text-lg mb-2 ${
                    completedToday ? 'text-green-800' : 'text-gray-900'
                  }`}>
                    {habit.title}
                  </h3>
                  
                  {habit.description && (
                    <p className="text-gray-600 text-sm mb-4">{habit.description}</p>
                  )}
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                      {getFrequencyLabel(habit.frequency)}
                    </span>
                  </div>
                  
                  {habit.streak > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-gray-700">Sequência</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{habit.streak} dias</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${getStreakColor(habit.streak)} transition-all duration-300`}
                          style={{ width: `${Math.min(habit.streak * 3, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">{habit.sparksReward} Sparks</span>
                  </div>
                  
                  <button
                    onClick={() => handleCompleteHabit(habit.id)}
                    disabled={completedToday}
                    className={`p-3 rounded-2xl transition-all ${
                      completedToday
                        ? 'bg-green-200 text-green-800 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 hover:shadow-md'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {habits.length === 0 && (
          <div className="text-center py-16">
            <Repeat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum hábito criado</h3>
            <p className="text-gray-600">Comece criando seu primeiro hábito!</p>
          </div>
        )}

        {/* Add Habit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Novo Hábito</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nome do hábito"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={newHabit.description}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detalhes do hábito (opcional)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequência</label>
                  <select
                    value={newHabit.frequency}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Cor</label>
                  <div className="grid grid-cols-5 gap-3">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewHabit(prev => ({ ...prev, color }))}
                        className={`w-10 h-10 rounded-2xl transition-all ${
                          newHabit.color === color ? 'ring-4 ring-gray-300 scale-110' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddHabit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-all font-medium"
                >
                  Criar Hábito
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
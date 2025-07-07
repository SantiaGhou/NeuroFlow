import React, { useState } from 'react';
import { Plus, Utensils, Star, Calendar, TrendingUp, Apple, Coffee, Sandwich, Cookie } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { NutritionEntry } from '../../types';

export function NutritionView() {
  const { state, dispatch } = useApp();
  const { nutritionEntries } = state;
  const isDark = state.theme === 'dark';
  const [showForm, setShowForm] = useState(false);
  
  const [newEntry, setNewEntry] = useState({
    meal: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    foods: [''],
    calories: 0,
    rating: 3
  });

  const mealTypes = [
    { id: 'breakfast', label: 'Café da Manhã', icon: Coffee, color: 'from-yellow-500 to-orange-500' },
    { id: 'lunch', label: 'Almoço', icon: Utensils, color: 'from-green-500 to-emerald-500' },
    { id: 'dinner', label: 'Jantar', icon: Sandwich, color: 'from-blue-500 to-purple-500' },
    { id: 'snack', label: 'Lanche', icon: Cookie, color: 'from-pink-500 to-rose-500' }
  ];

  const handleAddEntry = () => {
    if (newEntry.foods.some(food => food.trim())) {
      const entry: NutritionEntry = {
        id: Date.now().toString(),
        meal: newEntry.meal,
        foods: newEntry.foods.filter(food => food.trim()),
        calories: newEntry.calories || undefined,
        date: new Date(),
        rating: newEntry.rating
      };
      dispatch({ type: 'ADD_NUTRITION_ENTRY', payload: entry });
      dispatch({ type: 'ADD_SPARKS', payload: 15 });
      setNewEntry({
        meal: 'breakfast',
        foods: [''],
        calories: 0,
        rating: 3
      });
      setShowForm(false);
    }
  };

  const addFoodField = () => {
    setNewEntry(prev => ({ ...prev, foods: [...prev.foods, ''] }));
  };

  const updateFood = (index: number, value: string) => {
    const newFoods = [...newEntry.foods];
    newFoods[index] = value;
    setNewEntry(prev => ({ ...prev, foods: newFoods }));
  };

  const removeFoodField = (index: number) => {
    if (newEntry.foods.length > 1) {
      const newFoods = newEntry.foods.filter((_, i) => i !== index);
      setNewEntry(prev => ({ ...prev, foods: newFoods }));
    }
  };

  const getMealIcon = (meal: string) => {
    const mealType = mealTypes.find(m => m.id === meal);
    return mealType?.icon || Utensils;
  };

  const getMealColor = (meal: string) => {
    const mealType = mealTypes.find(m => m.id === meal);
    return mealType?.color || 'from-gray-500 to-gray-600';
  };

  const getMealLabel = (meal: string) => {
    const mealType = mealTypes.find(m => m.id === meal);
    return mealType?.label || meal;
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
      />
    ));
  };

  const getTodayEntries = () => {
    const today = new Date().toDateString();
    return nutritionEntries.filter(entry => 
      new Date(entry.date).toDateString() === today
    );
  };

  const getWeeklyAverage = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekEntries = nutritionEntries.filter(entry => 
      new Date(entry.date) >= weekAgo
    );
    
    if (weekEntries.length === 0) return 0;
    return weekEntries.reduce((sum, entry) => sum + entry.rating, 0) / weekEntries.length;
  };

  const getMealStats = () => {
    const stats = mealTypes.map(mealType => {
      const mealEntries = nutritionEntries.filter(entry => entry.meal === mealType.id);
      const avgRating = mealEntries.length > 0 
        ? mealEntries.reduce((sum, entry) => sum + entry.rating, 0) / mealEntries.length 
        : 0;
      
      return {
        ...mealType,
        count: mealEntries.length,
        avgRating
      };
    });
    
    return stats;
  };

  const todayEntries = getTodayEntries();
  const weeklyAverage = getWeeklyAverage();
  const mealStats = getMealStats();
  const totalCalories = todayEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);

  return (
    <div className={`flex-1 overflow-auto ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-gray-50 to-white'
    }`}>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Nutrição
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Registre suas refeições e monitore sua alimentação
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Registrar Refeição</span>
          </button>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-3xl p-6 shadow-sm border ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {todayEntries.length}
              </span>
            </div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Refeições Hoje
            </p>
          </div>

          <div className={`rounded-3xl p-6 shadow-sm border ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {totalCalories}
              </span>
            </div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Calorias Hoje
            </p>
          </div>

          <div className={`rounded-3xl p-6 shadow-sm border ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <span className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {weeklyAverage.toFixed(1)}
                </span>
                <span className={`text-lg ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  /5
                </span>
              </div>
            </div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Qualidade Semanal
            </p>
          </div>
        </div>

        {/* Meal Stats */}
        <div className={`rounded-3xl p-8 mb-8 shadow-sm border ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
            : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Estatísticas por Refeição
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mealStats.map(meal => {
              const Icon = meal.icon;
              
              return (
                <div key={meal.id} className={`p-6 rounded-2xl ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-r ${meal.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {meal.count}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {meal.label}
                    </p>
                    <div className="flex items-center space-x-1">
                      {getRatingStars(Math.round(meal.avgRating))}
                      <span className={`text-sm ml-2 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {meal.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Meals */}
        <div className={`rounded-3xl p-8 mb-8 shadow-sm border ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
            : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 flex items-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <Calendar className="w-6 h-6 mr-3" />
            Refeições de Hoje
          </h2>
          
          {todayEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todayEntries.map(entry => {
                const Icon = getMealIcon(entry.meal);
                
                return (
                  <div key={entry.id} className={`p-6 rounded-2xl ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getMealColor(entry.meal)} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {getMealLabel(entry.meal)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {getRatingStars(entry.rating)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className={`text-sm font-medium mb-1 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Alimentos:
                        </p>
                        <ul className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {entry.foods.map((food, index) => (
                            <li key={index}>• {food}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {entry.calories && (
                        <div className={`pt-2 border-t ${
                          isDark ? 'border-gray-600' : 'border-gray-200'
                        }`}>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <span className="font-medium">Calorias:</span> {entry.calories}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Utensils className={`w-12 h-12 mx-auto mb-3 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>
                Nenhuma refeição registrada hoje
              </p>
            </div>
          )}
        </div>

        {/* Recent Entries */}
        <div className={`rounded-3xl p-8 shadow-sm border ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
            : 'bg-white border-gray-100'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Histórico Recente
          </h2>
          
          {nutritionEntries.length > 0 ? (
            <div className="space-y-4">
              {nutritionEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map(entry => {
                  const Icon = getMealIcon(entry.meal);
                  
                  return (
                    <div key={entry.id} className={`flex items-center justify-between p-4 rounded-2xl ${
                      isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getMealColor(entry.meal)} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className={`font-semibold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {getMealLabel(entry.meal)}
                          </p>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {new Date(entry.date).toLocaleDateString('pt-BR')} • {entry.foods.join(', ')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {getRatingStars(entry.rating)}
                        </div>
                        {entry.calories && (
                          <p className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {entry.calories} cal
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Utensils className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-900'
              }`}>
                Nenhuma refeição registrada
              </h3>
              <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>
                Comece registrando suas refeições!
              </p>
            </div>
          )}
        </div>

        {/* Add Entry Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto ${
              isDark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white'
            }`}>
              <h3 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Registrar Refeição
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tipo de Refeição
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {mealTypes.map(meal => {
                      const Icon = meal.icon;
                      const isSelected = newEntry.meal === meal.id;
                      
                      return (
                        <button
                          key={meal.id}
                          onClick={() => setNewEntry(prev => ({ ...prev, meal: meal.id as any }))}
                          className={`p-3 rounded-2xl border-2 transition-all ${
                            isSelected
                              ? isDark
                                ? 'border-orange-500 bg-orange-500/20'
                                : 'border-orange-500 bg-orange-50'
                              : isDark
                                ? 'border-gray-600 hover:border-gray-500'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`w-8 h-8 bg-gradient-to-r ${meal.color} rounded-lg flex items-center justify-center shadow-lg`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className={`text-sm font-medium ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              {meal.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Alimentos
                  </label>
                  <div className="space-y-2">
                    {newEntry.foods.map((food, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={food}
                          onChange={(e) => updateFood(index, e.target.value)}
                          placeholder={`Alimento ${index + 1}`}
                          className={`flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        />
                        {newEntry.foods.length > 1 && (
                          <button
                            onClick={() => removeFoodField(index)}
                            className={`px-3 py-2 rounded-xl transition-colors ${
                              isDark 
                                ? 'text-red-400 hover:bg-red-500/20' 
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addFoodField}
                    className={`mt-2 text-sm transition-colors ${
                      isDark 
                        ? 'text-orange-400 hover:text-orange-300' 
                        : 'text-orange-600 hover:text-orange-700'
                    }`}
                  >
                    + Adicionar alimento
                  </button>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Calorias (opcional)
                  </label>
                  <input
                    type="number"
                    value={newEntry.calories}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, calories: Number(e.target.value) }))}
                    placeholder="0"
                    className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Qualidade da refeição: {newEntry.rating}/5
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setNewEntry(prev => ({ ...prev, rating }))}
                        className="transition-colors"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= newEntry.rating 
                              ? 'text-yellow-500 fill-current' 
                              : isDark ? 'text-gray-600' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className={`text-xs mt-2 ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    1 = Muito ruim, 5 = Excelente
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setShowForm(false)}
                  className={`flex-1 px-6 py-3 rounded-2xl transition-colors font-medium ${
                    isDark 
                      ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddEntry}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:shadow-lg hover:shadow-orange-500/30 transition-all font-medium"
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { BookOpen, Plus, Lightbulb, Heart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { DiaryEntry } from '../../types';

export function DiaryBlock() {
  const { state, dispatch } = useApp();
  const { diaryEntries, theme } = state;
  const isDark = theme === 'dark';
  const [newEntry, setNewEntry] = useState('');
  const [mood, setMood] = useState(5);
  const [showForm, setShowForm] = useState(false);

  const handleAddEntry = () => {
    if (newEntry.trim()) {
      const entry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date(),
        content: newEntry,
        mood: mood,
        tags: [],
        aiInsights: [
          'Você parece estar se sentindo bem hoje! Continue assim.',
          'Considere manter um ritual matinal para começar o dia com energia.'
        ]
      };
      dispatch({ type: 'ADD_DIARY_ENTRY', payload: entry });
      dispatch({ type: 'ADD_SPARKS', payload: 25 });
      setNewEntry('');
      setMood(5);
      setShowForm(false);
    }
  };

  const getMoodEmoji = (moodValue: number) => {
    if (moodValue <= 2) return '😢';
    if (moodValue <= 4) return '😔';
    if (moodValue <= 6) return '😐';
    if (moodValue <= 8) return '😊';
    return '😄';
  };

  const getMoodColor = (moodValue: number) => {
    if (moodValue <= 2) return 'from-red-500 to-pink-500';
    if (moodValue <= 4) return 'from-orange-500 to-yellow-500';
    if (moodValue <= 6) return 'from-yellow-500 to-green-500';
    if (moodValue <= 8) return 'from-green-500 to-blue-500';
    return 'from-blue-500 to-purple-500';
  };

  return (
    <div className={`rounded-2xl lg:rounded-3xl shadow-sm border p-4 lg:p-6 h-full transition-all duration-300 ${
      isDark 
        ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
        : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg lg:text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Diário
            </h3>
            <p className={`text-xs lg:text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {diaryEntries.length} entradas
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl transition-all ${
            isDark 
              ? 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/20' 
              : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
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
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Como você está se sentindo hoje?"
           className={`w-full p-2 lg:p-3 border rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm lg:text-base ${
              isDark 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
            rows={3}
          />
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <Heart className={`w-3 h-3 lg:w-4 lg:h-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`} />
              <span className={`text-xs lg:text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Humor:
              </span>
              <span className="text-sm lg:text-lg">{getMoodEmoji(mood)}</span>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-16 lg:w-20"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className={`px-2 lg:px-3 py-1 text-xs lg:text-sm transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEntry}
                className="px-2 lg:px-3 py-1 text-xs lg:text-sm bg-purple-600 text-white rounded-lg lg:rounded-xl hover:bg-purple-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {diaryEntries.slice(0, 2).map(entry => (
          <div key={entry.id} className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border ${
            isDark 
              ? 'bg-gray-700/30 border-gray-600' 
              : 'bg-gray-50 border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm lg:text-lg">{getMoodEmoji(entry.mood)}</span>
                <span className={`text-xs lg:text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {entry.date.toLocaleDateString()}
                </span>
              </div>
              <div className={`w-12 h-2 rounded-full ${
                isDark ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${getMoodColor(entry.mood)} transition-all duration-300`}
                  style={{ width: `${(entry.mood / 10) * 100}%` }}
                />
              </div>
            </div>
            
            <p className={`text-xs lg:text-sm mb-2 lg:mb-3 line-clamp-3 ${
              isDark ? 'text-gray-300' : 'text-gray-800'
            }`}>
              {entry.content}
            </p>
            
            {entry.aiInsights && entry.aiInsights.length > 0 && (
              <div className={`border-t pt-2 lg:pt-3 ${
                isDark ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-600" />
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Insights da IA
                  </span>
                </div>
                <p className={`text-xs p-2 rounded-lg lg:rounded-xl ${
                  isDark 
                    ? 'text-yellow-300 bg-yellow-500/10' 
                    : 'text-gray-600 bg-yellow-50'
                }`}>
                  {entry.aiInsights[0]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {diaryEntries.length === 0 && (
        <div className="text-center py-6 lg:py-8">
          <BookOpen className={`w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-3 ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-xs lg:text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Começe a escrever seu diário
          </p>
          <p className={`text-xs mt-1 ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Registre seus pensamentos e receba insights da IA
          </p>
        </div>
      )}
    </div>
  );
}
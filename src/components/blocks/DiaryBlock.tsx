import React, { useState } from 'react';
import { BookOpen, Plus, Lightbulb, Heart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { DiaryEntry } from '../../types';

export function DiaryBlock() {
  const { state, dispatch } = useApp();
  const { diaryEntries } = state;
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
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Diário</h3>
            <p className="text-sm text-gray-600">{diaryEntries.length} entradas</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-3 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Como você está se sentindo hoje?"
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
          />
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Humor:</span>
              <span className="text-lg">{getMoodEmoji(mood)}</span>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-20"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEntry}
                className="px-3 py-1 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {diaryEntries.slice(0, 2).map(entry => (
          <div key={entry.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                <span className="text-sm text-gray-600">
                  {entry.date.toLocaleDateString()}
                </span>
              </div>
              <div className="w-12 h-2 rounded-full bg-gray-200">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${getMoodColor(entry.mood)} transition-all duration-300`}
                  style={{ width: `${(entry.mood / 10) * 100}%` }}
                />
              </div>
            </div>
            
            <p className="text-gray-800 text-sm mb-3 line-clamp-3">{entry.content}</p>
            
            {entry.aiInsights && entry.aiInsights.length > 0 && (
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs font-medium text-gray-700">Insights da IA</span>
                </div>
                <p className="text-xs text-gray-600 bg-yellow-50 p-2 rounded-xl">
                  {entry.aiInsights[0]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {diaryEntries.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Começe a escrever seu diário</p>
          <p className="text-gray-500 text-xs mt-1">
            Registre seus pensamentos e receba insights da IA
          </p>
        </div>
      )}
    </div>
  );
}
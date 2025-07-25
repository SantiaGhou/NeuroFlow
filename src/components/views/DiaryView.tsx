import React, { useState } from 'react';
import { Plus, BookOpen, Heart, Lightbulb, Calendar, Search, Smile, Meh, Frown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { DiaryEntry } from '../../types';

export function DiaryView() {
  const { state, dispatch } = useApp();
  const { diaryEntries } = state;
  const isDark = state.theme === 'dark';
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newEntry, setNewEntry] = useState({
    content: '',
    mood: 5,
    gratitude: ['', '', ''],
    goals: ['']
  });

  const handleAddEntry = () => {
    if (newEntry.content.trim()) {
      const entry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date(),
        content: newEntry.content,
        mood: newEntry.mood,
        tags: [],
        gratitude: newEntry.gratitude.filter(g => g.trim()),
        goals: newEntry.goals.filter(g => g.trim()),
        aiInsights: generateAIInsights(newEntry.content, newEntry.mood)
      };
      dispatch({ type: 'ADD_DIARY_ENTRY', payload: entry });
      dispatch({ type: 'ADD_SPARKS', payload: 25 });
      setNewEntry({
        content: '',
        mood: 5,
        gratitude: ['', '', ''],
        goals: ['']
      });
      setShowForm(false);
    }
  };

  const generateAIInsights = (content: string, mood: number) => {
    const insights = [];
    
    if (mood >= 8) {
      insights.push('Você parece estar se sentindo muito bem hoje! Continue assim.');
      insights.push('Momentos de alegria como este são importantes para o bem-estar.');
    } else if (mood >= 6) {
      insights.push('Você está em um bom estado emocional. Que tal aproveitar para fazer algo que gosta?');
    } else if (mood >= 4) {
      insights.push('Parece que você está passando por um momento neutro. Considere fazer uma atividade relaxante.');
    } else {
      insights.push('Percebo que você pode estar passando por um momento difícil. Lembre-se de que isso é temporário.');
      insights.push('Considere conversar com alguém de confiança ou praticar uma atividade que te traga paz.');
    }
    
    if (content.toLowerCase().includes('trabalho')) {
      insights.push('Vejo que o trabalho está em seus pensamentos. Lembre-se de equilibrar produtividade com descanso.');
    }
    
    if (content.toLowerCase().includes('família') || content.toLowerCase().includes('amigos')) {
      insights.push('Relacionamentos são fundamentais para o bem-estar. Continue cultivando essas conexões.');
    }
    
    return insights.slice(0, 2);
  };

  const getMoodEmoji = (moodValue: number) => {
    if (moodValue <= 3) return '😢';
    if (moodValue <= 5) return '😐';
    if (moodValue <= 7) return '🙂';
    if (moodValue <= 9) return '😊';
    return '😄';
  };

  const getMoodColor = (moodValue: number) => {
    if (moodValue <= 3) return 'from-red-500 to-pink-500';
    if (moodValue <= 5) return 'from-orange-500 to-yellow-500';
    if (moodValue <= 7) return 'from-yellow-500 to-green-500';
    if (moodValue <= 9) return 'from-green-500 to-blue-500';
    return 'from-blue-500 to-purple-500';
  };

  const getMoodLabel = (moodValue: number) => {
    if (moodValue <= 2) return 'Muito triste';
    if (moodValue <= 4) return 'Triste';
    if (moodValue <= 6) return 'Neutro';
    if (moodValue <= 8) return 'Feliz';
    return 'Muito feliz';
  };

  const filteredEntries = diaryEntries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const averageMood = diaryEntries.length > 0 
    ? diaryEntries.reduce((sum, entry) => sum + entry.mood, 0) / diaryEntries.length 
    : 0;

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
              Diário
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {diaryEntries.length} entradas • Humor médio: {averageMood.toFixed(1)}/10
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nova Entrada</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-3xl p-6 shadow-sm border ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {diaryEntries.length}
              </span>
            </div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Entradas Totais
            </p>
          </div>

          <div className={`rounded-3xl p-6 shadow-sm border ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <span className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {averageMood.toFixed(1)}
                </span>
                <span className={`text-lg ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  /10
                </span>
              </div>
            </div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Humor Médio
            </p>
          </div>

          <div className={`rounded-3xl p-6 shadow-sm border ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {diaryEntries.filter(entry => {
                  const today = new Date();
                  const entryDate = new Date(entry.date);
                  const diffTime = Math.abs(today.getTime() - entryDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 7;
                }).length}
              </span>
            </div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Esta Semana
            </p>
          </div>
        </div>

        {/* Search */}
        <div className={`rounded-3xl p-6 mb-8 shadow-sm border ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="relative">
            <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Buscar nas suas entradas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* Entries */}
        <div className="space-y-6">
          {filteredEntries.map(entry => (
            <div key={entry.id} className={`rounded-3xl p-8 shadow-sm border transition-all hover:shadow-md ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl hover:border-gray-600' 
                : 'bg-white border-gray-100 hover:border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{getMoodEmoji(entry.mood)}</div>
                  <div>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {entry.date.toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Humor:
                      </span>
                      <span className={`text-sm font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {entry.mood}/10
                      </span>
                      <span className={`text-xs ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        ({getMoodLabel(entry.mood)})
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`w-16 h-2 rounded-full ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getMoodColor(entry.mood)} transition-all duration-300`}
                    style={{ width: `${(entry.mood / 10) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <p className={`leading-relaxed whitespace-pre-wrap ${
                  isDark ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  {entry.content}
                </p>
              </div>
              
              {entry.gratitude && entry.gratitude.length > 0 && (
                <div className={`mb-6 p-4 rounded-2xl border ${
                  isDark 
                    ? 'bg-yellow-500/10 border-yellow-500/30' 
                    : 'bg-yellow-50 border-yellow-100'
                }`}>
                  <h4 className={`font-semibold mb-3 flex items-center ${
                    isDark ? 'text-yellow-400' : 'text-yellow-800'
                  }`}>
                    <Heart className="w-4 h-4 mr-2" />
                    Gratidão
                  </h4>
                  <ul className="space-y-1">
                    {entry.gratitude.map((item, index) => (
                      <li key={index} className={`text-sm ${
                        isDark ? 'text-yellow-300' : 'text-yellow-700'
                      }`}>
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {entry.goals && entry.goals.length > 0 && (
                <div className={`mb-6 p-4 rounded-2xl border ${
                  isDark 
                    ? 'bg-blue-500/10 border-blue-500/30' 
                    : 'bg-blue-50 border-blue-100'
                }`}>
                  <h4 className={`font-semibold mb-3 flex items-center ${
                    isDark ? 'text-blue-400' : 'text-blue-800'
                  }`}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Objetivos
                  </h4>
                  <ul className="space-y-1">
                    {entry.goals.map((goal, index) => (
                      <li key={index} className={`text-sm ${
                        isDark ? 'text-blue-300' : 'text-blue-700'
                      }`}>
                        • {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {entry.aiInsights && entry.aiInsights.length > 0 && (
                <div className={`p-4 rounded-2xl border ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30' 
                    : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100'
                }`}>
                  <h4 className={`font-semibold mb-3 flex items-center ${
                    isDark ? 'text-purple-400' : 'text-purple-800'
                  }`}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Insights da IA
                  </h4>
                  <div className="space-y-2">
                    {entry.aiInsights.map((insight, index) => (
                      <p key={index} className={`text-sm p-3 rounded-xl ${
                        isDark 
                          ? 'text-purple-300 bg-white/5' 
                          : 'text-purple-700 bg-white/50'
                      }`}>
                        {insight}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              {searchTerm ? 'Nenhuma entrada encontrada' : 'Nenhuma entrada ainda'}
            </h3>
            <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>
              {searchTerm 
                ? 'Tente buscar por outras palavras-chave'
                : 'Comece escrevendo seus pensamentos e reflexões!'
              }
            </p>
          </div>
        )}

        {/* Add Entry Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
              isDark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white'
            }`}>
              <h3 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Nova Entrada no Diário
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Como você está se sentindo?
                  </label>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-3xl">{getMoodEmoji(newEntry.mood)}</span>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newEntry.mood}
                        onChange={(e) => setNewEntry(prev => ({ ...prev, mood: Number(e.target.value) }))}
                        className="w-full"
                      />
                      <div className={`flex justify-between text-xs mt-1 ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <span>Muito triste</span>
                        <span>Neutro</span>
                        <span>Muito feliz</span>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {newEntry.mood}/10
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {getMoodLabel(newEntry.mood)}
                  </p>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    O que você gostaria de compartilhar?
                  </label>
                  <textarea
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Escreva sobre seu dia, seus pensamentos, sentimentos..."
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
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
                    Pelo que você é grato hoje? (opcional)
                  </label>
                  <div className="space-y-2">
                    {newEntry.gratitude.map((item, index) => (
                      <input
                        key={index}
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newGratitude = [...newEntry.gratitude];
                          newGratitude[index] = e.target.value;
                          setNewEntry(prev => ({ ...prev, gratitude: newGratitude }));
                        }}
                        placeholder={`Gratidão ${index + 1}`}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Objetivos para amanhã (opcional)
                  </label>
                  <div className="space-y-2">
                    {newEntry.goals.map((goal, index) => (
                      <input
                        key={index}
                        type="text"
                        value={goal}
                        onChange={(e) => {
                          const newGoals = [...newEntry.goals];
                          newGoals[index] = e.target.value;
                          setNewEntry(prev => ({ ...prev, goals: newGoals }));
                        }}
                        placeholder={`Objetivo ${index + 1}`}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setNewEntry(prev => ({ ...prev, goals: [...prev.goals, ''] }))}
                    className={`mt-2 text-sm transition-colors ${
                      isDark 
                        ? 'text-purple-400 hover:text-purple-300' 
                        : 'text-purple-600 hover:text-purple-700'
                    }`}
                  >
                    + Adicionar objetivo
                  </button>
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:shadow-lg hover:shadow-purple-500/30 transition-all font-medium"
                >
                  Salvar Entrada
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
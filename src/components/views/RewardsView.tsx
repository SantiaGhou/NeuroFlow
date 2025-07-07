import React, { useState } from 'react';
import { Gift, Star, Trophy, Zap, Crown, Heart, Target, Flame, ShoppingBag, Sparkles } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'wellness' | 'productivity' | 'entertainment' | 'social';
  icon: React.ComponentType<any>;
  color: string;
  unlocked: boolean;
  claimed: boolean;
}

export function RewardsView() {
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';
  const userSparks = state.user?.sparks || 0;
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showClaimModal, setShowClaimModal] = useState<Reward | null>(null);

  const rewards: Reward[] = [
    {
      id: '1',
      title: '30min de Descanso',
      description: 'Tire 30 minutos para relaxar sem culpa',
      cost: 50,
      category: 'wellness',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      unlocked: true,
      claimed: false
    },
    {
      id: '2',
      title: 'Episódio de Série',
      description: 'Assista um episódio da sua série favorita',
      cost: 75,
      category: 'entertainment',
      icon: Star,
      color: 'from-purple-500 to-indigo-500',
      unlocked: true,
      claimed: false
    },
    {
      id: '3',
      title: 'Lanche Especial',
      description: 'Compre aquele lanche que você estava querendo',
      cost: 100,
      category: 'wellness',
      icon: Gift,
      color: 'from-orange-500 to-red-500',
      unlocked: true,
      claimed: false
    },
    {
      id: '4',
      title: 'Pausa para Café',
      description: 'Vá ao seu café favorito',
      cost: 80,
      category: 'social',
      icon: Sparkles,
      color: 'from-amber-500 to-yellow-500',
      unlocked: true,
      claimed: false
    },
    {
      id: '5',
      title: 'Compra Online',
      description: 'Faça uma pequena compra online',
      cost: 150,
      category: 'entertainment',
      icon: ShoppingBag,
      color: 'from-green-500 to-emerald-500',
      unlocked: userSparks >= 100,
      claimed: false
    },
    {
      id: '6',
      title: 'Dia de Folga',
      description: 'Tire um dia inteiro para você',
      cost: 300,
      category: 'wellness',
      icon: Crown,
      color: 'from-blue-500 to-cyan-500',
      unlocked: userSparks >= 200,
      claimed: false
    },
    {
      id: '7',
      title: 'Jantar Especial',
      description: 'Vá ao seu restaurante favorito',
      cost: 250,
      category: 'social',
      icon: Trophy,
      color: 'from-violet-500 to-purple-500',
      unlocked: userSparks >= 150,
      claimed: false
    },
    {
      id: '8',
      title: 'Atividade Nova',
      description: 'Experimente uma atividade que sempre quis fazer',
      cost: 400,
      category: 'productivity',
      icon: Target,
      color: 'from-teal-500 to-cyan-500',
      unlocked: userSparks >= 300,
      claimed: false
    }
  ];

  const categories = [
    { id: 'all', label: 'Todas', icon: Sparkles },
    { id: 'wellness', label: 'Bem-estar', icon: Heart },
    { id: 'productivity', label: 'Produtividade', icon: Target },
    { id: 'entertainment', label: 'Entretenimento', icon: Star },
    { id: 'social', label: 'Social', icon: Trophy }
  ];

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  const handleClaimReward = (reward: Reward) => {
    if (userSparks >= reward.cost && reward.unlocked) {
      setShowClaimModal(reward);
    }
  };

  const confirmClaim = () => {
    if (showClaimModal && userSparks >= showClaimModal.cost) {
      dispatch({ type: 'ADD_SPARKS', payload: -showClaimModal.cost });
      // Here you would also mark the reward as claimed in a real app
      setShowClaimModal(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wellness': return 'from-pink-500 to-rose-500';
      case 'productivity': return 'from-blue-500 to-cyan-500';
      case 'entertainment': return 'from-purple-500 to-indigo-500';
      case 'social': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

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
              Recompensas
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Troque seus Sparks por recompensas incríveis
            </p>
          </div>
          
          <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl border ${
            isDark 
              ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30' 
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          }`}>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
            <span className={`text-2xl font-bold ${
              isDark ? 'text-green-400' : 'text-green-800'
            }`}>
              {userSparks}
            </span>
            <span className={`text-lg ${
              isDark ? 'text-green-300' : 'text-green-600'
            }`}>
              Sparks
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className={`rounded-3xl p-6 mb-8 shadow-sm border ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-2xl transition-all ${
                    isSelected
                      ? isDark
                        ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30'
                        : 'bg-green-50 text-green-700 border-2 border-green-200'
                      : isDark
                        ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border-2 border-transparent'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map(reward => {
            const Icon = reward.icon;
            const canAfford = userSparks >= reward.cost;
            const isLocked = !reward.unlocked;
            
            return (
              <div
                key={reward.id}
                className={`rounded-3xl p-6 shadow-sm border transition-all hover:shadow-md relative overflow-hidden ${
                  isLocked
                    ? isDark
                      ? 'bg-gray-800/30 border-gray-700/50 opacity-60'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                    : canAfford
                      ? isDark
                        ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl hover:border-green-500/30 hover:shadow-green-500/20'
                        : 'bg-white border-gray-100 hover:border-green-200 hover:shadow-green-100'
                      : isDark
                        ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl'
                        : 'bg-white border-gray-100'
                }`}
              >
                {isLocked && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className={`text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium opacity-75">Bloqueado</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${reward.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    canAfford && !isLocked
                      ? isDark
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-green-50 text-green-700 border-green-200'
                      : isDark
                        ? 'bg-gray-700 text-gray-400 border-gray-600'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                    {reward.cost} ✨
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className={`font-semibold text-lg mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {reward.title}
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {reward.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 border-gray-600' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {reward.category === 'wellness' ? 'Bem-estar' :
                     reward.category === 'productivity' ? 'Produtividade' :
                     reward.category === 'entertainment' ? 'Entretenimento' : 'Social'}
                  </span>
                  
                  <button
                    onClick={() => handleClaimReward(reward)}
                    disabled={!canAfford || isLocked}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      canAfford && !isLocked
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-105'
                        : isDark
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isLocked ? 'Bloqueado' : canAfford ? 'Resgatar' : 'Insuficiente'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRewards.length === 0 && (
          <div className="text-center py-16">
            <Gift className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              Nenhuma recompensa encontrada
            </h3>
            <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>
              Tente selecionar uma categoria diferente
            </p>
          </div>
        )}

        {/* Claim Modal */}
        {showClaimModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`rounded-3xl p-8 w-full max-w-md ${
              isDark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white'
            }`}>
              <div className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${showClaimModal.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <showClaimModal.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Resgatar Recompensa?
                </h3>
                
                <p className={`text-lg font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {showClaimModal.title}
                </p>
                
                <p className={`mb-6 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {showClaimModal.description}
                </p>
                
                <div className={`flex items-center justify-center space-x-2 mb-6 p-4 rounded-2xl ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Custo: {showClaimModal.cost} Sparks
                  </span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowClaimModal(null)}
                    className={`flex-1 px-6 py-3 rounded-2xl transition-colors font-medium ${
                      isDark 
                        ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmClaim}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-lg hover:shadow-green-500/30 transition-all font-medium"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
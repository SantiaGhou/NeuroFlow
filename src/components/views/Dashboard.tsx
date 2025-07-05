import React from 'react';
import { TaskBlock } from '../blocks/TaskBlock';
import { HabitBlock } from '../blocks/HabitBlock';
import { DiaryBlock } from '../blocks/DiaryBlock';
import { HealthBlock } from '../blocks/HealthBlock';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react';

export function Dashboard() {
  const { state } = useApp();
  
  const completedTasks = state.tasks.filter(task => task.completed).length;
  const totalTasks = state.tasks.length;
  const activeHabits = state.habits.length;
  const currentStreak = state.user?.streak || 0;

  const stats = [
    {
      label: 'Tarefas Concluídas',
      value: `${completedTasks}/${totalTasks}`,
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      percentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    },
    {
      label: 'Hábitos Ativos',
      value: activeHabits,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      percentage: 85
    },
    {
      label: 'Sequência Atual',
      value: `${currentStreak} dias`,
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      percentage: Math.min(currentStreak * 10, 100)
    },
    {
      label: 'Sparks Ganhos',
      value: state.user?.sparks || 0,
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      percentage: 75
    }
  ];

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-white">
      <div className="p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Olá, {state.user?.name}! 👋
          </h2>
          <p className="text-xl text-gray-600">
            Você está indo muito bem! Continue assim e alcance seus objetivos.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TaskBlock />
          </div>
          
          <div className="lg:col-span-1">
            <HabitBlock />
          </div>
          
          <div className="lg:col-span-1">
            <HealthBlock />
          </div>
          
          <div className="lg:col-span-2">
            <DiaryBlock />
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-8 text-white h-full shadow-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                🏆 Conquistas
              </h3>
              <div className="space-y-4">
                {state.achievements.map(achievement => (
                  <div key={achievement.id} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">🏆</span>
                      <span className="font-semibold">{achievement.title}</span>
                    </div>
                    <p className="text-sm text-white/90">{achievement.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-white/80">
                        {achievement.unlockedAt?.toLocaleDateString()}
                      </span>
                      <span className="text-sm font-bold">+{achievement.sparksReward} ✨</span>
                    </div>
                  </div>
                ))}
                
                {state.achievements.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-white/80">Complete tarefas e hábitos para desbloquear conquistas!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
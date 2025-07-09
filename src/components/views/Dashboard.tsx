import React from 'react';
import { TaskBlock } from '../blocks/TaskBlock';
import { HabitBlock } from '../blocks/HabitBlock';
import { DiaryBlock } from '../blocks/DiaryBlock';
import { HealthBlock } from '../blocks/HealthBlock';
import { PomodoroBlock } from '../blocks/PomodoroBlock';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react';

export function Dashboard() {
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  
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
    <div className={`flex-1 overflow-auto min-h-0 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 lg:mb-8">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 lg:mb-3 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Olá, {state.user?.name}! 👋
          </h2>
          <p className={`text-base sm:text-lg lg:text-xl ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Você está indo muito bem! Continue assim e alcance seus objetivos.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border transition-all hover:shadow-md ${
                isDark 
                  ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
                  : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
              }`}>
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className={`w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.color} rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <span className={`text-lg lg:text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className={`text-xs lg:text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.label}
                  </p>
                  <div className={`w-full rounded-full h-1.5 lg:h-2 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div 
                      className={`h-1.5 lg:h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* First Row - Tasks and Habits */}
          <div className="lg:col-span-4">
            <div className="h-full min-h-[400px]">
              <TaskBlock />
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <div className="h-full min-h-[400px]">
              <HabitBlock />
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <div className="h-full min-h-[400px]">
              <PomodoroBlock />
            </div>
          </div>

          {/* Second Row - Diary and Health */}
          <div className="lg:col-span-6">
            <div className="h-full min-h-[400px]">
              <DiaryBlock />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="h-full min-h-[400px]">
              <HealthBlock />
            </div>
          </div>
          
          {/* Achievements */}
          <div className="lg:col-span-3">
            <div className={`bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white h-full min-h-[400px] shadow-xl ${
              isDark ? 'shadow-orange-500/20' : ''
            }`}>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 flex items-center">
                🏆 Conquistas
              </h3>
              <div className="space-y-3 lg:space-y-4">
                {state.achievements.length > 0 ? (
                  state.achievements.slice(0, 3).map(achievement => (
                    <div key={achievement.id} className="bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xl lg:text-2xl">🏆</span>
                        <span className="font-semibold text-sm lg:text-base">{achievement.title}</span>
                      </div>
                      <p className="text-xs lg:text-sm text-white/90 mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/80">
                          {achievement.unlockedAt?.toLocaleDateString()}
                        </span>
                        <span className="text-xs lg:text-sm font-bold">+{achievement.sparksReward} ✨</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 lg:py-12">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl lg:text-3xl">🎯</span>
                    </div>
                    <p className="text-white/90 text-sm lg:text-base mb-2">Nenhuma conquista ainda</p>
                    <p className="text-white/70 text-xs lg:text-sm">
                      Complete tarefas e hábitos para desbloquear conquistas!
                    </p>
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
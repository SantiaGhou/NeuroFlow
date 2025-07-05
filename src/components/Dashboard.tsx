import React from 'react';
import { TaskBlock } from './blocks/TaskBlock';
import { HabitBlock } from './blocks/HabitBlock';
import { DiaryBlock } from './blocks/DiaryBlock';
import { HealthBlock } from './blocks/HealthBlock';
import { useApp } from '../contexts/AppContext';

export function Dashboard() {
  const { state } = useApp();
  
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, {state.user?.name}! 🌟
          </h2>
          <p className="text-gray-600">
            Você está indo muito bem! Continue assim e alcance seus objetivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white h-full">
              <h3 className="text-lg font-semibold mb-3">🏆 Conquistas</h3>
              <div className="space-y-3">
                {state.achievements.map(achievement => (
                  <div key={achievement.id} className="bg-white/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">🏆</span>
                      <span className="font-medium text-sm">{achievement.title}</span>
                    </div>
                    <p className="text-xs text-white/80">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Heart, Droplets, Moon, Activity, Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface HealthMetric {
  id: string;
  type: 'water' | 'sleep' | 'exercise' | 'mood';
  value: number;
  target: number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
}

export function HealthBlock() {
  const { state, dispatch } = useApp();
  const { theme } = state;
  const isDark = theme === 'dark';
  
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      type: 'water',
      value: 6,
      target: 8,
      unit: 'copos',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '2',
      type: 'sleep',
      value: 7.5,
      target: 8,
      unit: 'horas',
      icon: Moon,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: '3',
      type: 'exercise',
      value: 30,
      target: 45,
      unit: 'min',
      icon: Activity,
      color: 'from-green-500 to-emerald-500'
    }
  ]);

  const updateMetric = (id: string, increment: number) => {
    setMetrics(prev => 
      prev.map(metric => 
        metric.id === id 
          ? { ...metric, value: Math.max(0, metric.value + increment) }
          : metric
      )
    );
    
    if (increment > 0) {
      dispatch({ type: 'ADD_SPARKS', payload: 5 });
    }
  };

  const getProgressPercentage = (metric: HealthMetric) => {
    return Math.min((metric.value / metric.target) * 100, 100);
  };

  return (
    <div className={`rounded-2xl lg:rounded-3xl shadow-sm border p-4 lg:p-6 h-full transition-all duration-300 ${
      isDark 
        ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
        : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg lg:text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Saúde
            </h3>
            <p className={`text-xs lg:text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Monitoramento diário
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map(metric => {
          const Icon = metric.icon;
          const percentage = getProgressPercentage(metric);
          
          return (
            <div key={metric.id} className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border ${
              isDark 
                ? 'bg-gray-700/30 border-gray-600' 
                : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r ${metric.color} rounded-lg lg:rounded-xl flex items-center justify-center`}>
                    <Icon className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                  <span className={`text-sm lg:text-base font-medium capitalize ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {metric.type === 'water' ? 'Água' : 
                     metric.type === 'sleep' ? 'Sono' : 
                     metric.type === 'exercise' ? 'Exercício' : 'Humor'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateMetric(metric.id, -0.5)}
                    className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center transition-colors ${
                      isDark 
                        ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-xs lg:text-sm">-</span>
                  </button>
                  
                  <span className={`text-xs lg:text-sm font-medium min-w-[50px] lg:min-w-[60px] text-center ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {metric.value} {metric.unit}
                  </span>
                  
                  <button
                    onClick={() => updateMetric(metric.id, 0.5)}
                    className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center transition-colors ${
                      isDark 
                        ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    }`}
                  >
                    <Plus className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs ${
                  isDark ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Meta: {metric.target} {metric.unit}
                </span>
                <span className={`text-xs font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {Math.round(percentage)}%
                </span>
              </div>
              
              <div className={`w-full rounded-full h-2 ${
                isDark ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${metric.color} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-4 lg:mt-6 p-3 lg:p-4 rounded-xl lg:rounded-2xl border ${
        isDark 
          ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30' 
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100'
      }`}>
        <div className="flex items-center space-x-2 mb-2">
          <Heart className={`w-3 h-3 lg:w-4 lg:h-4 ${
            isDark ? 'text-pink-400' : 'text-pink-600'
          }`} />
          <span className={`text-xs lg:text-sm font-medium ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Dica do Dia
          </span>
        </div>
        <p className={`text-xs lg:text-sm ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Manter-se hidratado melhora seu foco e energia. Que tal beber mais um copo de água?
        </p>
      </div>
    </div>
  );
}
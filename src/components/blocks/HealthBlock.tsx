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
  const { dispatch } = useApp();
  
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
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Saúde</h3>
            <p className="text-sm text-gray-600">Monitoramento diário</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map(metric => {
          const Icon = metric.icon;
          const percentage = getProgressPercentage(metric);
          
          return (
            <div key={metric.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900 capitalize">
                    {metric.type === 'water' ? 'Água' : 
                     metric.type === 'sleep' ? 'Sono' : 
                     metric.type === 'exercise' ? 'Exercício' : 'Humor'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateMetric(metric.id, -0.5)}
                    className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <span className="text-gray-600 text-sm">-</span>
                  </button>
                  
                  <span className="text-sm font-medium text-gray-900 min-w-[60px] text-center">
                    {metric.value} {metric.unit}
                  </span>
                  
                  <button
                    onClick={() => updateMetric(metric.id, 0.5)}
                    className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">
                  Meta: {metric.target} {metric.unit}
                </span>
                <span className="text-xs font-medium text-gray-900">
                  {Math.round(percentage)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${metric.color} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
        <div className="flex items-center space-x-2 mb-2">
          <Heart className="w-4 h-4 text-pink-600" />
          <span className="text-sm font-medium text-gray-900">Dica do Dia</span>
        </div>
        <p className="text-sm text-gray-700">
          Manter-se hidratado melhora seu foco e energia. Que tal beber mais um copo de água?
        </p>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Plus, Heart, Droplets, Moon, Activity, TrendingUp, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { HealthMetric } from '../../types';

export function HealthView() {
  const { state, dispatch } = useApp();
  const { healthMetrics } = state;
  const [showForm, setShowForm] = useState(false);
  
  const [newMetric, setNewMetric] = useState({
    type: 'water' as 'water' | 'sleep' | 'exercise' | 'weight' | 'steps',
    value: 0,
    target: 0
  });

  const metricTypes = [
    { id: 'water', label: 'Água', unit: 'copos', icon: Droplets, color: 'from-blue-500 to-cyan-500', target: 8 },
    { id: 'sleep', label: 'Sono', unit: 'horas', icon: Moon, color: 'from-purple-500 to-indigo-500', target: 8 },
    { id: 'exercise', label: 'Exercício', unit: 'minutos', icon: Activity, color: 'from-green-500 to-emerald-500', target: 30 },
    { id: 'weight', label: 'Peso', unit: 'kg', icon: TrendingUp, color: 'from-orange-500 to-red-500', target: 70 },
    { id: 'steps', label: 'Passos', unit: 'passos', icon: Activity, color: 'from-pink-500 to-rose-500', target: 10000 }
  ];

  const handleAddMetric = () => {
    if (newMetric.value > 0) {
      const metric: HealthMetric = {
        id: Date.now().toString(),
        type: newMetric.type,
        value: newMetric.value,
        target: newMetric.target || getDefaultTarget(newMetric.type),
        unit: getUnit(newMetric.type),
        date: new Date()
      };
      dispatch({ type: 'ADD_HEALTH_METRIC', payload: metric });
      dispatch({ type: 'ADD_SPARKS', payload: 10 });
      setNewMetric({ type: 'water', value: 0, target: 0 });
      setShowForm(false);
    }
  };

  const getDefaultTarget = (type: string) => {
    const metricType = metricTypes.find(m => m.id === type);
    return metricType?.target || 0;
  };

  const getUnit = (type: string) => {
    const metricType = metricTypes.find(m => m.id === type);
    return metricType?.unit || '';
  };

  const getIcon = (type: string) => {
    const metricType = metricTypes.find(m => m.id === type);
    return metricType?.icon || Heart;
  };

  const getColor = (type: string) => {
    const metricType = metricTypes.find(m => m.id === type);
    return metricType?.color || 'from-gray-500 to-gray-600';
  };

  const getLabel = (type: string) => {
    const metricType = metricTypes.find(m => m.id === type);
    return metricType?.label || type;
  };

  const getTodayMetrics = () => {
    const today = new Date().toDateString();
    return healthMetrics.filter(metric => 
      new Date(metric.date).toDateString() === today
    );
  };

  const getWeeklyAverage = (type: string) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekMetrics = healthMetrics.filter(metric => 
      metric.type === type && new Date(metric.date) >= weekAgo
    );
    
    if (weekMetrics.length === 0) return 0;
    return weekMetrics.reduce((sum, metric) => sum + metric.value, 0) / weekMetrics.length;
  };

  const getProgressPercentage = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  const todayMetrics = getTodayMetrics();
  const groupedMetrics = metricTypes.map(type => {
    const todayMetric = todayMetrics.find(m => m.type === type.id);
    const weeklyAvg = getWeeklyAverage(type.id);
    
    return {
      ...type,
      todayValue: todayMetric?.value || 0,
      todayTarget: todayMetric?.target || type.target,
      weeklyAverage: weeklyAvg
    };
  });

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-white">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Saúde</h1>
            <p className="text-gray-600">
              Monitore seu bem-estar diário
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-red-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Registrar Métrica</span>
          </button>
        </div>

        {/* Today's Overview */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-3" />
            Hoje
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedMetrics.map(metric => {
              const Icon = metric.icon;
              const percentage = getProgressPercentage(metric.todayValue, metric.todayTarget);
              
              return (
                <div key={metric.id} className="p-6 bg-gray-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">{metric.label}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.todayValue}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Meta: {metric.todayTarget} {metric.unit}</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${metric.color} transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3" />
            Tendências da Semana
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedMetrics.map(metric => {
              const Icon = metric.icon;
              const trend = metric.weeklyAverage > metric.todayTarget ? 'up' : 
                           metric.weeklyAverage < metric.todayTarget * 0.8 ? 'down' : 'stable';
              
              return (
                <div key={metric.id} className="p-6 border border-gray-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{metric.label}</span>
                    </div>
                    <div className={`text-sm px-2 py-1 rounded-full ${
                      trend === 'up' ? 'bg-green-100 text-green-800' :
                      trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '→'}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">
                      {metric.weeklyAverage.toFixed(1)} {metric.unit}
                    </p>
                    <p className="text-sm text-gray-600">Média semanal</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Registros Recentes</h2>
          
          {healthMetrics.length > 0 ? (
            <div className="space-y-4">
              {healthMetrics
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map(metric => {
                  const Icon = getIcon(metric.type);
                  const percentage = getProgressPercentage(metric.value, metric.target);
                  
                  return (
                    <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getColor(metric.type)} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{getLabel(metric.type)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(metric.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {metric.value} {metric.unit}
                        </p>
                        <p className="text-sm text-gray-600">
                          {Math.round(percentage)}% da meta
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum registro ainda</h3>
              <p className="text-gray-600">Comece registrando suas métricas de saúde!</p>
            </div>
          )}
        </div>

        {/* Add Metric Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Registrar Métrica</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Métrica</label>
                  <select
                    value={newMetric.type}
                    onChange={(e) => setNewMetric(prev => ({ 
                      ...prev, 
                      type: e.target.value as any,
                      target: getDefaultTarget(e.target.value)
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {metricTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.label} ({type.unit})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
                  <input
                    type="number"
                    value={newMetric.value}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, value: Number(e.target.value) }))}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta (opcional)</label>
                  <input
                    type="number"
                    value={newMetric.target}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, target: Number(e.target.value) }))}
                    placeholder={getDefaultTarget(newMetric.type).toString()}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddMetric}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-2xl hover:shadow-lg transition-all font-medium"
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
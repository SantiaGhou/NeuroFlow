import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Star, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Task } from '../../types';

export function TaskBlock() {
  const { state, dispatch } = useApp();
  const { tasks, theme } = state;
  const isDark = theme === 'dark';
  const [newTask, setNewTask] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      dispatch({ type: 'ADD_SPARKS', payload: task.sparksReward });
    }
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        priority: 'medium',
        sparksReward: 15,
        category: 'Geral',
        tags: []
      };
      dispatch({ type: 'ADD_TASK', payload: task });
      setNewTask('');
      setShowForm(false);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className={`rounded-2xl lg:rounded-3xl shadow-sm border p-4 lg:p-6 h-full transition-all duration-300 ${
      isDark 
        ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
        : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg lg:text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Tarefas
            </h3>
            <p className={`text-xs lg:text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {completedTasks} de {totalTasks} concluídas
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl transition-all ${
            isDark 
              ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/20' 
              : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
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
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nova tarefa..."
            className={`w-full p-2 lg:p-3 border rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${
              isDark 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setShowForm(false)}
              className={`px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-gray-200' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleAddTask}
              className="px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm bg-blue-600 text-white rounded-lg lg:rounded-xl hover:bg-blue-700 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tasks.slice(0, 4).map(task => (
          <div
            key={task.id}
            className={`flex items-center space-x-3 p-3 lg:p-4 rounded-xl lg:rounded-2xl border transition-all ${
              task.completed 
                ? isDark
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-green-50 border-green-200'
                : isDark
                  ? 'bg-gray-700/30 border-gray-600 hover:border-gray-500 hover:shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <button
              onClick={() => handleToggleTask(task.id)}
              className={`transition-colors ${
                task.completed 
                  ? isDark ? 'text-green-400' : 'text-green-600'
                  : isDark 
                    ? 'text-gray-500 hover:text-blue-400' 
                    : 'text-gray-400 hover:text-blue-600'
              }`}
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            
            <div className="flex-1">
              <h4 className={`font-medium ${
                task.completed 
                  ? isDark ? 'text-green-400 line-through' : 'text-green-800 line-through'
                  : isDark ? 'text-white' : 'text-gray-900'
              } text-sm lg:text-base`}>
                {task.title}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-0.5 lg:py-1 rounded-full font-medium ${
                  task.priority === 'high' 
                    ? isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                    : task.priority === 'medium' 
                    ? isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                    : isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
                <span className={`text-xs ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {task.category}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-yellow-600">
              <Star className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs lg:text-sm font-medium">{task.sparksReward}</span>
            </div>
          </div>
        ))}
      </div>

      {totalTasks > 0 && (
        <div className={`mt-4 lg:mt-6 pt-3 lg:pt-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs lg:text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Progresso
            </span>
            <span className={`text-xs lg:text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {Math.round((completedTasks / totalTasks) * 100)}%
            </span>
          </div>
          <div className={`w-full rounded-full h-2 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
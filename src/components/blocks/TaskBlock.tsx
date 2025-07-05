import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Star, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Task } from '../../types';

export function TaskBlock() {
  const { state, dispatch } = useApp();
  const { tasks } = state;
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
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Tarefas</h3>
            <p className="text-sm text-gray-600">{completedTasks} de {totalTasks} concluídas</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nova tarefa..."
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddTask}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
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
            className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all ${
              task.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <button
              onClick={() => handleToggleTask(task.id)}
              className={`transition-colors ${
                task.completed 
                  ? 'text-green-600' 
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
                  ? 'text-green-800 line-through' 
                  : 'text-gray-900'
              }`}>
                {task.title}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
                <span className="text-xs text-gray-500">{task.category}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-yellow-600">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">{task.sparksReward}</span>
            </div>
          </div>
        ))}
      </div>

      {totalTasks > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm text-gray-600">{Math.round((completedTasks / totalTasks) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
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
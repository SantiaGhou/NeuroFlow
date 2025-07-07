import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle2, Circle, Star, Clock, Trash2, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Task } from '../../types';

export function TasksView() {
  const { state, dispatch } = useApp();
  const { tasks } = state;
  const isDark = state.theme === 'dark';
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'Geral',
    estimatedTime: 30,
    dueDate: ''
  });

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        priority: newTask.priority,
        sparksReward: newTask.priority === 'high' ? 25 : newTask.priority === 'medium' ? 15 : 10,
        category: newTask.category,
        estimatedTime: newTask.estimatedTime,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
        tags: []
      };
      dispatch({ type: 'ADD_TASK', payload: task });
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        category: 'Geral',
        estimatedTime: 30,
        dueDate: ''
      });
      setShowForm(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      dispatch({ type: 'ADD_SPARKS', payload: task.sparksReward });
    }
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'high': 
        return isDark 
          ? 'bg-red-500/20 text-red-400 border-red-500/30' 
          : 'bg-red-50 text-red-700 border-red-200';
      case 'medium': 
        return isDark 
          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
          : 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': 
        return isDark 
          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
          : 'bg-green-50 text-green-700 border-green-200';
      default: 
        return isDark 
          ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
          : 'bg-gray-50 text-gray-700 border-gray-200';
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
              Tarefas
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {completedTasks} de {totalTasks} tarefas concluídas
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nova Tarefa</span>
          </button>
        </div>

        {/* Progress Bar */}
        {totalTasks > 0 && (
          <div className={`rounded-3xl p-6 mb-8 shadow-sm border ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Progresso do Dia
              </h3>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.round((completedTasks / totalTasks) * 100)}%
              </span>
            </div>
            <div className={`w-full rounded-full h-3 ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={`rounded-3xl p-6 mb-8 shadow-sm border ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={`px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="all">Todas as prioridades</option>
                <option value="high">Alta prioridade</option>
                <option value="medium">Média prioridade</option>
                <option value="low">Baixa prioridade</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendentes</option>
                <option value="completed">Concluídas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`rounded-3xl p-6 shadow-sm border transition-all hover:shadow-md ${
                task.completed 
                  ? isDark
                    ? 'border-green-500/30 bg-green-500/10 shadow-lg shadow-green-500/20'
                    : 'border-green-200 bg-green-50'
                  : isDark
                    ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl hover:border-gray-600'
                    : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
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
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className={`transition-colors ${
                    isDark 
                      ? 'text-gray-500 hover:text-red-400' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className={`font-semibold text-lg mb-2 ${
                  task.completed 
                    ? isDark ? 'text-green-400 line-through' : 'text-green-800 line-through'
                    : isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className={`text-sm mb-3 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getPriorityBg(task.priority)}`}>
                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full border ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 border-gray-600' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {task.category}
                  </span>
                </div>
                
                <div className={`flex items-center justify-between text-sm ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {task.estimatedTime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{task.estimatedTime}min</span>
                    </div>
                  )}
                  
                  {task.dueDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{task.dueDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`flex items-center justify-between pt-4 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">{task.sparksReward} Sparks</span>
                </div>
                
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)}`} />
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle2 className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              Nenhuma tarefa encontrada
            </h3>
            <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>
              {searchTerm || filterPriority !== 'all' || filterStatus !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira tarefa!'
              }
            </p>
          </div>
        )}

        {/* Add Task Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`rounded-3xl p-8 w-full max-w-md ${
              isDark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white'
            }`}>
              <h3 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Nova Tarefa
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Título
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nome da tarefa"
                    className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Descrição
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detalhes da tarefa (opcional)"
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Prioridade
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={newTask.category}
                      onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Categoria"
                      className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tempo estimado (min)
                    </label>
                    <input
                      type="number"
                      value={newTask.estimatedTime}
                      onChange={(e) => setNewTask(prev => ({ ...prev, estimatedTime: Number(e.target.value) }))}
                      className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Data limite
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
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
                  onClick={handleAddTask}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium"
                >
                  Criar Tarefa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
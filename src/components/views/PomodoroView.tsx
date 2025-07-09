import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, Square, Coffee, Target, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { PomodoroSession, PomodoroStats } from '../../types';

export function PomodoroView() {
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [stats, setStats] = useState<PomodoroStats>({
    today: { sessions: 0, totalTime: 0, completedSessions: 0 },
    week: { sessions: 0, totalTime: 0, completedSessions: 0 },
    total: { sessions: 0, totalTime: 0, completedSessions: 0 }
  });

  const sessionDurations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startSession = () => {
    if (!currentSession) {
      const session: PomodoroSession = {
        id: Date.now().toString(),
        userId: state.user?.id || '',
        taskId: selectedTask || undefined,
        duration: Math.floor(sessionDurations[sessionType] / 60),
        type: sessionType,
        completed: false,
        startedAt: new Date()
      };
      setCurrentSession(session);
      dispatch({ type: 'START_POMODORO_SESSION', payload: session });
    }
    setIsActive(true);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const stopSession = () => {
    setIsActive(false);
    setTimeLeft(sessionDurations[sessionType]);
    setCurrentSession(null);
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        completed: true,
        completedAt: new Date()
      };
      dispatch({ type: 'COMPLETE_POMODORO_SESSION', payload: completedSession });
      
      const sparksReward = sessionType === 'work' ? 30 : 10;
      dispatch({ type: 'ADD_SPARKS', payload: sparksReward });
    }

    if (sessionType === 'work') {
      setSessionType('shortBreak');
      setTimeLeft(sessionDurations.shortBreak);
    } else {
      setSessionType('work');
      setTimeLeft(sessionDurations.work);
    }
    
    setCurrentSession(null);
  };

  const switchSessionType = (type: 'work' | 'shortBreak' | 'longBreak') => {
    if (!isActive) {
      setSessionType(type);
      setTimeLeft(sessionDurations[type]);
      setCurrentSession(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case 'work': return 'from-red-500 to-pink-500';
      case 'shortBreak': return 'from-green-500 to-emerald-500';
      case 'longBreak': return 'from-blue-500 to-purple-500';
    }
  };

  const getSessionIcon = () => {
    switch (sessionType) {
      case 'work': return Target;
      case 'shortBreak': return Coffee;
      case 'longBreak': return Coffee;
    }
  };

  const SessionIcon = getSessionIcon();
  const progress = ((sessionDurations[sessionType] - timeLeft) / sessionDurations[sessionType]) * 100;

  return (
    <div className={`flex-1 overflow-auto ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-gray-50 to-white'
    }`}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Pomodoro
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Técnica de produtividade com foco e pausas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-3xl p-6 shadow-sm border transition-all hover:shadow-md ${
            isDark 
              ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
              : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.today.completedSessions}
              </span>
            </div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Sessões Hoje
            </p>
          </div>

          <div className={`rounded-3xl p-6 shadow-sm border transition-all hover:shadow-md ${
            isDark 
              ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
              : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.round((stats.today.totalTime || 0) / 60)}h
              </span>
            </div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Tempo Hoje
            </p>
          </div>

          <div className={`rounded-3xl p-6 shadow-sm border transition-all hover:shadow-md ${
            isDark 
              ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
              : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.week.completedSessions}
              </span>
            </div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Sessões na Semana
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer Section */}
          <div className={`rounded-3xl p-8 shadow-sm border ${
            isDark 
              ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
              : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
          }`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${getSessionColor()} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <SessionIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {sessionType === 'work' ? 'Sessão de Foco' : sessionType === 'shortBreak' ? 'Pausa Curta' : 'Pausa Longa'}
                </h2>
              </div>

              {/* Timer Display */}
              <div className={`text-8xl font-bold mb-8 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {formatTime(timeLeft)}
              </div>

              {/* Progress Ring */}
              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke={isDark ? '#374151' : '#E5E7EB'}
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke="url(#timerGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={sessionType === 'work' ? '#EF4444' : sessionType === 'shortBreak' ? '#10B981' : '#3B82F6'} />
                      <stop offset="100%" stopColor={sessionType === 'work' ? '#EC4899' : sessionType === 'shortBreak' ? '#059669' : '#8B5CF6'} />
                    </linearGradient>
                  </defs>
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xl font-bold ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              {/* Session Type Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {(['work', 'shortBreak', 'longBreak'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => switchSessionType(type)}
                    disabled={isActive}
                    className={`p-4 rounded-2xl font-medium transition-all ${
                      sessionType === type
                        ? isDark
                          ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-2 border-red-500/30'
                          : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-2 border-red-200'
                        : isDark
                          ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 border-2 border-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200'
                    } ${isActive ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
                  >
                    {type === 'work' ? 'Foco (25min)' : type === 'shortBreak' ? 'Pausa (5min)' : 'Pausa Longa (15min)'}
                  </button>
                ))}
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4">
                {!isActive ? (
                  <button
                    onClick={startSession}
                    className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-medium transition-all ${
                      isDark
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-105'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105'
                    }`}
                  >
                    <Play className="w-6 h-6" />
                    <span className="text-lg">Iniciar</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseSession}
                    className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-medium transition-all ${
                      isDark
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-lg hover:shadow-yellow-500/30 transform hover:scale-105'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105'
                    }`}
                  >
                    <Pause className="w-6 h-6" />
                    <span className="text-lg">Pausar</span>
                  </button>
                )}
                
                <button
                  onClick={stopSession}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-medium transition-all ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 transform hover:scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:scale-105'
                  }`}
                >
                  <Square className="w-6 h-6" />
                  <span className="text-lg">Parar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Settings and Info Section */}
          <div className="space-y-6">
            {/* Task Selection */}
            <div className={`rounded-3xl p-6 shadow-sm border ${
              isDark 
                ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
                : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Tarefa Atual
              </h3>
              
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                disabled={isActive}
                className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">Nenhuma tarefa selecionada</option>
                {state.tasks.filter(task => !task.completed).map(task => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Session Info */}
            {currentSession && (
              <div className={`rounded-3xl p-6 shadow-sm border ${
                isDark 
                  ? 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-3 ${
                  isDark ? 'text-red-400' : 'text-red-700'
                }`}>
                  Sessão Ativa
                </h3>
                
                <div className="space-y-2">
                  <p className={`text-sm ${
                    isDark ? 'text-red-300' : 'text-red-600'
                  }`}>
                    <strong>Iniciada:</strong> {currentSession.startedAt.toLocaleTimeString()}
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-red-300' : 'text-red-600'
                  }`}>
                    <strong>Duração:</strong> {currentSession.duration} minutos
                  </p>
                  {selectedTask && (
                    <p className={`text-sm ${
                      isDark ? 'text-red-300' : 'text-red-600'
                    }`}>
                      <strong>Tarefa:</strong> {state.tasks.find(t => t.id === selectedTask)?.title}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className={`rounded-3xl p-6 shadow-sm border ${
              isDark 
                ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
                : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Dicas Pomodoro
              </h3>
              
              <ul className={`space-y-2 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>• Foque completamente durante os 25 minutos</li>
                <li>• Evite distrações e notificações</li>
                <li>• Use as pausas para relaxar</li>
                <li>• Após 4 pomodoros, faça uma pausa longa</li>
                <li>• Mantenha consistência diária</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
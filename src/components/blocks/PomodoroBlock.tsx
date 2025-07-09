import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, Square, Coffee, Target } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { PomodoroSession } from '../../types';

export function PomodoroBlock() {
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);

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
      
      // Award sparks based on session type
      const sparksReward = sessionType === 'work' ? 30 : 10;
      dispatch({ type: 'ADD_SPARKS', payload: sparksReward });
    }

    // Auto-switch to next session type
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
    <div className={`rounded-2xl lg:rounded-3xl shadow-sm border p-4 lg:p-6 h-full transition-all duration-300 ${
      isDark 
        ? 'bg-gray-800/70 backdrop-blur-xl border-gray-700/50' 
        : 'bg-white/90 backdrop-blur-xl border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${getSessionColor()} rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg`}>
            <Timer className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg lg:text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Pomodoro
            </h3>
            <p className={`text-xs lg:text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {sessionType === 'work' ? 'Foco' : sessionType === 'shortBreak' ? 'Pausa Curta' : 'Pausa Longa'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <SessionIcon className={`w-4 h-4 lg:w-5 lg:h-5 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`} />
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className={`text-4xl lg:text-6xl font-bold mb-3 lg:mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-3 lg:mb-4">
          <svg className="w-24 h-24 lg:w-32 lg:h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke={isDark ? '#374151' : '#E5E7EB'}
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="url(#gradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={sessionType === 'work' ? '#EF4444' : sessionType === 'shortBreak' ? '#10B981' : '#3B82F6'} />
                <stop offset="100%" stopColor={sessionType === 'work' ? '#EC4899' : sessionType === 'shortBreak' ? '#059669' : '#8B5CF6'} />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs lg:text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Session Type Buttons */}
      <div className="grid grid-cols-3 gap-1 lg:gap-2 mb-4 lg:mb-6">
        {(['work', 'shortBreak', 'longBreak'] as const).map(type => (
          <button
            key={type}
            onClick={() => switchSessionType(type)}
            disabled={isActive}
            className={`p-1.5 lg:p-2 rounded-lg lg:rounded-xl text-xs font-medium transition-all ${
              sessionType === type
                ? isDark
                  ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30'
                  : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200'
                : isDark
                  ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 border border-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            } ${isActive ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
          >
            {type === 'work' ? 'Foco' : type === 'shortBreak' ? 'Pausa' : 'Longa'}
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-2 lg:space-x-3">
        {!isActive ? (
          <button
            onClick={startSession}
            className={`flex items-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-medium transition-all text-sm lg:text-base ${
              isDark
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25'
            }`}
          >
            <Play className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Iniciar</span>
          </button>
        ) : (
          <button
            onClick={pauseSession}
            className={`flex items-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-medium transition-all text-sm lg:text-base ${
              isDark
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-lg hover:shadow-yellow-500/30'
                : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-lg hover:shadow-yellow-500/25'
            }`}
          >
            <Pause className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Pausar</span>
          </button>
        )}
        
        <button
          onClick={stopSession}
          className={`flex items-center space-x-2 px-3 lg:px-4 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-medium transition-all text-sm lg:text-base ${
            isDark
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Square className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>
      </div>

      {/* Session Info */}
      {currentSession && (
        <div className={`mt-3 lg:mt-4 p-2 lg:p-3 rounded-xl lg:rounded-2xl border ${
          isDark 
            ? 'bg-gray-700/30 border-gray-600' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <p className={`text-xs lg:text-sm text-center ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sessão iniciada às {currentSession.startedAt.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
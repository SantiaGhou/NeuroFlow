import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Target, Heart, Brain, DollarSign, Utensils, CheckCircle2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { OnboardingData } from '../types';
import { BrainLogo } from './BrainLogo';

export function Onboarding() {
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';
  
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    focusAreas: [],
    goals: [],
    currentChallenges: [],
    preferredTime: '',
    experience: ''
  });

  const focusAreas = [
    { id: 'tasks', label: 'Produtividade', icon: CheckCircle2, description: 'Organize tarefas e projetos' },
    { id: 'habits', label: 'Hábitos', icon: Target, description: 'Construa rotinas saudáveis' },
    { id: 'health', label: 'Saúde', icon: Heart, description: 'Monitore bem-estar físico' },
    { id: 'diary', label: 'Diário', icon: Brain, description: 'Reflexões e autoconhecimento' },
    { id: 'finance', label: 'Finanças', icon: DollarSign, description: 'Controle financeiro' },
    { id: 'nutrition', label: 'Nutrição', icon: Utensils, description: 'Alimentação consciente' }
  ];

  const goals = [
    'Ser mais produtivo no trabalho',
    'Melhorar minha saúde física',
    'Desenvolver hábitos consistentes',
    'Ter mais equilíbrio emocional',
    'Organizar minhas finanças',
    'Comer de forma mais saudável',
    'Ter mais tempo para mim',
    'Reduzir o estresse'
  ];

  const challenges = [
    'Procrastinação',
    'Falta de motivação',
    'Desorganização',
    'Estresse',
    'Falta de tempo',
    'Dificuldade para manter hábitos',
    'Ansiedade',
    'Cansaço'
  ];

  const handleNext = () => {
    if (state.onboardingStep < 4) {
      dispatch({ type: 'SET_ONBOARDING_STEP', payload: state.onboardingStep + 1 });
    } else {
      dispatch({ type: 'COMPLETE_ONBOARDING', payload: formData });
    }
  };

  const handleBack = () => {
    if (state.onboardingStep > 0) {
      dispatch({ type: 'SET_ONBOARDING_STEP', payload: state.onboardingStep - 1 });
    }
  };

  const toggleSelection = (field: keyof OnboardingData, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const canProceed = () => {
    switch (state.onboardingStep) {
      case 0: return formData.name.trim().length > 0;
      case 1: return formData.focusAreas.length > 0;
      case 2: return formData.goals.length > 0;
      case 3: return formData.currentChallenges.length > 0;
      case 4: return formData.preferredTime && formData.experience;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (state.onboardingStep) {
      case 0:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                <BrainLogo size="lg" animated />
              </div>
              <h1 className={`text-4xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Bem-vindo ao NeuroFlow
              </h1>
              <p className={`text-xl max-w-md mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Sua jornada neural para uma vida mais organizada e equilibrada começa aqui
              </p>
            </div>
            
            <div className="space-y-4">
              <label className="block text-left">
                <span className={`text-sm font-medium mb-2 block ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Como podemos te chamar?
                </span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Seu nome"
                  className={`w-full px-4 py-3 rounded-2xl text-lg transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
                  } border focus:outline-none focus:ring-2`}
                />
              </label>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Quais áreas você quer focar?
              </h2>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Escolha as áreas da sua vida que você gostaria de melhorar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {focusAreas.map(area => {
                const Icon = area.icon;
                const isSelected = formData.focusAreas.includes(area.id);
                
                return (
                  <button
                    key={area.id}
                    onClick={() => toggleSelection('focusAreas', area.id)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
                      isSelected 
                        ? isDark
                          ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20' 
                          : 'border-green-500 bg-green-50'
                        : isDark
                          ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && isDark && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 animate-pulse" />
                    )}
                    <div className="flex items-start space-x-4 relative z-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected 
                          ? isDark 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                            : 'bg-green-500 text-white'
                          : isDark
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-gray-100 text-gray-600'
                      } transition-all duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {area.label}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {area.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Quais são seus objetivos?
              </h2>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Selecione os objetivos que mais fazem sentido para você
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goals.map(goal => {
                const isSelected = formData.goals.includes(goal);
                
                return (
                  <button
                    key={goal}
                    onClick={() => toggleSelection('goals', goal)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected 
                        ? isDark
                          ? 'border-green-500 bg-green-500/10 text-green-400' 
                          : 'border-green-500 bg-green-50 text-green-800'
                        : isDark
                          ? 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                    }`}
                  >
                    <span className="font-medium">{goal}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Quais são seus maiores desafios?
              </h2>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Isso nos ajuda a personalizar sua experiência
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {challenges.map(challenge => {
                const isSelected = formData.currentChallenges.includes(challenge);
                
                return (
                  <button
                    key={challenge}
                    onClick={() => toggleSelection('currentChallenges', challenge)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected 
                        ? isDark
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400' 
                          : 'border-orange-500 bg-orange-50 text-orange-800'
                        : isDark
                          ? 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                    }`}
                  >
                    <span className="font-medium">{challenge}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Últimas perguntas
              </h2>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Para finalizar sua configuração neural
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Qual o melhor horário para você se organizar?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Manhã', 'Tarde', 'Noite'].map(time => (
                    <button
                      key={time}
                      onClick={() => setFormData(prev => ({ ...prev, preferredTime: time }))}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.preferredTime === time
                          ? isDark
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-green-500 bg-green-50 text-green-800'
                          : isDark
                            ? 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Como você se descreveria?
                </label>
                <div className="space-y-2">
                  {[
                    'Iniciante - Estou começando a me organizar',
                    'Intermediário - Já tenho algumas práticas',
                    'Avançado - Busco otimizar minha rotina'
                  ].map(exp => (
                    <button
                      key={exp}
                      onClick={() => setFormData(prev => ({ ...prev, experience: exp }))}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                        formData.experience === exp
                          ? isDark
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-green-500 bg-green-50 text-green-800'
                          : isDark
                            ? 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-gray-50 to-white'
    }`}>
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step <= state.onboardingStep 
                      ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                      : isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className={`w-full rounded-full h-1 ${
            isDark ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full transition-all duration-500 shadow-lg shadow-green-500/30"
              style={{ width: `${((state.onboardingStep + 1) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className={`rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-xl border ${
          isDark 
            ? 'bg-gray-900/80 border-gray-800 shadow-black/50' 
            : 'bg-white/90 border-gray-100'
        }`}>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={state.onboardingStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all ${
              state.onboardingStep === 0
                ? isDark 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 cursor-not-allowed'
                : isDark
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center space-x-2 px-8 py-3 rounded-2xl transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-105'
                : isDark
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{state.onboardingStep === 4 ? 'Iniciar Jornada' : 'Continuar'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
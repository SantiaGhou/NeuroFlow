import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Block, Task, Habit, DiaryEntry, Achievement, HealthMetric, FinanceEntry, NutritionEntry, OnboardingData } from '../types';

interface AppState {
  user: User | null;
  currentView: string;
  blocks: Block[];
  tasks: Task[];
  habits: Habit[];
  diaryEntries: DiaryEntry[];
  achievements: Achievement[];
  healthMetrics: HealthMetric[];
  financeEntries: FinanceEntry[];
  nutritionEntries: NutritionEntry[];
  isOnboarding: boolean;
  onboardingStep: number;
  theme: 'light' | 'dark';
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_VIEW'; payload: string }
  | { type: 'ADD_SPARKS'; payload: number }
  | { type: 'ADD_BLOCK'; payload: Block }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; data: any } }
  | { type: 'REMOVE_BLOCK'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'COMPLETE_HABIT'; payload: string }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'ADD_DIARY_ENTRY'; payload: DiaryEntry }
  | { type: 'ADD_HEALTH_METRIC'; payload: HealthMetric }
  | { type: 'ADD_FINANCE_ENTRY'; payload: FinanceEntry }
  | { type: 'ADD_NUTRITION_ENTRY'; payload: NutritionEntry }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'COMPLETE_ONBOARDING'; payload: OnboardingData }
  | { type: 'SET_ONBOARDING_STEP'; payload: number }
  | { type: 'START_ONBOARDING' }
  | { type: 'TOGGLE_THEME' };

const initialState: AppState = {
  user: null,
  currentView: 'dashboard',
  blocks: [],
  tasks: [],
  habits: [],
  diaryEntries: [],
  achievements: [],
  healthMetrics: [],
  financeEntries: [],
  nutritionEntries: [],
  isOnboarding: true,
  onboardingStep: 0,
  theme: 'dark'
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'ADD_SPARKS':
      return {
        ...state,
        user: state.user ? { ...state.user, sparks: state.user.sparks + action.payload } : null
      };
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        )
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    
    case 'COMPLETE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload 
            ? { 
                ...habit, 
                streak: habit.streak + 1, 
                lastCompleted: new Date(),
                completedDates: [...habit.completedDates, new Date()]
              }
            : habit
        )
      };
    
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload)
      };
    
    case 'ADD_DIARY_ENTRY':
      return { ...state, diaryEntries: [...state.diaryEntries, action.payload] };
    
    case 'ADD_HEALTH_METRIC':
      return { ...state, healthMetrics: [...state.healthMetrics, action.payload] };
    
    case 'ADD_FINANCE_ENTRY':
      return { ...state, financeEntries: [...state.financeEntries, action.payload] };
    
    case 'ADD_NUTRITION_ENTRY':
      return { ...state, nutritionEntries: [...state.nutritionEntries, action.payload] };
    
    case 'UNLOCK_ACHIEVEMENT':
      return { ...state, achievements: [...state.achievements, action.payload] };
    
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    
    case 'COMPLETE_ONBOARDING':
      const newUser: User = {
        id: Date.now().toString(),
        name: action.payload.name,
        email: 'user@neuroflow.com',
        sparks: 100,
        level: 1,
        streak: 0,
        joinDate: new Date(),
        activeModules: action.payload.focusAreas,
        onboardingCompleted: true,
        preferences: {
          theme: state.theme,
          notifications: true,
          gamification: true,
          aiSuggestions: true,
          focusAreas: action.payload.focusAreas,
          goals: action.payload.goals
        }
      };
      return { 
        ...state, 
        user: newUser,
        isOnboarding: false,
        currentView: 'dashboard'
      };
    
    case 'SET_ONBOARDING_STEP':
      return { ...state, onboardingStep: action.payload };
    
    case 'START_ONBOARDING':
      return { ...state, isOnboarding: true, onboardingStep: 0 };
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
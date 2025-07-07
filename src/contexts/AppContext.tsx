import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, Block, Task, Habit, DiaryEntry, Achievement, HealthMetric, FinanceEntry, NutritionEntry, OnboardingData } from '../types';
import { db } from '../utils/database';

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
  | { type: 'TOGGLE_THEME' }
  | { type: 'LOAD_USER_DATA'; payload: any };

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
      if (state.user) {
        const updatedUser = { ...state.user, sparks: state.user.sparks + action.payload };
        db.updateUser(state.user.id, { sparks: updatedUser.sparks });
        return { ...state, user: updatedUser };
      }
      return state;
    
    case 'ADD_TASK':
      if (state.user) {
        db.createTask(action.payload, state.user.id);
      }
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case 'TOGGLE_TASK':
      const updatedTasks = state.tasks.map(task => {
        if (task.id === action.payload) {
          const updatedTask = { ...task, completed: !task.completed };
          if (state.user) {
            db.updateTask(task.id, { completed: updatedTask.completed });
          }
          return updatedTask;
        }
        return task;
      });
      return { ...state, tasks: updatedTasks };
    
    case 'DELETE_TASK':
      db.deleteTask(action.payload);
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    
    case 'ADD_HABIT':
      if (state.user) {
        db.createHabit(action.payload, state.user.id);
      }
      return { ...state, habits: [...state.habits, action.payload] };
    
    case 'COMPLETE_HABIT':
      const updatedHabits = state.habits.map(habit => {
        if (habit.id === action.payload) {
          const updatedHabit = { 
            ...habit, 
            streak: habit.streak + 1, 
            lastCompleted: new Date(),
            completedDates: [...habit.completedDates, new Date()]
          };
          if (state.user) {
            db.updateHabit(habit.id, {
              streak: updatedHabit.streak,
              lastCompleted: updatedHabit.lastCompleted,
              completedDates: updatedHabit.completedDates
            });
          }
          return updatedHabit;
        }
        return habit;
      });
      return { ...state, habits: updatedHabits };
    
    case 'DELETE_HABIT':
      db.deleteHabit(action.payload);
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload)
      };
    
    case 'ADD_DIARY_ENTRY':
      if (state.user) {
        db.createDiaryEntry(action.payload, state.user.id);
      }
      return { ...state, diaryEntries: [...state.diaryEntries, action.payload] };
    
    case 'ADD_HEALTH_METRIC':
      if (state.user) {
        db.createHealthMetric(action.payload, state.user.id);
      }
      return { ...state, healthMetrics: [...state.healthMetrics, action.payload] };
    
    case 'ADD_FINANCE_ENTRY':
      if (state.user) {
        db.createFinanceEntry(action.payload, state.user.id);
      }
      return { ...state, financeEntries: [...state.financeEntries, action.payload] };
    
    case 'ADD_NUTRITION_ENTRY':
      if (state.user) {
        db.createNutritionEntry(action.payload, state.user.id);
      }
      return { ...state, nutritionEntries: [...state.nutritionEntries, action.payload] };
    
    case 'UNLOCK_ACHIEVEMENT':
      if (state.user) {
        db.createAchievement(action.payload, state.user.id);
      }
      return { ...state, achievements: [...state.achievements, action.payload] };
    
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      if (state.user) {
        const updatedPreferences = { ...state.user.preferences, theme: newTheme };
        const updatedUser = { ...state.user, preferences: updatedPreferences };
        db.updateUser(state.user.id, { preferences: updatedPreferences });
        return { ...state, theme: newTheme, user: updatedUser };
      }
      return { ...state, theme: newTheme };
    
    case 'COMPLETE_ONBOARDING':
      const newUser: User = {
        id: localStorage.getItem('neuroflow_current_user_id') || 'user_' + Date.now().toString(),
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
      
      db.createUser(newUser);
      localStorage.setItem('neuroflow_current_user_id', newUser.id);
      
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
    
    case 'LOAD_USER_DATA':
      return {
        ...state,
        user: action.payload.user,
        tasks: action.payload.tasks || [],
        habits: action.payload.habits || [],
        diaryEntries: action.payload.diaryEntries || [],
        healthMetrics: action.payload.healthMetrics || [],
        financeEntries: action.payload.financeEntries || [],
        nutritionEntries: action.payload.nutritionEntries || [],
        achievements: action.payload.achievements || [],
        theme: action.payload.user?.preferences?.theme || 'dark',
        isOnboarding: !action.payload.user?.onboardingCompleted
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Try to load existing user data on app start
    try {
      // Check if we have a stored user ID
      let userId = localStorage.getItem('neuroflow_current_user_id');
      
      if (!userId) {
        // If no user ID exists, create a new one for first-time users
        userId = 'user_' + Date.now().toString();
        localStorage.setItem('neuroflow_current_user_id', userId);
      }
      
      const user = db.getUser(userId);
      
      if (user) {
        const tasks = db.getTasks(userId);
        const habits = db.getHabits(userId);
        const diaryEntries = db.getDiaryEntries(userId);
        const healthMetrics = db.getHealthMetrics(userId);
        const financeEntries = db.getFinanceEntries(userId);
        const nutritionEntries = db.getNutritionEntries(userId);
        const achievements = db.getAchievements(userId);
        
        dispatch({
          type: 'LOAD_USER_DATA',
          payload: {
            user,
            tasks,
            habits,
            diaryEntries,
            healthMetrics,
            financeEntries,
            nutritionEntries,
            achievements
          }
        });
      }
    } catch (error) {
      console.log('No existing user data found, starting fresh');
    }
  }, []);

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
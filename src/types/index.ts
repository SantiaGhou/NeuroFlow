export interface User {
  id: string;
  name: string;
  email: string;
  sparks: number;
  level: number;
  streak: number;
  joinDate: Date;
  activeModules: string[];
  preferences: UserPreferences;
  onboardingCompleted: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  gamification: boolean;
  aiSuggestions: boolean;
  focusAreas: string[];
  goals: string[];
}

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: any;
  isActive: boolean;
}

export type BlockType = 'tasks' | 'habits' | 'diary' | 'health' | 'finance' | 'nutrition' | 'rewards';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  sparksReward: number;
  category: string;
  estimatedTime?: number;
  tags: string[];
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  lastCompleted?: Date;
  sparksReward: number;
  color: string;
  targetDays?: number[];
  completedDates: Date[];
}

export interface DiaryEntry {
  id: string;
  date: Date;
  content: string;
  mood: number; // 1-10
  aiInsights?: string[];
  tags: string[];
  gratitude?: string[];
  goals?: string[];
}

export interface HealthMetric {
  id: string;
  type: 'water' | 'sleep' | 'exercise' | 'weight' | 'steps';
  value: number;
  target: number;
  unit: string;
  date: Date;
}

export interface FinanceEntry {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  tags: string[];
}

export interface NutritionEntry {
  id: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: string[];
  calories?: number;
  date: Date;
  rating: number; // 1-5 how healthy
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  sparksReward: number;
  unlockedAt?: Date;
  category: string;
  progress?: number;
  target?: number;
}

export interface OnboardingData {
  name: string;
  focusAreas: string[];
  goals: string[];
  currentChallenges: string[];
  preferredTime: string;
  experience: string;
}

export interface PomodoroSession {
  id: string;
  userId: string;
  taskId?: string;
  taskTitle?: string;
  duration: number; // in minutes
  type: 'work' | 'shortBreak' | 'longBreak';
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface PomodoroStats {
  today: {
    sessions: number;
    totalTime: number;
    completedSessions: number;
  };
  week: {
    sessions: number;
    totalTime: number;
    completedSessions: number;
  };
  total: {
    sessions: number;
    totalTime: number;
    completedSessions: number;
  };
}
// Browser-compatible database implementation using localStorage
interface DatabaseSchema {
  users: any;
  tasks: any;
  habits: any;
  diary_entries: any;
  health_metrics: any;
  finance_entries: any;
  nutrition_entries: any;
  achievements: any;
}

class NeuroFlowDB {
  private storagePrefix = 'neuroflow_';

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    // Initialize storage structure if it doesn't exist
    const tables = ['users', 'tasks', 'habits', 'diary_entries', 'health_metrics', 'finance_entries', 'nutrition_entries', 'achievements'];
    
    tables.forEach(table => {
      const key = this.storagePrefix + table;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
  }

  private getTable(tableName: string): any[] {
    const data = localStorage.getItem(this.storagePrefix + tableName);
    return data ? JSON.parse(data) : [];
  }

  private setTable(tableName: string, data: any[]): void {
    localStorage.setItem(this.storagePrefix + tableName, JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // User operations
  createUser(user: any) {
    const users = this.getTable('users');
    const userData = {
      ...user,
      join_date: user.joinDate.toISOString(),
      active_modules: JSON.stringify(user.activeModules),
      preferences: JSON.stringify(user.preferences),
      onboarding_completed: user.onboardingCompleted,
      theme: user.preferences.theme,
      created_at: new Date().toISOString()
    };
    
    users.push(userData);
    this.setTable('users', users);
    return { changes: 1 };
  }

  getUser(userId: string) {
    const users = this.getTable('users');
    const user = users.find(u => u.id === userId);
    
    if (user) {
      return {
        ...user,
        joinDate: new Date(user.join_date),
        activeModules: JSON.parse(user.active_modules),
        preferences: JSON.parse(user.preferences),
        onboardingCompleted: Boolean(user.onboarding_completed)
      };
    }
    return null;
  }

  updateUser(userId: string, updates: any) {
    const users = this.getTable('users');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      const updatedData: any = {};
      
      Object.keys(updates).forEach(key => {
        const value = updates[key];
        if (key === 'joinDate') {
          updatedData.join_date = value.toISOString();
        } else if (key === 'activeModules') {
          updatedData.active_modules = JSON.stringify(value);
        } else if (key === 'onboardingCompleted') {
          updatedData.onboarding_completed = value;
        } else if (typeof value === 'object' && value !== null) {
          updatedData[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = JSON.stringify(value);
        } else {
          updatedData[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = value;
        }
      });
      
      users[userIndex] = { ...users[userIndex], ...updatedData };
      this.setTable('users', users);
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  // Check if user exists
  userExists(userId: string): boolean {
    const users = this.getTable('users');
    return users.some(u => u.id === userId);
  }

  // Task operations
  createTask(task: any, userId: string) {
    const tasks = this.getTable('tasks');
    const taskData = {
      ...task,
      user_id: userId,
      due_date: task.dueDate ? task.dueDate.toISOString() : null,
      sparks_reward: task.sparksReward,
      estimated_time: task.estimatedTime || null,
      tags: JSON.stringify(task.tags || []),
      created_at: new Date().toISOString()
    };
    
    tasks.push(taskData);
    this.setTable('tasks', tasks);
    return { changes: 1 };
  }

  getTasks(userId: string) {
    const tasks = this.getTable('tasks');
    const userTasks = tasks.filter(t => t.user_id === userId);
    
    return userTasks.map(task => ({
      ...task,
      dueDate: task.due_date ? new Date(task.due_date) : undefined,
      tags: JSON.parse(task.tags || '[]'),
      sparksReward: task.sparks_reward,
      estimatedTime: task.estimated_time
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  updateTask(taskId: string, updates: any) {
    const tasks = this.getTable('tasks');
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
      const updatedData: any = {};
      
      Object.keys(updates).forEach(key => {
        const value = updates[key];
        if (key === 'dueDate') {
          updatedData.due_date = value ? value.toISOString() : null;
        } else if (key === 'sparksReward') {
          updatedData.sparks_reward = value;
        } else if (key === 'estimatedTime') {
          updatedData.estimated_time = value;
        } else if (typeof value === 'object' && value !== null) {
          updatedData[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = JSON.stringify(value);
        } else {
          updatedData[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = value;
        }
      });
      
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
      this.setTable('tasks', tasks);
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  deleteTask(taskId: string) {
    const tasks = this.getTable('tasks');
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    this.setTable('tasks', filteredTasks);
    return { changes: tasks.length - filteredTasks.length };
  }

  // Habit operations
  createHabit(habit: any, userId: string) {
    const habits = this.getTable('habits');
    const habitData = {
      ...habit,
      user_id: userId,
      last_completed: habit.lastCompleted ? habit.lastCompleted.toISOString() : null,
      sparks_reward: habit.sparksReward,
      target_days: JSON.stringify(habit.targetDays || []),
      completed_dates: JSON.stringify(habit.completedDates.map((d: Date) => d.toISOString())),
      created_at: new Date().toISOString()
    };
    
    habits.push(habitData);
    this.setTable('habits', habits);
    return { changes: 1 };
  }

  getHabits(userId: string) {
    const habits = this.getTable('habits');
    const userHabits = habits.filter(h => h.user_id === userId);
    
    return userHabits.map(habit => ({
      ...habit,
      lastCompleted: habit.last_completed ? new Date(habit.last_completed) : undefined,
      sparksReward: habit.sparks_reward,
      targetDays: JSON.parse(habit.target_days || '[]'),
      completedDates: JSON.parse(habit.completed_dates || '[]').map((d: string) => new Date(d))
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  updateHabit(habitId: string, updates: any) {
    const habits = this.getTable('habits');
    const habitIndex = habits.findIndex(h => h.id === habitId);
    
    if (habitIndex !== -1) {
      const updatedData: any = {};
      
      Object.keys(updates).forEach(key => {
        const value = updates[key];
        if (key === 'lastCompleted') {
          updatedData.last_completed = value ? value.toISOString() : null;
        } else if (key === 'sparksReward') {
          updatedData.sparks_reward = value;
        } else if (key === 'targetDays') {
          updatedData.target_days = JSON.stringify(value);
        } else if (key === 'completedDates') {
          updatedData.completed_dates = JSON.stringify(value.map((d: Date) => d.toISOString()));
        } else if (typeof value === 'object' && value !== null) {
          updatedData[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = JSON.stringify(value);
        } else {
          updatedData[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = value;
        }
      });
      
      habits[habitIndex] = { ...habits[habitIndex], ...updatedData };
      this.setTable('habits', habits);
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  deleteHabit(habitId: string) {
    const habits = this.getTable('habits');
    const filteredHabits = habits.filter(h => h.id !== habitId);
    this.setTable('habits', filteredHabits);
    return { changes: habits.length - filteredHabits.length };
  }

  // Diary operations
  createDiaryEntry(entry: any, userId: string) {
    const entries = this.getTable('diary_entries');
    const entryData = {
      ...entry,
      user_id: userId,
      date: entry.date.toISOString(),
      ai_insights: JSON.stringify(entry.aiInsights || []),
      tags: JSON.stringify(entry.tags || []),
      gratitude: JSON.stringify(entry.gratitude || []),
      goals: JSON.stringify(entry.goals || []),
      created_at: new Date().toISOString()
    };
    
    entries.push(entryData);
    this.setTable('diary_entries', entries);
    return { changes: 1 };
  }

  getDiaryEntries(userId: string) {
    const entries = this.getTable('diary_entries');
    const userEntries = entries.filter(e => e.user_id === userId);
    
    return userEntries.map(entry => ({
      ...entry,
      date: new Date(entry.date),
      aiInsights: JSON.parse(entry.ai_insights || '[]'),
      tags: JSON.parse(entry.tags || '[]'),
      gratitude: JSON.parse(entry.gratitude || '[]'),
      goals: JSON.parse(entry.goals || '[]')
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Health metrics operations
  createHealthMetric(metric: any, userId: string) {
    const metrics = this.getTable('health_metrics');
    const metricData = {
      ...metric,
      user_id: userId,
      date: metric.date.toISOString(),
      created_at: new Date().toISOString()
    };
    
    metrics.push(metricData);
    this.setTable('health_metrics', metrics);
    return { changes: 1 };
  }

  getHealthMetrics(userId: string) {
    const metrics = this.getTable('health_metrics');
    const userMetrics = metrics.filter(m => m.user_id === userId);
    
    return userMetrics.map(metric => ({
      ...metric,
      date: new Date(metric.date)
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Finance operations
  createFinanceEntry(entry: any, userId: string) {
    const entries = this.getTable('finance_entries');
    const entryData = {
      ...entry,
      user_id: userId,
      date: entry.date.toISOString(),
      tags: JSON.stringify(entry.tags || []),
      created_at: new Date().toISOString()
    };
    
    entries.push(entryData);
    this.setTable('finance_entries', entries);
    return { changes: 1 };
  }

  getFinanceEntries(userId: string) {
    const entries = this.getTable('finance_entries');
    const userEntries = entries.filter(e => e.user_id === userId);
    
    return userEntries.map(entry => ({
      ...entry,
      date: new Date(entry.date),
      tags: JSON.parse(entry.tags || '[]')
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Nutrition operations
  createNutritionEntry(entry: any, userId: string) {
    const entries = this.getTable('nutrition_entries');
    const entryData = {
      ...entry,
      user_id: userId,
      meal: entry.meal,
      foods: JSON.stringify(entry.foods),
      calories: entry.calories || null,
      date: entry.date.toISOString(),
      rating: entry.rating,
      created_at: new Date().toISOString()
    };
    
    entries.push(entryData);
    this.setTable('nutrition_entries', entries);
    return { changes: 1 };
  }

  getNutritionEntries(userId: string) {
    const entries = this.getTable('nutrition_entries');
    const userEntries = entries.filter(e => e.user_id === userId);
    
    return userEntries.map(entry => ({
      ...entry,
      date: new Date(entry.date),
      foods: JSON.parse(entry.foods)
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Achievement operations
  createAchievement(achievement: any, userId: string) {
    const achievements = this.getTable('achievements');
    const achievementData = {
      ...achievement,
      user_id: userId,
      sparks_reward: achievement.sparksReward,
      unlocked_at: achievement.unlockedAt ? achievement.unlockedAt.toISOString() : null,
      progress: achievement.progress || null,
      target: achievement.target || null,
      created_at: new Date().toISOString()
    };
    
    achievements.push(achievementData);
    this.setTable('achievements', achievements);
    return { changes: 1 };
  }

  getAchievements(userId: string) {
    const achievements = this.getTable('achievements');
    const userAchievements = achievements.filter(a => a.user_id === userId);
    
    return userAchievements.map(achievement => ({
      ...achievement,
      unlockedAt: achievement.unlocked_at ? new Date(achievement.unlocked_at) : undefined,
      sparksReward: achievement.sparks_reward
    })).sort((a, b) => {
      const aTime = a.unlocked_at ? new Date(a.unlocked_at).getTime() : 0;
      const bTime = b.unlocked_at ? new Date(b.unlocked_at).getTime() : 0;
      return bTime - aTime;
    });
  }

  close() {
    // No-op for localStorage implementation
  }
}

export const db = new NeuroFlowDB();
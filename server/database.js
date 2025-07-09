const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'neuroflow.db'));
    this.init();
  }

  init() {
    // Create tables
    this.db.serialize(() => {
      // Users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          sparks INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          streak INTEGER DEFAULT 0,
          join_date TEXT NOT NULL,
          active_modules TEXT,
          preferences TEXT,
          onboarding_completed BOOLEAN DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tasks table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          completed BOOLEAN DEFAULT 0,
          priority TEXT DEFAULT 'medium',
          due_date TEXT,
          sparks_reward INTEGER DEFAULT 15,
          category TEXT DEFAULT 'Geral',
          estimated_time INTEGER,
          tags TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Habits table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS habits (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          frequency TEXT DEFAULT 'daily',
          streak INTEGER DEFAULT 0,
          last_completed TEXT,
          sparks_reward INTEGER DEFAULT 20,
          color TEXT DEFAULT '#10B981',
          target_days TEXT,
          completed_dates TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Diary entries table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS diary_entries (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          date TEXT NOT NULL,
          content TEXT NOT NULL,
          mood INTEGER NOT NULL,
          ai_insights TEXT,
          tags TEXT,
          gratitude TEXT,
          goals TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Health metrics table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS health_metrics (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          type TEXT NOT NULL,
          value REAL NOT NULL,
          target REAL NOT NULL,
          unit TEXT NOT NULL,
          date TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Finance entries table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS finance_entries (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          type TEXT NOT NULL,
          amount REAL NOT NULL,
          category TEXT NOT NULL,
          description TEXT NOT NULL,
          date TEXT NOT NULL,
          tags TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Nutrition entries table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS nutrition_entries (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          meal TEXT NOT NULL,
          foods TEXT NOT NULL,
          calories INTEGER,
          date TEXT NOT NULL,
          rating INTEGER NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Achievements table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS achievements (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          icon TEXT NOT NULL,
          sparks_reward INTEGER NOT NULL,
          unlocked_at TEXT,
          category TEXT NOT NULL,
          progress INTEGER,
          target INTEGER,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Pomodoro sessions table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS pomodoro_sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          task_id TEXT,
          duration INTEGER NOT NULL,
          type TEXT NOT NULL,
          completed BOOLEAN DEFAULT 0,
          started_at TEXT NOT NULL,
          completed_at TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (task_id) REFERENCES tasks (id)
        )
      `);
    });
  }

  // Generic query methods
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = Database;
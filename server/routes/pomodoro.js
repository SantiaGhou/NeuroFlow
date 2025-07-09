const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get pomodoro sessions for user
  router.get('/user/:userId', async (req, res) => {
    try {
      const sessions = await db.all(`
        SELECT p.*, t.title as task_title 
        FROM pomodoro_sessions p 
        LEFT JOIN tasks t ON p.task_id = t.id 
        WHERE p.user_id = ? 
        ORDER BY p.created_at DESC
      `, [req.params.userId]);
      
      const formattedSessions = sessions.map(session => ({
        ...session,
        completed: Boolean(session.completed),
        startedAt: session.started_at,
        completedAt: session.completed_at,
        taskTitle: session.task_title
      }));
      
      res.json(formattedSessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create pomodoro session
  router.post('/', async (req, res) => {
    try {
      const { id, userId, taskId, duration, type, startedAt } = req.body;
      
      await db.run(`
        INSERT INTO pomodoro_sessions (id, user_id, task_id, duration, type, started_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [id, userId, taskId || null, duration, type, startedAt]);
      
      res.status(201).json({ message: 'Pomodoro session created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Complete pomodoro session
  router.put('/:id/complete', async (req, res) => {
    try {
      const { completedAt } = req.body;
      
      await db.run(`
        UPDATE pomodoro_sessions 
        SET completed = 1, completed_at = ? 
        WHERE id = ?
      `, [completedAt, req.params.id]);
      
      res.json({ message: 'Pomodoro session completed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get pomodoro stats for user
  router.get('/stats/:userId', async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const [todayStats, weekStats, totalStats] = await Promise.all([
        db.get(`
          SELECT 
            COUNT(*) as sessions,
            SUM(duration) as totalTime,
            COUNT(CASE WHEN completed = 1 THEN 1 END) as completedSessions
          FROM pomodoro_sessions 
          WHERE user_id = ? AND DATE(started_at) = ?
        `, [req.params.userId, today]),
        
        db.get(`
          SELECT 
            COUNT(*) as sessions,
            SUM(duration) as totalTime,
            COUNT(CASE WHEN completed = 1 THEN 1 END) as completedSessions
          FROM pomodoro_sessions 
          WHERE user_id = ? AND started_at >= ?
        `, [req.params.userId, weekAgo]),
        
        db.get(`
          SELECT 
            COUNT(*) as sessions,
            SUM(duration) as totalTime,
            COUNT(CASE WHEN completed = 1 THEN 1 END) as completedSessions
          FROM pomodoro_sessions 
          WHERE user_id = ?
        `, [req.params.userId])
      ]);
      
      res.json({
        today: todayStats,
        week: weekStats,
        total: totalStats
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
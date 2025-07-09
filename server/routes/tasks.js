const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get tasks for user
  router.get('/user/:userId', async (req, res) => {
    try {
      const tasks = await db.all('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId]);
      
      const formattedTasks = tasks.map(task => ({
        ...task,
        dueDate: task.due_date ? task.due_date : undefined,
        sparksReward: task.sparks_reward,
        estimatedTime: task.estimated_time,
        tags: JSON.parse(task.tags || '[]'),
        completed: Boolean(task.completed)
      }));
      
      res.json(formattedTasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create task
  router.post('/', async (req, res) => {
    try {
      const { id, userId, title, description, priority, dueDate, sparksReward, category, estimatedTime, tags } = req.body;
      
      await db.run(`
        INSERT INTO tasks (id, user_id, title, description, priority, due_date, sparks_reward, category, estimated_time, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, userId, title, description || null, priority || 'medium',
        dueDate || null, sparksReward || 15, category || 'Geral',
        estimatedTime || null, JSON.stringify(tags || [])
      ]);
      
      res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update task
  router.put('/:id', async (req, res) => {
    try {
      const updates = req.body;
      const setParts = [];
      const values = [];

      Object.keys(updates).forEach(key => {
        if (key === 'dueDate') {
          setParts.push('due_date = ?');
          values.push(updates[key]);
        } else if (key === 'sparksReward') {
          setParts.push('sparks_reward = ?');
          values.push(updates[key]);
        } else if (key === 'estimatedTime') {
          setParts.push('estimated_time = ?');
          values.push(updates[key]);
        } else if (key === 'completed') {
          setParts.push('completed = ?');
          values.push(updates[key] ? 1 : 0);
        } else if (typeof updates[key] === 'object') {
          setParts.push(`${key} = ?`);
          values.push(JSON.stringify(updates[key]));
        } else {
          setParts.push(`${key} = ?`);
          values.push(updates[key]);
        }
      });

      values.push(req.params.id);
      
      await db.run(
        `UPDATE tasks SET ${setParts.join(', ')} WHERE id = ?`,
        values
      );
      
      res.json({ message: 'Task updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete task
  router.delete('/:id', async (req, res) => {
    try {
      await db.run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
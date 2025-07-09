const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get user by ID
  router.get('/:id', async (req, res) => {
    try {
      const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
      if (user) {
        res.json({
          ...user,
          joinDate: user.join_date,
          activeModules: JSON.parse(user.active_modules || '[]'),
          preferences: JSON.parse(user.preferences || '{}'),
          onboardingCompleted: Boolean(user.onboarding_completed)
        });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create user
  router.post('/', async (req, res) => {
    try {
      const { id, name, email, sparks, level, streak, joinDate, activeModules, preferences, onboardingCompleted } = req.body;
      
      await db.run(`
        INSERT INTO users (id, name, email, sparks, level, streak, join_date, active_modules, preferences, onboarding_completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, name, email, sparks || 0, level || 1, streak || 0,
        joinDate || new Date().toISOString(),
        JSON.stringify(activeModules || []),
        JSON.stringify(preferences || {}),
        onboardingCompleted ? 1 : 0
      ]);
      
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user
  router.put('/:id', async (req, res) => {
    try {
      const updates = req.body;
      const setParts = [];
      const values = [];

      Object.keys(updates).forEach(key => {
        if (key === 'activeModules') {
          setParts.push('active_modules = ?');
          values.push(JSON.stringify(updates[key]));
        } else if (key === 'onboardingCompleted') {
          setParts.push('onboarding_completed = ?');
          values.push(updates[key] ? 1 : 0);
        } else if (key === 'joinDate') {
          setParts.push('join_date = ?');
          values.push(updates[key]);
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
        `UPDATE users SET ${setParts.join(', ')} WHERE id = ?`,
        values
      );
      
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
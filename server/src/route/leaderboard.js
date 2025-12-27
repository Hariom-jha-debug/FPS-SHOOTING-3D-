const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get top players by best score
router.get('/top', async (req, res) => {
  try {
    const topPlayers = await User.find()
      .sort({ 'stats.bestScore': -1 })
      .limit(100)
      .select('username stats.bestScore stats.accuracy');
    
    res.json(topPlayers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user stats
router.patch('/stats', async (req, res) => {
  try {
    const { userId, kills, shots, score } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.stats.totalKills += kills;
    user.stats.totalShots += shots;
    user.stats.accuracy = (user.stats.totalKills / user.stats.totalShots) * 100;
    
    if (score > user.stats.bestScore) {
      user.stats.bestScore = score;
    }
    
    await user.save();
    
    res.json({ success: true, stats: user.stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

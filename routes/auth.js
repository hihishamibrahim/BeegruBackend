const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Auth (Login or Signup)
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  let signUp = false;
  try {
    let user = await User.findOne({ username });
    if (user) {
      // User exists, proceed to login
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      // User does not exist, proceed to signup
      const hashedPassword = await bcrypt.hash(password, 10);
      
      user = new User({ username, password: hashedPassword });
      signUp = true;
    }
    // Generate tokens
    const accessToken = jwt.sign({ username: user.username, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '60m' });
    const refreshToken = jwt.sign({ username: user.username, userId: user._id }, process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});
    user.auth.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({ 
      message: 'Login successful', 
      isSignUp:signUp,
      accessToken, 
      refreshToken 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh Token
router.post('/refresh-token', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  const userId = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)?.userId
  if(!userId) return res.status(401).json({ error: 'Invalid token' });
  const user = User.findById(userId)
  if (!user || !user.auth.refreshToken === token) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  try {
    const accessToken = jwt.sign({ username: user.username ,userId:user._id}, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// Logout (Invalidate Refresh Token)
router.delete('/logout', verifyToken, async (req, res) => {
  await User.updateOne(
    { _id: req.userId },
    { $unset: { 'auth.refreshToken': 1 } }
  );
  res.status(200).json({ message: 'Logged out successfully' });
});


// User Info - Updated to use token authentication
router.get('/user-info', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

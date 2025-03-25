const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');

const verifyAuthToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }
  
  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    if(!decoded.userId) return res.status(401).json({ error: 'Invalid token' });
    const user = User.findById(decoded.userId)
    if(!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyAuthToken;

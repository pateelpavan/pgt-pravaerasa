const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'paverasa_tech_growth_jwt_secret_key_2026_super_secure';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Session expired or invalid token.' });
    }
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required.' });
  }
  next();
}

function requireClient(req, res, next) {
  if (!req.user || req.user.role !== 'client') {
    return res.status(403).json({ success: false, message: 'Access denied: Client privileges required.' });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireClient,
  JWT_SECRET
};

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'JWT secret is not configured' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }, (error, user) => {
    if (error) {
      console.error('JWT verification failed:', error);
      return res.status(403).json({ error: 'Invalid access token' });
    }

    req.user = user;
    return next();
  });
}

module.exports = {
  authenticateToken
};

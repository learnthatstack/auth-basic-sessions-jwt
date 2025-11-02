const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key-change-in-production-use-env-vars';

const demoTasks = [
  { id: 1, title: 'Build authentication', completed: true },
  { id: 2, title: 'Record demo', completed: false }
];

// Login endpoint - generates JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'secret123') {
    const token = jwt.sign(
      {
        sub: '1',
        username: username,
        role: 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
      },
      JWT_SECRET,
      { algorithm: 'HS256' }
    );

    console.log('JWT generated (no storage needed)');
    console.log('Token is self-contained');

    return res.json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600
    });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// JWT authentication middleware
function jwtAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    console.log('Verifying JWT (no database lookup)...');

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

    req.user = {
      userId: decoded.sub,
      username: decoded.username,
      role: decoded.role
    };

    console.log('JWT verified successfully');
    console.log('User:', decoded.username, '| Role:', decoded.role);

    next();
  } catch (error) {
    console.log('JWT verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Protected endpoint
app.get('/tasks', jwtAuth, (req, res) => {
  res.json(demoTasks);
});

// Logout endpoint (shows the problem)
app.post('/logout', jwtAuth, (req, res) => {
  console.log('JWT is still valid until expiration');
  console.log('No database to delete from - token is stateless');

  res.json({
    message: 'Logged out on client side',
    note: 'JWT remains valid until expiration'
  });
});

app.listen(3003, () => {
  console.log('JWT server running on port 3003');
  console.log('Using algorithm: HS256');
});

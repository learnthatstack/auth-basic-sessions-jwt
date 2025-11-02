const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory session storage (use actual DB/Redis in production)
const sessions = new Map();

const demoTasks = [
  { id: 1, title: 'Build authentication', completed: true },
  { id: 2, title: 'Record demo', completed: false }
];

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // hardcoded for demo
  if (username === 'admin' && password === 'secret123') {
    // Generate random token
    const token = crypto.randomBytes(32).toString('hex');

    // Store in session storage
    sessions.set(token, {
      userId: 1,
      username: username,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });

    console.log('Token generated and stored');
    console.log('Current sessions:', sessions.size);

    return res.json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 86400
    });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// Bearer token authentication middleware
function bearerAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];

  console.log('Database lookup for token validation...');
  const session = sessions.get(token);

  if (!session) {
    console.log('Token not found in database');
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    console.log('Token expired and removed');
    return res.status(401).json({ error: 'Token expired' });
  }

  console.log('Token valid, user:', session.username);
  req.user = { userId: session.userId, username: session.username };
  next();
}

// Protected endpoint
app.get('/tasks', bearerAuth, (req, res) => {
  res.json(demoTasks);
});

// Logout endpoint
app.post('/logout', bearerAuth, (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  sessions.delete(token);
  console.log('Token deleted from database');
  console.log('Remaining sessions:', sessions.size);
  res.json({ message: 'Logged out successfully' });
});

app.listen(3002, () => {
  console.log('Bearer Token server running on port 3002');
});

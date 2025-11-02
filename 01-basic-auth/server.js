const express = require('express');
const app = express();

const demoTasks = [
  { id: 1, title: 'My first task', completed: true },
  { id: 2, title: 'My second task', completed: false }
];

function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Missing credentials' });
  }

  const base64 = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  console.log('Credentials received:', username); // Show in terminal

  // NOTE: username and password are hardcoded for demo purposes
  if (username === 'admin' && password === 'secret123') {
    req.user = { username };
    return next();
  }

  res.status(401).json({ error: 'Invalid credentials' });
}

app.get('/tasks', basicAuth, (req, res) => {
  res.json(demoTasks);
});

app.listen(3001, () => {
  console.log('Basic Auth server running on port 3001');
});
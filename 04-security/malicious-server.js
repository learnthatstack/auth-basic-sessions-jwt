const express = require('express');
const path = require('path');
const app = express();

// Serve static files (including csrf-attack.html)
app.use(express.static(__dirname));

// Root route - serve the csrf-attack.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'csrf-attack.html'));
});

// Demo Steps:
// 1. Make sure secure-server.js is running on port 3004
// 2. Open http://localhost:3004/secure-client.html
// 3. Login with admin/secret123
// 4. Visit http://localhost:3005 to trigger CSRF attack
// 5. Observe that attack, FAILS with sameSite='strict'

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Malicious server running on port ${PORT}`);
});

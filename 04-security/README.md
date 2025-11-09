# Security Demo - Token Storage & Vulnerabilities

## Quick Start

```bash
# Install dependencies
npm install express jsonwebtoken cookie-parser cors

# Terminal 1: Start secure server
node 04-security/secure-server.js

# Terminal 2: Start malicious server (for CSRF demo)
node 04-security/malicious-server.js

# Terminal 3: Open vulnerable client
open 04-security/vulnerable-client.html
```

## Demo Scenarios

### 1. XSS Attack (localStorage vulnerability)
1. Open http://localhost:3003 (vulnerable-client.html)
2. Login with `admin` / `secret123`
3. Open DevTools → Application → Local Storage
4. In Console, run: `localStorage.getItem('token')`
5. Show token theft: `alert('Stolen: ' + localStorage.getItem('token').substring(0,50))`

### 2. httpOnly Cookie Protection
1. Open http://localhost:3004 (secure server)
2. Login with same credentials
3. DevTools → Application → Cookies (see httpOnly flag)
4. In Console, try: `document.cookie` (token not accessible)

### 3. CSRF Attack & SameSite Protection
1. Stay logged in at http://localhost:3004
2. Open http://127.0.0.1:3005 (malicious site)
3. Click "Claim Prize" button
4. With SameSite='none', the request works (attack succeed)
5. SameSite='strict' blocks cross-origin cookie. Check Network tab - request fails (401)

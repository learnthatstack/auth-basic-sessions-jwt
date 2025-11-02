# Bearer Token (Opaque) Demo

## What is Bearer Token Auth?

Bearer tokens are random strings stored server-side. The server generates a token on login and validates it against a database on each request.

## How It Works

1. Login: Server generates random token, stores it in database with user info
2. Client includes token: `Authorization: Bearer <token>`
3. Server looks up token in database to validate
4. Logout: Server deletes token from database

## Key Characteristics

**Pros:**
- Can revoke tokens instantly (logout works)
- Control token expiration
- Track active sessions
- More secure than Basic Auth

**Cons:**
- Requires database lookup on every request
- Need session storage (database/Redis)
- Server maintains state

## Testing

### Interactive Demo (Recommended)
1. Start the server: `node server.js`
2. Open `client.html` in your browser
3. Try the workflow:
   - Login to get a token
   - Access protected tasks endpoint (watch console for database lookups)
   - Logout to revoke the token
   - Try using the same token after logout (will fail - instant revocation!)

### Command Line
```bash
# Start server
node server.js

# Login to get token
curl -X POST http://localhost:3002/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secret123"}'

# Use token to access protected endpoint
curl http://localhost:3002/tasks \
  -H "Authorization: Bearer <your-token>"

# Logout
curl -X POST http://localhost:3002/logout \
  -H "Authorization: Bearer <your-token>"
```

**Credentials:** `admin` / `secret123`

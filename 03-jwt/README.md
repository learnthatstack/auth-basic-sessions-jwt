# JWT (JSON Web Token) Demo

## What is JWT?

JWT is a self-contained token that includes user data and signature. The server verifies the signature without database lookups.

## How It Works

1. Login: Server creates JWT with user data, signs it with secret key
2. Client includes token: `Authorization: Bearer <jwt>`
3. Server verifies signature (no database lookup)
4. Server extracts user data from token payload

## Token Structure

```
header.payload.signature
```

- **Header:** Algorithm (HS256) and token type
- **Payload:** User data (sub, username, role, exp)
- **Signature:** HMAC SHA256 hash using secret key

## Key Characteristics

**Pros:**
- Stateless (no database lookup needed)
- Scalable across multiple servers
- Self-contained user information
- Built-in expiration

**Cons:**
- Cannot revoke before expiration
- Logout doesn't invalidate token
- Token size larger than opaque tokens
- Secret key must be secure

## Testing

### Interactive Demo (Recommended)
1. Start the server: `node server.js`
2. Open `client.html` in your browser
3. Try the workflow:
   - Login to get a JWT (see it decoded into header/payload/signature)
   - Access protected tasks endpoint (watch console - no database lookup!)
   - **Tampering demo:** Modify the JWT payload and see signature verification fail
   - Logout and try using the same JWT (still works - shows revocation problem!)
   - Copy token to [jwt.io](https://jwt.io) to inspect it

### Command Line
```bash
# Start server
node server.js

# Login to get JWT
curl -X POST http://localhost:3003/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secret123"}'

# Use JWT to access protected endpoint
curl http://localhost:3003/tasks \
  -H "Authorization: Bearer <your-jwt>"

# Logout (token remains valid until expiration)
curl -X POST http://localhost:3003/logout \
  -H "Authorization: Bearer <your-jwt>"
```

**Credentials:** `admin` / `secret123`
**Token expires in:** 1 hour

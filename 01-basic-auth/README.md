# Basic Authentication Demo

## What is Basic Auth?

HTTP Basic Authentication sends credentials (username:password) encoded in Base64 with every request in the `Authorization` header.

## How It Works

1. Client sends credentials: `Authorization: Basic base64(username:password)`
2. Server decodes the Base64 string
3. Server validates credentials on every request

## Key Characteristics

**Pros:**
- Simple to implement
- Built into HTTP standard
- No session storage needed

**Cons:**
- Credentials sent with every request
- Must use HTTPS (credentials easily decoded from Base64)
- No logout mechanism
- No expiration

## Testing

### Command Line
```bash
# Start server
node server.js

# Test protected endpoint
curl -u admin:secret123 http://localhost:3001/tasks
```

**Credentials:** `admin` / `secret123`

### Browser Testing
Basic Auth works natively in browsers - just visit `http://localhost:3001/tasks` and the browser will prompt for credentials.

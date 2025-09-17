# Production Setup Guide

## HTTPS Configuration

Your Certificate Generator backend is now configured for production with HTTPS support.

### 1. SSL Certificate Setup

Replace the placeholder domain in `app.js` with your actual domain:

```javascript
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/YOUR_DOMAIN.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/YOUR_DOMAIN.com/fullchain.pem"),
};
```

### 2. Environment Variables

Update your `.env` file for production:

```env
NODE_ENV=production
PORT=5016
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=your-production-jwt-secret
# Add other production environment variables
```

### 3. Domain Configuration

Update the CORS origin in `app.js`:

```javascript
const httpsIO = new Server(httpsServer, {
  cors: {
    origin: process.env.CLIENT_URL || "https://your-domain.com",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});
```

### 4. Frontend Configuration

Update your frontend's Socket.io connection URL in `SocketContext.jsx`:

```javascript
const newSocket = io(
  import.meta.env.VITE_API_URL || "https://your-backend-domain.com",
  {
    withCredentials: true,
    transports: ["websocket", "polling"],
  }
);
```

### 5. Deployment Steps

1. **Install SSL Certificate** (using Let's Encrypt):

   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

2. **Update Domain References**:

   - Replace `your-domain.com` with your actual domain
   - Update CORS origins
   - Update Socket.io connection URLs

3. **Start Production Server**:
   ```bash
   npm start
   ```

### 6. Features

✅ **HTTPS Server** - Runs on port 443
✅ **HTTP Server** - Commented out for production
✅ **Socket.io HTTPS** - Real-time updates over HTTPS
✅ **Dual Broadcasting** - Supports both HTTP and HTTPS clients
✅ **SSL Security** - Encrypted connections
✅ **Production Logging** - Enhanced console output

### 7. Testing

After deployment, test:

- HTTPS API endpoints
- Socket.io connections over HTTPS
- Real-time notifications
- Event updates
- User authentication

### 8. Monitoring

Monitor your production server:

- Check SSL certificate expiration
- Monitor Socket.io connections
- Watch for any CORS issues
- Verify real-time functionality

## Development vs Production

**Development**: HTTP server on port 5016
**Production**: HTTPS server on port 443

To switch back to development, uncomment the HTTP server section and comment out the HTTPS server section in `app.js`.

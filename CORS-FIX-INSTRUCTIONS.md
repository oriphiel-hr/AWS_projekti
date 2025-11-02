# CORS Fix Instructions

## Problem
Admin panel cannot login - CORS errors when accessing API from `https://uslugar.oriph.io` to `https://uslugar.api.oriph.io`.

## Root Cause
CORS headers may not be properly configured or nginx proxy might be stripping them.

## Solutions Applied

### 1. Backend Server CORS Configuration
Updated `uslugar/backend/src/server.js`:
- ✅ Added logging for CORS origin checking
- ✅ Added `Accept` and `X-Requested-With` to allowed headers
- ✅ Added `Access-Control-Max-Age` header
- ✅ Improved error logging for blocked origins
- ✅ Added `Access-Control-Allow-Credentials` header

### 2. Environment Variable
Make sure `CORS_ORIGINS` is set in ECS Task Definition:
```
CORS_ORIGINS=https://uslugar.oriph.io,https://uslugar.oriphiel.io
```

Current value in task-def.json (revision 203):
```
"value": "https://uslugar.oriph.io,http://localhost:5173,http://localhost:3000"
```

### 3. Nginx Proxy (if applicable)
If nginx-proxy container is handling requests, ensure it's not stripping CORS headers.

## Deployment Steps

1. **Redeploy Backend:**
   ```bash
   # Build and push new backend image
   cd uslugar/backend
   docker build -t uslugar-backend:latest .
   # Tag and push to ECR
   ```

2. **Update ECS Task Definition:**
   - Ensure `CORS_ORIGINS` environment variable includes `https://uslugar.oriph.io`
   - Update task definition with new image
   - Force new deployment

3. **Verify CORS Headers:**
   ```bash
   curl -H "Origin: https://uslugar.oriph.io" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type,Authorization" \
        -X OPTIONS \
        https://uslugar.api.oriph.io/api/auth/login \
        -v
   ```

   Expected response headers:
   ```
   Access-Control-Allow-Origin: https://uslugar.oriph.io
   Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With
   ```

## Troubleshooting

### Check Backend Logs
```bash
aws logs tail /ecs/uslugar --follow
```

Look for:
- `[CORS] Allowed origins:` - Should show the allowed origins
- `[CORS] Blocked origin:` - If you see this, the origin is not in the allowed list

### Verify Environment Variable
Check ECS task definition:
```bash
aws ecs describe-task-definition --task-definition uslugar
```

### Test from Browser Console
```javascript
fetch('https://uslugar.api.oriph.io/api/auth/login', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://uslugar.oriph.io',
    'Access-Control-Request-Method': 'POST'
  }
})
.then(r => console.log(r.headers.get('Access-Control-Allow-Origin')))
```

## Notes
- Backend code has been updated and committed
- Changes need to be deployed to production
- If nginx proxy is in front, check nginx configuration as well
- The `nginx-proxy-uslugar` container might need CORS configuration updates


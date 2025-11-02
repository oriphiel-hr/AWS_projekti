# Network Error Debug Guide

## Problem
"Network Error" (ERR_NETWORK) when trying to login or access API from frontend.

## Possible Causes

### 1. Backend Not Deployed Yet
The latest CORS fixes might not be deployed to production yet.

**Check:** 
- GitHub Actions workflow status
- ECS service deployment status

**Solution:**
```powershell
# Force new deployment
.\redeploy-backend-cors-fix.ps1
```

### 2. Backend Crashed/Not Running
Backend might have crashed due to syntax error or missing dependency.

**Check Backend Logs:**
```powershell
aws logs tail /ecs/uslugar --since 10m --region eu-north-1 --format short
```

**Look for:**
- Syntax errors
- Missing imports
- Server startup messages
- "[CORS] Allowed origins:" message

### 3. Backend Still Using Old Code
Backend might still be running old code without CORS fixes.

**Check:**
```powershell
aws ecs describe-services --cluster apps-cluster --services uslugar-service-2gk1f1mv --region eu-north-1 `
  --query "services[0].taskDefinition"
```

Compare with latest commit SHA to see if deployment completed.

### 4. CORS Package Import Error
Even though we removed `import cors from 'cors'`, the package.json still lists it as dependency. 
If backend is using cached node_modules, it might fail.

**This shouldn't be an issue** since we removed the import, but verify Docker build doesn't fail.

## Immediate Actions

### 1. Check GitHub Actions
Go to: https://github.com/YOUR_REPO/actions

Check if:
- Workflow is running/completed
- Build succeeded
- Deployment succeeded
- No errors in workflow logs

### 2. Check ECS Service Status
```powershell
aws ecs describe-services --cluster apps-cluster --services uslugar-service-2gk1f1mv --region eu-north-1 `
  --query "services[0].{Status:status,DesiredCount:desiredCount,RunningCount:runningCount,Deployments:deployments[*].{Status:status,RunningCount:runningCount}}"
```

**Expected:**
- Status: ACTIVE
- RunningCount == DesiredCount
- Latest deployment: PRIMARY with RunningCount > 0

### 3. Check Backend Logs for Errors
```powershell
aws logs tail /ecs/uslugar --since 15m --region eu-north-1 --format short | Select-String -Pattern "error|Error|ERROR|SyntaxError|Cannot|Failed" -CaseSensitive:$false
```

### 4. Test API Directly
```powershell
# Test health endpoint
curl https://uslugar.api.oriph.io/api/health

# Test with CORS
curl -X OPTIONS -H "Origin: https://uslugar.oriph.io" -H "Access-Control-Request-Method: POST" https://uslugar.api.oriph.io/api/auth/login -v
```

### 5. Force Redeploy
If deployment didn't complete or backend is stuck:

```powershell
.\redeploy-backend-cors-fix.ps1
```

Or manually:
```powershell
aws ecs update-service --cluster apps-cluster --service uslugar-service-2gk1f1mv --region eu-north-1 --force-new-deployment
```

## Verification Steps After Deployment

1. **Wait 2-3 minutes** for deployment to complete
2. **Check logs** for server startup:
   ```
   [CORS] Allowed origins: [ 'https://uslugar.oriph.io', ... ]
   Server listening on port 8080
   ```
3. **Test health endpoint:**
   ```powershell
   curl https://uslugar.api.oriph.io/api/health
   ```
   Should return: `ok`
4. **Test login endpoint:**
   ```powershell
   curl -X POST -H "Content-Type: application/json" -H "Origin: https://uslugar.oriph.io" -d '{"email":"test@test.com","password":"test"}' https://uslugar.api.oriph.io/api/auth/login -v
   ```
   Should return proper response (401 if wrong credentials, but with CORS headers)

## Common Fixes

### Backend Not Starting
If logs show errors:
1. Check for syntax errors in latest commit
2. Verify all imports are correct
3. Check if npm dependencies are installed
4. Verify Dockerfile builds successfully

### Deployment Stuck
If ECS service shows "Deploying" for too long:
1. Check CloudWatch logs for errors
2. Check ECS task status (might be failing to start)
3. Verify task definition is valid
4. Check security groups and networking

### Network Error Persists
If backend is running but still getting Network Error:
1. Check ALB/nginx proxy configuration
2. Verify DNS is pointing to correct endpoint
3. Check if SSL certificate is valid
4. Verify security groups allow traffic

## Status Check Script

Use `check-backend-status.ps1` to quickly check:
- ECS service status
- Recent backend logs
- API health endpoint
- CORS headers

```powershell
.\check-backend-status.ps1
```


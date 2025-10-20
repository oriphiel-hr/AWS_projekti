# Deploy Fix: Unicode Emoji Error

## Problem Identified
The Docker container was crashing due to emoji characters (✅) in console.log statements that couldn't be encoded in the container environment.

## Fix Applied
- Removed emoji characters from `uslugar/backend/src/server.js`
- Commit: `aecbb89548e02b1d25d1976ab0e76e7d89d0dda8`

## Deployment Steps

### 1. Ensure Docker Desktop is running

### 2. Build and push the image:
```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti\uslugar\backend

# Build
docker build -f Dockerfile.prod -t 666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar:aecbb89548e02b1d25d1976ab0e76e7d89d0dda8 .

# Push
docker push 666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar:aecbb89548e02b1d25d1976ab0e76e7d89d0dda8
```

### 3. Register new task definition:
```powershell
aws ecs register-task-definition --region eu-north-1 --cli-input-json file://taskdef-new.json
```

### 4. Update ECS service:
```powershell
aws ecs update-service --cluster apps-cluster --service uslugar-service-2gk1f1mv --task-definition uslugar:73 --force-new-deployment --region eu-north-1
```

### 5. Monitor deployment:
```powershell
# Check service status
aws ecs describe-services --cluster apps-cluster --services uslugar-service-2gk1f1mv --region eu-north-1 --query 'services[0].deployments[0].[status,rolloutState,runningCount,desiredCount]' --output table

# Check logs
aws logs tail /ecs/uslugar --since 5m --region eu-north-1 --format short
```

## Previous Issues
- ❌ Task Definition 71: Used old image `e80887b` - failed to start
- ❌ Task Definition 72: Used `dc2ec72` image - failed due to emoji encoding error
- ✅ Task Definition 73: Will use `aecbb89` with emoji fix - should work!


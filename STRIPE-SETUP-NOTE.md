# ⚠️ Stripe Integration - Manual Setup Required

## Problem
Stripe API keys cannot be automatically configured via CLI due to the complexity of ECS Task Definition management from Windows/PowerShell environment.

## Current Status
- ✅ Stripe secrets created in AWS Secrets Manager:
  - `uslugar/stripe-secret-key` (ARN: `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-jKdcdD`)
  - `uslugar/stripe-publishable-key` (ARN: `arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-37rvJI`)
- ✅ Backend code supports Stripe (with graceful fallback)
- ❌ ECS Task Definition needs manual update via AWS Console

## Manual Steps Required

### Via AWS Console:
1. Go to **ECS → Task Definitions → uslugar → Revision 203**
2. Click **Create new revision**
3. Find the `secrets` array in the `uslugar` container definition
4. Replace the Stripe keys with:
   ```json
   {
     "name": "STRIPE_SECRET_KEY",
     "valueFrom": "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-jKdcdD"
   },
   {
     "name": "STRIPE_PUBLISHABLE_KEY",
     "valueFrom": "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-37rvJI"
   }
   ```
5. Click **Create** to create new revision
6. Update service to use the new revision

### Alternative: Use CloudShell
From AWS CloudShell, run:
```bash
# Get current task definition
aws ecs describe-task-definition --task-definition uslugar:203 --region eu-north-1 > task-def.json

# Edit to replace Stripe ARNs (use sed/vi)

# Register new revision
aws ecs register-task-definition --cli-input-json file://task-def-fixed.json --region eu-north-1

# Update service
aws ecs update-service --cluster apps-cluster --service uslugar-service-2gk1f1mv --task-definition uslugar:NEW_REVISION --force-new-deployment --region eu-north-1
```

---

**Current State**: Backend will show "Stripe not configured" error message until ECS Task Definition is updated manually.


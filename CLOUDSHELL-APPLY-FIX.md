# 🔧 Apply Project Type Fix via CloudShell

**Run this in AWS CloudShell or ECS Exec**

## Method 1: ECS Exec (Recommended)

```bash
# 1. Get task ARN
TASK_ARN=$(aws ecs list-tasks \
  --cluster apps-cluster \
  --service-name uslugar-service-2gk1f1mv \
  --region eu-north-1 \
  --query 'taskArns[0]' --output text)

# 2. Run SQL fix
aws ecs execute-command \
  --cluster apps-cluster \
  --task $TASK_ARN \
  --container uslugar \
  --region eu-north-1 \
  --command "psql 'postgres://uslugar_user:Pastor123@uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com:5432/uslugar' -c \"ALTER TABLE \\\"Job\\\" ADD COLUMN IF NOT EXISTS \\\"projectType\\\" TEXT; ALTER TABLE \\\"Job\\\" ADD COLUMN IF NOT EXISTS \\\"customFields\\\" JSONB;\""
```

## Method 2: Direct SQL (CloudShell)

```bash
# Install psql in CloudShell
sudo yum install postgresql15 -y

# Run SQL
psql 'postgres://uslugar_user:Pastor123@uslugar-db.cr80o0eeg3gy.eu-north-1.rds.amazonaws.com:5432/uslugar' << EOF
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "projectType" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "customFields" JSONB;
EOF
```

## Method 3: Trigger Server Restart (Auto-fix will run)

```bash
# Force ECS deployment - server.js will auto-add columns
aws ecs update-service \
  --cluster apps-cluster \
  --service uslugar-service-2gk1f1mv \
  --force-new-deployment \
  --region eu-north-1
```

**Auto-fix kod u server.js** će automatski dodati kolone pri pokretanju!


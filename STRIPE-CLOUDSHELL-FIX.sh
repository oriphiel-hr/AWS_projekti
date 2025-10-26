#!/bin/bash
# Quick fix - remove invalid fields from JSON

cat > fix-json-v2.py << 'PYEOF'
import json

with open('task-def.json', 'r') as f:
    data = json.load(f)

# Get task definition data
task_def = data['taskDefinition']

# Remove ALL read-only fields that cause validation errors
read_only_fields = [
    'taskDefinitionArn', 'revision', 'status', 'registeredAt', 'registeredBy',
    'requiresAttributes', 'compatibilities'
]

for field in read_only_fields:
    task_def.pop(field, None)

# Update secrets in first container
container = task_def['containerDefinitions'][0]

# Keep existing secrets except Stripe ones
new_secrets = [s for s in container.get('secrets', []) 
             if s['name'] not in ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY']]

# Add new Stripe secrets
new_secrets.extend([
    {
        "name": "STRIPE_SECRET_KEY",
        "valueFrom": "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-jKdcdD"
    },
    {
        "name": "STRIPE_PUBLISHABLE_KEY",
        "valueFrom": "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-37rvJI"
    }
])

container['secrets'] = new_secrets

# Write fixed JSON
with open('task-def-fixed.json', 'w') as f:
    json.dump(task_def, f, indent=2)

print("✅ Fixed JSON created (no invalid fields)")
PYEOF

python3 fix-json-v2.py

# Register new task definition
echo "📝 Registering new task definition..."
NEW_REVISION=$(aws ecs register-task-definition \
    --cli-input-json file://task-def-fixed.json \
    --region eu-north-1 \
    --query 'taskDefinition.revision' \
    --output text)

echo "✅ New revision created: uslugar:$NEW_REVISION"

# Update ECS service
echo "🚀 Updating ECS service..."
aws ecs update-service \
    --cluster apps-cluster \
    --service uslugar-service-2gk1f1mv \
    --task-definition uslugar:$NEW_REVISION \
    --force-new-deployment \
    --region eu-north-1

echo ""
echo "✅ Deployment started! Wait 2-3 minutes."


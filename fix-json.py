import json

with open('task-def.json', 'r') as f:
    data = json.load(f)

task_def = data['taskDefinition']

# Remove ALL read-only fields
read_only_fields = [
    'taskDefinitionArn', 'revision', 'status', 'registeredAt', 'registeredBy',
    'requiresAttributes', 'compatibilities'
]

for field in read_only_fields:
    task_def.pop(field, None)

# Update secrets in first container
container = task_def['containerDefinitions'][0]
new_secrets = [s for s in container.get('secrets', []) 
             if s['name'] not in ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY']]

# Add new Stripe secrets
new_secrets.extend([
    {
        'name': 'STRIPE_SECRET_KEY',
        'valueFrom': 'arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-jKdcdD'
    },
    {
        'name': 'STRIPE_PUBLISHABLE_KEY',
        'valueFrom': 'arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-37rvJI'
    }
])

container['secrets'] = new_secrets

with open('task-def-fixed.json', 'w') as f:
    json.dump(task_def, f, indent=2)

print("✅ Fixed JSON created")

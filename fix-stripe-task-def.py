import json
import subprocess
import sys

# Get current task definition
print("Fetching task definition 203...")
result = subprocess.run(
    ["aws", "ecs", "describe-task-definition", "--task-definition", "uslugar:203", "--region", "eu-north-1"],
    capture_output=True, text=True
)

if result.returncode != 0:
    print(f"Error fetching task definition: {result.stderr}")
    sys.exit(1)

task_def = json.loads(result.stdout)
task_def_data = task_def["taskDefinition"]

# Remove read-only fields
read_only_fields = ['taskDefinitionArn', 'revision', 'status', 'registeredAt', 'registeredBy']
for field in read_only_fields:
    if field in task_def_data:
        del task_def_data[field]

# Update Stripe secrets in first container
uslugar_container = task_def_data['containerDefinitions'][0]

# Remove old Stripe secrets
new_secrets = []
for secret in uslugar_container.get('secrets', []):
    if secret['name'] not in ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY']:
        new_secrets.append(secret)

# Add new Stripe secrets
new_secrets.append({
    "name": "STRIPE_SECRET_KEY",
    "valueFrom": "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-jKdcdD"
})
new_secrets.append({
    "name": "STRIPE_PUBLISHABLE_KEY",
    "valueFrom": "arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-37rvJI"
})

uslugar_container['secrets'] = new_secrets

# Save to file
with open('task-def-fixed.json', 'w') as f:
    json.dump(task_def_data, f, indent=2)

print("✅ Task definition JSON prepared")

# Register new task definition
print("Registering new task definition...")
result = subprocess.run(
    ["aws", "ecs", "register-task-definition", "--cli-input-json", "file://task-def-fixed.json", "--region", "eu-north-1"],
    capture_output=True, text=True
)

if result.returncode != 0:
    print(f"Error registering task definition: {result.stderr}")
    sys.exit(1)

new_task_def = json.loads(result.stdout)
new_revision = new_task_def["taskDefinition"]["revision"]
print(f"✅ New task definition created: uslugar:{new_revision}")

# Update service
print(f"Updating service to use uslugar:{new_revision}...")
result = subprocess.run(
    ["aws", "ecs", "update-service", 
     "--cluster", "apps-cluster",
     "--service", "uslugar-service-2gk1f1mv",
     "--task-definition", f"uslugar:{new_revision}",
     "--force-new-deployment",
     "--region", "eu-north-1"],
    capture_output=True, text=True
)

if result.returncode != 0:
    print(f"Error updating service: {result.stderr}")
    sys.exit(1)

print("✅ Service updated successfully!")
print(f"Deployment will start with Stripe keys configured.")


#!/bin/bash
# Fix Task Definition - Add Prisma Generate to Runtime Command

set -e

REGION="eu-north-1"
FAMILY="uslugar"
IMAGE_URI="666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar:e80887b7b651d762c687bb86f00fe5b9264b5f81"

echo "=== Dohvaćam Task Definition 67 ==="
aws ecs describe-task-definition \
  --task-definition $FAMILY:67 \
  --region $REGION \
  --query 'taskDefinition' \
  --output json > td.json

echo "=== Čistim JSON ==="
cat td.json | jq 'del(.status,.requiresAttributes,.compatibilities,.revision,.registeredAt,.registeredBy,.taskDefinitionArn,.tags)' > td-clean.json

echo "=== Mijenjam image URI i command ==="
cat td-clean.json | jq --arg IMG "$IMAGE_URI" '
  .containerDefinitions = (.containerDefinitions | map(
    if .name == "uslugar" then 
      .image = $IMG |
      .command = ["sh", "-lc", "set -e; npx prisma generate --schema=./prisma/schema.prisma || true; node src/server.js"]
    else . 
    end
  ))
' > td-new.json

echo "=== Registriram novu Task Definition ==="
NEW_TD=$(aws ecs register-task-definition \
  --cli-input-json file://td-new.json \
  --region $REGION \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text)

echo "Nova Task Definition: $NEW_TD"

echo "=== Update-am service ==="
aws ecs update-service \
  --cluster apps-cluster \
  --service uslugar-service-2gk1f1mv \
  --task-definition $NEW_TD \
  --desired-count 1 \
  --force-new-deployment \
  --region $REGION

echo "=== GOTOVO! ==="
echo "Čekaj 2-3 minute, zatim test:"
echo "curl https://uslugar.api.oriph.io/api/categories"


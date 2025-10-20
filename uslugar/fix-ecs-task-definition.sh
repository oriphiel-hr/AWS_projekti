#!/bin/bash
# Fix ECS Task Definition - Use Existing ECR Image

set -e

REGION="eu-north-1"
CLUSTER="apps-cluster"
SERVICE="uslugar-service-2gk1f1mv"
FAMILY="uslugar"

# Postojeći image iz ECR-a (potvrdio sam da postoji)
IMAGE_URI="666203386231.dkr.ecr.eu-north-1.amazonaws.com/uslugar:e80887b7b651d762c687bb86f00fe5b9264b5f81"

echo "=== Dohvaćam trenutnu Task Definition ==="
aws ecs describe-task-definition \
  --task-definition $FAMILY \
  --region $REGION \
  --query 'taskDefinition' \
  --output json > td.json

echo "=== Čistim JSON ==="
cat td.json | jq 'del(.status,.requiresAttributes,.compatibilities,.revision,.registeredAt,.registeredBy,.taskDefinitionArn,.tags)' > td-clean.json

echo "=== Mijenjam image URI na postojeći image ==="
cat td-clean.json | jq --arg IMG "$IMAGE_URI" '
  .containerDefinitions = (.containerDefinitions | map(
    if .name == "uslugar" 
    then .image = $IMG 
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

echo "=== Update-am service na novu TD ==="
aws ecs update-service \
  --cluster $CLUSTER \
  --service $SERVICE \
  --task-definition $NEW_TD \
  --desired-count 1 \
  --force-new-deployment \
  --region $REGION

echo "=== GOTOVO! Čekaj 2-3 minute da task se pokrene ==="
echo "Provjeri: aws ecs describe-services --cluster $CLUSTER --services $SERVICE --region $REGION --query 'services[0].runningCount'"


#!/bin/bash
# USLUGAR - Dodavanje kompletnih kategorija na AWS produkciju
# =============================================================

echo "🌱 USLUGAR - Dodavanje kompletnih kategorija"
echo "============================================="

# Provjeri AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI nije instaliran"
    exit 1
fi

# Provjeri AWS konfiguraciju
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI nije konfiguriran"
    exit 1
fi

echo "✅ AWS CLI je konfiguriran"

# Pokreni seed script na AWS ECS
echo "🚀 Pokretanje seed script-a na AWS ECS..."

# Pronađi task definition
TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition uslugar --query 'taskDefinition.taskDefinitionArn' --output text)
echo "📋 Task Definition: $TASK_DEFINITION"

# Pronađi cluster
CLUSTER_NAME=$(aws ecs list-clusters --query 'clusterArns[0]' --output text | sed 's/.*\///')
echo "🏗️ Cluster: $CLUSTER_NAME"

# Pokreni task za seed
echo "🌱 Pokretanje seed task-a..."
TASK_ARN=$(aws ecs run-task \
    --cluster $CLUSTER_NAME \
    --task-definition uslugar \
    --overrides '{
        "containerOverrides": [{
            "name": "uslugar",
            "command": ["node", "prisma/seed-categories.js"]
        }]
    }' \
    --query 'tasks[0].taskArn' \
    --output text)

echo "✅ Seed task pokrenut: $TASK_ARN"

# Čekaj da se task završi
echo "⏳ Čekam da se task završi..."
aws ecs wait tasks-stopped --cluster $CLUSTER_NAME --tasks $TASK_ARN

# Provjeri status
TASK_STATUS=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN --query 'tasks[0].lastStatus' --output text)
echo "📊 Task status: $TASK_STATUS"

if [ "$TASK_STATUS" = "STOPPED" ]; then
    EXIT_CODE=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN --query 'tasks[0].containers[0].exitCode' --output text)
    if [ "$EXIT_CODE" = "0" ]; then
        echo "✅ Kategorije uspješno dodane!"
    else
        echo "❌ Seed task završio s greškom (exit code: $EXIT_CODE)"
        # Prikaži logove
        echo "📋 Logovi:"
        aws logs get-log-events \
            --log-group-name /ecs/uslugar \
            --log-stream-name ecs/uslugar/$(echo $TASK_ARN | sed 's/.*\///') \
            --query 'events[*].message' \
            --output text
    fi
else
    echo "❌ Task nije završio uspješno"
fi

echo "🏁 Gotovo!"

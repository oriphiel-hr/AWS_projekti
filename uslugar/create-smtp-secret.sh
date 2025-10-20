#!/bin/bash

# Create SMTP Secret in AWS Secrets Manager
# Usage: ./create-smtp-secret.sh

echo "==================================="
echo "AWS Secrets Manager - SMTP Setup"
echo "==================================="
echo ""

# Prompt for SMTP credentials
read -p "SMTP Host (default: smtp.gmail.com): " SMTP_HOST
SMTP_HOST=${SMTP_HOST:-smtp.gmail.com}

read -p "SMTP Port (default: 587): " SMTP_PORT
SMTP_PORT=${SMTP_PORT:-587}

read -p "SMTP User (email): " SMTP_USER
if [ -z "$SMTP_USER" ]; then
    echo "Error: SMTP User is required"
    exit 1
fi

read -sp "SMTP Password (App Password): " SMTP_PASS
echo ""
if [ -z "$SMTP_PASS" ]; then
    echo "Error: SMTP Password is required"
    exit 1
fi

echo ""
echo "Creating secret with following values:"
echo "  Host: $SMTP_HOST"
echo "  Port: $SMTP_PORT"
echo "  User: $SMTP_USER"
echo "  Pass: ********"
echo ""

# Create temporary JSON file
cat > /tmp/smtp-secret.json << EOF
{
  "SMTP_HOST": "$SMTP_HOST",
  "SMTP_PORT": "$SMTP_PORT",
  "SMTP_USER": "$SMTP_USER",
  "SMTP_PASS": "$SMTP_PASS"
}
EOF

# Create secret in AWS
echo "Creating secret in AWS Secrets Manager..."
SECRET_ARN=$(aws secretsmanager create-secret \
  --name uslugar-smtp-secret \
  --description "SMTP credentials for Uslugar email notifications" \
  --secret-string file:///tmp/smtp-secret.json \
  --region eu-north-1 \
  --query ARN \
  --output text 2>&1)

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Secret created successfully!"
    echo ""
    echo "Secret ARN: $SECRET_ARN"
    echo ""
    echo "Next steps:"
    echo "1. Update taskdef-new.json with this ARN"
    echo "2. Deploy backend with new task definition"
    echo "3. Test email sending"
else
    echo ""
    echo "✗ Error creating secret:"
    echo "$SECRET_ARN"
    echo ""
    
    # Check if secret already exists
    if echo "$SECRET_ARN" | grep -q "ResourceExistsException"; then
        echo "Secret already exists. Updating..."
        aws secretsmanager update-secret \
          --secret-id uslugar-smtp-secret \
          --secret-string file:///tmp/smtp-secret.json \
          --region eu-north-1
        
        if [ $? -eq 0 ]; then
            echo "✓ Secret updated successfully!"
            
            # Get ARN
            SECRET_ARN=$(aws secretsmanager describe-secret \
              --secret-id uslugar-smtp-secret \
              --region eu-north-1 \
              --query ARN \
              --output text)
            
            echo ""
            echo "Secret ARN: $SECRET_ARN"
        fi
    fi
fi

# Clean up
rm -f /tmp/smtp-secret.json

echo ""
echo "Done!"


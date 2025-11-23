#!/bin/bash

# AWS S3 Setup Script za Uslugar PDF Fakture
# Ovaj skript kreira S3 bucket i postavlja lifecycle policy

set -e

BUCKET_NAME="uslugar-invoices"
REGION="eu-north-1"

echo "🪣 Setting up S3 bucket for invoice PDFs..."

# Provjeri da li je AWS CLI instaliran
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI nije instaliran. Instaliraj ga prvo: https://aws.amazon.com/cli/"
    exit 1
fi

# Provjeri AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials nisu konfigurirani. Pokreni 'aws configure'"
    exit 1
fi

echo "✅ AWS CLI konfiguriran"

# Provjeri da li bucket već postoji
if aws s3api head-bucket --bucket "$BUCKET_NAME" --region "$REGION" 2>/dev/null; then
    echo "⚠️  Bucket '$BUCKET_NAME' već postoji. Preskačem kreiranje."
else
    echo "📦 Kreiranje S3 bucket-a: $BUCKET_NAME"
    
    # Kreiraj bucket
    aws s3api create-bucket \
        --bucket "$BUCKET_NAME" \
        --region "$REGION" \
        --create-bucket-configuration LocationConstraint="$REGION"
    
    echo "✅ Bucket kreiran"
    
    # Postavi versioning (disable)
    aws s3api put-bucket-versioning \
        --bucket "$BUCKET_NAME" \
        --versioning-configuration Status=Suspended
    
    # Postavi encryption
    aws s3api put-bucket-encryption \
        --bucket "$BUCKET_NAME" \
        --server-side-encryption-configuration '{
            "Rules": [{
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }]
        }'
    
    # Blokiraj public access
    aws s3api put-public-access-block \
        --bucket "$BUCKET_NAME" \
        --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
    
    echo "✅ Bucket konfiguracija postavljena"
fi

# Postavi lifecycle policy
echo "🔄 Postavljanje lifecycle policy..."

cat > /tmp/lifecycle-policy.json << 'EOF'
{
  "Rules": [
    {
      "Id": "MoveOldInvoicesToGlacier",
      "Status": "Enabled",
      "Prefix": "invoices/",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "GLACIER_IR"
        }
      ],
      "Expiration": {
        "Days": 2555
      }
    }
  ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \
    --bucket "$BUCKET_NAME" \
    --lifecycle-configuration file:///tmp/lifecycle-policy.json \
    --region "$REGION"

rm /tmp/lifecycle-policy.json

echo "✅ Lifecycle policy postavljena"

# Test upload
echo "🧪 Testiranje uploada..."

TEST_FILE="/tmp/test-invoice.pdf"
echo "Test PDF content" > "$TEST_FILE"

aws s3 cp "$TEST_FILE" "s3://$BUCKET_NAME/invoices/TEST-0001.pdf" --region "$REGION"

# Obriši test file
aws s3 rm "s3://$BUCKET_NAME/invoices/TEST-0001.pdf" --region "$REGION"
rm "$TEST_FILE"

echo "✅ Test upload uspješan"

echo ""
echo "🎉 S3 bucket setup završen!"
echo ""
echo "📝 Sljedeći koraci:"
echo "1. Dodaj environment varijable u ECS task definition:"
echo "   - AWS_S3_BUCKET_NAME=$BUCKET_NAME"
echo "   - AWS_REGION=$REGION"
echo ""
echo "2. Provjeri IAM permissions za ECS task role (S3 pristup)"
echo ""
echo "3. Testiraj generiranje fakture preko API-ja"

#!/bin/bash
# 🔄 Ažuriraj Twilio i Stripe Credentials u AWS Secrets Manager
# Automatski ažurira credentials i restartuje ECS service
# Za AWS CloudShell

set -euo pipefail

# Konfiguracija
REGION="eu-north-1"
CLUSTER="apps-cluster"
SERVICE="uslugar-service-2gk1f1mv"

# Boje za output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Ažuriranje Twilio i Stripe Credentials${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# ========================================
# Funkcije
# ========================================

function print_section() {
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
}

function print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

function print_error() {
    echo -e "${RED}❌ $1${NC}"
}

function print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

function print_info() {
    echo -e "${CYAN}📝 $1${NC}"
}

function read_secret() {
    local prompt="$1"
    echo -n "$prompt: "
    read -s value
    echo ""
    echo "$value"
}

# ========================================
# 1. TWILIO CREDENTIALS
# ========================================
print_section "TWILIO CREDENTIALS"

TWILIO_SECRET_NAME="uslugar-twilio-config"

# Provjeri da li secret postoji
print_info "Provjera Twilio secret-a..."
if ! aws secretsmanager describe-secret --secret-id "$TWILIO_SECRET_NAME" --region "$REGION" &>/dev/null; then
    print_error "Twilio secret '$TWILIO_SECRET_NAME' ne postoji!"
    echo -e "${YELLOW}💡 Kreiraj secret prvo: uslugar/backend/setup-twilio-secrets.ps1${NC}"
    echo -n "Želiš li nastaviti bez Twilio ažuriranja? (y/n): "
    read -r skip_twilio
    if [[ "$skip_twilio" != "y" ]]; then
        exit 1
    fi
    SKIP_TWILIO=true
else
    print_success "Twilio secret postoji"
    SKIP_TWILIO=false
fi

if [[ "$SKIP_TWILIO" == "false" ]]; then
    # Unos novih Twilio credentials
    echo ""
    echo -e "${CYAN}Unesi nove Twilio credentials:${NC}"
    echo -n "  Twilio Account SID: "
    read -r TWILIO_ACCOUNT_SID
    
    echo -n "  Twilio Auth Token: "
    TWILIO_AUTH_TOKEN=$(read_secret "  Twilio Auth Token")
    
    echo -n "  Twilio Phone Number (format: +1234567890): "
    read -r TWILIO_PHONE_NUMBER
    
    # Validacija
    if [[ -z "$TWILIO_ACCOUNT_SID" || -z "$TWILIO_AUTH_TOKEN" || -z "$TWILIO_PHONE_NUMBER" ]]; then
        print_error "Svi Twilio podaci su obavezni!"
        exit 1
    fi
    
    # Ažuriraj Twilio secret
    print_info "Ažuriranje Twilio secret-a..."
    
    TWILIO_SECRET_JSON=$(cat <<EOF
{
    "TWILIO_ACCOUNT_SID": "$TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN": "$TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER": "$TWILIO_PHONE_NUMBER"
}
EOF
)
    
    if aws secretsmanager put-secret-value \
        --secret-id "$TWILIO_SECRET_NAME" \
        --secret-string "$TWILIO_SECRET_JSON" \
        --region "$REGION" &>/dev/null; then
        print_success "Twilio secret uspješno ažuriran!"
    else
        print_error "Greška pri ažuriranju Twilio secret-a!"
        exit 1
    fi
    
    # Očisti osjetljive podatke iz memorije (bash nema garbage collection, ali barem izbrišemo varijable)
    unset TWILIO_AUTH_TOKEN
fi

# ========================================
# 2. STRIPE CREDENTIALS
# ========================================
print_section "STRIPE CREDENTIALS"

# Stripe secret ARN-ovi (prema STRIPE-SETUP.ps1)
STRIPE_SECRET_KEY_ARN="arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-secret-key-jKdcdD"
STRIPE_PUBLISHABLE_KEY_ARN="arn:aws:secretsmanager:eu-north-1:666203386231:secret:uslugar/stripe-publishable-key-37rvJI"

# Provjeri da li Stripe secrets postoje
print_info "Provjera Stripe secrets..."
if aws secretsmanager describe-secret --secret-id "$STRIPE_SECRET_KEY_ARN" --region "$REGION" &>/dev/null && \
   aws secretsmanager describe-secret --secret-id "$STRIPE_PUBLISHABLE_KEY_ARN" --region "$REGION" &>/dev/null; then
    print_success "Stripe secrets postoje"
else
    print_warning "Neki Stripe secrets možda ne postoje. Nastavljamo..."
fi

# Unos novih Stripe credentials
echo ""
echo -e "${CYAN}Unesi nove Stripe credentials:${NC}"
echo -n "  Stripe Secret Key (sk_live_...): "
STRIPE_SECRET_KEY=$(read_secret "  Stripe Secret Key")

echo -n "  Stripe Publishable Key (pk_live_...): "
STRIPE_PUBLISHABLE_KEY=$(read_secret "  Stripe Publishable Key")

echo -n "  Ažurirati Stripe Webhook Secret? (y/n): "
read -r INCLUDE_WEBHOOK

STRIPE_WEBHOOK_SECRET=""
STRIPE_WEBHOOK_SECRET_ARN=""
if [[ "$INCLUDE_WEBHOOK" == "y" ]]; then
    STRIPE_WEBHOOK_SECRET=$(read_secret "  Stripe Webhook Secret (whsec_...)")
    echo -n "  Unesi ARN za Stripe Webhook Secret (ili pritisni Enter za preskakanje): "
    read -r STRIPE_WEBHOOK_SECRET_ARN
fi

# Validacija
if [[ -z "$STRIPE_SECRET_KEY" || -z "$STRIPE_PUBLISHABLE_KEY" ]]; then
    print_warning "Stripe Secret Key i Publishable Key su obavezni!"
    echo -n "Preskoči ažuriranje Stripe-a? (y/n): "
    read -r SKIP_STRIPE_INPUT
    if [[ "$SKIP_STRIPE_INPUT" == "y" ]]; then
        print_info "Preskačem Stripe ažuriranje"
        SKIP_STRIPE=true
    else
        exit 1
    fi
else
    SKIP_STRIPE=false
    
    # Ažuriraj Stripe Secret Key
    print_info "Ažuriranje Stripe Secret Key..."
    if aws secretsmanager put-secret-value \
        --secret-id "$STRIPE_SECRET_KEY_ARN" \
        --secret-string "$STRIPE_SECRET_KEY" \
        --region "$REGION" &>/dev/null; then
        print_success "Stripe Secret Key uspješno ažuriran!"
    else
        print_error "Greška pri ažuriranju Stripe Secret Key!"
    fi
    
    # Ažuriraj Stripe Publishable Key
    print_info "Ažuriranje Stripe Publishable Key..."
    if aws secretsmanager put-secret-value \
        --secret-id "$STRIPE_PUBLISHABLE_KEY_ARN" \
        --secret-string "$STRIPE_PUBLISHABLE_KEY" \
        --region "$REGION" &>/dev/null; then
        print_success "Stripe Publishable Key uspješno ažuriran!"
    else
        print_error "Greška pri ažuriranju Stripe Publishable Key!"
    fi
    
    # Ažuriraj Stripe Webhook Secret (ako je unesen)
    if [[ -n "$STRIPE_WEBHOOK_SECRET" && -n "$STRIPE_WEBHOOK_SECRET_ARN" ]]; then
        print_info "Ažuriranje Stripe Webhook Secret..."
        if aws secretsmanager put-secret-value \
            --secret-id "$STRIPE_WEBHOOK_SECRET_ARN" \
            --secret-string "$STRIPE_WEBHOOK_SECRET" \
            --region "$REGION" &>/dev/null; then
            print_success "Stripe Webhook Secret uspješno ažuriran!"
        else
            print_error "Greška pri ažuriranju Stripe Webhook Secret!"
        fi
    fi
    
    # Očisti osjetljive podatke iz memorije
    unset STRIPE_SECRET_KEY
    unset STRIPE_PUBLISHABLE_KEY
    unset STRIPE_WEBHOOK_SECRET
fi

# ========================================
# 3. RESTART ECS SERVICE
# ========================================
print_section "RESTART ECS SERVICE"

print_info "Restartovanje ECS service '$SERVICE'..."
echo -e "${YELLOW}   Cluster: $CLUSTER${NC}"
echo -e "${YELLOW}   Region: $REGION${NC}"
echo ""

echo -n "Želiš li restartovati ECS service? (y/n): "
read -r CONFIRM_RESTART

if [[ "$CONFIRM_RESTART" != "y" ]]; then
    print_warning "Preskačem restart. Restartuj ručno:"
    echo -e "${YELLOW}   aws ecs update-service --cluster $CLUSTER --service $SERVICE --force-new-deployment --region $REGION${NC}"
    exit 0
fi

print_info "Ažuriranje ECS service..."
UPDATE_RESULT=$(aws ecs update-service \
    --cluster "$CLUSTER" \
    --service "$SERVICE" \
    --force-new-deployment \
    --region "$REGION")

if [[ $? -eq 0 ]]; then
    print_success "ECS service restartovan!"
    echo ""
    echo -e "${CYAN}📊 Deployment Status:${NC}"
    SERVICE_ARN=$(echo "$UPDATE_RESULT" | jq -r '.service.serviceArn')
    DESIRED_COUNT=$(echo "$UPDATE_RESULT" | jq -r '.service.desiredCount')
    RUNNING_COUNT=$(echo "$UPDATE_RESULT" | jq -r '.service.runningCount')
    
    echo -e "${YELLOW}   Service ARN: $SERVICE_ARN${NC}"
    echo -e "${YELLOW}   Desired Count: $DESIRED_COUNT${NC}"
    echo -e "${YELLOW}   Running Count: $RUNNING_COUNT${NC}"
    echo ""
    print_warning "Pričekaj 2-3 minute da se deployment završi..."
else
    print_error "Greška pri restartovanju ECS service!"
    exit 1
fi

# ========================================
# 4. PROVJERA STATUSA
# ========================================
print_section "PROVJERA STATUSA"

echo -e "${CYAN}🔍 Sljedeći koraci za provjeru:${NC}"
echo ""
echo -e "${CYAN}1. Provjeri Twilio logove (nakon 2-3 minute):${NC}"
echo -e "${YELLOW}   aws logs tail /ecs/uslugar --region $REGION --filter-pattern \"TWILIO\" --since 5m${NC}"
echo ""
echo -e "${CYAN}2. Provjeri Stripe logove (nakon 2-3 minute):${NC}"
echo -e "${YELLOW}   aws logs tail /ecs/uslugar --region $REGION --filter-pattern \"STRIPE|PAYMENTS\" --since 5m${NC}"
echo ""
echo -e "${CYAN}3. Provjeri da su novi credentials učitani:${NC}"
echo -e "${YELLOW}   Očekivani logovi:${NC}"
echo -e "${YELLOW}   - [SMS Service] Twilio config check: { hasAccountSID: true, ... }${NC}"
echo -e "${YELLOW}   - [PAYMENTS] Stripe initialized successfully${NC}"
echo ""

# Automatska provjera (opcionalno)
echo -n "Želiš li automatski provjeriti logove nakon 30 sekundi? (y/n): "
read -r AUTO_CHECK

if [[ "$AUTO_CHECK" == "y" ]]; then
    echo ""
    print_warning "Čekam 30 sekundi..."
    sleep 30
    
    echo ""
    print_info "Provjera Twilio logova..."
    aws logs tail /ecs/uslugar --region "$REGION" --filter-pattern "TWILIO" --since 2m || true
    
    echo ""
    print_info "Provjera Stripe logova..."
    aws logs tail /ecs/uslugar --region "$REGION" --filter-pattern "STRIPE|PAYMENTS" --since 2m || true
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}  ✅ ZAVRŠENO${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}💡 Napomene:${NC}"
echo -e "${YELLOW}   - Twilio: Provjeri da je phone number verificiran (ako je trial)${NC}"
echo -e "${YELLOW}   - Stripe: Ažuriraj webhook URL u Stripe Dashboard-u ako je potrebno${NC}"
echo -e "${YELLOW}   - Stripe: Kreiraj nove webhooke ako prelaziš na novi račun${NC}"
echo ""


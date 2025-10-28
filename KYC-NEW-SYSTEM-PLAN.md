# 🎯 Novi KYC Sustav - Badge System

## 📋 Badge Sustav

### 1. **Business Badge** (Auto-provjera javnih registara)
- ✅ Sudski registar (d.o.o./j.d.o.o.) - **IMPLEMENTIRANO**
- ⏳ Obrtni registar (obrt/paušalni)
- ⏳ VIES (PDV ID provjera)
- ⏳ Komorsko

### 2. **Identity Badge** (Anti-impersonation)
- ⏳ Email na domeni tvrtke
- ⏳ Poziv/SMS na službeni broj
- ⏳ DNS TXT verifikacija domene

### 3. **Safety Badge** (Opcijski)
- ⏳ Polica osiguranja

---

## 🎯 Implementation Plan

### Phase 1: Business Badge Completition
1. ✅ Sudski registar (done)
2. ⏳ Obrtni registar provjera
3. ⏳ VIES provjera
4. ⏳ Komorsko provjera

### Phase 2: Identity Badge
1. Email verifikacija na domeni tvrtke
2. Phone verifikacija na broj s weba
3. DNS TXT verifikacija

### Phase 3: Safety Badge
1. Polica osiguranja upload

### Phase 4: Rangiranje
1. Frontend sortiranje po broju badgeova
2. Priority za verificirane profile

---

## 🔧 Database Schema Changes Needed

```prisma
model ProviderProfile {
  // Existing fields...
  
  // Badge fields
  badge_business      Boolean  @default(false)
  badge_identity      Boolean  @default(false)
  badge_safety        Boolean  @default(false)
  badge_vies          Boolean  @default(false)
  
  // Business verification details
  biz_verification_source String? // 'SUDSKI', 'OBRTNI', 'VIES', 'KOMORSKO'
  biz_verification_date DateTime?
  
  // Identity verification
  identity_email_verified Boolean @default(false)
  identity_phone_verified Boolean @default(false)
  identity_dns_verified  Boolean @default(false)
  
  // Safety
  safety_insurance_url    String?
}
```

---

## 📊 Badge Priority za Rangiranje

1. **Business + Identity** = Top priority (na vrhu)
2. **Business** = High priority
3. **Identity** = Medium priority
4. **None** = Last priority


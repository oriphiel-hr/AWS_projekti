# Testiranje KYC Auto-Verifikacije

## 🧪 Kako Testirati

### 1. Otvori registraciju
```
https://uslugar.oriph.io/#register-provider
```

### 2. Otvori Developer Tools
- **F12** ili **Ctrl+Shift+I**
- **Console** tab

### 3. Popuni formu

#### Test Case 1: DOO (d.o.o.)
- **Pravni status**: d.o.o.
- **OIB**: 12345678901 (ili bilo koji 11-znamenkasti)
- **Naziv firme**: Test Obrt

**Expected Console Output:**
```
[Auto-Verify] Checking conditions: { taxId: "12345678901", taxIdLength: 11, legalStatusId: "cls4_doo" }
[Auto-Verify] Starting verification...
[Auto-Verify] ✅ Success: { verified: true, needsDocument: false, badges: [{type: "SUDSKI"}] }
```

**Expected UI:**
- Plavi box: "🔍 Brzo provjeravamo..."
- Zeleni box: "✓ Verificiran – SUDSKI"

---

#### Test Case 2: Freelancer
- **Pravni status**: Samostalni djelatnik (FREELANCER)
- **OIB**: 12345678901
- **Naziv firme**: (opcionalno)

**Expected Console Output:**
```
[Auto-Verify] Checking conditions: { taxId: "12345678901", taxIdLength: 11, legalStatusId: "cls6_freelancer" }
[Auto-Verify] Starting verification...
[Auto-Verify] ✅ Success: { verified: false, needsDocument: true, errors: ["Freelancer: Potrebno Rješenje Porezne uprave"] }
```

**Expected UI:**
- Plavi box: "📄 Freelancer: Potrebno Rješenje Porezne uprave"

---

## 🔍 Debugging

### Problem: Ne vidim ništa u UI

**Provjeri:**
1. Console → Da li se pokrenuo useEffect?
2. Network tab → Da li se poziva `/api/kyc/auto-verify`?
3. Network → Da li je status 200 ili error?

### Problem: CORS Error

**Rješenje:**
- Provjeri da li backend ima prave CORS postavke
- Provjeri da li `/api/kyc/auto-verify` postoji

### Problem: 401 Unauthorized

**Rješenje:**
- Endpoint je sada javni (bez auth)
- Provjeri da li je pozvan bez `Authorization` header

---

## 📊 Admin Metrike

### Test Admin Metrike:

```bash
# 1. Login kao ADMIN
# 2. Test endpoint:

curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:4000/api/admin/kyc-metrics
```

**Expected Response:**
```json
{
  "total": 10,
  "verified": 5,
  "pendingDocument": 2,
  "neverVerified": 3,
  "verificationRate": "50.0%",
  "byStatus": [
    { "code": "FREELANCER", "name": "Samostalni djelatnik", "count": "5" },
    { "code": "DOO", "name": "d.o.o.", "count": "3" }
  ],
  "avgVerificationMinutes": "15"
}
```

---

## 🎯 Što Očekovati

### U Registraciji:
1. ✅ Unesi OIB (11 znamenki)
2. ✅ Odaberi pravni status
3. ✅ Vidljivo: "🔍 Brzo provjeravamo..." (nekoliko sekundi)
4. ✅ Vidljivo: Rezultat (Verificiran ili Dokument potreban)
5. ✅ Pojavljuje se odgovarajuća poruka

### U Admin Panelu:
1. ✅ Endpoint: `/api/admin/kyc-metrics`
2. ✅ Prikazuje: Konverziju, verified rate, byStatus
3. ⏳ Admin UI još nije kreiran (treba dodati u AdminDashboard)

---

## ⚠️ Ako Ne Vidiš Ništa

1. **Hard Refresh**: Ctrl+Shift+R
2. **Provjeri Console**: Da li ima errors?
3. **Provjeri Network**: Da li je API pozvan?
4. **Čekaj Deploy**: GitHub Actions traje ~15 minuta

---

## 📝 Checklist

- [ ] Backend auto-verify endpoint dostupan
- [ ] Frontend useEffect pokrenut
- [ ] Console logs prikazuju se
- [ ] UI reagira na input
- [ ] API poziv se izvršava
- [ ] Rezultat se prikazuje


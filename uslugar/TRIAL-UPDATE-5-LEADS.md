# 🎁 TRIAL Update: 2 → 5 Besplatnih Leadova

## 📋 Izmjene

Povećan broj besplatnih leadova u TRIAL planu s **2 na 5** kako bi se bolje privukli novi providere i dala im veća šansa da isprobaju platformu.

---

## ✅ Ažurirane Datoteke

### **Backend:**

1. **`uslugar/backend/src/routes/subscriptions.js`**
   - Line 49: `creditsBalance: 2` → `creditsBalance: 5`
   - Line 58: Poruka "2 besplatna leada" → "5 besplatnih leadova"

2. **`uslugar/backend/src/services/credit-service.js`**
   - Line 113: `creditsBalance: 2` → `creditsBalance: 5`
   - Line 127: Poruka "2 besplatna leada" → "5 besplatnih leadova"

3. **`uslugar/backend/src/lib/subscription-reminder.js`**
   - Line 47: "2 besplatna leada" → "5 besplatnih leadova" (email template)

4. **`uslugar/backend/src/server.js`**
   - Line 433: Console log "TRIAL (2 free)" → "TRIAL (5 free)"

### **Frontend:**

5. **`uslugar/frontend/src/pages/Pricing.jsx`**
   - Line 64: `credits: 2` → `credits: 5`
   - Line 66: "2 ekskluzivna leada" → "5 ekskluzivnih leadova"

6. **`uslugar/frontend/src/pages/FAQ.jsx`**
   - Line 63: "2 kredita" → "5 kredita"

---

## 📊 Usporedba

| Element | Prije | Sada |
|---------|-------|------|
| **TRIAL credits** | 2 | 5 |
| **Cijena** | 0€ | 0€ |
| **Trajanje** | 7 dana | 7 dana |
| **Vrijednost** | ~20€ | ~50€ |

---

## 🎯 Utjecaj

### **Za nove providere:**
- ✅ Više prilika da isprobaju platformu (5 umjesto 2 leada)
- ✅ Bolji uvid u kvalitetu leadova
- ✅ Veća šansa za konverziju (više leadova = veća vjerojatnost da nađu dobar posao)
- ✅ Manji otpor prema plaćanju nakon TRIAL-a (osjete više vrijednosti)

### **Za platformu:**
- ✅ Veća privlačnost novim providere
- ✅ Viša konverzija TRIAL → paid plan (zbog pozitivnijeg iskustva)
- ✅ Bolji retention (više leadova = više prilika za uspjeh)

---

## 🚀 Deployment

### **Backend:**
```bash
# Build i deploy backend (automatski primijenit će se kod)
cd uslugar/backend
# Docker build + ECS update
```

### **Frontend:**
```bash
# Build frontend
cd uslugar/frontend
npm run build

# Deploy na FTP/GitHub Actions
git add .
git commit -m "Update: TRIAL plan - increase free leads from 2 to 5"
git push origin main
```

---

## ✅ Verifikacija

Nakon deploymenta, provjeri:

1. **Nova registracija providera:**
   - ✅ Treba dobiti 5 kredita umjesto 2
   - ✅ Notification poruka treba spominjati "5 besplatnih leadova"

2. **Subscription Plans stranica:**
   - ✅ TRIAL plan treba prikazivati "5 ekskluzivnih leadova"

3. **FAQ:**
   - ✅ Odgovor na "Što je trial period?" treba spominjati "5 kredita"

---

## 📝 Napomene

- **Postojeći korisnici:** Oni koji već imaju TRIAL s 2 leada zadržavaju svoje postojeće kredite (neće automatski dobiti dodatne)
- **Nova registracija:** Svi novi providere dobivaju 5 leadova
- **Email reminders:** Ažurirane poruke za TRIAL isteke sada spominju 5 leadova

---

**Datum izmjene:** 2025-01-31  
**Status:** ✅ Implementirano i spremno za deployment


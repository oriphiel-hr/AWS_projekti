# 🚀 Ručno pokretanje Backend Workflow-a

## Problem:
- Frontend workflow se pokrenuo prije 25 minuta ✅
- Backend workflow se NIJE pokrenuo ❌
- Dokumentacija route nije deployana → 404 greška

## Rješenje: Ručno pokreni Backend Workflow

### Korak 1: GitHub Actions

1. **Otvori GitHub:**
   👉 https://github.com/oriphiel/AWS_projekti/actions

2. **Pronađi workflow:**
   - U lijevom sidebaru traži: **"Backend - Reuse existing Task Definition (ECR→ECS)"**
   - Ili idi direktno: https://github.com/oriphiel/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml

3. **Pokreni workflow:**
   - Klikni gumb **"Run workflow"** (desno gore)
   - Odaberi branch: **"main"**
   - Klikni **"Run workflow"**

### Korak 2: Čekaj deployment (~7-10 minuta)

Workflow će:
1. ✅ Buildati Docker image sa novim kodom
2. ✅ Pushati na AWS ECR
3. ✅ Deployati na ECS
4. ✅ Restartati container

### Korak 3: Provjeri status

**U GitHub Actions:**
- Provjeri da li workflow ima zelenu kvačicu ✅
- Provjeri logs ako ima grešaka

**Test endpoint:**
```powershell
curl https://uslugar.oriph.io/api/documentation
```

**Očekivano:**
- ✅ JSON sa `features` i `featureDescriptions`
- ❌ Nema više 404 greške

## Alternativa: Commit promjena da triggerira workflow

Ako želiš automatski triggerati workflow:

```powershell
# Provjeri da li je documentation route commitan
git log --oneline -- "uslugar/backend/src/routes/documentation.js"

# Ako nije, commit i push:
git add uslugar/backend/src/routes/documentation.js
git add uslugar/backend/src/server.js
git commit -m "feat: Trigger backend deployment - documentation route"
git push origin main
```

**Workflow će se automatski pokrenuti** jer je trigger postavljen na promjene u `uslugar/backend/**`.

---

**Preporuka:** Koristi Korak 1 (ručno pokretanje) jer je brže i pouzdanije! 🚀


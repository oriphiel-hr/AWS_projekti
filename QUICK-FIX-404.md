# ⚡ Brzi Fix za 404 Grešku

## Problem:
- `/api/documentation` vraća 404 Not Found
- Backend workflow se nije pokrenuo

## Najbrže rješenje (2 minute):

### Ručno pokreni workflow kroz GitHub UI:

1. **Otvori:** https://github.com/oriphiel/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml

2. **Klikni:** "Run workflow" (gornji desni kut)

3. **Odaberi:** Branch "main"

4. **Klikni:** "Run workflow"

**Gotovo!** Workflow će se pokrenuti i deployati backend za ~7-10 minuta.

---

## Alternativa: Commit i push

Ako želiš automatski trigger:

```powershell
git add uslugar/backend/src/routes/documentation.js
git add uslugar/backend/src/server.js  
git commit -m "feat: Trigger backend deployment"
git push origin main
```

Workflow će se automatski pokrenuti zbog promjena u `uslugar/backend/**`.

---

**Preporuka:** Koristi ručno pokretanje - brže je! 🚀


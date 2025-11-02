# 🔍 Kako pronaći i pokrenuti Backend Workflow

## Workflow postoji:
- **File:** `.github/workflows/backend-uslugar-ecs.yml`
- **Ime:** "Backend - Reuse existing Task Definition (ECR→ECS)"

## Načini pokretanja:

### Opcija 1: Preko GitHub Actions UI

1. **Otvori:** https://github.com/oriphiel/AWS_projekti/actions
2. **U lijevom sidebaru** (pod "Workflows") traži:
   - "Backend - Reuse existing Task Definition (ECR→ECS)"
   - Ili scrollaj kroz listu workflow-a
3. **Klikni na workflow**
4. **Klikni "Run workflow"** (desno gore)

### Opcija 2: Preko Workflow File

1. **Otvori:** https://github.com/oriphiel/AWS_projekti/blob/main/.github/workflows/backend-uslugar-ecs.yml
2. **Na gornjem desnom kutu** klikni **"Actions"** tab
3. **Klikni "Run workflow"**

### Opcija 3: Trigger preko Push-a

Workflow se automatski pokreće kada pushaš promjene u `uslugar/backend/**`.

**Napravi empty commit:**
```powershell
git commit --allow-empty -m "chore: Trigger backend deployment"
git push origin main
```

### Opcija 4: Preko GitHub CLI (ako je instaliran)

```bash
gh workflow run "Backend - Reuse existing Task Definition (ECR→ECS)" --ref main
```

---

## Ako ne vidiš workflow u GitHub UI:

### Mogući uzroci:
1. **Workflow je disabled** - provjeri GitHub Settings → Actions
2. **Nemaš prava** - provjeri repository permissions
3. **Workflow nije vidljiv** - provjeri da li je workflow file commitan

### Rješenje:
- **Trigger automatski** preko push-a (Opcija 3)
- **Ili kontaktiraj repo ownera** da provjeri workflow permissions

---

## Najlakše: Push trigger

```powershell
# Napravi empty commit da triggerira workflow
git commit --allow-empty -m "chore: Trigger backend deployment - documentation route"
git push origin main
```

Workflow će se automatski pokrenuti za ~1 minutu nakon push-a! 🚀


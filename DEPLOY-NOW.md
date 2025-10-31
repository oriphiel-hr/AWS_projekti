# 🚀 Ručno Pokretanje Deployment-a

## Problem

Promjene su pushane na GitHub, ali GitHub Actions workflow-i se nisu pokrenuli automatski ili nisu završili.

---

## ✅ Rješenje: Ručno Pokreni Workflow-ove

### Opcija 1: Preko GitHub Web Interface

1. **Idi na GitHub repo:** https://github.com/oriphiel-hr/AWS_projekti
2. **Klikni "Actions" tab**
3. **Odaberi workflow:**

   **Backend:**
   - Odaberi: **"Backend - Reuse existing Task Definition (ECR→ECS)"**
   - Klikni **"Run workflow"** → **"Run workflow"**

   **Frontend:**
   - Odaberi: **"Frontend - Build & Deploy (Hostinger)"**
   - Klikni **"Run workflow"** → **"Run workflow"**

4. **Pratite progress** u real-time

---

### Opcija 2: Preko GitHub CLI (ako imaš gh)

```powershell
# Backend deployment
gh workflow run "Backend - Reuse existing Task Definition (ECR→ECS).yml"

# Frontend deployment
gh workflow run "Frontend - Build & Deploy (Hostinger).yml"
```

---

### Opcija 3: Push Dummy Commit (trigger automatski)

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti

# Napravi prazan commit da triggera workflow
git commit --allow-empty -m "trigger: Deploy backend and frontend changes"

# Push
git push origin main
```

Ovo će automatski triggerati oba workflow-a (backend i frontend).

---

## 🔍 Provjera Statusa Deployment-a

### GitHub Actions:
- https://github.com/oriphiel-hr/AWS_projekti/actions

### AWS ECS Status:
```powershell
aws ecs describe-services --cluster apps-cluster --services uslugar-service-2gk1f1mv --region eu-north-1 --query 'services[0].{Status:status,RunningCount:runningCount,DesiredCount:desiredCount,TaskDefinition:taskDefinition}'
```

---

## ⚡ Brzi Deployment

**Jednostavno:**
1. Idi na GitHub Actions
2. Klikni "Run workflow" za backend i frontend
3. Čekaj ~5-10 minuta

**Ili:**
```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti
git commit --allow-empty -m "trigger: Deploy"
git push origin main
```


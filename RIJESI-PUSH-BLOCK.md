# 🔒 Rješavanje GitHub Push Block

## ❌ Problem

```
! [remote rejected] main -> main (push declined due to repository rule violations)
```

**Razlog:** Twilio credentials su još uvijek u git history-u, iako su uklonjeni iz fajlova.

---

## ✅ Rješenje 1: Koristi GitHub Actions (Najbrže - Ne zahtijeva push!)

**Ne trebaš pushati!** Možeš direktno pokrenuti deployment preko GitHub Actions:

### Backend:
1. Idi na: https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/backend-uslugar-ecs.yml
2. Klikni **"Run workflow"** → **"Run workflow"**
3. Čekaj 5-10 minuta

### Frontend:
1. Idi na: https://github.com/oriphiel-hr/AWS_projekti/actions/workflows/frontend-uslugar.yml
2. Klikni **"Run workflow"** → **"Run workflow"**
3. Čekaj 3-5 minuta

**To je sve!** Ne trebaš pushati kod.

---

## ✅ Rješenje 2: Unblock Secret na GitHub-u

Ako želiš pushati, moraš unblockati secret:

1. Idi na: https://github.com/oriphiel-hr/AWS_projekti/security/secret-scanning/unblock-secret/34qv6hK1MJP2DkZnmjJwhMg0c3P
2. Klikni **"Allow secret"**
3. Push ponovno: `git push origin main`

**⚠️ Napomena:** Ovo će omogućiti push, ali secret će i dalje biti u git history-u. Za potpunu sigurnost, koristi Rješenje 3.

---

## ✅ Rješenje 3: Ukloni Secret iz Git History-a (Najsigurnije)

Ovo će potpuno očistiti Twilio credentials iz git history-a:

### Opcija A: Git Filter-Repo (Preporučeno)

```powershell
# Instaliraj git-filter-repo (ako nije instaliran)
# pip install git-filter-repo

cd C:\GIT_PROJEKTI\AWS\AWS_projekti

# Backup branch
git branch backup-main

# Ukloni Twilio credentials iz cijelog history-a
# ZAMIJENI ACTUAL_ACCOUNT_SID s tvojim Account SID-om
git filter-repo --replace-text <(echo "ACTUAL_ACCOUNT_SID==>TWILIO_ACCOUNT_SID_HIDDEN")
# ZAMIJENI ACTUAL_AUTH_TOKEN s tvojim Auth Token-om
git filter-repo --replace-text <(echo "ACTUAL_AUTH_TOKEN==>TWILIO_AUTH_TOKEN_HIDDEN")
# ZAMIJENI ACTUAL_PHONE_NUMBER s tvojim Phone Number-om
git filter-repo --replace-text <(echo "ACTUAL_PHONE_NUMBER==>TWILIO_PHONE_NUMBER_HIDDEN")

# Force push (OPREZNO - mijenja history!)
git push origin --force --all
```

### Opcija B: Interactive Rebase (Jednostavnije)

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti

# Pogledaj zadnjih 10 commit-a
git log --oneline -10

# Pokreni interactive rebase
git rebase -i HEAD~10  # Zamijeni 10 s brojem commit-a koji sadrže secret

# U editoru, promijeni "pick" u "edit" za commit-e koji sadrže secret
# Zatim za svaki commit:
git commit --amend  # Uredi da ukloniš secret
git rebase --continue
```

**⚠️ Važno:** Ovo mijenja git history. Ako drugi ljudi rade na projektu, moraju ponovno klonirati repo.

---

## ✅ Rješenje 4: Kreiraj Novi Branch (Trenutno Rješenje)

Ako ne želiš mijenjati history, možeš kreirati novi branch:

```powershell
cd C:\GIT_PROJEKTI\AWS\AWS_projekti

# Kreiraj novi branch bez problematičnih commit-a
git checkout -b main-clean

# Kopiraj samo najnovije promjene (bez history-a)
git add -A
git commit -m "feat: Clean commit without secrets"

# Push novi branch
git push origin main-clean

# Na GitHub-u, merge main-clean u main (preko Pull Request)
```

---

## 🎯 Preporuka

**Za brzu deployment:** Koristi Rješenje 1 (GitHub Actions) - ne zahtijeva push uopće!

**Za dugoročno rješenje:** Koristi Rješenje 3 (git filter-repo) da potpuno očistiš credentials iz history-a.

---

## 📝 Status

✅ Credentials uklonjeni iz aktivnih fajlova  
❌ Credentials još uvijek u git history-u  
✅ GitHub Actions radi bez push-a  

**Sadašnje promjene su spremne za deployment preko GitHub Actions!**


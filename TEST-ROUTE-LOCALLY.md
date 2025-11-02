# 🧪 Test Route Lokalno

## Problem:
- ✅ Route je commitan i pushan
- ✅ Workflow je završio
- ❌ Endpoint i dalje vraća 404

## Možda problem nije u deploymentu, nego u route-u?

### Test 1: Provjeri da li route radi lokalno

```powershell
cd uslugar/backend
npm install
npm run dev
```

**U drugom terminalu:**
```powershell
curl http://localhost:4000/api/documentation
```

**Ako lokalno radi:**
- Problem je u deploymentu
- Provjeri ECS logs

**Ako lokalno ne radi:**
- Problem je u route kodu
- Provjeri da li ima greške

### Test 2: Provjeri da li Prisma tablice postoje

Route koristi `DocumentationCategory` i `DocumentationFeature` tablice.

**Ako tablice ne postoje u bazi:**
- Route će failati
- Potrebno je pokrenuti Prisma migracije i seed

**Provjeri:**
```powershell
# Ako imaš pristup bazi
psql -h [DB_HOST] -U [USER] -d uslugar -c "SELECT tablename FROM pg_tables WHERE tablename IN ('DocumentationCategory', 'DocumentationFeature');"
```

### Test 3: Provjeri backend health

```powershell
curl https://uslugar.oriph.io/api/health
```

**Ako ne radi:**
- Backend server nije pokrenut
- Problem nije specifično sa route-om

**Ako radi:**
- Backend radi, ali route ne postoji
- Provjeri da li je route deployan

---

## Najvjerojatniji uzrok:

**Tablice `DocumentationCategory` i `DocumentationFeature` možda ne postoje u produkcijskoj bazi!**

**Rješenje:**
1. Pokreni Prisma workflow za migracije
2. Pokreni seed za dokumentaciju
3. Testiraj endpoint ponovo


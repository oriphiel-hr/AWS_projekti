# 📜 LegalStatus - Pravni statusi pružatelja

## 🎯 Što je LegalStatus?

Nova tablica koja sadrži **6 predefiniranih pravnih statusa** za pružatelje usluga u Hrvatskoj.

---

## 📋 6 Pravnih statusa

### 1. **Fizička osoba** (`INDIVIDUAL`)
**Code:** `INDIVIDUAL`  
**ID:** `cls1_individual`

**Opis:**
- Privatna osoba bez registrirane djelatnosti
- Radi povremeno ili "na crno"
- **Nema** OIB poslovanja
- **Nema** zakonsku zaštitu

**Tko koristi:**
- Studenti
- Umirovljenici koji rade povremeno
- Hobisti

---

### 2. **Obrtnik** (`SOLE_TRADER`)
**Code:** `SOLE_TRADER`  
**ID:** `cls2_sole_trader`

**Opis:**
- Registrirani obrt
- Fizička osoba s OIB-om
- Najčešći oblik za male pružatelje
- Izdaje račune

**Tko koristi:**
- Vodoinstalateri
- Električari
- Soboslikari
- Mali poslovni ljudi

---

### 3. **Paušalni obrt** (`PAUSAL`)
**Code:** `PAUSAL`  
**ID:** `cls3_pausal`

**Opis:**
- Obrt s paušalnim oporezivanjem
- Fiksni porez (jednostavno)
- Do određenog godišnjeg prihoda
- Manje administracije

**Tko koristi:**
- Mali obrtnici
- Part-time pružatelji
- Start-up obrte

---

### 4. **d.o.o.** (`DOO`)
**Code:** `DOO`  
**ID:** `cls4_doo`

**Opis:**
- Društvo s ograničenom odgovornošću
- Pravna osoba (firma)
- Zaštita vlasnika
- Profesionalno poslovanje

**Tko koristi:**
- Firme
- Veći poslovni subjekti
- Tim stručnjaka

---

### 5. **j.d.o.o.** (`JDOO`)
**Code:** `JDOO`  
**ID:** `cls5_jdoo`

**Opis:**
- Jednostavno društvo s ograničenom odgovornošću
- Jedna osoba (vlasnik)
- Brže osnivanje od d.o.o.
- Niži troškovi

**Tko koristi:**
- Solo-preduzetnici
- Freelanceri koji žele pravnu zaštitu
- IT stručnjaci

---

### 6. **Samostalni djelatnik** (`FREELANCER`)
**Code:** `FREELANCER`  
**ID:** `cls6_freelancer`

**Opis:**
- Freelancer s paušalnim oporezivanjem
- Za kreativne djelatnosti
- Jednostavna registracija
- Paušalni porez

**Tko koristi:**
- Grafički dizajneri
- Web developeri
- Konzultanti
- Kreativci

---

## 🔗 Povezanost sa ProviderProfile

### **Schema:**
```prisma
model ProviderProfile {
  // ...
  legalStatus    LegalStatus?  @relation(fields: [legalStatusId], references: [id])
  legalStatusId  String?       // Pravni status (obrt, d.o.o., itd.)
  taxId          String?       // OIB (porezni broj)
  companyName    String?       // Naziv obrta/firme
  // ...
}
```

### **Primjer podataka:**
```json
{
  "userId": "cm123...",
  "bio": "Certificirani vodoinstalater",
  "legalStatusId": "cls2_sole_trader",
  "taxId": "12345678901",
  "companyName": "Vodoinstalater Marić obrt",
  "experience": 10
}
```

---

## 📊 Kako koristiti u Admin Panelu

### **Kreiranje LegalStatus-a** (već kreirani!)
6 statusa automatski kreirano u migraciji. Samo pregledaj:
```
Admin → LegalStatus → Vidi sve
```

### **Povezivanje sa Providerom:**

1. **Klikni na ProviderProfile**
2. **Edit** postojećeg providera
3. **Dodaj:**
   ```json
   {
     "legalStatusId": "cls2_sole_trader",
     "taxId": "12345678901",
     "companyName": "Ime obrta d.o.o."
   }
   ```
4. **Spremi**

---

## 🔍 Filtriranje po pravnom statusu

### **WHERE primjeri:**

```json
// Samo obrtnici
{
  "legalStatus": {
    "code": "SOLE_TRADER"
  }
}
```

```json
// Samo firme (d.o.o. ili j.d.o.o.)
{
  "legalStatus": {
    "code": {
      "in": ["DOO", "JDOO"]
    }
  }
}
```

```json
// Svi s OIB-om
{
  "taxId": {
    "not": null
  }
}
```

### **INCLUDE primjeri:**

```json
// ProviderProfile sa pravnim statusom
{
  "legalStatus": true
}
```

```json
// LegalStatus sa svim providerima
{
  "providers": true
}
```

---

## 💼 Primjeri realnih slučajeva

### **Vodoinstalater - Obrtnik**
```json
{
  "legalStatusId": "cls2_sole_trader",
  "taxId": "12345678901",
  "companyName": "Vodoinstalater Horvat obrt",
  "bio": "Ovlašteni vodoinstalater sa 15 godina iskustva"
}
```

### **IT Firma - d.o.o.**
```json
{
  "legalStatusId": "cls4_doo",
  "taxId": "98765432109",
  "companyName": "WebDev Solutions d.o.o.",
  "bio": "Web development agencija sa 20+ zaposlenih"
}
```

### **Grafički dizajner - Freelancer**
```json
{
  "legalStatusId": "cls6_freelancer",
  "taxId": "11122233344",
  "companyName": "Design Studio Marić",
  "bio": "Grafički dizajner, branding i web design"
}
```

### **Privatna osoba** (bez registracije)
```json
{
  "legalStatusId": null,
  "taxId": null,
  "companyName": null,
  "bio": "Student koji radi povremeno"
}
```

---

## 🎨 Frontend Prikaz (prijedlog)

### **Badge u UI:**
```jsx
{provider.legalStatus?.name && (
  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
    ✓ {provider.legalStatus.name}
  </span>
)}
```

**Rezultat:**
```
✓ Obrtnik    (zeleni badge)
✓ d.o.o.     (zeleni badge)
```

---

## 🔒 Validacija OIB-a (preporuka)

OIB u Hrvatskoj ima **11 cifara**.

### **Backend validacija:**
```javascript
if (taxId && !/^\d{11}$/.test(taxId)) {
  throw new Error('OIB mora imati točno 11 cifara')
}
```

---

## 📊 Statistike

### **Broj providera po statusu:**
```sql
SELECT 
  ls.name, 
  COUNT(pp.id) as provider_count
FROM "LegalStatus" ls
LEFT JOIN "ProviderProfile" pp ON pp."legalStatusId" = ls.id
GROUP BY ls.id, ls.name
ORDER BY provider_count DESC;
```

---

## ✅ Prednosti novog sistema

### **Za administratore:**
- ✅ Vide ko je legalno registriran
- ✅ Filtriranje po pravnom statusu
- ✅ Moderacija (blokiraj "na crno" radnike)

### **Za korisnike:**
- ✅ Znaju da li pružatelj može izdati račun
- ✅ Povećano povjerenje
- ✅ Zakonska zaštita

### **Za providere:**
- ✅ Badge za profesionalnost
- ✅ Konkurentska prednost
- ✅ Transparentnost

---

## 🚀 Sljedeći koraci

Nakon deploy-a možeš:

1. **Dodati providere u različite statuse**
2. **Filtrirati obrtinke vs firme**
3. **Prikazati badge na frontendu**
4. **Dodati OIB validaciju**
5. **Kreirati "Verificirani provideri" filter**

---

**LegalStatus tablica omogućava profesionalniju platformu sa jasnom distinkcijom između tipova pružatelja!** 🎯✨


# Auto-Verifikacija Implementacija - Plan

## 🎯 Što Treba Implementirati

### 1. Backend - Glavna Auto-Provjera Funkcija

```javascript
/**
 * Automatska provjera registara na osnovu pravnog statusa
 */
export async function autoVerifyLegalStatus(user, legalStatus, taxId, companyName) {
  const results = {
    verified: false,
    needsDocument: false,
    badges: [],
    errors: []
  };
  
  switch(legalStatus.code) {
    case 'DOO':
    case 'JDOO':
      // Provjeri Sudski registar
      const sudResult = await checkSudskiRegistar(taxId, companyName);
      if (sudResult.verified && sudResult.active) {
        results.verified = true;
        results.badges.push({ type: 'SUDSKI', verified: true });
      } else {
        results.needsDocument = true;
        results.errors.push('Sudski registar: Status nije potvrđen');
      }
      
      // Provjeri VIES ako postoji PDV ID
      if (user.pdvId) {
        const viesResult = await checkVIES(user.pdvId);
        if (viesResult.exists) {
          results.badges.push({ type: 'VIES', verified: true });
        }
      }
      break;
      
    case 'SOLE_TRADER':
    case 'PAUSAL':
      // Provjeri Obrtni registar
      const obrtResult = await checkObrtniRegistar(taxId, companyName);
      if (obrtResult.verified && obrtResult.active) {
        results.verified = true;
        results.badges.push({ type: 'OBRTNI', verified: true });
      } else {
        results.needsDocument = true;
        results.errors.push('Obrtni registar: Status nije potvrđen');
      }
      break;
      
    case 'FREELANCER':
      // Freelancer: odmah traži RPO dokument
      results.needsDocument = true;
      results.errors.push('Freelancer: Potrebno Rješenje Porezne uprave');
      break;
  }
  
  return results;
}
```

---

## 2. Backend - Anti-Fraud Provjere

```javascript
export async function detectFraudSignals(userId, ipAddress, registrationData) {
  // Provjeri da li isti IP radi više registracija
  const recentRegistrations = await prisma.user.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      // Mock - u stvarnosti bi provjerili IP
    }
  });
  
  if (recentRegistrations > 5) {
    return {
      isFraud: true,
      reason: 'Too many registrations from same IP',
      action: 'REQUIRE_DOCUMENT_IMMEDIATELY'
    };
  }
  
  // Provjeri irealističan broj kategorija
  if (registrationData.categoryIds?.length > 20) {
    return {
      isFraud: true,
      reason: 'Too many categories selected',
      action: 'REQUIRE_DOCUMENT_IMMEDIATELY'
    };
  }
  
  return { isFraud: false };
}
```

---

## 3. Frontend - Register Flow sa Auto-Provjerom

```jsx
// ProviderRegister.jsx

const [autoVerifying, setAutoVerifying] = useState(false);
const [verificationResult, setVerificationResult] = useState(null);

useEffect(() => {
  // Pokreni auto-provjeru kada korisnik unese OIB
  if (formData.taxId && formData.taxId.length === 11 && formData.legalStatusId) {
    autoVerify();
  }
}, [formData.taxId, formData.legalStatusId]);

const autoVerify = async () => {
  setAutoVerifying(true);
  
  try {
    const response = await api.post('/kyc/auto-verify', {
      taxId: formData.taxId,
      legalStatusId: formData.legalStatusId,
      companyName: formData.companyName
    });
    
    setVerificationResult(response.data);
    
    if (response.data.verified) {
      // Sve OK - prikaži badge
      setSuccess('✓ Verificiran u javnim registrima!');
    } else if (response.data.needsDocument) {
      // Prikaži upload sekciju
    }
  } catch (err) {
    setError('Greška pri provjeri registara');
  } finally {
    setAutoVerifying(false);
  }
};

// UI Render
return (
  <>
    {/* Auto-provjera status */}
    {autoVerifying && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          🔍 Brzo provjeravamo vaš OIB u javnim registrima. Obično traje nekoliko sekundi.
        </p>
      </div>
    )}
    
    {/* Rezultat provjere */}
    {verificationResult?.verified && (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-900 mb-2">
          ✓ Verificiran – {verificationResult.badges.map(b => b.type).join(', ')}
        </p>
        <p className="text-xs text-green-700">
          Potvrđeno u javnim registrima. Nije potreban dokument.
        </p>
      </div>
    )}
    
    {/* Dokument potreban */}
    {verificationResult?.needsDocument && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900 mb-2">
          ⚠️ Nismo mogli potvrditi podatke iz registra
        </p>
        <p className="text-xs text-yellow-700 mb-4">
          Učitajte službeni izvadak (PDF/screenshot) – prihvaćamo i fotografiju ekrana.
        </p>
        
        {/* Upload dokumenta */}
        <input type="file" accept=".pdf,.jpg,.png" />
      </div>
    )}
    
    {/* Freelancer poruka */}
    {formData.legalStatusId && 
     legalStatuses.find(s => s.id === formData.legalStatusId)?.code === 'FREELANCER' && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 mb-2">
          📄 Ako nemate obrt ni pravnu osobu, učitajte Rješenje Porezne uprave (RPO).
        </p>
        <p className="text-xs text-blue-700">
          Ovo nije javna objava; koristimo samo za provjeru.
        </p>
      </div>
    )}
  </>
);
```

---

## 4. Backend Endpoint

```javascript
// routes/kyc.js

r.post('/auto-verify', auth(true), async (req, res, next) => {
  try {
    const { taxId, legalStatusId, companyName } = req.body;
    
    // 1. Validiraj OIB
    if (!validateOIB(taxId)) {
      return res.status(400).json({
        verified: false,
        needsDocument: true,
        error: 'OIB nije validan'
      });
    }
    
    // 2. Anti-fraud provjere
    const fraudCheck = await detectFraudSignals(req.user.id, req.ip, req.body);
    if (fraudCheck.isFraud) {
      return res.json({
        verified: false,
        needsDocument: true,
        badges: [],
        fraudDetected: true,
        reason: fraudCheck.reason
      });
    }
    
    // 3. Auto-provjera registara
    const legalStatus = await prisma.legalStatus.findUnique({
      where: { id: legalStatusId }
    });
    
    const verificationResult = await autoVerifyLegalStatus(
      req.user,
      legalStatus,
      taxId,
      companyName
    );
    
    // 4. Ako je sve OK - automatski verificiran
    if (verificationResult.verified) {
      await prisma.providerProfile.update({
        where: { userId: req.user.id },
        data: {
          kycVerified: true,
          kycVerifiedAt: new Date(),
          kycAutoVerified: true,
          kycBadges: verificationResult.badges
        }
      });
    }
    
    res.json(verificationResult);
    
  } catch (err) {
    next(err);
  }
});
```

---

## 5. Admin Metrike

```javascript
// routes/admin.js

r.get('/kyc-metrics', auth(true, ['ADMIN']), async (req, res, next) => {
  try {
    const [
      totalRegistrations,
      autoVerified,
      manualVerified,
      verifiedByStatus,
      avgVerificationTime,
      invalidOIBDetected,
      documentUploaded,
      verifiedProviders
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'PROVIDER' } }),
      
      prisma.providerProfile.count({ where: { kycAutoVerified: true } }),
      
      prisma.providerProfile.count({ 
        where: { kycVerified: true, kycAutoVerified: false } 
      }),
      
      prisma.providerProfile.groupBy({
        by: ['legalStatusId'],
        where: { kycVerified: true },
        _count: true
      }),
      
      // Avg time from registration to verification
      prisma.$queryRaw`
        SELECT AVG(EXTRACT(EPOCH FROM ("kycVerifiedAt" - "createdAt")) / 60) as avg_minutes
        FROM "ProviderProfile" 
        WHERE "kycVerifiedAt" IS NOT NULL
      `,
      
      // Invalid OIB attempts
      prisma.$queryRaw`
        SELECT COUNT(*) as count FROM logs 
        WHERE message LIKE '%OIB nije validan%'
      `,
      
      prisma.providerProfile.count({ where: { kycDocumentUrl: { not: null } } }),
      
      prisma.providerProfile.count({ where: { kycVerified: true } })
    ]);
    
    res.json({
      conversionRate: (verifiedProviders / totalRegistrations) * 100,
      autoVerificationRate: (autoVerified / totalRegistrations) * 100,
      avgVerificationTime,
      verifiedByStatus,
      invalidOIBDetected,
      documentUploadRate: (documentUploaded / totalRegistrations) * 100
    });
    
  } catch (err) {
    next(err);
  }
});
```

---

## 6. UX Trikovi

### A. Ograničena Vidljivost

```javascript
// ProviderProfile.jsx

// Ako NIJE verificiran
if (!profile.kycVerified) {
  return (
    <div>
      <p className="text-yellow-600 font-bold">
        ⚠️ Vaš profil je ograničeno vidljiv (nije potpuno verificiran)
      </p>
      <p className="text-sm">
        Dovršite verifikaciju da biste dobili punu vidljivost i više poslova.
      </p>
    </div>
  );
}
```

### B. Badge s Datumom

```jsx
{provider.kycVerified && (
  <div className="flex items-center space-x-2">
    <span className="text-green-600">✓ Verificiran</span>
    <span className="text-xs text-gray-500">
      {new Date(profile.kycVerifiedAt).toLocaleDateString('hr-HR')}
    </span>
    {provider.kycBadges?.map(badge => (
      <span key={badge.type} className="badge">
        {badge.type}
      </span>
    ))}
  </div>
)}
```

---

## 📊 Što Treba Dodati u Schema

```prisma
model ProviderProfile {
  // ... existing fields ...
  
  kycAutoVerified Boolean? @default(false)  // Automatski verificiran
  kycBadges Json?                           // [{type: 'SUDSKI', verified: true}]
  kycVerificationErrors String[]            // Lista grešaka
  kycNeedsDocument Boolean @default(false)  // Da li treba dokument
  kycFraudDetected Boolean @default(false)   // Anti-fraud flag
}
```

---

## ✅ Status

- ✅ Plan kreiran
- ⏳ Backend auto-verify funkcija
- ⏳ Anti-fraud provjere
- ⏳ Frontend UI sa različitim porukama
- ⏳ Admin metrike
- ⏳ UX trikovi

**Sljedeći korak**: Implementirati glavnu `autoVerifyLegalStatus` funkciju i ažurirati frontend registraciju.


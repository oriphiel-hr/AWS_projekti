# Konfiguracija Fiskalizacije - ZKI i JIR

## Podaci tvrtke

Postavite sljedeće environment varijable za fiskalizaciju faktura:

```env
# Omogući/onemogući fiskalizaciju
FISCALIZATION_ENABLED=true

# eRačun API konfiguracija (Porezna uprava)
ERACUN_API_URL=https://cistest.apis.hr/api/v1/fiscalization
ERACUN_API_KEY=your_api_key_here
ERACUN_CERT_PATH=/path/to/certificate.pem  # Opcionalno

# Podaci tvrtke
COMPANY_OIB=88070789896  # OIB tvrtke koja izdaje fakture
COMPANY_NAME=ORIPHIEL d.o.o.
COMPANY_ADDRESS=Slavenskoga ulica 5, 10000 Zagreb
COMPANY_DIRECTOR=Tomislav Kranjec
```

## Napomene

- **Fiskalizacija je OBAVEZNA samo za gotovinske transakcije**
- **Stripe plaćanja (kartice) = bezgotovinske = NIJE obavezna fiskalizacija**
- Za produkciju je potrebno dobiti API pristup od Porezne uprave
- Test okruženje: `https://cistest.apis.hr/api/v1/fiscalization`
- Produkcija: `https://cis.porezna-uprava.hr/api/v1/fiscalization`

## Podaci koji se prikazuju na fakturi

Na svakoj fakturi se prikazuje:
- **Naziv tvrtke**: ORIPHIEL d.o.o.
- **OIB**: 88070789896
- **Adresa**: Slavenskoga ulica 5, 10000 Zagreb
- **Direktor**: Tomislav Kranjec


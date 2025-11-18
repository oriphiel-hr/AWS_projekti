# Workaround za Prisma CDN Problem

Ako Prisma CDN vraća 500 greške tijekom Docker build-a, koristite ovaj workaround:

## Opcija 1: Generiraj Prisma Client lokalno prije build-a

```bash
cd uslugar/backend

# Generiraj Prisma Client lokalno
npx prisma generate

# Zatim pokreni Docker build
docker build -f Dockerfile.prisma .
```

## Opcija 2: Koristi lokalni cache

Ako imate lokalno generirani Prisma Client, možete ga kopirati u Docker image:

```dockerfile
# U Dockerfile-u, prije COPY prisma, kopiraj lokalno generirani Prisma Client
COPY node_modules/.prisma ./node_modules/.prisma
COPY node_modules/@prisma ./node_modules/@prisma
```

## Opcija 3: Pričekaj da Prisma CDN bude dostupan

Prisma CDN problemi su obično privremeni. Pokušajte ponovno za nekoliko sati.

## Opcija 4: Koristi alternativni mirror (ako postoji)

```bash
export PRISMA_ENGINES_MIRROR=https://alternative-mirror.com
docker build -f Dockerfile.prisma .
```

## Provjeri Prisma Status

Provjerite Prisma status na: https://www.prisma.io/status


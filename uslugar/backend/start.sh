#!/bin/sh
set -e

echo "🔧 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"

echo "🔄 Running database migrations..."
LC_ALL=C.UTF-8 npx prisma migrate deploy > /tmp/migrate.log 2>&1 || cat /tmp/migrate.log
echo "✅ Migrations complete."

echo "🚀 Starting server..."
exec node src/server.js


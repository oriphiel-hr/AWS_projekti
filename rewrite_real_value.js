
const fs = require('fs');
const path = 'uslugar/backend/prisma/seeds/seed-documentation.js';
let text = fs.readFileSync(path, 'utf8');
const startMarker = '    "Proporcionalna naplata (REAL_VALUE)": {';
const endMarker = '    "Feature ownership (funkcionalnosti ne nestaju)": {';
const start = text.indexOf(startMarker);
if (start === -1) throw new Error('start marker not found');
const end = text.indexOf(endMarker, start);
if (end === -1) throw new Error('end marker not found');
const lines = [

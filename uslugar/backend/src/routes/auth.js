import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword, signToken } from '../lib/auth.js';

const r = Router();

r.post('/register', async (req, res, next) => {
  try {
    const { email, password, fullName, role = 'USER', phone, city } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ error: 'Missing fields' });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email already in use' });
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash, fullName, role, phone, city } });
    if (role === 'PROVIDER') {
      await prisma.providerProfile.create({ data: { userId: user.id, bio: '', serviceArea: city || '' } });
    }
    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.fullName });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } });
  } catch (e) { next(e); }
});

r.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.fullName });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } });
  } catch (e) { next(e); }
});

export default r;
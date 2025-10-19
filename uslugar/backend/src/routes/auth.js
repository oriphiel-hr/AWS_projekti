import { Router } from 'express';
import { randomBytes } from 'crypto';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword, signToken } from '../lib/auth.js';
import { sendVerificationEmail } from '../lib/email.js';

const r = Router();

r.post('/register', async (req, res, next) => {
  try {
    const { email, password, fullName, role = 'USER', phone, city, legalStatusId, taxId, companyName } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ error: 'Missing fields' });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email already in use' });
    
    const passwordHash = await hashPassword(password);
    
    // Generiraj verification token (32 byte random hex)
    const verificationToken = randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    
    const userData = {
      email,
      passwordHash,
      fullName,
      role,
      phone,
      city,
      verificationToken,
      tokenExpiresAt,
      legalStatusId,
      taxId,
      companyName
    };
    
    const user = await prisma.user.create({ data: userData });
    
    if (role === 'PROVIDER') {
      await prisma.providerProfile.create({ data: { userId: user.id, bio: '', serviceArea: city || '' } });
    }
    
    // Pošalji verification email - OBAVEZNO
    try {
      await sendVerificationEmail(email, fullName, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      
      // Izbriši user-a ako email nije poslan (rollback)
      await prisma.user.delete({ where: { id: user.id } });
      
      return res.status(500).json({ 
        error: 'Greška pri slanju verifikacijskog email-a. Pokušajte ponovno.',
        details: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
    
    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.fullName });
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName, isVerified: user.isVerified },
      message: 'Registracija uspješna! Provjerite email za aktivacijski link.'
    });
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
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName, isVerified: user.isVerified } });
  } catch (e) { next(e); }
});

r.get('/verify', async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Missing verification token' });
    
    const user = await prisma.user.findUnique({ where: { verificationToken: token } });
    if (!user) return res.status(404).json({ error: 'Invalid or expired token' });
    
    // Provjeri da li je token istekao
    if (user.tokenExpiresAt && new Date() > user.tokenExpiresAt) {
      return res.status(410).json({ error: 'Verification link has expired' });
    }
    
    // Ako je već verificiran
    if (user.isVerified) {
      return res.json({ message: 'Email already verified', user: { email: user.email, isVerified: true } });
    }
    
    // Verificiraj korisnika
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null, // Clear token nakon verifikacije
        tokenExpiresAt: null
      }
    });
    
    res.json({ 
      message: 'Email successfully verified!',
      user: { email: user.email, fullName: user.fullName, isVerified: true }
    });
  } catch (e) { next(e); }
});

r.post('/resend-verification', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'Email already verified' });
    
    // Generiraj novi token
    const verificationToken = randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken, tokenExpiresAt }
    });
    
    await sendVerificationEmail(email, user.fullName, verificationToken);
    
    res.json({ message: 'Verification email resent' });
  } catch (e) { next(e); }
});

export default r;
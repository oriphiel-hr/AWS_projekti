import { Router } from 'express';
import { randomBytes } from 'crypto';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword, signToken } from '../lib/auth.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../lib/email.js';
import { deleteUserWithRelations } from '../lib/delete-helpers.js';

const r = Router();

r.post('/register', async (req, res, next) => {
  try {
    const { email, password, fullName, role = 'USER', phone, city, legalStatusId, taxId, companyName } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ error: 'Missing fields' });
    
    // VALIDACIJA: PROVIDER pravni status (opciono za sada - FAZA 1)
    // TODO: Enable strict validation nakon što frontend implementira UI
    if (role === 'PROVIDER' && legalStatusId) {
      // Samo provjeri da li legal status postoji AKO je poslan
      const legalStatus = await prisma.legalStatus.findUnique({ where: { id: legalStatusId } });
      if (!legalStatus || !legalStatus.isActive) {
        return res.status(400).json({ 
          error: 'Nevažeći pravni status',
          message: 'Odabrani pravni status ne postoji ili nije aktivan.'
        });
      }
    }
    
    // Log warning ako PROVIDER nema legal status (za monitoring)
    if (role === 'PROVIDER' && !legalStatusId) {
      console.warn('[WARNING] PROVIDER registered without legal status:', email);
    }
    
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
      await prisma.providerProfile.create({ 
        data: { 
          userId: user.id, 
          bio: '', 
          serviceArea: city || '',
          legalStatusId,
          taxId,
          companyName
        } 
      });
    }
    
    // Pošalji verification email - OBAVEZNO
    try {
      await sendVerificationEmail(email, fullName, verificationToken);
      console.log('[OK] Verification email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      console.error('Email error details:', emailError.message);
      
      // Izbriši user-a ako email nije poslan (rollback)
      // Koristimo helper jer može imati ProviderProfile
      await deleteUserWithRelations(user.id);
      
      return res.status(500).json({ 
        error: 'Greška pri slanju verifikacijskog email-a. Pokušajte ponovno.',
        details: process.env.NODE_ENV === 'development' ? emailError.message : 'SMTP configuration error'
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

r.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    const user = await prisma.user.findUnique({ where: { email } });
    
    // Security: Uvijek vrati success, čak i ako user ne postoji
    // Ovo sprječava da napadač zna koji email-ovi postoje u sustavu
    if (!user) {
      console.log('Forgot password attempt for non-existent email:', email);
      return res.json({ message: 'If that email exists, a password reset link has been sent.' });
    }
    
    // Generiraj reset token (32 byte random hex)
    const resetPasswordToken = randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
    
    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken, resetPasswordExpires }
    });
    
    try {
      await sendPasswordResetEmail(email, user.fullName, resetPasswordToken);
      console.log('[OK] Password reset email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return res.status(500).json({ 
        error: 'Greška pri slanju email-a. Pokušajte ponovno.',
        details: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
    
    res.json({ message: 'If that email exists, a password reset link has been sent.' });
  } catch (e) { next(e); }
});

r.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const user = await prisma.user.findUnique({ where: { resetPasswordToken: token } });
    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired reset token' });
    }
    
    // Provjeri da li je token istekao
    if (user.resetPasswordExpires && new Date() > user.resetPasswordExpires) {
      return res.status(410).json({ error: 'Reset link has expired. Please request a new one.' });
    }
    
    // Hash novu lozinku
    const passwordHash = await hashPassword(newPassword);
    
    //Updateaj lozinku i clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });
    
    console.log('[OK] Password reset successful for:', user.email);
    
    res.json({ 
      message: 'Password successfully reset! You can now login with your new password.',
      user: { email: user.email, fullName: user.fullName }
    });
  } catch (e) { next(e); }
});

// Upgrade USER to PROVIDER
r.post('/upgrade-to-provider', async (req, res, next) => {
  try {
    const { email, password, legalStatusId, taxId, companyName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // VALIDACIJA: Pravni status (opciono za sada - FAZA 1)
    // TODO: Enable strict validation nakon što frontend implementira UI
    if (legalStatusId) {
      // Samo provjeri da li legal status postoji AKO je poslan
      const legalStatus = await prisma.legalStatus.findUnique({ where: { id: legalStatusId } });
      if (!legalStatus || !legalStatus.isActive) {
        return res.status(400).json({ 
          error: 'Nevažeći pravni status',
          message: 'Odabrani pravni status ne postoji ili nije aktivan.'
        });
      }
    }
    
    // Log warning ako nema legal status (za monitoring)
    if (!legalStatusId) {
      console.warn('[WARNING] User upgrading to PROVIDER without legal status:', email);
    }
    
    // Verify user credentials
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if already a provider
    if (user.role === 'PROVIDER') {
      return res.status(400).json({ error: 'Already a provider' });
    }
    
    // Upgrade to PROVIDER and add legal info
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        role: 'PROVIDER',
        legalStatusId,
        taxId,
        companyName
      }
    });
    
    // Create ProviderProfile if it doesn't exist
    const existingProfile = await prisma.providerProfile.findUnique({ 
      where: { userId: user.id } 
    });
    
    if (!existingProfile) {
      await prisma.providerProfile.create({
        data: {
          userId: user.id,
          bio: '',
          serviceArea: user.city || '',
          legalStatusId,
          taxId,
          companyName
        }
      });
    }
    
    console.log('[OK] User upgraded to PROVIDER:', user.email);
    
    // Generate new token with updated role
    const token = signToken({ 
      id: updatedUser.id, 
      email: updatedUser.email, 
      role: updatedUser.role, 
      name: updatedUser.fullName 
    });
    
    res.json({ 
      message: 'Successfully upgraded to provider!',
      token,
      user: { 
        id: updatedUser.id, 
        email: updatedUser.email, 
        role: updatedUser.role, 
        fullName: updatedUser.fullName, 
        isVerified: updatedUser.isVerified 
      }
    });
  } catch (e) { next(e); }
});

export default r;
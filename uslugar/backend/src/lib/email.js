import nodemailer from 'nodemailer';

// Kreiraj transporter (koristimo Hostinger SMTP)
// U produkciji koristite profesionalni SMTP servis (SendGrid, AWS SES, itd.)
const createTransporter = () => {
  if (!process.env.SMTP_USER) {
    console.warn('SMTP not configured - email notifications disabled');
    return null;
  }
  
  const port = parseInt(process.env.SMTP_PORT || '587');
  const isSSL = port === 465;
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: port,
    secure: isSSL, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const transporter = createTransporter();

// Template funkcije za različite tipove emailova
export const sendJobNotification = async (toEmail, jobTitle, jobUrl) => {
  if (!transporter) {
    console.log('SMTP not configured, skipping email:', toEmail, jobTitle);
    return; // Skip if not configured
  }

  try {
    await transporter.sendMail({
      from: `"Uslugar" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Novi posao: ${jobTitle}`,
      html: `
        <h2>Novi posao u vašoj kategoriji!</h2>
        <p><strong>${jobTitle}</strong></p>
        <p>Netko traži uslugu u vašoj kategoriji. Prijavite se i pošaljite ponudu!</p>
        <a href="${jobUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Pogledaj posao</a>
      `
    });
    console.log('Email sent to:', toEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendOfferNotification = async (toEmail, jobTitle, providerName, offerAmount) => {
  if (!transporter) {
    console.log('SMTP not configured, skipping email:', toEmail);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Uslugar" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Nova ponuda za: ${jobTitle}`,
      html: `
        <h2>Primili ste novu ponudu!</h2>
        <p><strong>${providerName}</strong> je poslao ponudu za vaš posao: <strong>${jobTitle}</strong></p>
        <p>Cijena: <strong>${offerAmount} EUR</strong></p>
        <p>Prijavite se da pregledate ponudu i odaberete izvođača.</p>
      `
    });
    console.log('Offer notification sent to:', toEmail);
  } catch (error) {
    console.error('Error sending offer notification:', error);
  }
};

export const sendOfferAcceptedNotification = async (toEmail, jobTitle, customerName) => {
  if (!transporter) {
    console.log('SMTP not configured, skipping email:', toEmail);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Uslugar" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Ponuda prihvaćena: ${jobTitle}`,
      html: `
        <h2>Vaša ponuda je prihvaćena!</h2>
        <p><strong>${customerName}</strong> je prihvatio vašu ponudu za posao: <strong>${jobTitle}</strong></p>
        <p>Kontaktirajte korisnika i dogovorite detalje izvršenja posla.</p>
      `
    });
    console.log('Acceptance notification sent to:', toEmail);
  } catch (error) {
    console.error('Error sending acceptance notification:', error);
  }
};

export const sendReviewNotification = async (toEmail, rating, comment, reviewerName) => {
  if (!transporter) {
    console.log('SMTP not configured, skipping email:', toEmail);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Uslugar" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Primili ste novu recenziju',
      html: `
        <h2>Nova recenzija!</h2>
        <p><strong>${reviewerName}</strong> vam je ostavio recenziju.</p>
        <p>Ocjena: ${'⭐'.repeat(rating)}</p>
        ${comment ? `<p>Komentar: "${comment}"</p>` : ''}
        <p>Prijavite se da vidite više detalja.</p>
      `
    });
    console.log('Review notification sent to:', toEmail);
  } catch (error) {
    console.error('Error sending review notification:', error);
  }
};

export const sendVerificationEmail = async (toEmail, fullName, verificationToken) => {
  if (!transporter) {
    const error = new Error('SMTP nije konfiguriran. Email verifikacija zahtijeva SMTP postavke.');
    console.error('SMTP not configured - cannot send verification email to:', toEmail);
    throw error;
  }

  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/#verify?token=${verificationToken}`;

  try {
    await transporter.sendMail({
      from: `"Uslugar" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Potvrdite vašu email adresu - Uslugar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h1 style="color: #333; margin-bottom: 20px;">Dobrodošli na Uslugar!</h1>
            
            <p style="font-size: 16px; color: #555;">Poštovani/a <strong>${fullName}</strong>,</p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Hvala što ste se registrirali na Uslugar platformu! 
              Da biste aktivirali svoj račun, molimo potvrdite vašu email adresu klikom na button ispod.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #4CAF50; 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-size: 18px;
                        font-weight: bold;
                        display: inline-block;">
                Potvrdi email adresu
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              Ako button ne radi, kopirajte i zalijepite sljedeći link u vaš browser:
            </p>
            <p style="font-size: 12px; color: #0066cc; word-break: break-all;">
              ${verificationUrl}
            </p>
            
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              <strong>Link istječe za 24 sata.</strong>
            </p>
            
            <p style="font-size: 14px; color: #888; margin-top: 20px;">
              Ako niste zatražili registraciju, ignorirajte ovu poruku.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              Uslugar - Platforma za pronalaženje lokalnih pružatelja usluga
            </p>
          </div>
        </body>
        </html>
      `
    });
    console.log('[OK] Verification email sent to:', toEmail);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error; // Throw da register endpoint zna da je email failed
  }
};

export const sendPasswordResetEmail = async (toEmail, fullName, resetToken) => {
  if (!transporter) {
    const error = new Error('SMTP nije konfiguriran. Password reset zahtijeva SMTP postavke.');
    console.error('SMTP not configured - cannot send password reset email to:', toEmail);
    throw error;
  }

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/#reset-password?token=${resetToken}`;

  try {
    await transporter.sendMail({
      from: `"Uslugar" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Resetirajte vašu lozinku - Uslugar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h1 style="color: #333; margin-bottom: 20px;">Resetiranje lozinke</h1>
            
            <p style="font-size: 16px; color: #555;">Poštovani/a <strong>${fullName}</strong>,</p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Zaprimili smo zahtjev za resetiranje vaše lozinke. 
              Kliknite na button ispod da postavite novu lozinku.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #2563EB; 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-size: 18px;
                        font-weight: bold;
                        display: inline-block;">
                Resetiraj lozinku
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              Ako button ne radi, kopirajte i zalijepite sljedeći link u vaš browser:
            </p>
            <p style="font-size: 12px; color: #0066cc; word-break: break-all;">
              ${resetUrl}
            </p>
            
            <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 30px 0; border-radius: 5px;">
              <p style="font-size: 14px; color: #92400E; margin: 0;">
                <strong>Važno:</strong> Link istječe za 1 sat.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #888; margin-top: 20px;">
              Ako niste zatražili resetiranje lozinke, ignorirajte ovu poruku. 
              Vaša lozinka ostaje nepromijenjena.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              Uslugar - Platforma za pronalaženje lokalnih pružatelja usluga
            </p>
          </div>
        </body>
        </html>
      `
    });
    console.log('[OK] Password reset email sent to:', toEmail);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendAnonymousJobConfirmationEmail = async (toEmail, contactName, jobTitle, jobId) => {
  if (!transporter) {
    console.log('SMTP not configured, skipping anonymous job confirmation email:', toEmail);
    return;
  }

  // Create a unique token for linking the job to an account after registration
  const crypto = await import('crypto');
  const linkingToken = crypto.randomBytes(32).toString('hex');
  
  // Store the linking token temporarily (in production, use Redis or similar)
  // For now, we'll include it in the email and verify it during registration
  
  const registerUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/#register?linkJob=${jobId}&token=${linkingToken}`;

  try {
    await transporter.sendMail({
      from: `"Uslugar" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Hvala na upitu - Uslugar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h1 style="color: #333; margin-bottom: 20px;">Hvala na upitu! 👋</h1>
            
            <p style="font-size: 16px; color: #555;">Poštovani/a <strong>${contactName}</strong>,</p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Vaš upit za <strong>${jobTitle}</strong> je uspješno kreiran! 🎉
            </p>
            
            <div style="background-color: #E0F2FE; border-left: 4px solid #0EA5E9; padding: 20px; margin: 30px 0; border-radius: 5px;">
              <p style="font-size: 15px; color: #0369A1; margin: 0;">
                <strong>🗣️ Pružatelji usluga su sada u mogućnosti vidjeti vaš upit i poslati vam ponude!</strong>
              </p>
            </div>
            
            <h2 style="color: #333; margin-top: 30px; margin-bottom: 15px; font-size: 20px;">
              Što dalje?
            </h2>
            
            <ul style="font-size: 16px; color: #555; line-height: 1.8;">
              <li>Pružatelji usluga će vidjeti vaš upit i moći će vam poslati ponude</li>
              <li>Primit ćete notifikacije o novim ponudama na email <strong>${toEmail}</strong></li>
              <li>Možete pregledati i usporediti ponude dok ne odaberete najbolju</li>
            </ul>
            
            <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 30px 0; border-radius: 5px;">
              <p style="font-size: 15px; color: #92400E; margin: 0;">
                <strong>💡 Prijava na Uslugar:</strong> Prijavite se za lakše upravljanje upitima i pregled ponuda!
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${registerUrl}" 
                 style="background-color: #4CAF50; 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-size: 18px;
                        font-weight: bold;
                        display: inline-block;">
                Registriraj se i poveži upit
              </a>
            </div>
            
            <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
              Prijavom ćete moći upravljati svojim upitima i brže odgovarati na ponude.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #888; margin-top: 20px;">
              Ako imate pitanja, slobodno nam se obratite.
            </p>
            
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
              Uslugar - Platforma za pronalaženje lokalnih pružatelja usluga<br>
              © ${new Date().getFullYear()} Uslugar. Sva prava pridržana.
            </p>
          </div>
        </body>
        </html>
      `
    });
    console.log('[OK] Anonymous job confirmation email sent to:', toEmail);
    
    // Return the linking token for storage
    return linkingToken;
  } catch (error) {
    console.error('Error sending anonymous job confirmation email:', error);
    return null;
  }
};

export { transporter, createTransporter };
export default { transporter, createTransporter };


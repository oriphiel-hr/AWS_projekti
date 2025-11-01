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

export const sendInvoiceEmail = async (toEmail, fullName, invoice, pdfBuffer) => {
  if (!transporter) {
    console.log('SMTP not configured, skipping invoice email:', toEmail);
    return;
  }

  try {
    const invoiceAmount = (invoice.totalAmount / 100).toFixed(2);
    const invoiceUrl = `${process.env.FRONTEND_URL || 'https://uslugar.oriph.io'}#invoices/${invoice.id}`;

    await transporter.sendMail({
      from: `"Uslugar" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Faktura ${invoice.invoiceNumber} - Uslugar`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="color: white; margin: 0;">USLUGAR</h1>
          </div>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px;">
            <h2 style="color: #333; margin-top: 0;">Faktura je generirana</h2>
            <p>Poštovani/na <strong>${fullName}</strong>,</p>
            <p>Vaša faktura <strong>${invoice.invoiceNumber}</strong> je generirana i priložena u ovom emailu.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
              <p style="margin: 5px 0;"><strong>Broj fakture:</strong> ${invoice.invoiceNumber}</p>
              <p style="margin: 5px 0;"><strong>Datum izdavanja:</strong> ${new Date(invoice.issueDate).toLocaleDateString('hr-HR')}</p>
              <p style="margin: 5px 0;"><strong>Rok plaćanja:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('hr-HR') : 'N/A'}</p>
              <p style="margin: 5px 0;"><strong>Iznos:</strong> ${invoiceAmount} €</p>
            </div>

            <p>Fakturu možete preuzeti u PDF formatu klikom na link ispod ili priloženu datoteku.</p>
            <a href="${invoiceUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Pregledaj fakturu</a>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Hvala vam na povjerenju!<br>
              Uslugar tim
            </p>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Faktura-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });
    console.log('Invoice email sent to:', toEmail);
  } catch (error) {
    console.error('Error sending invoice email:', error);
    throw error;
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

/**
 * Pošalji fakturu emailom s PDF attachmentom
 */
export const sendInvoiceEmail = async (toEmail, fullName, invoice, pdfBuffer) => {
  if (!transporter) {
    console.log('SMTP not configured, skipping invoice email:', toEmail);
    return;
  }

  const invoiceUrl = `${process.env.FRONTEND_URL || 'https://uslugar.oriph.io'}#invoices/${invoice.id}`;
  const formattedAmount = (invoice.totalAmount / 100).toFixed(2);

  try {
    await transporter.sendMail({
      from: `"Uslugar" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Faktura ${invoice.invoiceNumber} - Uslugar`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #4CAF50; margin-top: 0;">Faktura ${invoice.invoiceNumber}</h2>
            <p>Poštovani/na ${fullName},</p>
            <p>U privitku vam šaljemo fakturu za vašu transakciju.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Broj fakture:</strong> ${invoice.invoiceNumber}</p>
              <p style="margin: 5px 0;"><strong>Datum izdavanja:</strong> ${new Date(invoice.issueDate).toLocaleDateString('hr-HR')}</p>
              <p style="margin: 5px 0;"><strong>Rok plaćanja:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('hr-HR') : 'N/A'}</p>
              <p style="margin: 5px 0;"><strong>Ukupan iznos:</strong> <strong style="color: #4CAF50; font-size: 18px;">${formattedAmount} €</strong></p>
            </div>
            <p>Faktura je u privitku u PDF formatu. Možete je preuzeti i s vašeg profila:</p>
            <a href="${invoiceUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              Pregledaj fakture
            </a>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Hvala vam na povjerenju!<br>
              Uslugar tim
            </p>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `faktura-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });
    console.log(`Invoice email sent to: ${toEmail} for invoice ${invoice.invoiceNumber}`);
  } catch (error) {
    console.error('Error sending invoice email:', error);
    throw error;
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

// Get plan-specific features
const getPlanFeatures = (planName) => {
  const features = {
    'BASIC': [
      '10 ekskluzivnih leadova mjesečno',
      'Pregled leadova bez konkurencije',
      'Kontakt direktno klijenta',
      'Email notifikacije za nove leadove'
    ],
    'PREMIUM': [
      '25 ekskluzivnih leadova mjesečno',
      'Pregled leadova bez konkurencije',
      'Kontakt direktno klijenta',
      'AI-kvaliteta leadova',
      'ROI statistika'
    ],
    'PRO': [
      '50 ekskluzivnih leadova mjesečno',
      'Pregled leadova bez konkurencije',
      'Kontakt direktno klijenta',
      'AI-kvaliteta leadova',
      'ROI statistika',
      'Prioritetni support'
    ]
  };
  
  return features[planName] || features['BASIC'];
};

export const sendPaymentConfirmationEmail = async (toEmail, fullName, planName, amount, credits) => {
  if (!transporter) {
    console.log('SMTP not configured, skipping payment confirmation email:', toEmail);
    return;
  }

  const features = getPlanFeatures(planName);

  try {
    await transporter.sendMail({
      from: `"Uslugar" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Potvrda plaćanja - ${planName} pretplata`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4CAF50; font-size: 32px; margin: 0;">🎉 Hvala vam!</h1>
            </div>
            
            <p style="font-size: 16px; color: #555;">Poštovani/a <strong>${fullName}</strong>,</p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Vaša pretplata na <strong>${planName}</strong> je uspješno aktivirana! 🎉
            </p>
            
            <div style="background-color: #E8F5E9; border-left: 4px solid #4CAF50; padding: 20px; margin: 30px 0; border-radius: 5px;">
              <h2 style="color: #2E7D32; font-size: 24px; margin: 0 0 15px 0;">Detalji pretplate:</h2>
              <p style="font-size: 16px; color: #555; margin: 10px 0;">
                <strong>Plan:</strong> ${planName}
              </p>
              <p style="font-size: 16px; color: #555; margin: 10px 0;">
                <strong>Cijena:</strong> ${amount}€
              </p>
              <p style="font-size: 16px; color: #555; margin: 10px 0;">
                <strong>Krediti:</strong> ${credits}
              </p>
            </div>
            
            <div style="background-color: #FFF3CD; border-left: 4px solid #FFC107; padding: 20px; margin: 30px 0; border-radius: 5px;">
              <p style="font-size: 15px; color: #856404; margin: 0;">
                <strong>💡 Sada možete:</strong><br>
                ${features.map(f => `• ${f}`).join('<br>')}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://uslugar.oriph.io/#leads" 
                 style="background-color: #4CAF50; 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-size: 18px;
                        font-weight: bold;
                        display: inline-block;">
                Pregledaj leadove →
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #888; margin-top: 20px;">
              Ako imate pitanja ili trebate pomoć, slobodno nam se obratite.
            </p>
            
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
              Uslugar - Ekskluzivni leadovi bez konkurencije<br>
              © ${new Date().getFullYear()} Uslugar. Sva prava pridržana.
            </p>
          </div>
        </body>
        </html>
      `
    });
    console.log('[OK] Payment confirmation email sent to:', toEmail);
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
  }
};

export { transporter, createTransporter };
export default { transporter, createTransporter };


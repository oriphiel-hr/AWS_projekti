import nodemailer from 'nodemailer';

// Kreiraj transporter (koristimo Gmail kao primjer)
// U produkciji koristite profesionalni SMTP servis (SendGrid, AWS SES, itd.)
const createTransporter = () => {
  if (!process.env.SMTP_USER) {
    console.warn('SMTP not configured - email notifications disabled');
    return null;
  }
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
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

export { transporter, createTransporter };
export default { transporter, createTransporter };


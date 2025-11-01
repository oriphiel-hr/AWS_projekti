// SMS Notification Service - USLUGAR EXCLUSIVE
// Twilio Integration Ready

/**
 * SMS Service - Twilio Integration
 * 
 * Setup:
 * 1. Install Twilio: npm install twilio
 * 2. Add to .env:
 *    TWILIO_ACCOUNT_SID=your_account_sid
 *    TWILIO_AUTH_TOKEN=your_auth_token
 *    TWILIO_PHONE_NUMBER=+1234567890
 * 3. Uncomment Twilio integration code below
 */

import dotenv from 'dotenv';
dotenv.config();

/**
 * Pošalji SMS notifikaciju
 * @param {String} phone - Broj telefona (format: +385901234567)
 * @param {String} message - Poruka
 * @returns {Object} - Rezultat slanja
 */
export async function sendSMS(phone, message) {
  try {
    // Provjeri Twilio konfiguraciju
    const hasTwilioConfig = process.env.TWILIO_ACCOUNT_SID && 
                           process.env.TWILIO_AUTH_TOKEN && 
                           process.env.TWILIO_PHONE_NUMBER;
    
    
    // Twilio integration
    if (hasTwilioConfig) {
      try {
        const twilio = (await import('twilio')).default;
        const client = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
        
        
        const result = await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        });
        
        return { success: true, sid: result.sid, mode: 'twilio', status: result.status };
      } catch (twilioError) {
        console.error('❌ Twilio SMS error:', twilioError);
        console.error('   Error code:', twilioError.code);
        console.error('   Error message:', twilioError.message);
        console.error('   Full error:', JSON.stringify(twilioError, null, 2));
        
        // Ako je Twilio trial i broj nije verificiran
        if (twilioError.code === 21608 || twilioError.message?.includes('verified')) {
          console.warn('⚠️ Twilio trial: Broj mora biti verificiran u Twilio konzoli');
          console.warn('   Dodajte broj na: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
          // Fallback na simulation mode
          return { 
            success: false, 
            error: twilioError.message,
            code: twilioError.code,
            sid: 'sm_error_' + Date.now(),
            mode: 'simulation',
            needsVerification: true
          };
        }
        
        // Za sve ostale Twilio greške, također logiraj detaljno
        console.error(`📱 [SMS FAILED - Twilio error] To: ${phone}`);
        console.error(`   Error: ${twilioError.message} (Code: ${twilioError.code})`);
        
        // Ne baci grešku, nego vrati error response
        return {
          success: false,
          error: twilioError.message,
          code: twilioError.code,
          sid: 'sm_error_' + Date.now(),
          mode: 'twilio_error'
        };
      }
    }
    
    // Simulation mode (for development when Twilio not configured)
    
    return { 
      success: true, 
      sid: 'sm_simulation_' + Date.now(),
      mode: 'simulation'
    };
    
  } catch (error) {
    console.error('❌ SMS error:', error);
    throw new Error('Failed to send SMS: ' + error.message);
  }
}

/**
 * Pošalji SMS kod za verifikaciju
 * @param {String} phone - Broj telefona
 * @param {String} code - 6-znamenkasti kod
 */
export async function sendVerificationCode(phone, code) {
  const message = `Vaš Uslugar kod: ${code}\n\nKod važi 10 minuta. Nemojte dijeliti taj kod.`;
  return await sendSMS(phone, message);
}

/**
 * Obavijest o novom leadu
 * @param {String} phone - Broj telefona
 * @param {String} leadTitle - Naziv leada
 * @param {Number} leadPrice - Cijena leada
 */
export async function notifyNewLeadAvailable(phone, leadTitle, leadPrice) {
  const message = `🎯 Novi ekskluzivni lead dostupan!\n\n${leadTitle}\nCijena: ${leadPrice} kredita\n\nImate 24h da odgovorite.\n\nUslugar`;
  return await sendSMS(phone, message);
}

/**
 * Obavijest o kupnji leada
 * @param {String} phone - Broj telefona
 * @param {String} leadTitle - Naziv leada
 */
export async function notifyLeadPurchased(phone, leadTitle) {
  const message = `✅ Lead uspješno kupljen!\n\n${leadTitle}\n\nKontaktirajte klijenta u roku od 24h.\n\nUslugar`;
  return await sendSMS(phone, message);
}

/**
 * Obavijest o refundaciji
 * @param {String} phone - Broj telefona
 * @param {Number} creditsRefunded - Broj vraćenih kredita
 */
export async function notifyRefund(phone, creditsRefunded) {
  const message = `💰 Refund uspješan!\n\n${creditsRefunded} kredita vraćeno na vaš račun.\n\nUslugar`;
  return await sendSMS(phone, message);
}

/**
 * Urgentna obavijest (VIP podrška)
 * @param {String} phone - Broj telefona
 * @param {String} title - Naslov
 * @param {String} body - Sadržaj
 */
export async function sendUrgentNotification(phone, title, body) {
  const message = `🚨 URGENT\n\n${title}\n\n${body}\n\nUslugar VIP Support`;
  return await sendSMS(phone, message);
}

export default {
  sendSMS,
  sendVerificationCode,
  notifyNewLeadAvailable,
  notifyLeadPurchased,
  notifyRefund,
  sendUrgentNotification
};


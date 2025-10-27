import axios from 'axios';

const clientId = 'UcfrGwvRv3uGkqvYnUMxIA..';
const clientSecret = '-TX-7q_UfffSEaRmGIP4bA..';

async function testAPI() {
  console.log('🧪 Testing Sudreg API...');
  console.log('Credentials:', { clientId: !!clientId, clientSecret: !!clientSecret });
  
  try {
    // 1. Test OAuth token
    console.log('\n1️⃣ Requesting OAuth token...');
    const tokenResponse = await axios.post(
      'https://sudreg-data.gov.hr/ords/srn_rep/oauth/token',
      null,
      {
        auth: {
          username: clientId,
          password: clientSecret
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('✅ Token received:', !!tokenResponse?.data?.access_token);
    const accessToken = tokenResponse.data.access_token;
    console.log('Token preview:', accessToken.substring(0, 20) + '...');
    
    // 2. Test API call
    console.log('\n2️⃣ Testing API call for OIB 88070789896...');
    const apiResponse = await axios.get(
      'https://sudreg-data.gov.hr/ords/srn_rep/1.0/Surad/88070789896',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('✅ API Response status:', apiResponse.status);
    console.log('Response data:', JSON.stringify(apiResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Stack:', error.stack);
  }
}

testAPI();


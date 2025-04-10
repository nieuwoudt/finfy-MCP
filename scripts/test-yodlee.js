require('dotenv').config({ path: '../.env.local' });
const axios = require('axios');
const querystring = require('querystring');

// Yodlee credentials
const YODLEE_BASE_URL = 'https://fingoalchannel.stageapi.yodlee.com/ysl';
const YODLEE_CLIENT_ID = 'das2X4DGJSwIYKgqXjwEmAsMjwVsFcbQHvpKfmVcGmalg3Yg';
const YODLEE_CLIENT_SECRET = 'OEtjtjojPiySULU9e5DUj23f7uot0vda73o7EA1SaWCqnWGfw9Niiaw4TwxGJVl8';
const YODLEE_LOGIN_NAME = '3b0f18c7-a2f4-4c2c-b581-3fcff7493bb5_ADMIN';

async function testYodleeCredentials() {
  console.log('Testing Yodlee API credentials...');
  
  try {
    // Step 1: Generate an auth token
    console.log('Generating auth token...');
    
    const authResponse = await axios({
      method: 'post',
      url: `${YODLEE_BASE_URL}/auth/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Api-Version': '1.1',
        'loginName': YODLEE_LOGIN_NAME
      },
      data: querystring.stringify({
        'clientId': YODLEE_CLIENT_ID,
        'secret': YODLEE_CLIENT_SECRET
      })
    });
    
    if (!authResponse.data || !authResponse.data.token || !authResponse.data.token.accessToken) {
      throw new Error('Failed to get access token from response');
    }
    
    const accessToken = authResponse.data.token.accessToken;
    console.log('✅ Successfully generated access token');
    console.log(`Token: ${accessToken.substring(0, 10)}...`);
    
    // Step 2: Make a simple API call to verify the token works
    console.log('\nTesting API access with token...');
    
    const apiResponse = await axios({
      method: 'get',
      url: `${YODLEE_BASE_URL}/providers`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Api-Version': '1.1'
      },
      params: {
        'top': 5
      }
    });
    
    console.log('✅ Successfully accessed Yodlee API');
    console.log(`Retrieved ${apiResponse.data.provider ? apiResponse.data.provider.length : 0} providers`);
    
    return true;
  } catch (error) {
    console.error('❌ Error testing Yodlee credentials:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from Yodlee API');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    return false;
  }
}

// Run the test
testYodleeCredentials()
  .then(success => {
    if (success) {
      console.log('\n✅ All tests passed! Your Yodlee credentials are working correctly.');
    } else {
      console.log('\n❌ Tests failed. Please check your Yodlee credentials.');
    }
  })
  .catch(err => {
    console.error('Unexpected error running tests:', err);
  }); 
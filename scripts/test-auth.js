const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Extract credentials from environment variables
const clientId = process.env.FINGOAL_CLIENT_ID;
const clientSecret = process.env.FINGOAL_CLIENT_SECRET;
const baseUrl = process.env.FINGOAL_BASE_URL || 'https://findmoney-dev.fingoal.com/v3';

if (!clientId || !clientSecret) {
  console.error('Error: Fingoal credentials are missing!');
  console.error('Make sure FINGOAL_CLIENT_ID and FINGOAL_CLIENT_SECRET are set in .env.local');
  process.exit(1);
}

console.log('Testing Fingoal API authentication...');
console.log(`Base URL: ${baseUrl}`);
console.log(`Client ID: ${clientId.substring(0, 5)}...${clientId.substring(clientId.length - 5)}`);

// Authenticate with Fingoal API
axios.post(`${baseUrl}/authentication`, {
  client_id: clientId,
  client_secret: clientSecret
})
.then(response => {
  const { access_token, expires_in, scope, token_type } = response.data;
  
  console.log('\n✅ Authentication successful!');
  console.log('Token type:', token_type);
  console.log('Expires in:', `${expires_in} seconds (${Math.floor(expires_in / 3600)} hours)`);
  console.log('Scopes:', scope);
  console.log('Access token:', `${access_token.substring(0, 15)}...${access_token.substring(access_token.length - 15)}`);
  
  // Test a simple API request
  return axios.get(`${baseUrl}/users/example-user`, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
  .catch(error => {
    console.log('\n❓ API request failed - this is expected if "example-user" does not exist');
    console.log('The authentication is still working if you received a proper 404 error');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      
      // If we got a 404, that's actually fine - it means the auth worked
      // but the user doesn't exist
      if (error.response.status === 404) {
        console.log('\n✅ Authentication is working correctly!');
        console.log('The 404 error is expected since we used a test user ID.');
        return true;
      }
    }
    
    throw error;
  });
})
.catch(error => {
  console.error('\n❌ Authentication failed!');
  
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Response data:', error.response.data);
  } else if (error.request) {
    console.error('No response received. Check network connectivity or API endpoint.');
  } else {
    console.error('Error:', error.message);
  }
  
  process.exit(1);
}); 
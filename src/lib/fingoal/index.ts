import axios from 'axios';

// Cache for the auth token to avoid unnecessary requests
interface TokenCache {
  accessToken: string | null;
  expiresAt: number | null;
}

const tokenCache: TokenCache = {
  accessToken: null,
  expiresAt: null,
};

/**
 * Get a valid FinGoal authentication token, refreshing if necessary
 */
export const getFinGoalAuthToken = async (): Promise<string> => {
  const now = Date.now();
  
  // If we have a cached token that's still valid, return it
  if (tokenCache.accessToken && tokenCache.expiresAt && now < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }
  
  try {
    const response = await axios.post(
      `${process.env.FINGOAL_BASE_URL}/authentication`,
      {
        client_id: process.env.FINGOAL_CLIENT_ID,
        client_secret: process.env.FINGOAL_CLIENT_SECRET,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    const { access_token, expires_in } = response.data;
    
    // Cache the token with expiration time (with 5 minute buffer)
    tokenCache.accessToken = access_token;
    tokenCache.expiresAt = now + (expires_in * 1000) - (5 * 60 * 1000);
    
    return access_token;
  } catch (error) {
    console.error('Failed to get FinGoal authentication token:', error);
    throw error;
  }
};

/**
 * Create an Axios instance for FinGoal API requests
 */
export const createFinGoalClient = async () => {
  const token = await getFinGoalAuthToken();
  
  return axios.create({
    baseURL: process.env.FINGOAL_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Submit transactions for enrichment
 * For production use, use the historical endpoint
 */
export const enrichTransactions = async (transactions: any[], isSync = false) => {
  const client = await createFinGoalClient();
  const endpoint = isSync ? '/cleanup/sync' : '/cleanup';
  
  try {
    const response = await client.post(endpoint, { transactions });
    return response.data;
  } catch (error) {
    console.error('Failed to enrich transactions:', error);
    throw error;
  }
};

/**
 * Retrieve enriched transactions by batch ID
 */
export const getEnrichedTransactions = async (batchId: string) => {
  const client = await createFinGoalClient();
  
  try {
    const response = await client.get(`/cleanup/${batchId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to retrieve enriched transactions:', error);
    throw error;
  }
};

/**
 * Get user tags for a specific user
 */
export const getUserTags = async (userId: string) => {
  const client = await createFinGoalClient();
  
  try {
    const response = await client.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get user tags:', error);
    throw error;
  }
};

/**
 * Trigger a refresh of user tags
 */
export const triggerUserTagsUpdate = async (userId: string) => {
  const client = await createFinGoalClient();
  
  try {
    const response = await client.get(`/users/${userId}/sync`);
    return response.data;
  } catch (error) {
    console.error('Failed to trigger user tags update:', error);
    throw error;
  }
};

/**
 * Retrieve updated tags by GUID
 */
export const getUpdatedTags = async (guid: string) => {
  const client = await createFinGoalClient();
  
  try {
    const response = await client.get(`/users/tags/${guid}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get updated tags:', error);
    throw error;
  }
};

/**
 * Submit transactions for savings recommendations
 */
export const getSavingsRecommendations = async (
  transactions: any[], 
  type: 'fingoal' | 'plaid' | 'mx' = 'fingoal'
) => {
  const client = await createFinGoalClient();
  
  try {
    const response = await client.post('/transactions', 
      { transactions },
      { headers: { type } }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to get savings recommendations:', error);
    throw error;
  }
};

/**
 * Get a specific savings recommendation
 */
export const getSavingsRecommendation = async (finsightId: string) => {
  const client = await createFinGoalClient();
  
  try {
    const response = await client.get(`/finsights/${finsightId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get savings recommendation:', error);
    throw error;
  }
};

/**
 * Get all savings recommendations within a time range
 */
export const getAllSavingsRecommendations = async (startAt?: string, endAt?: string) => {
  const client = await createFinGoalClient();
  const params: Record<string, string> = {};
  
  if (startAt) params.startAt = startAt;
  if (endAt) params.endAt = endAt;
  
  try {
    const response = await client.get('/finsights', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to get all savings recommendations:', error);
    throw error;
  }
};

/**
 * Verify the signature of a FinGoal webhook
 */
export const verifyWebhookSignature = (
  payload: string,
  signature: string,
) => {
  const crypto = require('crypto');
  const secret = process.env.FINGOAL_CLIENT_SECRET || '';
  
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  
  return digest === signature;
}; 
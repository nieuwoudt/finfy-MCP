// environment.ts - Helper for environment-specific configurations

/**
 * Get the current environment (development, staging, production)
 */
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  // Check if we're in a Vercel environment
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV as 'development' | 'staging' | 'production';
  }
  
  // Fallback to NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }
  
  return 'development';
};

/**
 * Check if current environment is staging
 */
export const isStaging = (): boolean => {
  return getEnvironment() === 'staging';
};

/**
 * Check if current environment is production
 */
export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};

/**
 * Check if current environment is development
 */
export const isDevelopment = (): boolean => {
  return getEnvironment() === 'development';
};

/**
 * Get site URL based on current environment
 */
export const getSiteUrl = (): string => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (siteUrl) {
    return siteUrl;
  }
  
  // Fallbacks based on environment
  switch (getEnvironment()) {
    case 'production':
      return 'https://app.finfy.ai';
    case 'staging':
      return 'https://finfy-staging.vercel.app';
    default:
      return 'http://localhost:3000';
  }
};

/**
 * Get appropriate API base URL for external services based on environment
 */
export const getApiBaseUrl = (service: 'yodlee'): string => {
  switch (service) {
    case 'yodlee':
      // For Yodlee, we use the same staging API for both staging and development
      if (isProduction()) {
        return process.env.YOADLEE_API || 'https://fingoalchannel.api.yodlee.com/ysl';
      } else {
        return process.env.YOADLEE_API || 'https://fingoalchannel.stageapi.yodlee.com/ysl';
      }
    default:
      return '';
  }
}; 
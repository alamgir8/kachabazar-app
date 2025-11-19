/**
 * Environment configuration for production deployment
 * Manages different environment settings and feature flags
 */

export type Environment = "development" | "staging" | "production";

interface EnvironmentConfig {
  env: Environment;
  apiBaseUrl: string;
  apiTimeout: number;
  enableAnalytics: boolean;
  enableLogging: boolean;
  enableDebugTools: boolean;
  enableCrashReporting: boolean;
  maxRetries: number;
  cacheTimeout: number;
  features: {
    wishlist: boolean;
    reviews: boolean;
    socialLogin: boolean;
    guestCheckout: boolean;
    multiCurrency: boolean;
    pushNotifications: boolean;
    inAppPurchases: boolean;
  };
  api: {
    products: string;
    categories: string;
    orders: string;
    auth: string;
    customer: string;
    reviews: string;
    wishlist: string;
  };
  payments: {
    stripe: {
      enabled: boolean;
      publishableKey?: string;
    };
    razorpay: {
      enabled: boolean;
      keyId?: string;
    };
    paypal: {
      enabled: boolean;
      clientId?: string;
    };
  };
  social: {
    facebook: {
      appId?: string;
      enabled: boolean;
    };
    google: {
      webClientId?: string;
      enabled: boolean;
    };
    apple: {
      enabled: boolean;
    };
  };
}

const development: EnvironmentConfig = {
  env: "development",
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000/v1",
  apiTimeout: 30000,
  enableAnalytics: false,
  enableLogging: true,
  enableDebugTools: true,
  enableCrashReporting: false,
  maxRetries: 3,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  features: {
    wishlist: true,
    reviews: true,
    socialLogin: true,
    guestCheckout: true,
    multiCurrency: true,
    pushNotifications: true,
    inAppPurchases: false,
  },
  api: {
    products: "/products",
    categories: "/category",
    orders: "/order",
    auth: "/customer",
    customer: "/customer",
    reviews: "/reviews",
    wishlist: "/wishlist",
  },
  payments: {
    stripe: {
      enabled: true,
      publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
    razorpay: {
      enabled: true,
      keyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
    },
    paypal: {
      enabled: true,
      clientId: process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID,
    },
  },
  social: {
    facebook: {
      appId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
      enabled: false,
    },
    google: {
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      enabled: false,
    },
    apple: {
      enabled: false,
    },
  },
};

const staging: EnvironmentConfig = {
  ...development,
  env: "staging",
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "https://staging-api.kachabazar.com/v1",
  enableAnalytics: true,
  enableCrashReporting: true,
  enableDebugTools: false,
};

const production: EnvironmentConfig = {
  ...staging,
  env: "production",
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.kachabazar.com/v1",
  enableLogging: false,
  enableDebugTools: false,
  cacheTimeout: 15 * 60 * 1000, // 15 minutes
};

/**
 * Get current environment based on NODE_ENV or EXPO_PUBLIC_ENV
 */
function getCurrentEnvironment(): Environment {
  const env = process.env.EXPO_PUBLIC_ENV || process.env.NODE_ENV || "development";
  if (env === "production") return "production";
  if (env === "staging") return "staging";
  return "development";
}

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const currentEnv = getCurrentEnvironment();

  switch (currentEnv) {
    case "production":
      return production;
    case "staging":
      return staging;
    default:
      return development;
  }
}

/**
 * Current environment configuration
 */
export const env = getEnvironmentConfig();

/**
 * Feature flags helper
 */
export const isFeatureEnabled = (feature: keyof EnvironmentConfig["features"]): boolean => {
  return env.features[feature];
};

/**
 * Check if running in production
 */
export const isProduction = env.env === "production";

/**
 * Check if running in development
 */
export const isDevelopment = env.env === "development";

/**
 * Check if running in staging
 */
export const isStaging = env.env === "staging";

/**
 * API endpoints helper
 */
export const getApiEndpoint = (endpoint: keyof EnvironmentConfig["api"]): string => {
  return `${env.apiBaseUrl}${env.api[endpoint]}`;
};

/**
 * Validate environment configuration
 */
export function validateEnvironmentConfig(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!env.apiBaseUrl) {
    errors.push("API base URL is not configured");
  }

  if (env.payments.stripe.enabled && !env.payments.stripe.publishableKey) {
    errors.push("Stripe is enabled but publishable key is missing");
  }

  if (env.payments.razorpay.enabled && !env.payments.razorpay.keyId) {
    errors.push("Razorpay is enabled but key ID is missing");
  }

  if (env.payments.paypal.enabled && !env.payments.paypal.clientId) {
    errors.push("PayPal is enabled but client ID is missing");
  }

  if (env.social.facebook.enabled && !env.social.facebook.appId) {
    errors.push("Facebook login is enabled but app ID is missing");
  }

  if (env.social.google.enabled && !env.social.google.webClientId) {
    errors.push("Google login is enabled but web client ID is missing");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Environment info for debugging
 */
export function getEnvironmentInfo() {
  return {
    environment: env.env,
    apiBaseUrl: env.apiBaseUrl,
    features: env.features,
    analytics: env.enableAnalytics,
    crashReporting: env.enableCrashReporting,
    debugTools: env.enableDebugTools,
  };
}


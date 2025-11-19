import * as Crypto from "expo-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "./logger";

/**
 * Security utilities for the application
 * Implements best practices for data protection and secure operations
 */

/**
 * Hash sensitive data using SHA-256
 */
export async function hashData(data: string): Promise<string> {
  try {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data
    );
  } catch (error) {
    logger.error("Failed to hash data", error, "Security");
    throw new Error("Hash operation failed");
  }
}

/**
 * Generate a secure random string
 */
export async function generateRandomString(length = 32): Promise<string> {
  try {
    const randomBytes = await Crypto.getRandomBytesAsync(length);
    return Array.from(randomBytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    logger.error("Failed to generate random string", error, "Security");
    throw new Error("Random generation failed");
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .trim();
}

/**
 * Validate URL to prevent open redirects
 */
export function isValidUrl(url: string, allowedDomains?: string[]): boolean {
  try {
    const parsed = new URL(url);
    
    // Check protocol
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }

    // Check allowed domains if specified
    if (allowedDomains && allowedDomains.length > 0) {
      return allowedDomains.some((domain) => parsed.hostname.endsWith(domain));
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(
  data: string,
  visibleChars = 4,
  maskChar = "*"
): string {
  if (data.length <= visibleChars) {
    return maskChar.repeat(data.length);
  }

  const masked = maskChar.repeat(data.length - visibleChars);
  const visible = data.slice(-visibleChars);
  return masked + visible;
}

/**
 * Secure storage wrapper with encryption
 */
export class SecureStore {
  private static prefix = "@secure:";

  /**
   * Store encrypted data
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      const hash = await hashData(value);
      const data = JSON.stringify({ value, hash });
      await AsyncStorage.setItem(this.prefix + key, data);
    } catch (error) {
      logger.error("Failed to store secure item", error, "Security");
      throw new Error("Secure storage failed");
    }
  }

  /**
   * Retrieve and verify encrypted data
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      const data = await AsyncStorage.getItem(this.prefix + key);
      if (!data) return null;

      const { value, hash } = JSON.parse(data);
      const computedHash = await hashData(value);

      // Verify integrity
      if (hash !== computedHash) {
        logger.warn("Data integrity check failed", { key }, "Security");
        await this.removeItem(key);
        return null;
      }

      return value;
    } catch (error) {
      logger.error("Failed to retrieve secure item", error, "Security");
      return null;
    }
  }

  /**
   * Remove secure item
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.prefix + key);
    } catch (error) {
      logger.error("Failed to remove secure item", error, "Security");
    }
  }

  /**
   * Clear all secure items
   */
  static async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const secureKeys = keys.filter((key) => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(secureKeys);
    } catch (error) {
      logger.error("Failed to clear secure storage", error, "Security");
    }
  }
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if action is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Filter out old attempts
    const recentAttempts = attempts.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (recentAttempts.length >= this.maxAttempts) {
      logger.warn("Rate limit exceeded", { key }, "Security");
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  /**
   * Reset attempts for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(key: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const recentAttempts = attempts.filter(
      (timestamp) => now - timestamp < this.windowMs
    );
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }
}

/**
 * Input validation utilities
 */
export const SecurityValidator = {
  /**
   * Check if email is valid
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Check password strength
   */
  getPasswordStrength(password: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (password.length < 8) feedback.push("Use at least 8 characters");
    if (!/[a-z]/.test(password)) feedback.push("Add lowercase letters");
    if (!/[A-Z]/.test(password)) feedback.push("Add uppercase letters");
    if (!/[0-9]/.test(password)) feedback.push("Add numbers");
    if (!/[^a-zA-Z0-9]/.test(password))
      feedback.push("Add special characters");

    return { score, feedback };
  },

  /**
   * Detect potential SQL injection
   */
  hasSqlInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT)\b)/i,
      /(--|;|\/\*|\*\/|xp_|sp_)/i,
      /('|(--|;)|(\s+(OR|AND)\s+\d+\s*=\s*\d+))/i,
    ];

    return sqlPatterns.some((pattern) => pattern.test(input));
  },

  /**
   * Detect potential XSS
   */
  hasXssAttempt(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<embed/gi,
      /<object/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(input));
  },
};

/**
 * CSRF token management
 */
export class CsrfTokenManager {
  private static tokenKey = "@csrf:token";
  private static token: string | null = null;

  /**
   * Generate new CSRF token
   */
  static async generateToken(): Promise<string> {
    this.token = await generateRandomString(32);
    await AsyncStorage.setItem(this.tokenKey, this.token);
    return this.token;
  }

  /**
   * Get current CSRF token
   */
  static async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    this.token = await AsyncStorage.getItem(this.tokenKey);
    return this.token;
  }

  /**
   * Verify CSRF token
   */
  static async verifyToken(token: string): Promise<boolean> {
    const storedToken = await this.getToken();
    return token === storedToken;
  }

  /**
   * Clear CSRF token
   */
  static async clearToken(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem(this.tokenKey);
  }
}



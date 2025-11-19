import { logger } from "./logger";

/**
 * Analytics and monitoring utilities
 * Provides tracking for user actions, screen views, and business metrics
 */

export enum AnalyticsEvent {
  // Authentication
  LOGIN = "login",
  LOGOUT = "logout",
  SIGNUP = "signup",
  
  // Product interactions
  PRODUCT_VIEW = "product_view",
  PRODUCT_SEARCH = "product_search",
  PRODUCT_FILTER = "product_filter",
  
  // Cart operations
  ADD_TO_CART = "add_to_cart",
  REMOVE_FROM_CART = "remove_from_cart",
  UPDATE_CART_QUANTITY = "update_cart_quantity",
  CLEAR_CART = "clear_cart",
  
  // Checkout
  BEGIN_CHECKOUT = "begin_checkout",
  ADD_SHIPPING_INFO = "add_shipping_info",
  ADD_PAYMENT_INFO = "add_payment_info",
  PURCHASE = "purchase",
  
  // Wishlist
  ADD_TO_WISHLIST = "add_to_wishlist",
  REMOVE_FROM_WISHLIST = "remove_from_wishlist",
  
  // Reviews
  WRITE_REVIEW = "write_review",
  RATE_PRODUCT = "rate_product",
  
  // Navigation
  SCREEN_VIEW = "screen_view",
  
  // Errors
  ERROR_OCCURRED = "error_occurred",
  API_ERROR = "api_error",
  
  // Performance
  SLOW_OPERATION = "slow_operation",
}

interface AnalyticsEventData {
  [key: string]: string | number | boolean | undefined | null;
}

interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  [key: string]: string | number | boolean | undefined | null;
}

class AnalyticsService {
  private isEnabled = true;
  private userId: string | null = null;
  private userProperties: UserProperties = {};

  /**
   * Initialize analytics
   */
  initialize(config?: { enabled?: boolean }) {
    this.isEnabled = config?.enabled ?? !__DEV__;
    logger.info(
      `Analytics ${this.isEnabled ? "enabled" : "disabled"}`,
      undefined,
      "Analytics"
    );
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string | null) {
    this.userId = userId;
    logger.debug("User ID set", { userId }, "Analytics");
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties) {
    this.userProperties = { ...this.userProperties, ...properties };
    logger.debug("User properties updated", { properties }, "Analytics");

    // TODO: Send to analytics service
    // Example: Firebase Analytics
    // analytics().setUserProperties(properties);
  }

  /**
   * Track an event
   */
  trackEvent(event: AnalyticsEvent | string, data?: AnalyticsEventData) {
    if (!this.isEnabled) return;

    const eventData = {
      ...data,
      userId: this.userId,
      timestamp: new Date().toISOString(),
    };

    logger.info(`Event: ${event}`, eventData, "Analytics");

    // TODO: Send to analytics service
    // Example: Firebase Analytics
    // analytics().logEvent(event, eventData);
    
    // Example: Segment
    // analytics.track(event, eventData);
    
    // Example: Amplitude
    // amplitude.track(event, eventData);
  }

  /**
   * Track screen view
   */
  trackScreenView(screenName: string, params?: AnalyticsEventData) {
    this.trackEvent(AnalyticsEvent.SCREEN_VIEW, {
      screen_name: screenName,
      ...params,
    });
  }

  /**
   * Track product view
   */
  trackProductView(productId: string, productName: string, price: number) {
    this.trackEvent(AnalyticsEvent.PRODUCT_VIEW, {
      product_id: productId,
      product_name: productName,
      price,
    });
  }

  /**
   * Track add to cart
   */
  trackAddToCart(
    productId: string,
    productName: string,
    price: number,
    quantity: number
  ) {
    this.trackEvent(AnalyticsEvent.ADD_TO_CART, {
      product_id: productId,
      product_name: productName,
      price,
      quantity,
      value: price * quantity,
    });
  }

  /**
   * Track purchase
   */
  trackPurchase(
    orderId: string,
    total: number,
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
    }>
  ) {
    this.trackEvent(AnalyticsEvent.PURCHASE, {
      order_id: orderId,
      value: total,
      currency: "USD",
      items: items.length,
    });

    // Track individual items
    items.forEach((item) => {
      this.trackEvent("purchase_item", {
        order_id: orderId,
        product_id: item.productId,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
      });
    });
  }

  /**
   * Track search
   */
  trackSearch(query: string, resultsCount?: number) {
    this.trackEvent(AnalyticsEvent.PRODUCT_SEARCH, {
      search_query: query,
      results_count: resultsCount,
    });
  }

  /**
   * Track error
   */
  trackError(
    error: Error,
    context?: string,
    additionalData?: AnalyticsEventData
  ) {
    this.trackEvent(AnalyticsEvent.ERROR_OCCURRED, {
      error_message: error.message,
      error_name: error.name,
      context,
      ...additionalData,
    });
  }

  /**
   * Track API error
   */
  trackApiError(
    endpoint: string,
    statusCode: number,
    errorMessage: string
  ) {
    this.trackEvent(AnalyticsEvent.API_ERROR, {
      endpoint,
      status_code: statusCode,
      error_message: errorMessage,
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(
    operation: string,
    duration: number,
    metadata?: AnalyticsEventData
  ) {
    if (duration > 1000) {
      this.trackEvent(AnalyticsEvent.SLOW_OPERATION, {
        operation,
        duration,
        ...metadata,
      });
    }

    // TODO: Send to performance monitoring service
    // Example: Firebase Performance
    // const trace = perf().newTrace(operation);
    // trace.putMetric('duration', duration);
    // trace.stop();
  }

  /**
   * Start timing an operation
   */
  startTiming(operationName: string): () => void {
    const startTime = Date.now();
    return () => {
      const duration = Date.now() - startTime;
      this.trackPerformance(operationName, duration);
    };
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    logger.info(
      `Analytics ${enabled ? "enabled" : "disabled"}`,
      undefined,
      "Analytics"
    );
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

/**
 * Higher-order function to track function execution time
 */
export function withPerformanceTracking<T extends (...args: any[]) => any>(
  fn: T,
  operationName: string
): T {
  return ((...args: Parameters<T>) => {
    const endTiming = analytics.startTiming(operationName);
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.finally(endTiming);
      }
      endTiming();
      return result;
    } catch (error) {
      endTiming();
      throw error;
    }
  }) as T;
}

/**
 * Hook to track screen views
 */
export function useScreenTracking(screenName: string, params?: AnalyticsEventData) {
  // This would typically use React.useEffect
  analytics.trackScreenView(screenName, params);
}



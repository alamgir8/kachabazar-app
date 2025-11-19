import { AccessibilityInfo, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { logger } from "./logger";

/**
 * Accessibility utilities for enhanced user experience
 * Follows WCAG 2.1 AA standards
 */

/**
 * Accessibility labels for common UI elements
 */
export const A11yLabels = {
  // Navigation
  backButton: "Go back",
  closeButton: "Close",
  menuButton: "Open menu",
  searchButton: "Search",
  filterButton: "Filter",
  sortButton: "Sort",

  // Actions
  addToCart: "Add to cart",
  removeFromCart: "Remove from cart",
  addToWishlist: "Add to wishlist",
  removeFromWishlist: "Remove from wishlist",
  checkout: "Proceed to checkout",
  placeOrder: "Place order",

  // Product
  productImage: "Product image",
  productRating: "Product rating",
  productPrice: "Product price",

  // Forms
  emailInput: "Email address",
  passwordInput: "Password",
  nameInput: "Full name",
  phoneInput: "Phone number",
  addressInput: "Address",

  // Loading
  loading: "Loading",
  loadingMore: "Loading more items",
  refreshing: "Refreshing content",
};

/**
 * Accessibility hints for complex interactions
 */
export const A11yHints = {
  tapToOpen: "Tap to open",
  tapToClose: "Tap to close",
  tapToSelect: "Tap to select",
  doubleTapToActivate: "Double tap to activate",
  swipeToDelete: "Swipe to delete",
  tapToAddToCart: "Tap to add this item to your cart",
  tapToRemoveFromCart: "Tap to remove this item from your cart",
  tapToViewDetails: "Tap to view product details",
};

/**
 * Screen reader announcements
 */
export class ScreenReaderAnnouncer {
  /**
   * Announce a message to screen reader
   */
  static announce(message: string, assertive = false) {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      AccessibilityInfo.announceForAccessibility(message);
      logger.debug("Screen reader announcement", { message }, "A11y");
    }
  }

  /**
   * Announce success message
   */
  static announceSuccess(message: string) {
    this.announce(`Success: ${message}`, true);
  }

  /**
   * Announce error message
   */
  static announceError(message: string) {
    this.announce(`Error: ${message}`, true);
  }

  /**
   * Announce loading state
   */
  static announceLoading(message = "Loading") {
    this.announce(message);
  }

  /**
   * Announce item added to cart
   */
  static announceAddedToCart(productName: string, quantity: number) {
    this.announce(
      `${quantity} ${productName} ${quantity === 1 ? "item" : "items"} added to cart`
    );
  }

  /**
   * Announce item removed from cart
   */
  static announceRemovedFromCart(productName: string) {
    this.announce(`${productName} removed from cart`);
  }
}

/**
 * Haptic feedback for better user experience
 */
export class HapticFeedback {
  /**
   * Light impact feedback
   */
  static async light() {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      logger.debug("Haptic feedback failed", error, "A11y");
    }
  }

  /**
   * Medium impact feedback
   */
  static async medium() {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      logger.debug("Haptic feedback failed", error, "A11y");
    }
  }

  /**
   * Heavy impact feedback
   */
  static async heavy() {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      logger.debug("Haptic feedback failed", error, "A11y");
    }
  }

  /**
   * Success notification
   */
  static async success() {
    try {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    } catch (error) {
      logger.debug("Haptic feedback failed", error, "A11y");
    }
  }

  /**
   * Warning notification
   */
  static async warning() {
    try {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning
      );
    } catch (error) {
      logger.debug("Haptic feedback failed", error, "A11y");
    }
  }

  /**
   * Error notification
   */
  static async error() {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      logger.debug("Haptic feedback failed", error, "A11y");
    }
  }

  /**
   * Selection changed
   */
  static async selection() {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      logger.debug("Haptic feedback failed", error, "A11y");
    }
  }
}

/**
 * Check if screen reader is enabled
 */
export async function isScreenReaderEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch (error) {
    logger.error("Failed to check screen reader status", error, "A11y");
    return false;
  }
}

/**
 * Check if reduce motion is enabled
 */
export async function isReduceMotionEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isReduceMotionEnabled();
  } catch (error) {
    logger.error("Failed to check reduce motion status", error, "A11y");
    return false;
  }
}

/**
 * Subscribe to screen reader changes
 */
export function subscribeToScreenReaderChanges(
  callback: (enabled: boolean) => void
): () => void {
  const subscription = AccessibilityInfo.addEventListener(
    "screenReaderChanged",
    callback
  );
  return () => subscription.remove();
}

/**
 * Accessibility role helpers
 */
export const A11yRoles = {
  button: "button" as const,
  link: "link" as const,
  header: "header" as const,
  search: "search" as const,
  image: "image" as const,
  imageButton: "imagebutton" as const,
  adjustable: "adjustable" as const,
  text: "text" as const,
  none: "none" as const,
};

/**
 * Accessibility state helpers
 */
export const A11yStates = {
  disabled: { disabled: true },
  selected: { selected: true },
  checked: { checked: true },
  unchecked: { checked: false },
  busy: { busy: true },
  expanded: { expanded: true },
  collapsed: { expanded: false },
};

/**
 * Color contrast checker for WCAG compliance
 */
export class ColorContrast {
  /**
   * Calculate relative luminance
   */
  private static getLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Parse hex color to RGB
   */
  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  static getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Check if contrast meets WCAG AA standard (4.5:1 for normal text)
   */
  static meetsWCAG_AA(foreground: string, background: string): boolean {
    return this.getContrastRatio(foreground, background) >= 4.5;
  }

  /**
   * Check if contrast meets WCAG AAA standard (7:1 for normal text)
   */
  static meetsWCAG_AAA(foreground: string, background: string): boolean {
    return this.getContrastRatio(foreground, background) >= 7;
  }
}

/**
 * Touch target size validator (minimum 44x44 points)
 */
export const TouchTarget = {
  MIN_SIZE: 44,
  COMFORTABLE_SIZE: 48,

  isAccessible(size: number): boolean {
    return size >= this.MIN_SIZE;
  },

  isComfortable(size: number): boolean {
    return size >= this.COMFORTABLE_SIZE;
  },
};

/**
 * Text size helpers for accessibility
 */
export const TextSize = {
  MIN_BODY: 16,
  MIN_LABEL: 14,
  MIN_CAPTION: 12,

  isReadable(size: number, type: "body" | "label" | "caption" = "body"): boolean {
    switch (type) {
      case "body":
        return size >= this.MIN_BODY;
      case "label":
        return size >= this.MIN_LABEL;
      case "caption":
        return size >= this.MIN_CAPTION;
      default:
        return size >= this.MIN_BODY;
    }
  },
};

/**
 * Focus management utilities
 */
export class FocusManager {
  private static focusedElement: any = null;

  static setFocus(element: any) {
    this.focusedElement = element;
    AccessibilityInfo.setAccessibilityFocus(element);
  }

  static getFocusedElement() {
    return this.focusedElement;
  }

  static clearFocus() {
    this.focusedElement = null;
  }
}


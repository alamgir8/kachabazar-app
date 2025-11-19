import { useCallback, useEffect, useMemo, useRef } from "react";
import { InteractionManager } from "react-native";
import { logger } from "./logger";

/**
 * Performance optimization utilities
 */

/**
 * Debounce hook for input handling
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for rate-limiting function calls
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        return callback(...args);
      }
    },
    [callback, delay]
  ) as T;
}

/**
 * Defer expensive operations until after interactions
 */
export function useDeferredValue<T>(value: T): T {
  const [deferredValue, setDeferredValue] = React.useState<T>(value);

  useEffect(() => {
    const handle = InteractionManager.runAfterInteractions(() => {
      setDeferredValue(value);
    });

    return () => handle.cancel();
  }, [value]);

  return deferredValue;
}

/**
 * Memoize async function results
 */
class AsyncMemoizer<T> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private ttl: number;

  constructor(ttl = 5 * 60 * 1000) {
    // 5 minutes default
    this.ttl = ttl;
  }

  async get(
    key: string,
    fetcher: () => Promise<T>,
    forceFetch = false
  ): Promise<T> {
    if (!forceFetch) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < this.ttl) {
        logger.debug("Cache hit", { key }, "Performance");
        return cached.value;
      }
    }

    logger.debug("Cache miss, fetching", { key }, "Performance");
    const value = await fetcher();
    this.cache.set(key, { value, timestamp: Date.now() });
    return value;
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  size() {
    return this.cache.size;
  }
}

export const asyncMemoizer = new AsyncMemoizer();

/**
 * Batch multiple updates together
 */
export class BatchProcessor<T> {
  private queue: T[] = [];
  private timeout: NodeJS.Timeout | null = null;
  private processor: (items: T[]) => void;
  private delay: number;

  constructor(processor: (items: T[]) => void, delay = 100) {
    this.processor = processor;
    this.delay = delay;
  }

  add(item: T) {
    this.queue.push(item);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  flush() {
    if (this.queue.length > 0) {
      const items = [...this.queue];
      this.queue = [];
      this.processor(items);
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}

/**
 * Measure component render time
 */
export function useMeasureRender(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current++;
    const renderTime = Date.now() - startTime.current;

    if (renderTime > 16) {
      // More than one frame (60fps)
      logger.warn(
        `Slow render detected: ${componentName}`,
        { renderTime, renderCount: renderCount.current },
        "Performance"
      );
    }

    startTime.current = Date.now();
  });
}

/**
 * Lazy load component after initial render
 */
export function useLazyLoad(delay = 100): boolean {
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    const handle = InteractionManager.runAfterInteractions(() => {
      setTimeout(() => setIsReady(true), delay);
    });

    return () => handle.cancel();
  }, [delay]);

  return isReady;
}

/**
 * Virtual scroll helpers
 */
export const VirtualScrollHelpers = {
  /**
   * Calculate visible items in viewport
   */
  getVisibleItems<T>(
    items: T[],
    scrollOffset: number,
    itemHeight: number,
    containerHeight: number
  ): { startIndex: number; endIndex: number; visibleItems: T[] } {
    const startIndex = Math.floor(scrollOffset / itemHeight);
    const endIndex = Math.ceil((scrollOffset + containerHeight) / itemHeight);

    const visibleStartIndex = Math.max(0, startIndex - 2); // Buffer
    const visibleEndIndex = Math.min(items.length, endIndex + 2); // Buffer

    return {
      startIndex: visibleStartIndex,
      endIndex: visibleEndIndex,
      visibleItems: items.slice(visibleStartIndex, visibleEndIndex),
    };
  },

  /**
   * Get optimal batch size for list rendering
   */
  getOptimalBatchSize(itemHeight: number, screenHeight: number): number {
    return Math.ceil((screenHeight * 2) / itemHeight);
  },
};

/**
 * Memory optimization helpers
 */
export const MemoryHelpers = {
  /**
   * Deep clone with JSON (fast but limited)
   */
  fastClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Check if object should be garbage collected
   */
  shouldCollect(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp > ttl;
  },

  /**
   * Weak reference map for cached data
   */
  createWeakCache<K extends object, V>(): WeakMap<K, V> {
    return new WeakMap();
  },
};

/**
 * Bundle size optimization helpers
 */
export const BundleHelpers = {
  /**
   * Dynamic import with retry
   */
  async dynamicImport<T>(
    importFn: () => Promise<T>,
    retries = 3
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await importFn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error("Dynamic import failed");
  },
};

/**
 * React import for hooks
 */
import React from "react";



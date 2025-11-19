import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "./logger";

const OFFLINE_QUEUE_KEY = "@kachabazar/offlineQueue";
const NETWORK_STATE_KEY = "@kachabazar/networkState";

export interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  data?: unknown;
  headers?: Record<string, string>;
  timestamp: number;
  retryCount: number;
}

class OfflineManager {
  private isOnline = true;
  private listeners: Array<(isOnline: boolean) => void> = [];
  private queue: QueuedRequest[] = [];
  private maxRetries = 3;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize network monitoring
   */
  private async initialize() {
    // Load persisted queue
    await this.loadQueue();

    // Subscribe to network state changes
    NetInfo.addEventListener((state: NetInfoState) => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected ?? false;

      logger.info(
        `Network state changed: ${this.isOnline ? "Online" : "Offline"}`,
        { state },
        "Offline"
      );

      // Save network state
      AsyncStorage.setItem(
        NETWORK_STATE_KEY,
        JSON.stringify({ isOnline: this.isOnline, timestamp: Date.now() })
      );

      // Notify listeners
      this.listeners.forEach((listener) => listener(this.isOnline));

      // Process queue when coming back online
      if (!wasOnline && this.isOnline) {
        this.processQueue();
      }
    });

    // Get initial state
    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected ?? false;
  }

  /**
   * Check if device is online
   */
  getIsOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Subscribe to network state changes
   */
  subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Add request to offline queue
   */
  async queueRequest(
    url: string,
    method: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<void> {
    const request: QueuedRequest = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      method,
      data,
      headers,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(request);
    await this.persistQueue();

    logger.info("Request queued for offline processing", { request }, "Offline");
  }

  /**
   * Process queued requests
   */
  private async processQueue() {
    if (!this.isOnline || this.queue.length === 0) {
      return;
    }

    logger.info(
      `Processing ${this.queue.length} queued requests`,
      undefined,
      "Offline"
    );

    const requests = [...this.queue];
    this.queue = [];

    for (const request of requests) {
      try {
        await this.executeRequest(request);
        logger.info("Queued request processed successfully", { request }, "Offline");
      } catch (error) {
        request.retryCount++;

        if (request.retryCount < this.maxRetries) {
          logger.warn(
            `Queued request failed, will retry (${request.retryCount}/${this.maxRetries})`,
            { request, error },
            "Offline"
          );
          this.queue.push(request);
        } else {
          logger.error(
            "Queued request failed after max retries",
            { request, error },
            "Offline"
          );
        }
      }
    }

    await this.persistQueue();
  }

  /**
   * Execute a queued request
   */
  private async executeRequest(request: QueuedRequest): Promise<void> {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.data ? JSON.stringify(request.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  /**
   * Load queue from storage
   */
  private async loadQueue() {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        logger.info(
          `Loaded ${this.queue.length} queued requests`,
          undefined,
          "Offline"
        );
      }
    } catch (error) {
      logger.error("Failed to load offline queue", error, "Offline");
    }
  }

  /**
   * Persist queue to storage
   */
  private async persistQueue() {
    try {
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      logger.error("Failed to persist offline queue", error, "Offline");
    }
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Clear queue
   */
  async clearQueue(): Promise<void> {
    this.queue = [];
    await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
    logger.info("Offline queue cleared", undefined, "Offline");
  }
}

export const offlineManager = new OfflineManager();



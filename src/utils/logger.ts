/**
 * Comprehensive logging system for production and development
 * Provides structured logging with different severity levels
 */

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  context?: string;
}

class Logger {
  private isProduction = !__DEV__;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;

  /**
   * Log debug information (only in development)
   */
  debug(message: string, data?: unknown, context?: string) {
    if (!this.isProduction) {
      this.log(LogLevel.DEBUG, message, data, context);
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, data?: unknown, context?: string) {
    this.log(LogLevel.INFO, message, data, context);
  }

  /**
   * Log warning messages
   */
  warn(message: string, data?: unknown, context?: string) {
    this.log(LogLevel.WARN, message, data, context);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, context?: string) {
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : error;

    this.log(LogLevel.ERROR, message, errorData, context);

    // In production, send to error reporting service
    if (this.isProduction) {
      this.reportToService({
        level: LogLevel.ERROR,
        message,
        data: errorData,
        context,
      });
    }
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: string
  ) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
    };

    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Console output
    const prefix = context ? `[${context}]` : "";
    const logMessage = `${prefix} ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.log(`🔍 ${logMessage}`, data ?? "");
        break;
      case LogLevel.INFO:
        console.info(`ℹ️ ${logMessage}`, data ?? "");
        break;
      case LogLevel.WARN:
        console.warn(`⚠️ ${logMessage}`, data ?? "");
        break;
      case LogLevel.ERROR:
        console.error(`❌ ${logMessage}`, data ?? "");
        break;
    }
  }

  /**
   * Report to external error tracking service
   */
  private reportToService(entry: Partial<LogEntry>) {
    // TODO: Integrate with services like Sentry, Crashlytics, or custom backend
    // Example:
    // Sentry.captureMessage(entry.message, {
    //   level: entry.level as SentryLevel,
    //   extra: entry.data,
    //   tags: { context: entry.context },
    // });
  }

  /**
   * Get recent logs (useful for debugging)
   */
  getRecentLogs(count = 50): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  /**
   * Clear log buffer
   */
  clearLogs() {
    this.logBuffer = [];
  }

  /**
   * API request logging helper
   */
  logApiRequest(
    method: string,
    url: string,
    status?: number,
    duration?: number
  ) {
    const message = `${method} ${url} ${status ? `- ${status}` : ""}`;
    const data = { method, url, status, duration };

    if (status && status >= 400) {
      this.warn(message, data, "API");
    } else {
      this.debug(message, data, "API");
    }
  }

  /**
   * Navigation logging helper
   */
  logNavigation(from: string, to: string) {
    this.debug(`Navigation: ${from} → ${to}`, { from, to }, "Navigation");
  }

  /**
   * Performance logging helper
   */
  logPerformance(operation: string, duration: number) {
    const message = `${operation} completed in ${duration}ms`;
    if (duration > 1000) {
      this.warn(message, { operation, duration }, "Performance");
    } else {
      this.debug(message, { operation, duration }, "Performance");
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience methods
export const { debug, info, warn, error } = logger;



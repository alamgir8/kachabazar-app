import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { AlertCircle, RefreshCw } from "lucide-react-native";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch and handle React errors gracefully
 * Provides a fallback UI and error reporting capabilities
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service (e.g., Sentry, Crashlytics)
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Integrate with error reporting service
    if (__DEV__) {
      console.error("Error Boundary caught an error:", error, errorInfo);
    }
    
    // Example: Sentry integration
    // Sentry.captureException(error, { extra: errorInfo });
  };

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.resetError);
      }

      return (
        <View className="flex-1 bg-neutral-50 justify-center items-center px-6">
          <View className="items-center">
            <View className="w-20 h-20 bg-error-light rounded-full items-center justify-center mb-6">
              <AlertCircle size={40} color="#ef4444" />
            </View>

            <Text className="text-2xl font-bold text-neutral-900 text-center mb-3">
              Oops! Something went wrong
            </Text>

            <Text className="text-base text-neutral-600 text-center mb-6 max-w-md">
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView 
                className="w-full max-h-40 bg-neutral-100 rounded-lg p-4 mb-6"
                showsVerticalScrollIndicator={true}
              >
                <Text className="text-xs font-mono text-error">
                  {this.state.error.toString()}
                </Text>
                {this.state.error.stack && (
                  <Text className="text-xs font-mono text-neutral-600 mt-2">
                    {this.state.error.stack}
                  </Text>
                )}
              </ScrollView>
            )}

            <Pressable
              onPress={this.resetError}
              className="bg-primary-500 px-8 py-4 rounded-xl flex-row items-center active:opacity-80"
            >
              <RefreshCw size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-base ml-2">
                Try Again
              </Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper
 * Usage: Wrap components that might throw errors
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: (error: Error, resetError: () => void) => ReactNode
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};



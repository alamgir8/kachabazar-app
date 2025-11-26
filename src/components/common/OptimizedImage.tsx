import React, { useState, useCallback } from "react";
import {
  Image,
  ImageProps,
  View,
  ActivityIndicator,
  StyleSheet,
  ImageStyle,
  ViewStyle,
} from "react-native";
import { Image as ExpoImage, ImageProps as ExpoImageProps } from "expo-image";
import { logger } from "@/utils/logger";

interface OptimizedImageProps
  extends Omit<ExpoImageProps, "source" | "onError"> {
  source: string | { uri: string } | number;
  placeholder?: string;
  blurhash?: string;
  priority?: "low" | "normal" | "high";
  cachePolicy?: "none" | "disk" | "memory" | "memory-disk";
  onLoadStart?: () => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  showLoader?: boolean;
  loaderColor?: string;
  containerStyle?: ViewStyle;
}

/**
 * OptimizedImage component with advanced caching and loading states
 * Uses Expo Image for better performance and caching
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  placeholder,
  blurhash,
  priority = "normal",
  cachePolicy = "memory-disk",
  onLoadStart,
  onLoad,
  onError,
  showLoader = true,
  loaderColor = "#10b981",
  containerStyle,
  style,
  ...rest
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(false);
    onLoadStart?.();
  }, [onLoadStart]);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(
    (e: { error: string }) => {
      setLoading(false);
      setError(true);
      logger.warn("Image loading failed", { source, error: e.error }, "Image");
      const error = new Error(e.error);
      onError?.(error);
    },
    [source, onError]
  );

  // Convert source to proper format
  const imageSource = typeof source === "string" ? { uri: source } : source;

  return (
    <View style={[styles.container, containerStyle]}>
      <ExpoImage
        source={imageSource}
        placeholder={placeholder ? { uri: placeholder } : blurhash}
        contentFit="cover"
        transition={300}
        priority={priority}
        cachePolicy={cachePolicy}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        style={[styles.image, style as ImageStyle]}
        {...rest}
      />

      {loading && showLoader && !error && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={loaderColor} />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <View style={styles.errorPlaceholder} />
        </View>
      )}
    </View>
  );
};

/**
 * Image with aspect ratio container
 */
interface AspectRatioImageProps extends OptimizedImageProps {
  aspectRatio?: number;
}

export const AspectRatioImage: React.FC<AspectRatioImageProps> = ({
  aspectRatio = 1,
  style,
  ...props
}) => {
  return (
    <View style={[styles.aspectContainer, { aspectRatio }]}>
      <OptimizedImage style={[StyleSheet.absoluteFill, style]} {...props} />
    </View>
  );
};

/**
 * Product image with optimized settings
 */
export const ProductImage: React.FC<OptimizedImageProps> = (props) => {
  return (
    <OptimizedImage
      priority="high"
      cachePolicy="memory-disk"
      blurhash="L6Pj0^jE.AyE_3t7t7R**0o#DgR4"
      {...props}
    />
  );
};

/**
 * Avatar image with circular style
 */
export const AvatarImage: React.FC<OptimizedImageProps & { size?: number }> = ({
  size = 40,
  style,
  ...props
}) => {
  return (
    <OptimizedImage
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      cachePolicy="memory-disk"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorPlaceholder: {
    width: "50%",
    height: "50%",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  aspectContainer: {
    width: "100%",
  },
});

/**
 * Preload images for better performance
 */
export const preloadImages = async (urls: string[]): Promise<void> => {
  try {
    await Promise.all(
      urls.map((url) => ExpoImage.prefetch(url, { cachePolicy: "memory-disk" }))
    );
    logger.info(`Preloaded ${urls.length} images`, undefined, "Image");
  } catch (error) {
    logger.error("Image preload failed", error, "Image");
  }
};

/**
 * Clear image cache
 */
export const clearImageCache = async (): Promise<void> => {
  try {
    await ExpoImage.clearDiskCache();
    await ExpoImage.clearMemoryCache();
    logger.info("Image cache cleared", undefined, "Image");
  } catch (error) {
    logger.error("Failed to clear image cache", error, "Image");
  }
};

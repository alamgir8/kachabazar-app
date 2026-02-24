/**
 * RateDelivery — Star rating form for delivery boys
 * Beautiful animated star rating with review text area
 */

import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRateDeliveryBoy } from "@/hooks/queries/useTracking";

interface RateDeliveryProps {
  orderId: string;
  deliveryBoyName: string;
  /** If already rated, show the existing rating */
  existingRating?: {
    rating: number;
    review?: string;
  };
}

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
const RATING_COLORS = [
  "",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#16a34a",
];

export const RateDelivery: React.FC<RateDeliveryProps> = ({
  orderId,
  deliveryBoyName,
  existingRating,
}) => {
  const [rating, setRating] = useState(existingRating?.rating ?? 0);
  const [review, setReview] = useState(existingRating?.review ?? "");
  const [submitted, setSubmitted] = useState(Boolean(existingRating));
  const { mutateAsync: rateDelivery, isPending } = useRateDeliveryBoy();

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Rating Required", "Please select a star rating.");
      return;
    }

    try {
      await rateDelivery({
        orderId,
        rating,
        review: review.trim() || undefined,
      });
      setSubmitted(true);
    } catch (error: any) {
      Alert.alert(
        "Rating Failed",
        error.message || "Could not submit your rating. Please try again.",
      );
    }
  };

  // Already rated — show confirmation
  if (submitted) {
    return (
      <View
        className="overflow-hidden rounded-3xl bg-white shadow-lg"
        style={{
          shadowColor: "#16a34a",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <View className="items-center px-5 py-8">
          <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <Feather name="heart" size={28} color="#16a34a" />
          </View>
          <Text className="text-lg font-bold text-slate-900">
            Delivery Rated!
          </Text>
          <Text className="mt-1 text-center text-sm text-slate-500">
            Thanks for rating {deliveryBoyName}
          </Text>

          {/* Show stars */}
          <View className="mt-4 flex-row gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Feather
                key={star}
                name="star"
                size={22}
                color={star <= rating ? "#eab308" : "#e2e8f0"}
              />
            ))}
          </View>
          {review ? (
            <Text className="mt-3 text-center text-xs italic text-slate-400">
              "{review}"
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View
      className="overflow-hidden rounded-3xl bg-white shadow-lg"
      style={{
        shadowColor: "#0f766e",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* Header */}
      <View className="px-5 py-4" style={{ backgroundColor: "#fef9c3" }}>
        <View className="flex-row items-center gap-2">
          <Feather name="star" size={16} color="#ca8a04" />
          <Text className="text-sm font-semibold text-yellow-800">
            Rate Your Delivery
          </Text>
        </View>
      </View>

      <View className="px-5 py-5">
        <Text className="text-center text-sm text-slate-600">
          How was your delivery experience with{" "}
          <Text className="font-bold text-slate-900">{deliveryBoyName}</Text>?
        </Text>

        {/* Stars */}
        <View className="mt-5 flex-row items-center justify-center gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => setRating(star)}
              className="active:scale-110"
              style={{
                transform: [{ scale: star === rating ? 1.15 : 1 }],
              }}
            >
              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    star <= rating ? `${RATING_COLORS[rating]}15` : "#f8fafc",
                }}
              >
                <Feather
                  name="star"
                  size={26}
                  color={star <= rating ? RATING_COLORS[rating] : "#cbd5e1"}
                />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Rating label */}
        {rating > 0 && (
          <Text
            className="mt-2 text-center text-sm font-bold"
            style={{ color: RATING_COLORS[rating] }}
          >
            {RATING_LABELS[rating]}
          </Text>
        )}

        {/* Review text area */}
        <TextInput
          value={review}
          onChangeText={setReview}
          placeholder="Leave a comment (optional)"
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={3}
          className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
          style={{ minHeight: 80, textAlignVertical: "top" }}
        />

        {/* Submit button */}
        <Pressable
          onPress={handleSubmit}
          disabled={isPending || rating === 0}
          className="mt-4 items-center rounded-2xl py-4 active:opacity-80"
          style={{
            backgroundColor: rating > 0 ? "#0f766e" : "#e2e8f0",
          }}
        >
          {isPending ? (
            <Text className="text-sm font-bold text-white">Submitting...</Text>
          ) : (
            <Text
              className="text-sm font-bold"
              style={{ color: rating > 0 ? "#fff" : "#94a3b8" }}
            >
              Submit Rating
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

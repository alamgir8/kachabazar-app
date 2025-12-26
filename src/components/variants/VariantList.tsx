import React, { memo, useCallback, useMemo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { getLocalizedValue } from "@/utils";
import { HapticFeedback } from "@/utils/accessibility";

interface VariantListProps {
  att: string; // Attribute ID
  option?: string; // "Dropdown" | "Button" - display type
  variants: any[]; // Product variants array
  varTitle: any[]; // All variant titles/attributes
  setValue: (value: string) => void;
  selectVariant: Record<string, string>;
  setSelectVariant: (variant: Record<string, string>) => void;
  setSelectVa?: (variant: Record<string, string>) => void;
}

const VariantListComponent: React.FC<VariantListProps> = ({
  att,
  option = "Button",
  variants,
  varTitle,
  setValue,
  selectVariant,
  setSelectVariant,
  setSelectVa,
}) => {
  // Get unique variant values for this attribute from product variants
  const uniqueVariants = useMemo(() => {
    if (!variants || variants.length === 0) return [];

    // Get unique variants by the attribute ID
    const seen = new Map<string, any>();
    variants.forEach((v) => {
      if (v[att] && !seen.has(v[att])) {
        seen.set(v[att], v);
      }
    });
    return Array.from(seen.values());
  }, [variants, att]);

  const handleChangeVariant = useCallback(
    (variantId: string) => {
      setValue(variantId);
      const newSelectVariant = {
        ...selectVariant,
        [att]: variantId,
      };
      setSelectVariant(newSelectVariant);
      setSelectVa?.({ [att]: variantId });
      HapticFeedback.selection();
    },
    [att, selectVariant, setSelectVariant, setSelectVa, setValue]
  );

  // Find the variant name from varTitle
  const getVariantName = useCallback(
    (variantId: string) => {
      for (const vr of varTitle) {
        if (vr._id === att) {
          const found = vr.variants?.find((el: any) => el._id === variantId);
          if (found) {
            return getLocalizedValue(found.name);
          }
        }
      }
      return "";
    },
    [varTitle, att]
  );

  if (uniqueVariants.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {uniqueVariants.map((vl) => {
        const variantId = vl[att];
        const isSelected = selectVariant[att] === variantId;
        const variantName = getVariantName(variantId);

        if (!variantName) return null;

        return (
          <Pressable
            key={variantId}
            onPress={() => handleChangeVariant(variantId)}
            className={`rounded-xl border-2 px-4 py-2.5 ${
              isSelected
                ? "border-primary-500 bg-primary-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                isSelected ? "text-primary-700" : "text-slate-600"
              }`}
            >
              {variantName}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export const VariantList = memo(VariantListComponent);
export default VariantList;

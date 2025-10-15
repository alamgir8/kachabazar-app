import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ModalProps,
} from "react-native";
import { BlurView } from "expo-blur";
import { X } from "lucide-react-native";
import { cn } from "@/utils/cn";

interface BottomSheetProps extends Omit<ModalProps, "children"> {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  height?: "auto" | "half" | "full";
  showCloseButton?: boolean;
  enableScroll?: boolean;
  className?: string;
}

const heightStyles = {
  auto: "max-h-[80%]",
  half: "h-1/2",
  full: "h-[90%]",
};

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  isVisible,
  onClose,
  title,
  height = "auto",
  showCloseButton = true,
  enableScroll = true,
  className,
  ...modalProps
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      {...modalProps}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable className="flex-1" onPress={onClose}>
          <BlurView intensity={20} className="flex-1 justify-end">
            <Pressable
              className={cn(
                "bg-white rounded-t-3xl",
                heightStyles[height],
                className
              )}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <View className="items-center pt-3 pb-2">
                <View className="w-12 h-1 bg-neutral-300 rounded-full" />
              </View>

              {/* Header */}
              {(title || showCloseButton) && (
                <View className="flex-row items-center justify-between px-6 py-3 border-b border-neutral-100">
                  {title ? (
                    <Text className="text-lg font-bold text-neutral-900">
                      {title}
                    </Text>
                  ) : (
                    <View />
                  )}
                  {showCloseButton && (
                    <Pressable
                      onPress={onClose}
                      className="p-2 rounded-full bg-neutral-100 active:bg-neutral-200"
                    >
                      <X size={20} color="#404040" />
                    </Pressable>
                  )}
                </View>
              )}

              {/* Content */}
              {enableScroll ? (
                <ScrollView
                  className="flex-1 px-6 py-4"
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {children}
                </ScrollView>
              ) : (
                <View className="flex-1 px-6 py-4">{children}</View>
              )}
            </Pressable>
          </BlurView>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

interface ModalDialogProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export const ModalDialog: React.FC<ModalDialogProps> = ({
  isVisible,
  onClose,
  title,
  children,
  showCloseButton = true,
  className,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center p-6"
        onPress={onClose}
      >
        <Pressable
          className={cn("bg-white rounded-2xl w-full max-w-md", className)}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-neutral-100">
              {title ? (
                <Text className="text-lg font-bold text-neutral-900">
                  {title}
                </Text>
              ) : (
                <View />
              )}
              {showCloseButton && (
                <Pressable
                  onPress={onClose}
                  className="p-2 rounded-full bg-neutral-100 active:bg-neutral-200"
                >
                  <X size={20} color="#404040" />
                </Pressable>
              )}
            </View>
          )}

          {/* Content */}
          <View className="px-6 py-4">{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

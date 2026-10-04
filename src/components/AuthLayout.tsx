import { ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/theme/useThemeColors";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  showBack?: boolean;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  showBack,
}: Props) {
  const c = useThemeColors();
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/login"); // fallback if there's no history
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: c.background }}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Back button */}
        {showBack && (
          <View className="px-5 pt-2">
            <TouchableOpacity
              onPress={goBack}
              className="h-10 w-10 items-center justify-center rounded-full border"
              style={{ borderColor: c.border, backgroundColor: c.surface }}
            >
              <Ionicons name="chevron-back" size={20} color={c.foreground} />
            </TouchableOpacity>
          </View>
        )}

        <View className="flex-1 justify-center px-6">
          <View className="items-center mb-8">
            <Text
              className="text-3xl font-bold text-center"
              style={{ color: c.foreground }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                className="text-base text-center mt-2"
                style={{ color: c.muted }}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          {children}

          {footer ? <View className="mt-10 items-center">{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
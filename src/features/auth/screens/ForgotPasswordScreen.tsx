import { useState } from "react";
import { View, Text } from "react-native";
import { Link, useRouter } from "expo-router";
import { useForgotPassword } from "@/features/auth/hooks/useAuth";
import { useThemeColors } from "@/theme/useThemeColors";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { AuthLayout, FormField, Button } from "@/components";

export default function ForgotPasswordScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { mutate: forgot, isPending, isError, error } = useForgotPassword();
  const disabled = isPending || !email.trim();

  const submit = () => {
    const value = email.trim().toLowerCase();
    forgot(value, {
      onSuccess: () =>
        router.push(`/reset-password?email=${encodeURIComponent(value)}`),
    });
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send a reset code"
      showBack
      footer={
        <Link
          href="/login"
          className="text-center"
          style={{ color: colors.muted }}
        >
          Remembered it?{" "}
          <Text className="font-semibold" style={{ color: colors.primary }}>
            Log in
          </Text>
        </Link>
      }
    >
      <View className="rounded-2xl border border-border bg-surface p-5 gap-3">
        {isError && (
          <Text className="text-center text-primary">
            {getErrorMessage(error, "Something went wrong.")}
          </Text>
        )}
        <FormField
          icon="mail-outline"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Button label="Send reset code" onPress={submit} loading={isPending} disabled={disabled} />
      </View>
    </AuthLayout>
  );
}
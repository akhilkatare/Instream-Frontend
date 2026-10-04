import { useState } from "react";
import { View, Text, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useResetPassword } from "@/features/auth/hooks/useAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { AuthLayout, OtpInput, FormField, Button } from "@/components";

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { mutate, isPending, isError, error } = useResetPassword();
  const disabled = isPending || otp.length < 6 || newPassword.length < 6;

  const onSubmit = () =>
    mutate(
      { email: String(email), otp: otp.trim(), newPassword },
      {
        onSuccess: () => {
          Alert.alert("Done", "Password reset. Please log in.");
          router.replace("/login");
        },
      }
    );

  return (
    <AuthLayout title="Reset password" showBack subtitle={`Enter the code sent to ${email}`}>
      <View className="rounded-2xl border border-border bg-surface p-5 gap-4">
        {isError && (
          <Text className="text-center text-primary">
            {getErrorMessage(error, "Invalid or expired code.")}
          </Text>
        )}
        <OtpInput value={otp} onChange={setOtp} />
        <FormField
          icon="lock-closed-outline"
          placeholder="New password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Button label="Reset password" onPress={onSubmit} loading={isPending} disabled={disabled} />
      </View>
    </AuthLayout>
  );
}
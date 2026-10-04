import { useState } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVerifyOTP } from "@/features/auth/hooks/useAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { AuthLayout, OtpInput, Button } from "@/components";

export default function VerifyOTPScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const { mutate, isPending, isError, error } = useVerifyOTP();
  const disabled = isPending || otp.length < 6;

  const onSubmit = () =>
    mutate(
      { email: String(email), otp: otp.trim() },
      { onSuccess: () => router.replace("/login") }
    );

  return (
    <AuthLayout title="Verify your email" showBack subtitle={`Enter the 6-digit code sent to ${email}`}>
      <View className="rounded-2xl border border-border bg-surface p-5 gap-4">
        {isError && (
          <Text className="text-center text-primary">
            {getErrorMessage(error, "Invalid or expired code.")}
          </Text>
        )}
        <OtpInput value={otp} onChange={setOtp} autoFocus />
        <Button label="Verify" onPress={onSubmit} loading={isPending} disabled={disabled} />
      </View>
    </AuthLayout>
  );
}
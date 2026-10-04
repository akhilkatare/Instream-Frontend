import { useState } from "react";
import { View, Text } from "react-native";
import { Link, useRouter } from "expo-router";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { useThemeColors } from "@/theme/useThemeColors";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { AuthLayout, FormField, Button } from "@/components";

export default function RegisterScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { mutate, isPending, isError, error } = useRegister();

  const mismatch = confirm.length > 0 && password !== confirm;
  const disabled =
    isPending || !email.trim() || password.length < 6 || password !== confirm;

  const onSubmit = () =>
    mutate(
      { email: email.trim(), password, confirmPassword: confirm },
      {
        onSuccess: () =>
          router.push({ pathname: "/verify-otp", params: { email: email.trim() } }),
      }
    );

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="We'll email you a code to verify"
      showBack
      footer={
        <Link
          href="/login"
          className="text-center"
          style={{ color: colors.muted }}
        >
          Already have an account?{" "}
          <Text className="font-semibold" style={{ color: colors.primary }}>
            Log in
          </Text>
        </Link>
      }
    >
      <View className="rounded-2xl border border-border bg-surface p-5 gap-3">
        {mismatch && (
          <Text className="text-center text-primary">Passwords don't match.</Text>
        )}
        {isError && (
          <Text className="text-center text-primary">
            {getErrorMessage(error, "Could not register.")}
          </Text>
        )}
        <FormField
          icon="mail-outline"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <FormField
          icon="lock-closed-outline"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <FormField
          icon="shield-checkmark-outline"
          placeholder="Confirm password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
        <Button label="Register" onPress={onSubmit} loading={isPending} disabled={disabled} />
      </View>
    </AuthLayout>
  );
}
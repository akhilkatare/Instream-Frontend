import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { useThemeColors } from "@/theme/useThemeColors";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { AuthLayout, FormField, Button } from "@/components";

export default function LoginScreen() {
  const colors = useThemeColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, isError, error } = useLogin();
  const disabled = isPending || !email.trim() || !password;

  return (
    <AuthLayout
      title="Welcome to Instream"
      footer={
        <Link
          href="/register"
          className="text-center"
          style={{ color: colors.muted }}
        >
          Don't have an account?{" "}
          <Text className="font-semibold" style={{ color: colors.primary }}>
            Sign up
          </Text>
        </Link>
      }
    >
      <View className="rounded-2xl border border-border bg-surface p-5 gap-3">
        {isError && (
          <Text className="text-center text-primary mb-1">
            {getErrorMessage(error, "Invalid email or password.")}
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
        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text className="text-right font-medium text-primary">
            Forgot password?
          </Text>
        </TouchableOpacity>
        <Button
          label="Log in"
          onPress={() => mutate({ email: email.trim(), password })}
          loading={isPending}
          disabled={disabled}
        />
      </View>
    </AuthLayout>
  );
}
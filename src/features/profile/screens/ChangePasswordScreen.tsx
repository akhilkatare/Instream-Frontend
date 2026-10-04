import { useState } from "react";
import { View, Text } from "react-native";
import { useChangePassword } from "@/features/profile/hooks/useAccount";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { AuthLayout, FormField, Button } from "@/components";
import { useThemeColors } from "@/theme/useThemeColors";

export default function ChangePasswordScreen() {
  const colors = useThemeColors();
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const { mutate, isPending, isError, error } = useChangePassword();

  const disabled = isPending || !oldPassword || newPassword.length < 6;

  return (
    <AuthLayout
      title="Change password"
      subtitle="You'll be logged out on all devices"
      showBack
    >
      <View
        className="rounded-2xl border p-5 gap-3"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        {isError && (
          <Text className="text-center" style={{ color: colors.primary }}>
            {getErrorMessage(error, "Could not change password.")}
          </Text>
        )}

        <FormField
          icon="lock-closed-outline"
          placeholder="Current password"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOld}
        />
        <FormField
          icon="key-outline"
          placeholder="New password (min 6 chars)"
          secureTextEntry
          value={newPassword}
          onChangeText={setNew}
        />

        <Button
          label="Change password"
          onPress={() => mutate({ oldPassword, newPassword })}
          loading={isPending}
          disabled={disabled}
        />
      </View>
    </AuthLayout>
  );
}
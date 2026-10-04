import { Pressable, Text, ActivityIndicator } from "react-native";
import { useThemeColors } from "@/theme/useThemeColors";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({ label, onPress, loading, disabled }: Props) {
  const c = useThemeColors();
  const isDisabled = disabled || loading;
  return (
    <Pressable
      className={`items-center rounded-xl py-3.5 ${isDisabled ? "opacity-50" : ""}`}
      style={{ backgroundColor: c.primary }}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={c.primaryForeground} />
      ) : (
        <Text
          className="text-base font-bold"
          style={{ color: c.primaryForeground }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
import { ComponentProps } from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/theme/useThemeColors";

type Props = TextInputProps & {
  icon: ComponentProps<typeof Ionicons>["name"];
};

export default function FormField({ icon, style, ...props }: Props) {
  const c = useThemeColors();
  return (
    <View
      className="flex-row items-center rounded-xl border px-4"
      style={{ borderColor: c.border, backgroundColor: c.input }}
    >
      <Ionicons name={icon} size={20} color={c.muted} />
      <TextInput
        className="flex-1 pl-3"
        style={[
          {
            fontSize: 15,
            paddingVertical: 12,
            textAlignVertical: "center",
            color: c.foreground,
          },
          style,
        ]}
        placeholderTextColor={c.muted}
        selectionColor={c.primary}
        cursorColor={c.primary}
        {...props}
      />
    </View>
  );
}
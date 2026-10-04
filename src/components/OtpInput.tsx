import { useRef } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

type Props = {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  autoFocus?: boolean;
};

export default function OtpInput({ value, onChange, length = 6, autoFocus }: Props) {
  const ref = useRef<TextInput>(null);
  return (
    <Pressable className="flex-row gap-2" onPress={() => ref.current?.focus()}>
      {Array.from({ length }).map((_, i) => {
        const char = value[i] ?? "";
        const isActive = i === value.length;
        return (
          <View
            key={i}
            className={`flex-1 aspect-square items-center justify-center rounded-xl border bg-input ${
              isActive ? "border-primary" : "border-border"
            }`}
          >
            <Text className="text-xl font-bold text-foreground">{char}</Text>
          </View>
        );
      })}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/[^0-9]/g, "").slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        caretHidden
        autoFocus={autoFocus}
        className="absolute h-full w-full opacity-0"
      />
    </Pressable>
  );
}
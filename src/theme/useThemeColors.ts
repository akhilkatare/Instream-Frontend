import { useColorScheme } from "nativewind";
import { lightColors, darkColors } from "./colors";

export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? darkColors : lightColors;
}

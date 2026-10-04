import { Image, Text, TouchableOpacity, View } from "react-native";
import type { Video } from "@/types";
import { useThemeColors } from "@/theme/useThemeColors";

// Relative-time formatter → "3 days ago", "2 months ago", etc.
// Hand-rolled because Hermes (RN's engine) lacks Intl.RelativeTimeFormat.
const DIVISIONS: { amount: number; unit: string }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];
function timeAgo(date?: Date | string): string {
  if (!date) return "";
  let duration = (Date.now() - new Date(date).getTime()) / 1000; // seconds since upload
  if (duration < 30) return "just now";
  for (const d of DIVISIONS) {
    if (duration < d.amount) {
      const value = Math.round(duration);
      return `${value} ${d.unit}${value === 1 ? "" : "s"} ago`;
    }
    duration /= d.amount;
  }
  return "";
}

// Formats a duration in seconds → "m:ss", or "h:mm:ss" when there's an hour or more.
function formatDuration(input?: string | number): string {
  if (input == null) return "";
  const total = Math.floor(Number(input));
  if (!Number.isFinite(total) || total < 0) {
    // Already a preformatted string → show as-is.
    return typeof input === "string" ? input : "";
  }
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export default function VideoCard({
  video,
  onPress,
}: {
  video: Video;
  onPress: () => void;
}) {
  const c = useThemeColors();
  const durationLabel = formatDuration(video.duration);
  const channelName = video.channel?.name ?? "";

  const subParts = [
    channelName,
    `${video.views} views`,
    timeAgo(video.uploadedAt),
  ].filter(Boolean);

  return (
    <TouchableOpacity className="mb-5" onPress={onPress} activeOpacity={0.85}>
      {/* Full-bleed thumbnail (negative margin cancels the list's 16px padding) */}
      <View className="relative" style={{ marginHorizontal: -16 }}>
        <Image
          source={{ uri: video.thumbnailUrl }}
          resizeMode="cover"
          className="w-full aspect-video bg-surface"
        />
        {!!durationLabel && (
          <View className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5">
            <Text className="text-white text-xs font-semibold">{durationLabel}</Text>
          </View>
        )}
      </View>

      {/* Title + meta */}
      <View className="mt-3">
        <Text className="text-base text-lg font-semibold text-foreground" numberOfLines={2}>
          {video.title}
        </Text>
        <Text className="text-sm text-muted mt-1" numberOfLines={1}>
          {subParts.join(" · ")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { VideoPlayer } from "../components/VideoPlayer";
import CommentsSection from "@/features/comment/components/CommentSection";
import { useAppendToHistory } from "@/features/history/hooks/useHistory";
import {
  useVideo,
  useLikeVideo,
  useUnlikeVideo,
  useIncrementViews,
} from "@/features/video/hooks/useVideos";
import {
  useFollowChannel,
  useUnfollowChannel,
} from "@/features/channel/hooks/useChannel";
import { useThemeColors } from "@/theme/useThemeColors";

// Relative time without Intl (Hermes-safe).
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
  let duration = (Date.now() - new Date(date).getTime()) / 1000;
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

export default function WatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useThemeColors();
  const { data: video, isLoading } = useVideo(id);

  const like = useLikeVideo();
  const unlike = useUnlikeVideo();
  const incViews = useIncrementViews();
  const append = useAppendToHistory();
  const follow = useFollowChannel();
  const unfollow = useUnfollowChannel();

  const [descExpanded, setDescExpanded] = useState(false);

  // Count a view (and record history) once per mount.
  const countedRef = useRef(false);
  useEffect(() => {
    if (id && !countedRef.current) {
      countedRef.current = true;
      incViews.mutate(id);
      append.mutate(id);
    }
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  if (!video) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted text-base">Video not found.</Text>
      </View>
    );
  }

  const toggleLike = () =>
    video.isLiked ? unlike.mutate(video.id) : like.mutate(video.id);

  const toggleFollow = () => {
    if (!video.channel) return;
    video.channel.isFollowing
      ? unfollow.mutate(video.channel.id)
      : follow.mutate(video.channel.id);
  };

  const onShare = () =>
    Share.share({ message: `${video.title}\n${video.videoUrl}` });

  const isFollowing = video.channel?.isFollowing;
  const metaLine = [`${video.views} views`, timeAgo(video.uploadedAt)]
    .filter(Boolean)
    .join(" · ");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={["top"]}>
      {video.videoUrl ? (
        <VideoPlayer uri={video.videoUrl} />
      ) : (
        <View className="w-full bg-black" style={{ aspectRatio: 16 / 9 }} />
      )}

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Title */}
        <Text className="text-lg font-bold text-foreground" numberOfLines={2}>
          {video.title}
        </Text>

        {/* Channel row */}
        {video.channel && (
          <View className="flex-row items-center mt-4">
            <View className="h-10 w-10 rounded-full bg-primary items-center justify-center">
              <Text className="text-white font-bold">
                {video.channel.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
                {video.channel.name}
              </Text>
              {video.channel.followers != null && (
                <Text className="text-xs text-muted mt-0.5">
                  {video.channel.followers}{" "}
                  {video.channel.followers === 1 ? "follower" : "followers"}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={toggleFollow}
              className={`rounded-full px-5 py-2 ${
                isFollowing ? "border border-border bg-surface" : "bg-primary"
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  isFollowing ? "text-foreground" : "text-white"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
          className="mt-4 -mx-1 px-1"
        >
          <TouchableOpacity
            onPress={toggleLike}
            className="flex-row items-center gap-2 rounded-full border border-border bg-surface px-4 py-2"
          >
            <Ionicons
              name={video.isLiked ? "thumbs-up" : "thumbs-up-outline"}
              size={18}
              color={video.isLiked ? c.primary : c.foreground}
            />
            <Text className="text-foreground font-semibold text-sm">{video.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onShare}
            className="flex-row items-center gap-2 rounded-full border border-border bg-surface px-4 py-2"
          >
            <Ionicons name="share-social-outline" size={18} color={c.foreground} />
            <Text className="text-foreground font-semibold text-sm">Share</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Description box (tap to expand) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setDescExpanded((e) => !e)}
          className="mt-4 rounded-xl bg-surface p-3"
        >
          <Text className="text-sm font-semibold text-foreground">{metaLine}</Text>
          {!!video.description && (
            <Text
              className="text-sm text-foreground mt-1 leading-5"
              numberOfLines={descExpanded ? undefined : 2}
            >
              {video.description}
            </Text>
          )}
          {!!video.description && (
            <Text className="text-xs text-muted font-semibold mt-1">
              {descExpanded ? "Show less" : "...more"}
            </Text>
          )}
        </TouchableOpacity>

        <CommentsSection videoId={video.id} />
      </ScrollView>
    </SafeAreaView>
  );
}
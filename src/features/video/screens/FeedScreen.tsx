import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useVideos } from "@/features/video/hooks/useVideos";
import VideoCard from "@/features/video/components/VideoCard";
import { useThemeColors } from "@/theme/useThemeColors";

export default function FeedScreen() {
  const router = useRouter();
  const c = useThemeColors();
  const { data: videos, isLoading, isError, refetch, isRefetching } = useVideos();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted text-base">Couldn't load videos.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={["top"]}>
      <FlatList
        data={videos}
        keyExtractor={(v) => v.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold tracking-tighter text-primary">Instream</Text>
            <TouchableOpacity
              onPress={() => router.push("/search")}
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
            >
              <Ionicons name="search" size={20} color={c.foreground} />
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <VideoCard video={item} onPress={() => router.push(`/watch/${item.id}`)} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={c.primary}
          />
        }
        ListEmptyComponent={
          <Text className="text-muted text-center mt-10 text-base">No videos yet.</Text>
        }
      />
    </SafeAreaView>
  );
}
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useHistory, useDeleteFromHistory } from "@/features/history/hooks/useHistory";
import VideoCard from "@/features/video/components/VideoCard";
import { useThemeColors } from "@/theme/useThemeColors";

export default function HistoryScreen() {
  const router = useRouter();
  const c = useThemeColors();
  const { data: history, isLoading, isError } = useHistory();
  const del = useDeleteFromHistory();

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
        <Text className="text-muted text-base">Couldn't load your history.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={["top"]}>
      {/* Header: back + centered title */}
      <View className="flex-row items-center px-4 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
        >
          <Ionicons name="chevron-back" size={20} color={c.foreground} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold tracking-tight text-primary">
          Watch history
        </Text>
        {/* Spacer to balance the back button so the title centers */}
        <View className="w-10" />
      </View>

      <FlatList
        data={history}
        keyExtractor={(v) => v.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="mb-1">
            <VideoCard video={item} onPress={() => router.push(`/watch/${item.id}`)} />
            <TouchableOpacity
              className="flex-row items-center gap-1.5 self-start -mt-3 mb-4"
              onPress={() => del.mutate(item.id)}
            >
              <Ionicons name="trash-outline" size={16} color={c.muted} />
              <Text className="text-muted text-sm">Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-muted text-center mt-10 text-base">
            Nothing watched yet.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
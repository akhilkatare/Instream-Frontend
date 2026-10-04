import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useFollowingChannels,
  useUnfollowChannel,
} from "@/features/channel/hooks/useChannel";
import { useThemeColors } from "@/theme/useThemeColors";
import { Ionicons } from "@expo/vector-icons";

export default function FollowingScreen() {
  const router = useRouter();
  const c = useThemeColors();
  const { data: channels, isLoading, isError } = useFollowingChannels();
  const { mutate: unfollow } = useUnfollowChannel();

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
        <Text className="text-muted text-base">Couldn't load your subscriptions.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={["top"]}>
      <View className="px-4 pt-2 pb-3">
        <Text className="text-center text-xl font-bold tracking-tight text-primary">
          Following Channels
        </Text>
      </View>
      <FlatList
        data={channels}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center gap-3 py-2"
            onPress={() => router.push(`/channel/${item.id}`)}
            activeOpacity={0.7}
          >
            {/* Avatar */}
            <View className="h-14 w-14 rounded-full bg-primary items-center justify-center">
              <Text className="text-white font-bold text-xl">
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            {/* Name + subline */}
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
                {item.name}
              </Text>
              {!!item.description && (
                <Text className="text-sm text-muted mt-0.5" numberOfLines={1}>
                  {item.description}
                </Text>
              )}
            </View>

            {/* Following pill → unfollow */}
            <TouchableOpacity
              onPress={() => unfollow(item.id)}
              hitSlop={6}
              className="rounded-full border border-border bg-surface px-4 py-1.5"
            >
              <Text className="text-foreground font-semibold text-sm">Following</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-muted text-center mt-10 text-base">
            You're not following any channels yet.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
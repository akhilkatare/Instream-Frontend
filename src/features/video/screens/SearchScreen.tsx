import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useSearchVideos } from "@/features/video/hooks/useVideos";
import VideoCard from "@/features/video/components/VideoCard";
import { useThemeColors } from "@/theme/useThemeColors";

export default function SearchScreen() {
  const router = useRouter();
  const c = useThemeColors();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  // Debounce so we don't fire a request on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data: results, isFetching } = useSearchVideos(debounced);
  const hasQuery = debounced.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={["top"]}>
      {/* Header: back + search bar */}
      <View className="flex-row items-center gap-3 px-4 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
        >
          <Ionicons name="chevron-back" size={20} color={c.foreground} />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center rounded-full border border-border bg-input px-4">
          <Ionicons name="search" size={18} color={c.muted} />
          <TextInput
            className="flex-1 text-foreground ml-2"
            style={{ fontSize: 15, paddingVertical: 10 }}
            placeholder="Search videos and channels"
            placeholderTextColor={c.muted}
            selectionColor={c.primary}
            cursorColor={c.primary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={c.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Body */}
      {!hasQuery ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-muted text-center text-xl font-semibold">
            Search your favourite content and channels
          </Text>
        </View>
      ) : isFetching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(v) => v.id}
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <VideoCard video={item} onPress={() => router.push(`/watch/${item.id}`)} />
          )}
          ListEmptyComponent={
            <Text className="text-muted text-center mt-10 text-base">
              No results for "{debounced}"
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
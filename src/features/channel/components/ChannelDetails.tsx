import { useState } from "react";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useUpdateChannelName,
  useUpdateChannelDescription,
  useDeleteChannel,
} from "@/features/channel/hooks/useChannel";
import { useChannelVideos } from "@/features/video/hooks/useVideos";
import VideoCard from "@/features/video/components/VideoCard";
import { useThemeColors } from "@/theme/useThemeColors";
import { getErrorMessage } from "@/utils/getErrorMessage";

type Channel = {
  id: string;
  name: string;
  description: string;
  followers: number;
};

export default function ChannelDetail({
  channel,
  isOwner,
  showBack = false,
}: {
  channel: Channel;
  isOwner: boolean;
  showBack?: boolean;
}) {
  const c = useThemeColors();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);

  const { data: videos } = useChannelVideos(channel.id);
  const { mutate: updateName } = useUpdateChannelName();
  const { mutate: updateDescription } = useUpdateChannelDescription();
  const { mutate: deleteChannel, isPending: deleting } = useDeleteChannel();

  // Keep the viewer-side cache fresh when the owner edits from /channel/[id].
  const refreshView = () =>
    queryClient.invalidateQueries({ queryKey: ["channel", "view", channel.id] });

  const onEditName = () => {
    Alert.prompt?.(
      "Edit channel name",
      "Enter a new name",
      (text) => {
        const next = text?.trim();
        if (next && next !== channel.name) {
          updateName(next, {
            onSuccess: refreshView,
            onError: (e) => Alert.alert("Error", getErrorMessage(e)),
          });
        }
      },
      "plain-text",
      channel.name
    );
  };

  const onEditDescription = () => {
    Alert.prompt?.(
      "Edit description",
      "What's your channel about?",
      (text) => {
        const next = (text ?? "").trim();
        if (next !== channel.description) {
          updateDescription(next, {
            onSuccess: refreshView,
            onError: (e) => Alert.alert("Error", getErrorMessage(e)),
          });
        }
      },
      "plain-text",
      channel.description
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete channel?",
      "This removes your channel and its videos. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteChannel(undefined, {
              onSuccess: () => showBack && router.back(),
              onError: (e) => Alert.alert("Error", getErrorMessage(e)),
            }),
        },
      ]
    );
  };

  const canExpand = (channel.description?.length ?? 0) > 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={["top"]}>
      {showBack && (
        <View className="px-4 pt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
          >
            <Ionicons name="chevron-back" size={20} color={c.foreground} />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={videos}
        keyExtractor={(v) => v.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View className="mb-2">
            {/* Identity row */}
            <View className="flex-row items-center">
              <View className="h-16 w-16 rounded-full bg-primary items-center justify-center">
                <Text className="text-white text-2xl font-bold">
                  {channel.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="flex-1 ml-4">
                <View className="flex-row items-center gap-2">
                  <Text
                    className="text-xl font-bold text-foreground flex-shrink"
                    numberOfLines={1}
                  >
                    {channel.name}
                  </Text>
                  {isOwner && (
                    <>
                      <TouchableOpacity onPress={onEditName} hitSlop={8}>
                        <Ionicons name="create-outline" size={18} color={c.muted} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleDelete} disabled={deleting} hitSlop={8}>
                        <Ionicons name="trash-outline" size={18} color={c.primary} />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                <Text className="text-muted text-sm mt-1">
                  {channel.followers}{" "}
                  {channel.followers === 1 ? "follower" : "followers"}
                </Text>
              </View>
            </View>

            {/* Description + see more */}
            <View className="mt-4">
              {channel.description ? (
                <>
                  <Text
                    className="text-muted leading-5"
                    numberOfLines={expanded ? undefined : 2}
                  >
                    {channel.description}
                  </Text>
                  <View className="flex-row items-center gap-3 mt-1">
                    {canExpand && (
                      <TouchableOpacity onPress={() => setExpanded((e) => !e)} hitSlop={6}>
                        <Text className="text-muted text-sm font-semibold">
                          {expanded ? "See less" : "See more"}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {isOwner && (
                      <TouchableOpacity onPress={onEditDescription} hitSlop={6}>
                        <Ionicons name="pencil-outline" size={14} color={c.muted} />
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              ) : isOwner ? (
                <TouchableOpacity onPress={onEditDescription} hitSlop={6}>
                  <Text className="text-primary font-semibold">Add a description</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Upload (owner only) */}
            {isOwner && (
              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 bg-primary rounded-xl py-3 mt-8"
                onPress={() => router.push("/upload")}
              >
                <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                <Text className="text-white font-bold text-base">Upload video</Text>
              </TouchableOpacity>
            )}

            {/* Videos section */}
            <Text className="text-lg font-bold text-muted mt-8">Videos</Text>
            <View className="h-px bg-border my-2" />
          </View>
        }
        renderItem={({ item }) => (
          <VideoCard video={item} onPress={() => router.push(`/watch/${item.id}`)} />
        )}
        ListEmptyComponent={
          <Text className="text-muted text-center mt-6">
            {isOwner
              ? "You haven't uploaded any videos yet."
              : "No videos on this channel yet."}
          </Text>
        }
      />
    </SafeAreaView>
  );
}
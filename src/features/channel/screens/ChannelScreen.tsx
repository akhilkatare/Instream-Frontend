import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

import { useChannelView, useMyChannel } from "@/features/channel/hooks/useChannel";
import ChannelDetail from "@/features/channel/components/ChannelDetails";
import { useThemeColors } from "@/theme/useThemeColors";

export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useThemeColors();

  const { data: channel, isLoading } = useChannelView(id);
  const { data: myChannel } = useMyChannel();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  if (!channel) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted">Channel not found.</Text>
      </View>
    );
  }

  const isOwner = !!myChannel && myChannel.id === channel.id;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ChannelDetail channel={channel} isOwner={isOwner} showBack />
    </>
  );
}
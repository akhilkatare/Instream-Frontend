import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeColors } from "@/theme/useThemeColors";
import { useMyChannel, useCreateChannel } from "@/features/channel/hooks/useChannel";
import ChannelDetail from "@/features/channel/components/ChannelDetails";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function MyChannelScreen() {
  const c = useThemeColors();
  const { data: channel, isLoading, isError } = useMyChannel();

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
        <Text className="text-muted text-base">Couldn't load your channel.</Text>
      </View>
    );
  }

  // The owner always sees the full set of controls.
  return channel ? (
    <ChannelDetail channel={channel} isOwner />
  ) : (
    <CreateChannel />
  );
}

/* ----------------------------- Create ----------------------------- */

function CreateChannel() {
  const c = useThemeColors();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: createChannel, isPending } = useCreateChannel();

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Give your channel a name to continue.");
      return;
    }
    createChannel(
      { name: name.trim(), description: description.trim() },
      { onError: (e) => Alert.alert("Error", getErrorMessage(e)) }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text className="text-2xl font-bold text-foreground">Create your channel</Text>
          <Text className="text-sm text-muted mt-1 mb-4">
            Start sharing videos. You can change these details anytime.
          </Text>

          <Text className="text-sm font-semibold text-foreground mt-3 mb-1.5">
            Channel name
          </Text>
          <TextInput
            className="rounded-xl border border-border bg-input px-4 text-foreground"
            style={{ fontSize: 15, paddingVertical: 12 }}
            placeholderTextColor={c.muted}
            selectionColor={c.primary}
            cursorColor={c.primary}
            placeholder="e.g. Pixel & Frame"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text className="text-sm font-semibold text-foreground mt-4 mb-1.5">
            Description
          </Text>
          <TextInput
            className="rounded-xl border border-border bg-input px-4 text-foreground"
            style={{ fontSize: 15, paddingVertical: 12, minHeight: 100 }}
            placeholderTextColor={c.muted}
            selectionColor={c.primary}
            cursorColor={c.primary}
            placeholder="What's your channel about?"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            className={`bg-primary rounded-xl py-3.5 items-center mt-6 ${
              isPending ? "opacity-50" : ""
            }`}
            onPress={handleCreate}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">Create channel</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
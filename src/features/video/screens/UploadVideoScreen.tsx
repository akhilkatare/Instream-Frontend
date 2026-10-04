import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useUploadVideo } from "@/features/video/hooks/useVideos";
import type { LocalFile } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useThemeColors } from "@/theme/useThemeColors";

function toLocalFile(
  asset: ImagePicker.ImagePickerAsset,
  fallbackType: string
): LocalFile {
  const uri = asset.uri;
  const name = asset.fileName ?? uri.split("/").pop() ?? "upload";
  return { uri, name, type: asset.mimeType ?? fallbackType };
}

export default function UploadScreen() {
  const router = useRouter();
  const c = useThemeColors();
  const { mutate: upload, isPending } = useUploadVideo();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<LocalFile | null>(null);
  const [thumbnail, setThumbnail] = useState<LocalFile | null>(null);

  const pickVideo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 1,
    });
    if (!res.canceled) setVideo(toLocalFile(res.assets[0], "video/mp4"));
  };

  const pickThumbnail = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!res.canceled) setThumbnail(toLocalFile(res.assets[0], "image/jpeg"));
  };

  const handleUpload = () => {
    if (!title.trim()) return Alert.alert("Title required");
    if (!video) return Alert.alert("Pick a video");
    if (!thumbnail) return Alert.alert("Pick a thumbnail");

    upload(
      { title: title.trim(), description: description.trim(), video, thumbnail },
      {
        onSuccess: () => {
          Alert.alert("Published", "Your video is live.");
          setTitle("");
          setDescription("");
          setVideo(null);
          setThumbnail(null);
          router.replace("/(tabs)");
        },
        onError: (e) => Alert.alert("Upload failed", getErrorMessage(e)),
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Header: back + centered title */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
            >
              <Ionicons name="chevron-back" size={20} color={c.foreground} />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-2xl font-bold tracking-tight text-primary">
              Upload Video
            </Text>
            {/* Spacer to balance the back button so the title centers */}
            <View className="w-10" />
          </View>

          {/* Title */}
          <Text className="text-lg font-semibold text-muted mb-1.5">Title</Text>
          <TextInput
            className="rounded-xl border border-border bg-input px-4 text-foreground"
            style={{ fontSize: 15, paddingVertical: 12 }}
            placeholderTextColor={c.muted}
            selectionColor={c.primary}
            cursorColor={c.primary}
            value={title}
            onChangeText={setTitle}
            placeholder="Video title"
          />

          {/* Description */}
          <Text className="text-lg font-semibold text-muted mt-5 mb-1.5">Description</Text>
          <TextInput
            className="rounded-xl border border-border bg-input px-4 text-foreground"
            style={{ fontSize: 15, paddingVertical: 12, minHeight: 100 }}
            placeholderTextColor={c.muted}
            selectionColor={c.primary}
            cursorColor={c.primary}
            value={description}
            onChangeText={setDescription}
            placeholder="What's this video about?"
            multiline
            textAlignVertical="top"
          />

          {/* Pickers */}
          <TouchableOpacity
            className="border border-primary border-dashed rounded-xl py-4 items-center mt-6"
            onPress={pickThumbnail}
          >
            <Text className="text-primary font-semibold">
              {thumbnail ? "Thumbnail selected" : "Select thumbnail"}
            </Text>
          </TouchableOpacity>
          {thumbnail && (
            <Image
              source={{ uri: thumbnail.uri }}
              className="w-full rounded-xl mt-2 bg-surface"
              style={{ aspectRatio: 16 / 9 }}
            />
          )}

          <TouchableOpacity
            className="border border-primary border-dashed rounded-xl py-4 items-center mt-3"
            onPress={pickVideo}
          >
            <Text className="text-primary font-semibold">
              {video ? `🎬 ${video.name}` : "Select video"}
            </Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            className={`bg-primary rounded-xl py-3.5 items-center mt-6 ${
              isPending ? "opacity-50" : ""
            }`}
            onPress={handleUpload}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">Publish</Text>
            )}
          </TouchableOpacity>

          {isPending && (
            <Text className="text-muted text-sm text-center mt-3">
              Uploading to Cloudinary… this can take a moment for large files.
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
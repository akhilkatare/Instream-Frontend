import { useState, ReactNode } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import {
  useCurrentUser,
  useUploadDisplayPicture,
  useDeleteAccount,
} from "@/features/profile/hooks/useAccount";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { displayPictureUrl } from "@/api/account.api";
import { useThemeColors } from "@/theme/useThemeColors";

/* ---- Settings row ---- */
function Row({
  icon,
  label,
  onPress,
  danger,
  last,
  right,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
  right?: ReactNode;
}) {
  const c = useThemeColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.6}
      className="flex-row items-center px-4 py-4"
      style={!last ? { borderBottomWidth: 1, borderBottomColor: c.border } : undefined}
    >
      <Ionicons name={icon} size={20} color={danger ? c.primary : c.foreground} />
      <Text
        className={`flex-1 ml-3 text-base ${danger ? "font-medium" : ""}`}
        style={{ color: danger ? c.primary : c.foreground }}
      >
        {label}
      </Text>
      {right ?? (!danger && <Ionicons name="chevron-forward" size={18} color={c.muted} />)}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const c = useThemeColors();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { data: user, isLoading, isError } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const uploadDp = useUploadDisplayPicture();
  const deleteAcct = useDeleteAccount();
  const [photoVersion, setPhotoVersion] = useState(0);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: c.background }}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: c.background }}>
        <Text className="text-base" style={{ color: c.muted }}>Couldn't load your profile.</Text>
      </View>
    );
  }

  const dpUrl = user.hasDisplayPicture
    ? `${displayPictureUrl(user.id)}?v=${photoVersion}` // ?v busts RN image cache
    : null;

  const onChangePhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted)
      return Alert.alert("Permission needed", "Allow photo access to set an avatar.");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    uploadDp.mutate(
      {
        uri: asset.uri,
        name: asset.fileName ?? "dp.jpg",
        type: asset.mimeType ?? "image/jpeg",
      },
      { onSuccess: () => setPhotoVersion((v) => v + 1) }
    );
  };

  const onDelete = () =>
    Alert.prompt?.(
      "Delete account",
      "Enter your password to confirm.",
      (password) => {
        if (password) deleteAcct.mutate(password);
      },
      "secure-text"
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Avatar + identity, one row */}
        <View className="flex-row items-center mb-8">
          <Pressable onPress={onChangePhoto} className="relative">
            {dpUrl ? (
              <Image source={{ uri: dpUrl }} className="h-16 w-16 rounded-full" />
            ) : (
              <View
                className="h-16 w-16 rounded-full items-center justify-center"
                style={{ backgroundColor: c.primary }}
              >
                <Text className="text-white text-2xl font-bold">
                  {user.email[0]?.toUpperCase()}
                </Text>
              </View>
            )}
            {/* Clickable camera badge */}
            <View
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full items-center justify-center border-2"
              style={{ backgroundColor: c.primary, borderColor: c.background }}
            >
              {uploadDp.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={12} color="#fff" />
              )}
            </View>
          </Pressable>

          <View className="flex-1 ml-4">
            <Text
              className="text-lg font-bold"
              style={{ color: c.foreground }}
              numberOfLines={1}
            >
              {user.email}
            </Text>
            <View className="flex-row items-center mt-1 gap-2">
              {user.isStreamer && (
                <View className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: c.input }}>
                  <Text className="text-xs font-semibold" style={{ color: c.primary }}>Streamer</Text>
                </View>
              )}
              <Text className="text-sm" style={{ color: c.muted }}>
                Joined {user.joinedOn.toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <Text className="text-xs font-semibold uppercase mb-2 ml-1" style={{ color: c.muted }}>
          Content
        </Text>
        <View
          className="rounded-2xl border overflow-hidden mb-6"
          style={{ backgroundColor: c.surface, borderColor: c.border }}
        >
          <Row 
            icon="tv-outline" 
            label="My channel" 
            onPress={() => router.push("/channel")} 
          />
          <Row
            icon="people-outline"
            label="Following"
            onPress={() => router.push("/following")}
          />
          <Row
            icon="time-outline"
            label="Watch history"
            onPress={() => router.push("/history")}
            last
          />
        </View>

        {/* Preferences */}
        <Text className="text-xs font-semibold uppercase mb-2 ml-1" style={{ color: c.muted }}>
          Preferences
        </Text>
        <View
          className="rounded-2xl border overflow-hidden mb-6"
          style={{ backgroundColor: c.surface, borderColor: c.border }}
        >
          <Row
            icon="moon-outline"
            label="Dark mode"
            last
            right={
              <Switch
                value={colorScheme === "dark"}
                onValueChange={toggleColorScheme}
                trackColor={{ false: c.border, true: c.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        {/* Account */}
        <Text className="text-xs font-semibold uppercase mb-2 ml-1" style={{ color: c.muted }}>
          Account
        </Text>
        <View
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: c.surface, borderColor: c.border }}
        >
          <Row
            icon="key-outline"
            label="Change password"
            onPress={() => router.push("/change-password")}
          />
          <Row icon="log-out-outline" label="Log out" onPress={() => logout()} />
          <Row icon="trash-outline" label="Delete account" onPress={onDelete} danger last />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
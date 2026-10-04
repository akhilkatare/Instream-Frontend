import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  useComments,
  useWriteComment,
  useDeleteComment,
} from "@/features/comment/hooks/useComment";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import { getErrorMessage } from "@/utils/getErrorMessage";
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

export default function CommentsSection({ videoId }: { videoId: string }) {
  const c = useThemeColors();
  const { data: comments, isLoading } = useComments(videoId);
  const currentUserId = useCurrentUserId();
  const write = useWriteComment();
  const del = useDeleteComment();
  const [text, setText] = useState("");

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    write.mutate(
      { videoId, comment: value },
      {
        onSuccess: () => setText(""),
        onError: (e) => Alert.alert("Error", getErrorMessage(e)),
      }
    );
  };

  const confirmDelete = (commentId: string) => {
    Alert.alert("Delete comment?", undefined, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          del.mutate(
            { commentId, videoId },
            { onError: (e) => Alert.alert("Error", getErrorMessage(e)) }
          ),
      },
    ]);
  };

  const canSend = !!text.trim() && !write.isPending;

  return (
    <View className="mt-6 pt-4 border-t border-border">
      <Text className="text-base font-bold text-foreground mb-3">
        {comments ? `${comments.length} Comments` : "Comments"}
      </Text>

      {/* Composer */}
      <View className="flex-row items-end gap-2">
        <TextInput
          className="flex-1 rounded-xl border border-border bg-input px-3 text-foreground"
          style={{ fontSize: 14, paddingVertical: 10, maxHeight: 100 }}
          placeholder="Add a comment…"
          placeholderTextColor={c.muted}
          selectionColor={c.primary}
          cursorColor={c.primary}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity
          onPress={submit}
          disabled={!canSend}
          className={`h-10 w-10 rounded-full bg-primary items-center justify-center ${
            canSend ? "" : "opacity-50"
          }`}
        >
          {write.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="send" size={16} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 16 }} color={c.primary} />
      ) : comments && comments.length > 0 ? (
        comments.map((item) => (
          <View key={item.id} className="flex-row mt-4 gap-3">
            {/* Avatar */}
            <View className="h-9 w-9 rounded-full bg-primary items-center justify-center">
              <Text className="text-white font-bold">
                {(item.senderEmail ?? "U").charAt(0).toUpperCase()}
              </Text>
            </View>

            {/* Body */}
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-muted flex-1" numberOfLines={1}>
                  {(item.senderEmail ?? "User")}
                  {timeAgo(item.sentOn) ? ` · ${timeAgo(item.sentOn)}` : ""}
                </Text>
                {currentUserId === item.senderId && (
                  <TouchableOpacity onPress={() => confirmDelete(item.id)} hitSlop={6}>
                    <Ionicons name="trash-outline" size={16} color={c.muted} />
                  </TouchableOpacity>
                )}
              </View>
              <Text className="text-sm text-foreground mt-0.5 leading-5">
                {item.comment}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text className="text-muted mt-4">Be the first to comment.</Text>
      )}
    </View>
  );
}
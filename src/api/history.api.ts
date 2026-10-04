import { apiClient, unwrap } from "@/api/client";
import type { Video, HistoryItem } from "@/types";


const mapHistoryItem = (row: any): HistoryItem => {
  const v = row.video ?? row; // row may be flattened video or nested under `video`
  return {
    id: v.id,
    channelId: v.channel_id,
    title: v.title ?? "",
    description: v.description ?? "",
    duration: v.duration ?? "",
    thumbnailUrl: v.thumbnail_url ?? "",
    videoUrl: v.video_url ?? "",
    views: v.views ?? 0,
    likes: v.likes ?? v.like_count ?? 0,
    uploadedAt: v.uploaded_at ? new Date(v.uploaded_at) : new Date(),
    watchedOn: row.watched_on ? new Date(row.watched_on) : undefined,
  };
};

// GET /history
export const getHistory = async (): Promise<HistoryItem[]> => {
  const res = await apiClient.get("/history");
  const payload = unwrap(res) as any;
  const list = payload?.history ?? payload?.videos ?? [];
  return Array.isArray(list) ? list.map(mapHistoryItem) : [];
};

// POST /history/append/{video_id}
export const appendToHistory = async (videoId: string): Promise<void> => {
  await apiClient.post(`/history/append/${videoId}`);
};

// DELETE /history/delete/{video_id}
export const deleteFromHistory = async (videoId: string): Promise<void> => {
  await apiClient.delete(`/history/delete/${videoId}`);
};

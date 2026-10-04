import { apiClient, unwrap } from "@/api/client";
import { Video, UploadMetadataInput, UploadSignatures } from "@/types";


const mapVideo = (v: any): Video => ({
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
    isLiked: v.is_liked ?? undefined,
    channel: v.channel ? {
          id: v.channel.id,
          name: v.channel.name,
          followers: v.channel.followers,
          isFollowing: v.channel.is_following,
        } : undefined,
});


const mapVideoList = (data: any): Video[] =>
    Array.isArray(data) ? data.map(mapVideo) : [];


export const getVideos = async (): Promise<Video[]> => {
    const res = await apiClient.get("/video");
    const payload = unwrap(res) as any; 
    return mapVideoList(payload?.videos ?? []);
};


export const searchVideos = async (query: string): Promise<Video[]> => {
    const res = await apiClient.get("/video/search", { params: { query } });
    const payload = unwrap(res) as any;
    return mapVideoList(payload?.videos ?? []);
};


export const getVideo = async (videoId: string): Promise<Video | null> => {
    const res = await apiClient.get(`/video/${videoId}`);
    const payload = unwrap(res) as any;
    return payload ? mapVideo(payload.video ?? payload) : null;
};


export const getChannelVideos = async (id: string): Promise<Video[]> => {
    const res = await apiClient.get(`/video/channel-videos/${id}`);
    const payload = unwrap(res) as any;
    return mapVideoList(payload?.videos ?? []);
};


export const likeVideo = async (videoId: string): Promise<void> => {
    await apiClient.post(`/video/like/${videoId}`);
};


export const unlikeVideo = async (videoId: string): Promise<void> => {
    await apiClient.post(`/video/unlike/${videoId}`);
};


export const incrementViews = async (videoId: string): Promise<void> => {
  await apiClient.post("/video/inc-views", null, { params: { video_id: videoId } });
};


export const deleteVideo = async (videoId: string): Promise<void> => {
    await apiClient.delete("/video/delete", { data: { video_id: videoId } });
};


export const generateSignatures = async (): Promise<UploadSignatures> => {
    const res = await apiClient.post("/video/upload/generate-signatures");
    return unwrap(res) as UploadSignatures; 
};


export const uploadMetadata = async (
  input: UploadMetadataInput
): Promise<{ videoId: string; title: string } | null> => {
  const body = {
    title: input.title,
    description: input.description,
    duration: input.duration,
    video_url: input.videoUrl,
    video_public_id: input.videoPublicId,
    thumbnail_url: input.thumbnailUrl,
    thumbnail_public_id: input.thumbnailPublicId,
  };

  const res = await apiClient.post("/video/upload/data", body);
  const data = unwrap(res) as any;

  return data ? { videoId: data.video_id, title: data.title } : null;
};

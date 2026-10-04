import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/config/queryClient";
import { Video } from "@/types";
import {
  getVideos,
  searchVideos,
  getVideo,
  getChannelVideos,
  likeVideo,
  unlikeVideo,
  incrementViews,
  deleteVideo,
  generateSignatures,
  uploadMetadata,
} from "@/api/video.api";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { LocalFile } from "@/types";


export function useVideos() {
  return useQuery({ queryKey: ["videos"], queryFn: getVideos });
}


export function useSearchVideos(query: string) {
  return useQuery({
    queryKey: ["videos", "search", query],
    queryFn: () => searchVideos(query),
    enabled: query.trim().length > 0,
  });
}


export function useVideo(videoId: string) {
  return useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideo(videoId),
    enabled: !!videoId,
  });
}


export function useChannelVideos(id: string) {
  return useQuery({
    queryKey: ["videos", "channel", id],
    queryFn: () => getChannelVideos(id),
    enabled: !!id,
  });
}


export function useLikeVideo() {
  return useMutation({
    mutationFn: (videoId: string) => likeVideo(videoId),
    onMutate: async (videoId) => {
      await queryClient.cancelQueries({ queryKey: ["video", videoId] });
      const prev = queryClient.getQueryData<Video>(["video", videoId]);
      if (prev && !prev.isLiked) {
        queryClient.setQueryData<Video>(["video", videoId], {
          ...prev,
          isLiked: true,
          likes: prev.likes + 1,
        });
      }
      return { prev };
    },
    onError: (_e, videoId, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["video", videoId], ctx.prev);
    },
    onSettled: (_d, _e, videoId) => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] }); // ← feed refresh
    },
  });
}


export function useUnlikeVideo() {
  return useMutation({
    mutationFn: (videoId: string) => unlikeVideo(videoId),
    onMutate: async (videoId) => {
      await queryClient.cancelQueries({ queryKey: ["video", videoId] });
      const prev = queryClient.getQueryData<Video>(["video", videoId]);
      if (prev && prev.isLiked) {
        queryClient.setQueryData<Video>(["video", videoId], {
          ...prev,
          isLiked: false,
          likes: Math.max(0, prev.likes - 1),
        });
      }
      return { prev };
    },
    onError: (_e, videoId, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["video", videoId], ctx.prev);
    },
    onSettled: (_d, _e, videoId) => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}


export function useIncrementViews() {
  return useMutation({
    mutationFn: (videoId: string) => incrementViews(videoId),
    onSuccess: (_d, videoId) => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

}


export function useDeleteVideo() {
  return useMutation({
    mutationFn: (videoId: string) => deleteVideo(videoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["videos"] }),
  });
}


export function useUploadVideo() {
  return useMutation({
    mutationFn: async (input: {
      title: string;
      description: string;
      video: LocalFile;
      thumbnail: LocalFile;
    }) => {
      const sig = await generateSignatures();

      const videoRes = await uploadToCloudinary({
        signed: sig.video,
        resourceType: "video",
        file: input.video,
      });

      const thumbRes = await uploadToCloudinary({
        signed: sig.thumbnail,
        resourceType: "image",
        file: input.thumbnail,
      });

      return uploadMetadata({
        title: input.title,
        description: input.description,
        duration: Math.round(videoRes.duration ?? 0),
        videoUrl: videoRes.secureUrl,
        videoPublicId: videoRes.publicId,
        thumbnailUrl: thumbRes.secureUrl,
        thumbnailPublicId: thumbRes.publicId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/config/queryClient";
import { getComments, writeComment, deleteComment } from "@/api/comment.api";

export function useComments(videoId: string) {
  return useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => getComments(videoId),
    enabled: !!videoId,
  });
}

export function useWriteComment() {
  return useMutation({
    mutationFn: (vars: { videoId: string; comment: string }) =>
      writeComment(vars.videoId, vars.comment),
    onSuccess: (_d, vars) =>
      queryClient.invalidateQueries({ queryKey: ["comments", vars.videoId] }),
  });
}

export function useDeleteComment() {
  return useMutation({
    mutationFn: (vars: { commentId: string; videoId: string }) =>
      deleteComment(vars.commentId),
    onSuccess: (_d, vars) =>
      queryClient.invalidateQueries({ queryKey: ["comments", vars.videoId] }),
  });
}

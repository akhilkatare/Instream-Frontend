import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/config/queryClient";
import {
  getHistory,
  appendToHistory,
  deleteFromHistory,
} from "@/api/history.api";

export function useHistory() {
  return useQuery({ queryKey: ["history"], queryFn: getHistory });
}

export function useAppendToHistory() {
  return useMutation({
    mutationFn: (videoId: string) => appendToHistory(videoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["history"] }),
  });
}

export function useDeleteFromHistory() {
  return useMutation({
    mutationFn: (videoId: string) => deleteFromHistory(videoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["history"] }),
  });
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/config/queryClient";
import {
  getMyChannel, createChannel, updateChannelName, updateChannelDescription,
  deleteChannel, followChannel, unfollowChannel, getFollowingChannels, getChannelView
} from "@/api/channel.api";


export function useMyChannel() {
  return useQuery({
    queryKey: ["channel", "me"],
    queryFn: getMyChannel,
  });
}


export function useFollowingChannels() {
  return useQuery({
    queryKey: ["channel", "following"],
    queryFn: getFollowingChannels,
  });
}


export function useChannelView(channelId: string) {
  return useQuery({
    queryKey: ["channel", "view", channelId],
    queryFn: () => getChannelView(channelId),
    enabled: !!channelId,
  });
}


export function useCreateChannel() {
  return useMutation({
    mutationFn: (v: { name: string; description: string }) => createChannel(v.name, v.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel", "me"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}


export function useUpdateChannelName() {
  return useMutation({
    mutationFn: (name: string) => updateChannelName(name),
    onSuccess: () => queryClient.invalidateQueries({ 
        queryKey: ["channel", "me"] 
    }),
  });
}


export function useUpdateChannelDescription() {
  return useMutation({
    mutationFn: (description: string) => updateChannelDescription(description),
    onSuccess: () => queryClient.invalidateQueries({ 
        queryKey: ["channel", "me"] 
    }),
  });
}


export function useDeleteChannel() {
  return useMutation({
    mutationFn: () => deleteChannel(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel", "me"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}


export function useFollowChannel() {
  return useMutation({
    mutationFn: (channelId: string) => followChannel(channelId), // id at mutate time
    onSuccess: (_d, channelId) =>
      queryClient.invalidateQueries({ queryKey: ["channel", channelId] }),
  });
}

export function useUnfollowChannel() {
  return useMutation({
    mutationFn: (channelId: string) => unfollowChannel(channelId),
    onSuccess: (_d, channelId) =>
      queryClient.invalidateQueries({ queryKey: ["channel", channelId] }),
  });
}
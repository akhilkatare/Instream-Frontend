import { AxiosError } from "axios"
import { apiClient, unwrap } from "./client";
import { Channel, FollowedChannel, ChannelView } from "@/types";


function mapChannel(raw: any): Channel {
    return { 
        id: raw.id, 
        name: raw.name, 
        description: raw.description, 
        followers: raw.followers 
    };
}


export async function getMyChannel(): Promise<Channel | null> {
    try {
        const response = await apiClient.get("/channel/me");
        const raw = unwrap(response);
        return raw ? mapChannel(raw) : null;
    } 
    catch (error) {
        if ((error as AxiosError)?.response?.status === 404)    
            return null;
        throw error
    }
}


export const getFollowingChannels = async (): Promise<FollowedChannel[]> => {
  const res = await apiClient.get("/channel/following");
  const payload = unwrap(res) as any;
  const list = payload?.channels ?? [];
  return Array.isArray(list)
    ? list.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description ?? "",
        followedOn: c.followed_on ? new Date(c.followed_on) : undefined,
      }))
    : [];
};


export const getChannelView = async (channelId: string): Promise<ChannelView | null> => {
  const res = await apiClient.get(`/channel/view/${channelId}`);
  const payload = unwrap(res) as any;
  if (!payload) return null;
  return {
    id: payload.id,
    name: payload.name,
    description: payload.description ?? "",
    followers: payload.followers ?? 0,
    isFollowing: payload.is_following ?? false,
  };
};


export async function createChannel(name: string, description: string) {
  const res = await apiClient.post("/channel/create", { name, description });
  return unwrap<{ channel_id: string; name: string }>(res);
}


export async function updateChannelName(name: string) {
  const res = await apiClient.patch("/channel/update/name", { name });
  return unwrap<{ name: string }>(res);
}


export async function updateChannelDescription(description: string) {
  await apiClient.patch("/channel/update/description", { description });
}


export async function deleteChannel() {
  await apiClient.delete("/channel/delete");
}


export async function followChannel(channelId: string) {
  await apiClient.post(`/channel/follow/${channelId}`);
}


export async function unfollowChannel(channelId: string) {
  await apiClient.post(`/channel/unfollow/${channelId}`);
}
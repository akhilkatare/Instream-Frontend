import { apiClient, unwrap } from "./client";
import { API_BASE_URL } from "@/config/constants";
import { User } from "../types/index";


function mapUser(raw: any): User {
    return {
        id: raw.id,
        email: raw.email,
        isStreamer: raw.is_streamer,
        hasDisplayPicture: raw.has_display_picture,
        joinedOn: new Date(raw.joined_on),
    };
}


export async function getUser(id: string): Promise<User> {
    const response = await apiClient.get(`/account/${id}`);
    const raw = unwrap(response);

    if (!raw)
        throw new Error("User not found");

    return mapUser(raw);
}


export function displayPictureUrl(userId: string) {
    return `${API_BASE_URL}/account/${userId}/display-picture`;
}


export async function uploadDisplayPicture(file: { uri: string, name: string, type: string}) {
    const form = new FormData();
    form.append("file", { 
        uri: file.uri, 
        name: file.name, 
        type: file.type 
    } as any);

    await apiClient.post("/account/upload-dp", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}


export async function changePassword(oldPassword: string, newPassword: string) {
  const res = await apiClient.post("/account/change-password", {
    old_password: oldPassword,
    new_password: newPassword,
  });
  
  return unwrap<{ access_token: string; refresh_token: string }>(res);
}


export async function deleteAccount(password: string) {
  await apiClient.delete("/account/delete", { data: { password } });
}

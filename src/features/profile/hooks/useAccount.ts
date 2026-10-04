import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { getUser, uploadDisplayPicture, deleteAccount, changePassword } from "@/api/account.api";
import { jwtDecode } from "jwt-decode";
import { AccessPayload } from "@/types";
import { queryClient } from "@/config/queryClient";


export function useCurrentUser() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const userId = accessToken ? jwtDecode<AccessPayload>(accessToken).sub : null;

    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUser(userId!),
        enabled: !!userId
    })
}


export function useUploadDisplayPicture() {
    return useMutation({
        mutationFn: (file: { uri: string, name: string, type: string}) => uploadDisplayPicture(file),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] })
    })
}


export function useChangePassword() {
  const setTokens = useAuthStore((s) => s.setTokens);
  
  return useMutation({
    mutationFn: (v: { oldPassword: string; newPassword: string }) =>
      changePassword(v.oldPassword, v.newPassword),
    onSuccess: (tokens) => { if (tokens) setTokens(tokens.access_token, tokens.refresh_token); },
  });
}


export function useDeleteAccount() {
  const clearTokens = useAuthStore((s) => s.clearTokens);
  return useMutation({
    mutationFn: (password: string) => deleteAccount(password),
    onSuccess: () => clearTokens(),
  });
}
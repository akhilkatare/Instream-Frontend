import axios from "axios";
import { tokenStorage } from "@/config/secureStore";
import { useAuthStore } from "@/store/auth.store";
import { API_BASE_URL } from "@/config/constants";
import { ApiResponse } from "@/types";


let refreshPromise: Promise<string | null> | null = null;


export const apiClient = axios.create({
    baseURL: API_BASE_URL,
});


async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) 
        return null;

    try {
        const response = await axios.post<ApiResponse<{ access_token: string, refresh_token: string }>>(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
        );

        if (!response.data.data)
            return null;

        const { access_token, refresh_token: newRefreshToken } = response.data.data;
        await useAuthStore.getState().setTokens(access_token, newRefreshToken);

        return access_token;
    } catch { return null; }
}


apiClient.interceptors.request.use(async (config) => {
    const accessToken = await tokenStorage.getAccessToken();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});


apiClient.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!refreshPromise) 
            refreshPromise = refreshAccessToken();

        const newAccessToken = await refreshPromise;
        refreshPromise = null;

        if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        }
        await useAuthStore.getState().clearTokens(); // refresh token failed, session expired.
    }

    return Promise.reject(error);
});


export function unwrap<T>(response: { data: ApiResponse<T> }): T | null {
    return response.data.data;
}

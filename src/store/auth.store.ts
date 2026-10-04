import { create } from "zustand";
import { tokenStorage } from "@/config/secureStore";


type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;

    isBootstrapping: boolean;
    bootstrap: () => Promise<void>;

    setTokens: (acessToken: string, refreshToken: string) => Promise<void>;
    clearTokens: () => Promise<void>;
};


export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    isBootstrapping: true,

    bootstrap: async () => {
        const accessToken = await tokenStorage.getAccessToken();
        const refreshToken = await tokenStorage.getRefreshToken();

        set({ accessToken, refreshToken, isBootstrapping: false });
    },

    setTokens: async (accessToken, refreshToken) => {
        await tokenStorage.setTokens(accessToken, refreshToken);
        set({ accessToken, refreshToken });
    },

    clearTokens: async () => {
        await tokenStorage.clearTokens();
        set({ accessToken: null, refreshToken: null });
    },
}));
import * as SecureStore from "expo-secure-store";


const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";


export const tokenStorage = {
    getAccessToken: () => SecureStore.getItemAsync(ACCESS_TOKEN),
    getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN),

    setTokens: async (accessToken: string, refreshToken: string) => {
        await SecureStore.setItemAsync(ACCESS_TOKEN, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken);
    },

    clearTokens: async () => {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN);
    },
}
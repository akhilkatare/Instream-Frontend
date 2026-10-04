import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../store/auth.store";


export default function useProtectedRoute(): boolean {
    const router = useRouter();
    const segments = useSegments();
    
    const accessToken = useAuthStore((state) => state.accessToken);
    const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

    // Load the tokens from secure storage when the app starts.
    useEffect(() => {
        useAuthStore.getState().bootstrap();
    }, []);

    // Redirect to the login page if the user is not authenticated and is not bootstrapping.
    useEffect(() => {
        if (isBootstrapping)
            return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!accessToken && !inAuthGroup) {
            router.replace("/login");
        }

        else if (accessToken && inAuthGroup) {
            router.replace("/(tabs)");
        }

    }, [accessToken, segments, isBootstrapping]);

    return isBootstrapping;
}
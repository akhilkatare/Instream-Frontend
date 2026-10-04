import { apiClient, unwrap } from "./client";
import { tokens } from "../types";


export async function register(email: string, password: string, confirmPassword: string) {
    const response = await apiClient.post("/auth/register/email", {
        email,
        password,
        confirm_password: confirmPassword
    });

    return unwrap<{expires_in_seconds: number}>(response);
}


export async function verifyOTP(email: string, otp: string) {
    const response = await apiClient.post("/auth/verify/email", { email, otp });
    return unwrap<{ user_id: string }>(response);
}


export async function login(email: string, password: string) {
    const response = await apiClient.post("/auth/login/email", { email, password });
    return unwrap<tokens>(response);
}


export const forgotPassword = async (email: string): Promise<void> => {
    await apiClient.post("/auth/forgot-password/email", { email });
};

export const resetPassword = async (email: string, otp: string, newPassword: string): Promise<void> => {
    await apiClient.post("/auth/reset-password/email", {email, otp, new_password: newPassword});
};


export async function logout(refreshToken: string) {
    const response = await apiClient.post("/auth/logout", { refresh_token: refreshToken });
    return unwrap<null>(response);
}
import { useMutation } from "@tanstack/react-query";
import { login, logout, register, verifyOTP, forgotPassword, resetPassword } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";


export function useRegister() {
    return useMutation({
        mutationFn: (data: { email: string; password: string; confirmPassword: string }) => register(data.email, data.password, data.confirmPassword)
    });
}


export function useVerifyOTP() {
    return useMutation({
        mutationFn: (data: { email: string; otp: string }) => verifyOTP(data.email, data.otp)
    });
}


export function useLogin() {
    const setTokens = useAuthStore((state) => state.setTokens);

    return useMutation({
        mutationFn: (data: { email: string; password: string }) => login(data.email, data.password),
        onSuccess: (tokens) => {
            if (tokens)
                setTokens(tokens.access_token, tokens.refresh_token);
        }
    });
}


export function useForgotPassword() {
  return useMutation({ mutationFn: (email: string) => forgotPassword(email) });
}


export function useResetPassword() {
  return useMutation({
    mutationFn: (v: { email: string; otp: string; newPassword: string }) =>
      resetPassword(v.email, v.otp, v.newPassword),
  });
}


export function useLogout() {
    const clearTokens = useAuthStore((state) => state.clearTokens);

    return useMutation({
        mutationFn: async () => {
            const refreshToken = useAuthStore.getState().refreshToken;
            if (refreshToken) {
                try {
                    await logout(refreshToken);
                } catch { /* Don't do anything */ }
            }
        },
        onSettled: () => clearTokens()
    });
}
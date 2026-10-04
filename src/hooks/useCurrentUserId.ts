import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/auth.store";


export function useCurrentUserId(): string | null {
  const accessToken = useAuthStore((s) => s.accessToken);
  if (!accessToken) return null;
  try {
    const { sub } = jwtDecode<{ sub: string }>(accessToken);
    return sub ?? null;
  } catch {
    return null;
  }
}

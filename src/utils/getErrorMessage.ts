import { AxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  const err = error as AxiosError<{ detail?: string; message?: string }>;
  return (
    err?.response?.data?.detail ??
    err?.response?.data?.message ??
    (error instanceof Error ? error.message : undefined) ?? // ← Cloudinary throws land here
    fallback
  );
}
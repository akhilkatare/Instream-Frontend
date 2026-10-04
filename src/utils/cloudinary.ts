import * as FileSystem from "expo-file-system/legacy";
import { CLOUDINARY_CLOUD_NAME } from "@/config/constants";
import type { SignedParams, CloudinaryResult, LocalFile } from "@/types";

export async function uploadToCloudinary(params: {
  signed: SignedParams;
  resourceType: "video" | "image";
  file: LocalFile;
}): Promise<CloudinaryResult> {
  const { cloud_name, ...rest } = params.signed as Record<string, any>;
  const cloudName = cloud_name ?? CLOUDINARY_CLOUD_NAME;

  
  const parameters: Record<string, string> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== null) parameters[key] = String(value);
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${params.resourceType}/upload`;

  // Native multipart upload straight from the file uri — no JS FormData,
  // so "unsupported FormDataPart implementation" cannot occur.
  const res = await FileSystem.uploadAsync(url, params.file.uri, {
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType?.MULTIPART ?? 1,
    fieldName: "file",
    mimeType: params.file.type,
    parameters,
  });

  if (res.status < 200 || res.status >= 300) {
    console.log(`Cloudinary ${params.resourceType} error:`, res.body);
    throw new Error(`Cloudinary ${params.resourceType} upload failed: ${res.body}`);
  }

  const json = JSON.parse(res.body);
  const playbackUrl = json.eager?.[0]?.secure_url ?? json.secure_url;
  return {
    secureUrl: playbackUrl,
    publicId: json.public_id,
    duration: json.duration,
  };
}

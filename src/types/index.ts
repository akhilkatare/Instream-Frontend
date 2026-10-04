export type ApiResponse <T = unknown> = {
    status: "SUCCESS" | "ERROR";
    message: string | null;
    data: T | null;
};


export type User = {
    id: string;
    email: string;
    isStreamer: boolean;
    hasDisplayPicture: boolean;
    joinedOn: Date;
};


export type tokens = {
    access_token: string;
    refresh_token: string;
    token_type: string;
};


export type AccessPayload = {
    sub: string;
};


export type Channel = {
  id: string;
  name: string;
  description: string;
  followers: number;
};


export type ChannelBlock = {
  id: string;
  name: string;
  followers?: number;
  isFollowing?: boolean;
};


export type Video = {
  id: string;
  channelId: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  likes: number;
  uploadedAt: Date;
  isLiked?: boolean;
  channel?: ChannelBlock;
};


export type SignedParams = Record<string, string | number>;


export type CloudinaryResult = {
  secureUrl: string;
  publicId: string;
  duration?: number;
};

export type LocalFile = { uri: string; name: string; type: string };


export type UploadMetadataInput = {
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  videoPublicId: string;
  thumbnailUrl: string;
  thumbnailPublicId: string;
};


export type UploadSignatures = {
  video: SignedParams;
  thumbnail: SignedParams;
};


export type Comment = {
  id: string;
  comment: string;
  senderId: string;
  senderEmail?: string;
  sentOn: Date;
};


export type HistoryItem = Video & { watchedOn?: Date };


export type FollowedChannel = {
  id: string;
  name: string;
  description: string;
  followedOn?: Date;
};


export type ChannelView = {
  id: string;
  name: string;
  description: string;
  followers: number;
  isFollowing: boolean;
};

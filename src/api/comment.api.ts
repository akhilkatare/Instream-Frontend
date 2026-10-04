import { apiClient, unwrap } from "@/api/client";
import { Comment } from "@/types";

const mapComment = (c: any): Comment => ({
  id: c.id,
  comment: c.comment ?? "",
  senderId: c.sender?.id ?? c.sender_id,
  senderEmail: c.sender?.email ?? undefined,
  sentOn: c.commented_at ? new Date(c.commented_at) : new Date(),
});

const mapCommentList = (data: any): Comment[] =>
  Array.isArray(data) ? data.map(mapComment) : [];

// GET /comment/{video_id}
export const getComments = async (videoId: string): Promise<Comment[]> => {
  const res = await apiClient.get(`/comment/${videoId}`);
  const payload = unwrap(res) as any;
  return mapCommentList(payload?.comments ?? []);
};

// POST /comment/write/{video_id}   body: { comment }
export const writeComment = async (
  videoId: string,
  comment: string
): Promise<void> => {
  await apiClient.post(`/comment/write/${videoId}`, { comment });
};

// DELETE /comment/delete/{comment_id}
export const deleteComment = async (commentId: string): Promise<void> => {
  await apiClient.delete(`/comment/delete/${commentId}`);
};

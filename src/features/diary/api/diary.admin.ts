import client from "../../../api/client";
import type { DiaryType } from "../types/types";

export type AdminPostResponse = {
  postId: string;
  title: string;
  content: string;
  userId: string;
  type: DiaryType; 
  isDeleted: boolean;
  views: number;
  likes: number;
  createdAt: string;
};

export type AdminPostDetailResponse = AdminPostResponse;

export const adminDiaryApi = {
  async getAll(type?: DiaryType): Promise<AdminPostResponse[]> {
    const res = await client.get<AdminPostResponse[]>("/admin/posts", {
      params: type ? { type } : undefined,
    });
    return res.data;
  },

  async getById(postId: string): Promise<AdminPostDetailResponse> {
    const res = await client.get<AdminPostDetailResponse>(`/admin/posts/${postId}`);
    return res.data;
  },

  async remove(postId: string): Promise<void> {
    await client.delete(`/admin/posts/${postId}`);
  },
};
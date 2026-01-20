import client from "../../../api/client";
import type {
  DiaryDetail,
  DiaryPreview,
  DiaryType,
  PostBody,
} from "../types/types";

export const adminDiaryApi = {
  async getAll(type?: DiaryType): Promise<DiaryPreview[]> {
    const res = await client.get<DiaryPreview[]>("/admin/posts", {
      params: type ? { type } : undefined,
    });
    return res.data;
  },

  async getById(id: string): Promise<DiaryDetail> {
    const res = await client.get<DiaryDetail>(`/admin/posts/${id}`);
    return res.data;
  },

  async update(id: string, body: PostBody): Promise<void> {
    await client.patch(`/admin/posts/${id}`, body);
  },

  async remove(id: string): Promise<void> {
    await client.delete(`/admin/posts/${id}`);
  },

};
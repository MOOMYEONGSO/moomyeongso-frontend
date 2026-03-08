export type AdminPostType = "MOOMYEONGSO" | "DIARY" | "TODAY";

export type AdminPostResponse = {
  postId: string;
  title: string;
  content: string;
  userId: string;
  type: AdminPostType;
  isDeleted: boolean;
  views: number;
  likes: number;
  createdAt: string;
  tags?: string[];
};

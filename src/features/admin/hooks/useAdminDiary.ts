import { useQuery } from "@tanstack/react-query";
import type { AdminPostResponse } from "../types/adminPost";
import { adminDiaryApi } from "../../diary/api/diary.admin";

export function useAdminDiary(id?: string) {
  return useQuery<AdminPostResponse>({
    queryKey: ["admin", "diary", "detail", id],
    queryFn: () => adminDiaryApi.getById(id as string),
    enabled: !!id,
  });
}
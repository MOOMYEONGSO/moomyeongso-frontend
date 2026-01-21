import { useQuery } from "@tanstack/react-query";
import type { DiaryDetail } from "../../diary/types/types";
import { adminDiaryApi } from "../../diary/api/diary.admin";

export function useAdminDiary(id?: string) {
  return useQuery<DiaryDetail>({
    queryKey: ["admin", "diary", "detail", id],
    queryFn: () => adminDiaryApi.getById(id as string),
    enabled: !!id,
  });
}
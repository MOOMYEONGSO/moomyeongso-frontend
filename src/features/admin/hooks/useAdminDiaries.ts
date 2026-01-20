import { useQuery } from "@tanstack/react-query";
import type { DiaryType, DiaryPreview } from "../../diary/types/types";
import { adminDiaryApi } from "../../diary/api/diary.admin";

export function useAdminDiaries({ type }: { type?: DiaryType }) {
  return useQuery<DiaryPreview[]>({
    queryKey: ["admin", "diary", "list", type ?? "ALL"],
    queryFn: () => adminDiaryApi.getAll(type),
  });
}
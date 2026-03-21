import { useQuery } from "@tanstack/react-query";
import { diaryApi } from "../api/diary";
import type { DiaryType } from "../types/types";

export function useDiaries({ type }: { type: DiaryType | undefined }) {
  return useQuery({
    queryKey: ["diaries", type],
    queryFn: () => diaryApi.getAll(type),
  });
}

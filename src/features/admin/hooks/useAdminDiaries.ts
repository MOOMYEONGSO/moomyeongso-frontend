import { useQuery } from "@tanstack/react-query";
import type { DiaryType } from "../../diary/types/types";
import type { AdminPostResponse } from "../types/adminPost";
import { adminDiaryApi} from "../../diary/api/diary.admin";

export function useAdminDiaries({ type }: { type?: DiaryType }) {
  return useQuery<AdminPostResponse[]>({
    queryKey: ["admin", "diary", "list", type ?? "ALL"],
    queryFn: () => adminDiaryApi.getAll(type),
  });
}
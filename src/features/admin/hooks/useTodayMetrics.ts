import { useQuery } from "@tanstack/react-query";
import { adminDiaryApi } from "../../diary/api/diary.admin";

export function useTodayMetrics() {
  return useQuery({
    queryKey: ["admin", "metrics", "today"],
    queryFn: () => adminDiaryApi.getTodayMetrics(),
    staleTime: 1000 * 60,
  });
}
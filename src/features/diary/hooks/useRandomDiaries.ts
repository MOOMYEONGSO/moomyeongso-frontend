import { useQuery } from "@tanstack/react-query";
import { fetchRandomDiaries } from "../api/randomDiary";

export function useRandomDiaries(count: number = 3) {
  return useQuery({
    queryKey: ["diaries", "random", count],
    queryFn: () => fetchRandomDiaries(count),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

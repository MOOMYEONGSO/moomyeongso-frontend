import { useQuery } from "@tanstack/react-query";
import { fetchRandomDiaries } from "../api/randomDiary";

export function useRandomDiaries(
  count: number = 3,
  tags: string[] = [],
  reroll: number = 0,
) {
  return useQuery({
    queryKey: ["diaries", "random", count, tags, reroll],
    queryFn: () => fetchRandomDiaries(count, tags, reroll),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user";
import type { DiaryType } from "../../diary/types/types";
import type { ReadDiaries } from "../type/types";

type ReadTab = "read" | "community";

const DIARY_ONLY_TYPES: DiaryType[] = ["TODAY", "DIARY"];

export function useReadDiaries(tab: ReadTab, enabled = true) {
  const isCommunity = tab === "community";

  return useQuery<ReadDiaries>({
    queryKey: ["user", "diaries", tab],
    queryFn: () =>
      isCommunity
        ? userApi.getReadDiaries("MOOMYEONGSO")
        : userApi.getReadDiaries(),
    enabled,
    select: isCommunity
      ? undefined
      : (data) => ({
          ...data,
          posts: data.posts.filter((post) =>
            post.type ? DIARY_ONLY_TYPES.includes(post.type) : true
          ),
        }),
  });
}

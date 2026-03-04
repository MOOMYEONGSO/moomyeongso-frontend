import { useQuery } from "@tanstack/react-query";
import { diaryApi } from "../api/diary";

export function useDiaries({
  type,
}: {
  // TODO: 서버 조회 타입 정책 확정 후 DIARY 임시 유니온 정리하기.
  type: "DIARY" | "SHORT" | "LONG" | "TODAY" | undefined;
}) {
  return useQuery({
    queryKey: ["diaries", type],
    queryFn: () => diaryApi.getAll(type),
  });
}

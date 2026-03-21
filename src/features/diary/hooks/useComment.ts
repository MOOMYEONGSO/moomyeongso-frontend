import { useMutation, useQueryClient } from "@tanstack/react-query";
import { diaryApi } from "../api/diary";

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => diaryApi.createComment(postId, content),
    onSuccess: () => {
      // 상세 조회 쿼리 무효화하여 댓글 리스트 갱신
      queryClient.invalidateQueries({ queryKey: ["diary", postId] });
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) =>
      diaryApi.deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary", postId] });
    },
  });
}

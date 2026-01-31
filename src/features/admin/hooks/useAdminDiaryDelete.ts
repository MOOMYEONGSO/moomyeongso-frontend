import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDiaryApi } from "../../diary/api/diary.admin";

export function useAdminDiaryDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminDiaryApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "diary"] });
    },
  });
}
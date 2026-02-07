import client from "../../../api/client";
import { unwrap } from "../../../api/helpers";
import type { ApiResponse } from "../../../api/types";
import type { RandomDiaryResponse } from "../types/types";

export const fetchRandomDiaries = async (
  count: number = 3,
): Promise<RandomDiaryResponse> => {
  const response = await client.get<ApiResponse<RandomDiaryResponse>>(
    "/posts/random",
    {
      params: { count },
    },
  );

  return unwrap(response);
};

import { useMemo } from "react";
import type { DiaryPreview } from "../../types/types";
import Card from "./Card";
import { getCurrentIdentity } from "../../../auth/api/tokenStore";

type CardListProps = {
  diaries: DiaryPreview[];
  onClickCard: (postId: string) => void;
};

const CardList = ({ diaries, onClickCard }: CardListProps) => {
  const identity = useMemo(() => getCurrentIdentity(), []);

  return (
    <>
      {diaries.map((diary) => {
        const isAuthor =
          !!identity &&
          identity.role !== "ANONYMOUS" &&
          diary.userId === identity.userId;

        return (
          <li key={diary.postId}>
            <Card
              onClick={() => onClickCard(diary.postId)}
              title={diary.title}
              isAuthor={isAuthor}
              tags={diary.tags}
              views={diary.views}
              type={diary.type}
              commentCount={diary.commentCount}
            />
          </li>
        );
      })}
    </>
  );
};

export default CardList;

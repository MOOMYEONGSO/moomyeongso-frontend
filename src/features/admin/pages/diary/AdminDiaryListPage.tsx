import { useState } from "react";
import { useParams } from "react-router-dom";
import CardListContainer from "../../../diary/components/card/CardListContainer";
import classes from "../../../diary/pages/DiaryListPage.module.css";
import type { UiType } from "../../../diary/types/typeMap";
import { InlineError } from "../../../../components/status/InlineStates";
import Paragraph from "../../../../components/paragraph/Paragraph";
import { useAdminDiaries } from "../../hooks/useAdminDiaries";
import { toAppError } from "../../../../api/errors";

function AdminDiaryListPage() {
  const { type } = useParams<{ type?: UiType }>();

  let apiType: "SHORT" | "LONG" | "TODAY" | undefined;
  if (type === "daily") apiType = "SHORT";
  else if (type === "mind") apiType = "LONG";
  else if (type === "today") apiType = "TODAY";
  else apiType = undefined;

  const { data, isLoading, isError, error, refetch } = useAdminDiaries({
    type: apiType,
  });

  const [retrying, setRetrying] = useState(false);

  if (isError) {
    const message =
    toAppError(error).message ?? "문제가 발생했어요. 잠시 후 다시 시도해주세요.";

    return (
      <InlineError
        isLoading={retrying}
        onRetry={async () => {
          try {
            setRetrying(true);
            await refetch();
          } finally {
            setRetrying(false);
          }
        }}
        message={message}
      />
    );
  }

  const diaries = data ?? [];
  const coin = 0; 
  const isEmpty = !isLoading && diaries.length === 0;

  return (
    <div className={classes.list}>
      <div className={classes.guide} role="note" aria-live="polite">
        <Paragraph>관리자 화면입니다.</Paragraph>
        <Paragraph>게시글을 조회/관리할 수 있습니다.</Paragraph>
      </div>

      <CardListContainer
        diaries={diaries}
        coin={coin}
        isLoading={isLoading}
        isEmpty={isEmpty}
        type={type}
        emptyMessage="아직 등록된 글이 없어요"
      />
    </div>
  );
}

export default AdminDiaryListPage;
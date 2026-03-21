import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardListContainer from "../../../diary/components/card/CardListContainer";
import classes from "../../../diary/pages/DiaryListPage.module.css";
import type { UiType } from "../../../diary/types/typeMap";
import { InlineError } from "../../../../components/status/InlineStates";
import Paragraph from "../../../../components/paragraph/Paragraph";
import { useAdminDiaries } from "../../hooks/useAdminDiaries";
import { toAppError } from "../../../../api/errors";
import type { DiaryPreview } from "../../../diary/types/types";
import { useTodayMetrics } from "../../hooks/useTodayMetrics";

function AdminDiaryListPage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type?: UiType }>();

  let apiType: "MOOMYEONGSO" | "DIARY" | "TODAY" | undefined;
  if (type === "public") apiType = "MOOMYEONGSO";
  else if (type === "mind") apiType = "DIARY";
  else if (type === "today") apiType = "TODAY";
  else apiType = undefined;

  const { data, isLoading, isError, error, refetch } = useAdminDiaries({
    type: apiType,
  });

  const {
    data: metrics,
    isLoading: metricsLoading,
    isError: metricsIsError,
    error: metricsError,
    refetch: refetchMetrics,
  } = useTodayMetrics();

  const [retrying, setRetrying] = useState(false);
  const [metricsRetrying, setMetricsRetrying] = useState(false);

  if (isError) {
    const message =
      toAppError(error).message ??
      "문제가 발생했어요. 잠시 후 다시 시도해주세요.";

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

  const diaries: DiaryPreview[] = (data ?? []).map((p) => ({
    postId: p.postId,
    userId: p.userId,
    title: p.title,
    contentPreview: p.content ? p.content.slice(0, 100) : "",
    contentLength: p.content ? p.content.length : 0,
    likes: p.likes,
    views: p.views,
    createdAt: p.createdAt,
    tags: p.tags ?? [],
  }));

  const isEmpty = !isLoading && diaries.length === 0;
  const totalUsers = (metrics?.members ?? 0) + (metrics?.anonymous ?? 0);
  const ratio =
    totalUsers === 0 ? 0 : ((metrics?.members ?? 0) / totalUsers) * 100;

  return (
    <div className={classes.list}>
      <div className={classes.guide} role="note" aria-live="polite">
        <Paragraph>오늘의 무명소</Paragraph>

        <div className={classes.metricsWrap}>
          {metricsIsError ? (
            <InlineError
              isLoading={metricsRetrying}
              onRetry={async () => {
                try {
                  setMetricsRetrying(true);
                  await refetchMetrics();
                } finally {
                  setMetricsRetrying(false);
                }
              }}
              message={
                toAppError(metricsError).message ??
                "오늘의 metrics를 불러오지 못했어요."
              }
            />
          ) : (
            <div className={classes.metricsBox}>
              {metricsLoading && <Paragraph>(불러오는 중…)</Paragraph>}
              {!metricsLoading && metrics && (
                <div className={classes.metricsGrid}>
                  <div>
                    <b>작성된 글</b>
                  </div>

                  <div>
                    · 무명소 기록 <b>{metrics.publicPosts}</b>개 (누적{" "}
                    <b>{metrics.publicTotalPosts}</b>개)
                  </div>

                  <div>
                    · 깊은 고민 <b>{metrics.mindPosts}</b>개 (누적{" "}
                    <b>{metrics.mindTotalPosts}</b>개)
                  </div>

                  <div>
                    · 오늘의 주제 <b>{metrics.todayPosts}</b>개 (누적{" "}
                    <b>{metrics.todayTotalPosts}</b>개)
                  </div>

                  <div style={{ marginTop: 4 }}>
                    <b>회원 현황</b>
                  </div>

                  <div>
                    · 신규 회원가입 <b>{metrics.members}</b>명 (누적{" "}
                    <b>{metrics.totalMembers}</b>명)
                  </div>

                  <div>
                    · 익명 이용자 <b>{metrics.anonymous}</b>명
                  </div>

                  <div>
                    · 익명 대비 신규 회원 비율 <b>{ratio.toFixed(1)}%</b>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CardListContainer
        diaries={diaries}
        coin={0}
        isLoading={isLoading}
        isEmpty={isEmpty}
        type={type}
        emptyMessage="아직 등록된 글이 없어요"
        onClickCardOverride={(id) => navigate(`/admin/diaries/post/${id}`)}
      />
    </div>
  );
}

export default AdminDiaryListPage;

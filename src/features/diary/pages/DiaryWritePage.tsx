import { useRef, useState, useEffect, type ChangeEvent } from "react";
import Form, { type FormHandle } from "../../../components/form/Form";
import TextArea from "../../../components/textarea/TextArea";
import TextCount from "../components/text/TextCount";
import textAreaClasses from "../../../components/textarea/TextArea.module.css";
import classes from "./DiaryWritePage.module.css";
import Button from "../../../components/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../../components/modal/Modal";
import { useToast } from "../../../contexts/ToastContext";
import FullscreenToggleButton from "../../../components/fullsrceen/FullscreenToggleButton";
import { useCreateDiary } from "../hooks/useCreateDiary";
import { PATHS } from "../../../constants/path";
import {
  API_TO_UI,
  UI_TO_API,
  type ApiType,
  type UiType,
} from "../types/typeMap";
import { useTopic } from "../hooks/useTopic";
import { SUBMIT_LOADING_MESSAGE } from "../../../constants/messages";
import TagButton from "../components/tag/TagButton";
import { DIARY_TAGS } from "../constants/diaryTags";

const FORM_ID = "diary-form";
const SHORT_MIN_LENGTH = 30;
const LONG_MIN_LENGTH = 100;

const isContentValid = (s: string, minLength: number) =>
  s.length >= minLength && s.trim().length > 0;

function DiaryWritePage() {
  const formRef = useRef<FormHandle>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const [count, setCount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTagSelect, setShowTagSelect] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const { type } = useParams<{ type: UiType }>();
  const diaryType: ApiType =
    type && UI_TO_API[type] ? UI_TO_API[type] : "SHORT";

  const DRAFT_KEY = `draft:diary-write:${diaryType}`;

  const isToday = type === "today";

  // 오늘의 주제 글인 경우, 주제 API 호출
  const { data: topic, isLoading: topicLoading } = useTopic(isToday);

  const MIN_LENGTH = diaryType === "LONG" ? LONG_MIN_LENGTH : SHORT_MIN_LENGTH;

  //
  const parsedTags = tags;

  //태그 숫자 제한 및 파싱
  /* const MAX_TAGS = 10;

  const parsedTags = Array.from(
    new Set(
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ).slice(0, MAX_TAGS);
  */

  const TITLE = isToday
    ? topicLoading
      ? "오늘의 주제를 불러오는 중…"
      : (topic?.title ?? "오늘의 주제를 불러오지 못했어요")
    : diaryType === "SHORT"
      ? "짧은 기록 순간의 생각을 가볍게 남겨요."
      : "마음 깊은 곳의 이야기를 꺼내보아요.";

  const PLACEHOLDER_MESSAGE = isToday
    ? "주제에 대해서 자유롭게 작성해보세요."
    : diaryType === "SHORT"
      ? "지금 떠오른 생각이나, 단 하나의 문장으로도 괜찮습니다."
      : "이곳 무명소는 고해성사를 담는 장소입니다. 말하지 못한 속마음을 조용히 흘려보내세요.";

  // API 호출
  const { mutateAsync } = useCreateDiary(diaryType, {
    onSuccess: (data) => {
      formRef.current?.clear();
      setTitle("");
      setContent("");
      setTags([]);
      setCount(0);
      localStorage.removeItem(DRAFT_KEY);

      const typeLower = API_TO_UI[diaryType];

      // 제출 완료 페이지로 이동
      navigate(PATHS.DIARY_SUBMIT_TYPE(typeLower), {
        replace: true,
        state: {
          type: typeLower,
          tags: parsedTags,
          showCalendar: data.showCalendar,
          streakState: data.showCalendar
            ? {
                calendar: data.calendar,
                coin: data.coin,
                totalPosts: data.totalPosts,
                postId: data.postId,
                tags: parsedTags,
              }
            : undefined,
          stayMs: 1600,
          message: SUBMIT_LOADING_MESSAGE,
        },
      });
    },
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if ("title" in parsed && typeof parsed.title === "string") {
            setTitle(parsed.title);
          }
          if ("content" in parsed && typeof parsed.content === "string") {
            setContent(parsed.content);
            setCount(parsed.content.length);
          }
          if ("tags" in parsed && Array.isArray(parsed.tags)) {
            setTags(parsed.tags);
          }
        }
      }
    } catch {
      // ignore
    }
  }, [DRAFT_KEY]);

  // ==============================
  // 임시 저장 (입력 중 자동 저장)
  // ==============================
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ title, content, tags }),
        );
      } catch {
        // ignore
      }
    }, 350);
    return () => clearTimeout(id);
  }, [title, content, tags, DRAFT_KEY]);

  const canSubmit = isContentValid(content, MIN_LENGTH);

  // 최종 저장 핸들러
  async function handleSave() {
    if (submitting) return;

    if (!canSubmit) {
      showToast(`${MIN_LENGTH}자 이상 입력해주세요.`, "info");
      return;
    }

    try {
      setSubmitting(true);
      await mutateAsync({
        title: title.trim(),
        content: content.trim(),
        tags: parsedTags,
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleOpenConfirm() {
    if (!canSubmit) {
      showToast(`${MIN_LENGTH}자 이상 입력해주세요.`, "info");
      return;
    }
    setShowTagSelect(true);
  }

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setContent(val);
    setCount(val.length);
  }

  return (
    <section className={classes.write} ref={containerRef}>
      <div className={classes.topActions}>
        <FullscreenToggleButton
          targetRef={containerRef}
          disabled={submitting}
        />
      </div>

      <h2 className={classes.title}>{TITLE}</h2>

      <Form id={FORM_ID} onSave={handleSave} ref={formRef}>
        <TextArea
          name="content"
          value={content}
          onChange={handleTextChange}
          disabled={submitting}
          required
          aria-describedby="submit-title"
          placeholder={PLACEHOLDER_MESSAGE}
        />

        <div className={classes.footer}>
          <div
            className={classes.revealWrap}
            data-ready={canSubmit}
            aria-hidden={!canSubmit && count === 0}
          >
            <Button
              type="button"
              onClick={handleOpenConfirm}
              disabled={submitting || !canSubmit}
            >
              {submitting ? "보관 중..." : "무명소에 흘려보내기"}
            </Button>
          </div>

          <div className={classes.countWrap}>
            <TextCount count={count} reqLength={MIN_LENGTH} />
          </div>
        </div>
      </Form>

      <Modal isOpen={showTagSelect} onClose={() => setShowTagSelect(false)}>
        <Modal.Title>작성한 이야기는 어떠한 내용인가요?</Modal.Title>
        <div className={classes.tagContainer}>
          {DIARY_TAGS.map((option) => (
            <TagButton
              key={option.id}
              id={option.id}
              title={option.title}
              subtitle={option.subtitle}
              image={option.image}
              isSelected={tags.includes(option.id)}
              onClick={() => {
                if (tags.includes(option.id)) {
                  setTags(tags.filter((t) => t !== option.id));
                } else if (tags.length < 2) {
                  setTags([...tags, option.id]);
                } else {
                  setTags([tags[0], option.id]);
                }
              }}
            />
          ))}
        </div>
        <Modal.Actions>
          <Button
            type="button"
            alwaysHoverStyle
            variant="main"
            state="default"
            onClick={() => setShowTagSelect(false)}
          >
            닫기
          </Button>
          <Button
            type="button"
            alwaysHoverStyle
            variant="main"
            state={tags.length > 0 ? "active" : "default"}
            disabled={tags.length === 0}
            className={tags.length > 0 ? classes.activeNextButton : undefined}
            onClick={() => {
              setShowTagSelect(false);
              setShowConfirm(true);
            }}
          >
            다음
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)}>
        <Modal.Title id="submit-title">작성하신 글을 정리해볼까요?</Modal.Title>
        <Modal.Textarea
          name="title"
          form={FORM_ID}
          placeholder="제목 작성하기"
          value={title}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setTitle(e.target.value)
          }
          disabled={submitting}
          className={textAreaClasses.textarea}
        />
        {/* <Modal.Textarea
          name="tags"
          placeholder="쉼표(,)로 구분하여 태그를 입력해주세요."
          value={tags}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setTags(e.target.value)
          }
          disabled={submitting}
        /> */}
        <Modal.Actions>
          <Button
            type="button"
            alwaysHoverStyle
            variant="main"
            state="default"
            onClick={() => setShowConfirm(false)}
          >
            닫기
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            alwaysHoverStyle
            variant="main"
            state="default"
            disabled={submitting || !title.trim()}
          >
            완료하기
          </Button>
        </Modal.Actions>
      </Modal>
    </section>
  );
}

export default DiaryWritePage;

import type { Comment } from "../../types/types";
import classes from "./CommentSection.module.css";
import { useDeleteComment } from "../../hooks/useComment";
import { useToast } from "../../../../contexts/ToastContext";
import CommentItem from "./CommentItem";

type Props = {
  postId: string;
  comments: Comment[];
};

export default function CommentList({ postId, comments }: Props) {
  const { mutateAsync: deleteComment } = useDeleteComment(postId);
  const { showToast } = useToast();

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteComment(commentId);
      showToast("댓글이 삭제되었습니다.", "info");
    } catch {
      showToast("삭제에 실패했습니다.", "cancel");
    }
  };

  if (comments.length === 0) return null;

  return (
    <ul className={classes.list}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

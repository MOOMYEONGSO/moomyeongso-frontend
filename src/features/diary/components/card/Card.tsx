import { useMemo, type ComponentPropsWithoutRef } from "react";
import classes from "./Card.module.css";
import Title from "../title/Title";
// import Count from "../count/Count";
import View from "../label/view/View";
import CommentCount from "../label/commentCount/commentcount";
import Tag from "../label/tag/Tag";
import { getRandomCardOverlayUrl } from "../../utils/overlayImages";
import { CARD_TAG_LABEL } from "../../constants/diaryTags";
import type { tags } from "../../types/tags";
import type { DiaryType } from "../../types/types";

type CardProps = ComponentPropsWithoutRef<"article"> & {
  title: string;
  type?: DiaryType;
  tags?: string[];
  isAuthor?: boolean;
  views?: number;
  commentCount?: number;
};

const Card = ({
  title,
  isAuthor,
  className,
  tags,
  type,
  views = 0,
  commentCount,
  ...props
}: CardProps) => {
  const authorType = isAuthor ? "self" : "other";

  const randomOverlay = useMemo(() => getRandomCardOverlayUrl(), [title]);

  return (
    <article
      className={`${classes.card} ${classes[authorType]} ${className ?? ""}`}
      {...props}
    >
      <div className={classes.contentWrapper}>
        <Title authorType={authorType}>{title}</Title>
        <div className={classes.metaInfo}>
          <div className={classes.metaLeft}>
            {tags?.map((tag) => {
              const label = CARD_TAG_LABEL[tag as tags];
              if (!label) return null;

              return <Tag key={tag}>{label}</Tag>;
            })}
          </div>
          <div className={classes.metaRight}>
            {type === "MOOMYEONGSO" && commentCount !== undefined && (
              <CommentCount>{commentCount}</CommentCount>
            )}
            <View>{views}</View>
          </div>
        </div>
      </div>

      {randomOverlay && (
        <img src={randomOverlay} alt="" className={classes.overlayImage} />
      )}
    </article>
  );
};

export default Card;

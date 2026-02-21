import { useMemo, type ComponentPropsWithoutRef } from "react";
import classes from "./Card.module.css";
import Title from "../title/Title";
// import Count from "../count/Count";
import { getRandomOverlayUrl } from "../../utils/overlayImages";
import { CARD_TAG_LABEL } from "../../constants/diaryTags";
import type { tags } from "../../types/tags";

type CardProps = ComponentPropsWithoutRef<"article"> & {
  title: string;
  tags?: string[];
  isAuthor?: boolean;
  textCount: number;
};

const Card = ({
  title,
  // textCount,
  isAuthor,
  className,
  tags,
  ...props
}: CardProps) => {
  const authorType = isAuthor ? "self" : "other";

  const randomOverlay = useMemo(() => getRandomOverlayUrl(), [title]);

  return (
    <article
      className={`${classes.card} ${classes[authorType]} ${className ?? ""}`}
      {...props}
    >
      <div className={classes.contentWrapper}>
        <Title authorType={authorType}>{title}</Title>
        <div className={classes.metaInfo}>
          {tags && tags.length > 0 && (
            <div className={classes.metaLeft}>
              {tags.map((tag) => {
                const label = CARD_TAG_LABEL[tag as tags];
                if (!label) return null;

                return (
                  <span key={tag} className={classes.tag}>
                    {label}
                  </span>
                );
              })}
            </div>
          )}
          <div className={classes.metaRight}>
            {/* 추후 뷰어수/댓글수 영역 */}
          </div>
        </div>
      </div>
      {/* <div>
        <Count className={classes.count}>{textCount}</Count>
      </div> */}

      {randomOverlay && (
        <img src={randomOverlay} alt="" className={classes.overlayImage} />
      )}
    </article>
  );
};

export default Card;

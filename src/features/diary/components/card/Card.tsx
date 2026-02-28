import { useMemo, type ComponentPropsWithoutRef } from "react";
import classes from "./Card.module.css";
import Title from "../title/Title";
// import Count from "../count/Count";
import View from "../label/view/View";
import Tag from "../label/tag/Tag";
import { getRandomOverlayUrl } from "../../utils/overlayImages";
import { CARD_TAG_LABEL } from "../../constants/diaryTags";
import type { tags } from "../../types/tags";

type CardProps = ComponentPropsWithoutRef<"article"> & {
  title: string;
  tags?: string[];
  isAuthor?: boolean;
  textCount: number;
  views?: number;
};

const Card = ({
  title,
  // textCount,
  isAuthor,
  className,
  tags,
  views = 0,
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
          <div className={classes.metaLeft}>
            {tags?.map((tag) => {
              const label = CARD_TAG_LABEL[tag as tags];
              if (!label) return null;

              return <Tag key={tag}>{label}</Tag>;
            })}
          </div>
          <div className={classes.metaRight}>
            <View>{views}</View>
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

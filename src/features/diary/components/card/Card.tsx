import { useMemo, type ComponentPropsWithoutRef } from "react";
import classes from "./Card.module.css";
import Title from "../title/Title";
// import Count from "../count/Count";
import { getRandomOverlayUrl } from "../../utils/overlayImages";

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
      <Title authorType={authorType}>{title}</Title>
      <div className={classes.tags}>
        {tags?.map((tag) => (
          <span key={tag} className={classes.tag}>
            #{tag}
          </span>
        ))}
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

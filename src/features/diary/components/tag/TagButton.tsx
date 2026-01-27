import classes from "./TagButton.module.css";

interface TagButtonProps {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function TagButton({
  title,
  subtitle,
  image,
  isSelected,
  onClick,
}: TagButtonProps) {
  return (
    <button
      type="button"
      className={`${classes.container} ${isSelected ? classes.active : ""}`}
      onClick={onClick}
    >
      <div className={classes.image}>
        {image && <img src={image} alt="" className={classes.icon} />}
      </div>
      <div className={classes.textGroup}>
        <span className={classes.title}>{title}</span>
        <span className={classes.subtitle}>{subtitle}</span>
      </div>
    </button>
  );
}

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
      {image ? (
        <img src={image} alt="" className={classes.image} />
      ) : (
        <div
          className={classes.image}
          style={{
            borderRadius: "20%",
            backgroundColor: isSelected ? "#ccc" : "#333",
          }}
        />
      )}
      <div className={classes.textGroup}>
        <span className={classes.title}>{title}</span>
        <span className={classes.subtitle}>{subtitle}</span>
      </div>
    </button>
  );
}

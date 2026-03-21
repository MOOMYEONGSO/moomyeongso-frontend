import {
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import classes from "./Button.module.css";

type ButtonVariant = "main" | "sub" | "ghost" | "solid";
type ButtonState = "default" | "active";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  children: ReactNode;
  alwaysHoverStyle?: boolean;
  revealOnMount?: boolean;
  revealDelay?: number;
  revealDurationMs?: number;
  revealEasing?: string;
  variant?: ButtonVariant;
  state?: ButtonState;
};

const Button = ({
  children,
  alwaysHoverStyle,
  className = "",
  revealOnMount = false,
  revealDelay = 600,
  revealDurationMs = 1000,
  revealEasing = "ease-in",
  variant = "main",
  state = "default",
  style: customStyle,
  ...props
}: ButtonProps) => {
  // revealOnMount=false면 초기에 바로 보이도록
  const [revealed, setRevealed] = useState(!revealOnMount);

  useEffect(() => {
    if (!revealOnMount) return;
    const t = setTimeout(() => setRevealed(true), revealDelay);
    return () => clearTimeout(t);
  }, [revealOnMount, revealDelay]);

  const combinedClassName = [
    classes.button,
    classes[variant],
    classes[state],
    alwaysHoverStyle && classes["hover-style"],
    revealed ? classes.revealed : classes.hidden,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style: CSSProperties = {
    "--reveal-delay": `${revealDelay}ms`,
    "--reveal-duration": `${revealDurationMs}ms`,
    "--reveal-easing": revealEasing,
    ...customStyle,
  } as CSSProperties;

  return (
    <button {...props} className={combinedClassName} style={style}>
      <span className={classes.content}>{children}</span>
    </button>
  );
};

export default Button;

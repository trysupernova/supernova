import { twMerge } from "tailwind-merge";
import { manrope } from "./font";

interface TypographyHeadingProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {}

export const H1 = (props: TypographyHeadingProps) => {
  return (
    <h1
      {...props}
      className={twMerge(
        "text-white text-4xl tracking-[-0.576px]",
        props.className,
        manrope.className
      )}
    >
      {props.children}
    </h1>
  );
};

export const H2 = (props: TypographyHeadingProps) => {
  return (
    <h2
      {...props}
      className={twMerge(
        "text-white text-3xl tracking-[-0.576px]",
        props.className,
        manrope.className
      )}
    >
      {props.children}
    </h2>
  );
};

export const H3 = (props: TypographyHeadingProps) => {
  return (
    <h3
      {...props}
      className={twMerge(
        "text-white text-2xl tracking-[-0.576px]",
        props.className,
        manrope.className
      )}
    >
      {props.children}
    </h3>
  );
};

export const Paragraph = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
) => {
  return (
    <p {...props} className={twMerge("text-base text-white", props.className)}>
      {props.children}
    </p>
  );
};

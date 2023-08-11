import { twMerge } from "tailwind-merge";
import { manrope } from "./font";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {}

export const H1 = (props: Props) => {
  return (
    <h1
      className={twMerge(
        "text-5xl tracking-[-0.576px]",
        props.className,
        manrope.className
      )}
      style={{
        textShadow: "0px 4px 10px rgba(255, 255, 255, 0.40)",
        ...props.style,
      }}
    >
      {props.children}
    </h1>
  );
};

export const Paragraph = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
) => {
  return <p className={twMerge("text-base text-white")}>{props.children}</p>;
};

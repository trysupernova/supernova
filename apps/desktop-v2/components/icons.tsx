import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { ClockIcon } from "@radix-ui/react-icons";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: "blur" | "empty";
};

export const arrowRightPath = "icons/arrow-right.svg";

export const ArrowRightIcon = (props: ImageProps) => (
  <Image
    src={arrowRightPath}
    width={20}
    height={20}
    alt="Arrow Right"
    priority
    {...props}
  />
);

export const supernovaGlobePath = "/supernova-globe.svg";

export const SupernovaGlobeLogoImage = (props: ImageProps) => (
  <Image
    src={supernovaGlobePath}
    width={40}
    height={40}
    alt="Supernova's logo--a gradient globe with cyan/bright teal colors on the left, and pinkish color on the right"
    {...props}
  />
);

export const googleIconPath = "/icons/google-icon.png";

export const GoogleIcon = (props: ImageProps) => (
  <Image
    src={googleIconPath}
    width={20}
    height={20}
    alt="Google icon"
    {...props}
  />
);

export const playGreenPath = "/icons/play-green.svg";

export const PlayGreenIcon = (props: ImageProps) => (
  <Image
    src={playGreenPath}
    alt="Play green icon"
    width={13}
    height={13}
    className="ml-[2px]"
    priority
    {...props}
  />
);

export const clockCyanPath = "/icons/clock-cyan.svg";
export const ClockCyanIcon = (props: ImageProps) => (
  <Image
    src={clockCyanPath}
    alt="Clock icon"
    style={{
      stroke: "#0057B7",
      strokeWidth: 2,
    }}
    width={13}
    height={13}
    className="ml-[2px]"
    priority
    {...props}
  />
);

export const calendarYellowPath = "/icons/calendar-yellow.svg";

export const CalendarYellowIcon = (props: ImageProps) => (
  <Image
    src={calendarYellowPath}
    width={13}
    height={13}
    alt="Calendar icon"
    priority
    {...props}
  />
);

export const hexagonPath = "/icons/hexagon.svg";

export const HexagonIcon = (props: ImageProps) => (
  <Image
    src={hexagonPath}
    width={13}
    height={13}
    alt="Hexagon icon"
    {...props}
  />
);

export const inboxPath = "/icons/inbox.svg";

export const InboxIcon = (props: ImageProps) => (
  <Image src={inboxPath} width={13} height={13} alt="Inbox icon" {...props} />
);

import Image from "next/image";

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
    {...props}
  />
);

export const clockCyanPath = "/icons/clock-cyan.svg";
export const ClockCyanIcon = (props: ImageProps) => (
  <Image
    src={clockCyanPath}
    alt="Play green icon"
    width={13}
    height={13}
    className="ml-[2px]"
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
    {...props}
  />
);

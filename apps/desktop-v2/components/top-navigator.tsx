import { HexagonIcon, InboxIcon } from "./icons";
import { inboxRoute } from "@/app/view/inbox/meta";
import { homeRoute } from "@/app/meta";
import { Button } from "./button";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function TopNavigator() {
  const navItems: {
    label: string;
    icon: React.ReactNode;
    route: string;
  }[] = [
    {
      label: "Inbox",
      icon: <InboxIcon />,
      route: inboxRoute,
    },
    {
      label: "Today",
      icon: <HexagonIcon />,
      route: homeRoute,
    },
  ];

  const activeRoute = navItems.find(
    (item) => item.route === window.location.pathname
  )?.route;

  return (
    <div className="flex items-center gap-3">
      {navItems.map((item) => (
        <Link href={item.route} key={item.route}>
          <Button key={item.route} bgVariant="ghost" className="gap-1">
            {item.icon}
            <p
              className={twMerge(
                "text-xs",
                activeRoute === item.route && "underline"
              )}
            >
              {item.label}
            </p>
          </Button>
        </Link>
      ))}
    </div>
  );
}

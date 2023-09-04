"use client";

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { homeRoute } from "../meta";
import { Button } from "../../components/button";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Mousetrap from "mousetrap";

const SettingsPage = () => {
  const router = useRouter();
  useEffect(() => {
    Mousetrap.bind("esc", () => {
      router.push(homeRoute);
    });
    return () => {
      Mousetrap.unbind("esc");
    };
  }, [router]);

  return (
    <main className="flex max-h-screen flex-col items-center pt-5 mb-10 px-5 gap-[10px]">
      <div className="flex items-center justify-start w-full">
        <div>
          <Link href={homeRoute}>
            <ChevronLeftIcon width={20} height={20} />
          </Link>
        </div>
      </div>
      <h1 className="text-xl font-semibold">Settings</h1>
      <hr className="h-[2px] w-32 bg-gray-300" />
      <div className="flex flex-col w-full gap-4">
        <div className="flex justify-between">
          <div className="inline-flex gap-2">
            <Image
              src="/icons/svg/google-calendar.png"
              unoptimized
              width={25}
              height={20}
              alt="Google Calendar icon"
            />
            <p>Connect your Google Calendar</p>
          </div>
          <Button disabled id="gcal-conn">
            Coming soon
          </Button>
        </div>
        <div className="flex justify-between">
          <div className="inline-flex gap-2">
            <Image
              src="/icons/svg/notion.png"
              width={25}
              height={20}
              unoptimized
              alt="Notion icon"
            />
            <p>Pull tasks from Notion</p>
          </div>
          <Button disabled>Coming soon</Button>
        </div>
        <div className="flex justify-between">
          <div className="inline-flex gap-2">
            <Image
              src="/icons/svg/github.png"
              width={25}
              height={20}
              unoptimized
              alt="Github icon"
            />
            <p>Pull issues and PRs from Github</p>
          </div>
          <Button disabled>Coming soon</Button>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;

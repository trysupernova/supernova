"use client";

import {
  ChevronLeftIcon,
  ExitIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { homeRoute } from "../meta";
import { Button } from "../../components/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Mousetrap from "mousetrap";
import { supernovaAPI } from "@/services/supernova-api";
import { withAuth } from "@/hocs/withAuth";
import { authRoute } from "../auth/meta";
import { AlertDialog } from "../../components/alert-dialog";
import useSupernovaToast from "@/hooks/useSupernovaToast";
import { useTheme } from "next-themes";

const SettingsPage = () => {
  const { makeToast } = useSupernovaToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    Mousetrap.bind("esc", () => {
      router.push(homeRoute);
    });
    return () => {
      Mousetrap.unbind("esc");
    };
  }, [router]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  if (!isMounted) {
    return null;
  }

  return (
    <main className="flex max-h-screen flex-col items-center pt-5 mb-10 px-5 gap-[10px]">
      <AlertDialog
        open={open}
        setOpen={setOpen}
        description="Are you sure you want to logout?"
        handleSubmit={async () => {
          const res = await supernovaAPI.logout();
          if (res.type === "error" || res.statusCode >= 400) {
            makeToast(res.message, "error");
            return;
          }
          router.replace(authRoute);
        }}
      />
      <div className="flex items-center justify-start w-full">
        <div>
          <Link href={homeRoute}>
            <ChevronLeftIcon width={20} height={20} />
          </Link>
        </div>
      </div>
      <h1 className="text-xl font-semibold">Settings</h1>
      <hr className="h-[2px] w-32 bg-gray-300" />
      <div className="flex flex-col w-full max-w-lg gap-4">
        <div className="flex justify-between">
          <div className="inline-flex gap-2">
            <Image
              src="/icons/svg/google-calendar.png"
              unoptimized
              width={15}
              height={15}
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
          <div className="inline-flex gap-2 items-center">
            <GitHubLogoIcon />
            <p>Pull issues and PRs from Github</p>
          </div>
          <Button disabled>Coming soon</Button>
        </div>
        <div className="flex justify-between">
          <div className="inline-flex gap-2">
            <p>Appearance</p>
          </div>
          <select
            className="border rounded-md p-1 bg-black text-white"
            name="appearance"
            value={theme}
            onChange={(e) => {
              e.currentTarget.value === "system"
                ? setTheme("system")
                : setTheme(e.currentTarget.value);
            }}
          >
            <option value="system">System setting</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
      <Button
        className="mt-auto gap-1"
        onClick={() => {
          setOpen(true);
        }}
      >
        Logout
        <ExitIcon />
      </Button>
    </main>
  );
};

export default withAuth(SettingsPage);

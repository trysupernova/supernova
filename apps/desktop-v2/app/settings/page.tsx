"use client";

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { homeRoute } from "../meta";

// TODO: implement connecting with calendar
// (might have to fetch the google calendar API from the backend)

const SettingsPage = () => {
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
      <div className="flex flex-col w-full">
        <div className="flex justify-between">
          <p>Connect your Google Calendar</p>
          <button
            className="bg-gray-200 rounded-md px-2 py-1 hover:bg-gray-300"
            id="gcal-conn"
          >
            Connect
          </button>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;

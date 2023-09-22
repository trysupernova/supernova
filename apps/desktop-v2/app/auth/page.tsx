"use client";

import { Button } from "@/components/button";
import { supernovaAPI } from "@/services/supernova-api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { homeRoute } from "../meta";
import { GlobeIcon } from "@radix-ui/react-icons";
import { SupernovaGlobeLogoImage } from "@/components/icons";

const AuthPage = () => {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const res = await supernovaAPI.authenticate();
      if (res.type === "error") {
        return;
      }
      router.replace(homeRoute);
    })();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-screen max-h-screen bg-dark-teal-gradient">
      <div className="flex flex-col items-center gap-2">
        <SupernovaGlobeLogoImage
          priority
          className="animate-slideInFromTopFast"
        />
        <div className="h-1" />
        <h1 className="text-xl text-white">Sign in</h1>
        <div className="h-1" />
        <Link href={supernovaAPI.getGoogleOAuthUrl()}>
          {/* TODO: replace with Google logo */}
          <Button bgVariant="white" className="gap-1">
            <GlobeIcon /> Sign in with Google
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default AuthPage;

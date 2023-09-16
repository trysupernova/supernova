"use client";

import { Button } from "@/components/button";
import { supernovaAPI } from "@/services/supernova-api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { homeRoute } from "../meta";

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
    <main className="flex flex-col items-center justify-center max-h-screen">
      <div className="flex flex-col">
        <Link href={supernovaAPI.getGoogleOAuthUrl()}>
          <Button>Login with Google</Button>
        </Link>
      </div>
    </main>
  );
};

export default AuthPage;

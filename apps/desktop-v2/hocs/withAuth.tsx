"use client";

import { useRouter } from "next/navigation";
import { supernovaAPI } from "@/services/supernova-api";
import { useEffect, useState } from "react";

export function withAuth<T>(Component: React.ComponentType<T>) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [fetchState, setFetchState] = useState<"loading" | "done" | "error">(
      "loading"
    );
    useEffect(() => {
      (async () => {
        const res = await supernovaAPI.authenticate();
        // If the user is not authenticated, redirect to login page
        if (res.type === "error") {
          setFetchState("error");
          router.replace("/auth");
          return;
        }
        setFetchState("done");
      })();
    }, []);

    if (fetchState === "loading")
      return <p className="text-center">Loading...</p>;
    if (fetchState === "error") return null; // to show a blank screen afterwards because I'm seeing a flash of the page before redirecting to /auth
    // If the user is authenticated, render the component passed into withAuth
    return <Component {...props} />;
  };
}

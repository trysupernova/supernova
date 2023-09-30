"use client";

import Image from "next/image";
import { H1, H2, Paragraph } from "../components/typography";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { useBoolean } from "usehooks-ts";
import { registerWaitlist } from "@/services/waitlist";
import { FormEventHandler, useEffect, useState } from "react";
import { BsDiscord, BsGithub, BsTwitter } from "react-icons/bs";

import { toast } from "sonner";
import Link from "next/link";
import { Navbar } from "./navbar";

export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for the navigator object on the client side
    if (typeof window !== "undefined") {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    }
  }, []);

  const graphicsFilePath: string =
    isMobile === null
      ? ""
      : isMobile
      ? "/landing-proto-2-mobile.png"
      : "/landing-proto-2.svg";

  const [email, setEmail] = useState("");
  const { value: submitted, setTrue } = useBoolean();

  const handleSignUpUpdatesSubmit: FormEventHandler = (ev) => {
    ev.preventDefault();
    registerWaitlist(email)
      .then(() => {
        toast.success("Thank you!", {
          description:
            "We will send updates about our beta release soon. For any inquiries, please direct them to vincent@trysupernova.one",
        });
        setTrue();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Oops! Something went wrong", {
          description: "It's something on us. Please try again later.",
        });
      });
  };

  return (
    <main className="flex flex-col px-3 bg-dark-teal-gradient min-h-screen">
      <Navbar />
      <div className="flex relative lg:flex-row flex-col gap-5 items-center justify-between pt-15">
        <div className="flex flex-col items-center justify-start gap-[5px]">
          <H1 className="text-center">Your superhuman productivity sidekick</H1>
          <br />
          <Paragraph className="text-center max-w-sm">
            Supernova is a productivity app that helps you focus on what matters
            and focus on only one thing at a time. Manage your tasks, capture
            them quickly, and take notes seamlessly. Integration-rich, fast, and
            delightful to use. All open-sourced!
          </Paragraph>
          <br />
          {submitted ? (
            <Paragraph>
              You{"'"}re on the waitlist! We will send beta release updates
              soon.
            </Paragraph>
          ) : (
            <form
              className="flex flex-wrap justify-center items-center gap-2"
              onSubmit={handleSignUpUpdatesSubmit}
            >
              <Input
                placeholder="e.g user@gmail.com"
                type="email"
                onChange={(ev) => {
                  setEmail(ev.currentTarget.value);
                }}
              />
              <Button type="submit">Join the waitlist</Button>
            </form>
          )}
          <br />

          <div>
            <Paragraph className="text-center">
              Made with ❤️ by{" "}
              <Link
                href="https://x.com/_vmvu"
                target="_blank"
                className="text-white underline"
              >
                Vincent
              </Link>
            </Paragraph>
          </div>
          <div className="flex items-center gap-3">
            <Link href="https://discord.gg/MUHH7rn2jV" target="_blank">
              <BsDiscord width={100} height={100} color="white" />
            </Link>
            <Link
              href="https://github.com/trysupernova/supernova"
              target="_blank"
            >
              <BsGithub width={100} height={100} color="white" />
            </Link>
            <Link href="https://x.com/trysupernova_" target="_blank">
              <BsTwitter width={100} height={100} color="white" />
            </Link>
          </div>
        </div>
        <div className="transition relative w-full md:h-[700px] sm:h-[600px] h-[500px] animate-slideIn">
          {graphicsFilePath === "" ? null : (
            <Image
              src={graphicsFilePath}
              priority
              fill
              style={{ objectFit: "contain", bottom: 0, right: 0 }}
              alt="The prototype showcasing Supernova, a productivity app"
            />
          )}
        </div>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import { H1, Paragraph } from "../components/typography";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { useBoolean, useWindowSize } from "usehooks-ts";
import { registerWaitlist } from "@/services/waitlist";
import { FormEventHandler, useState } from "react";
import { BsDiscord, BsGithub, BsTwitter } from "react-icons/bs";

import { toast } from "sonner";
import Link from "next/link";

export default function Home() {
  const widthLandingProto = 1024;
  const { width } = useWindowSize();

  const matches = width < widthLandingProto;

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
    <main className="flex relative min-h-screen lg:flex-row flex-col gap-5 items-center justify-between py-15 px-10 pb-0 bg-dark-teal-gradient">
      <div className="h-full flex flex-col items-center justify-start gap-[5px] pt-[20px]">
        <div className="flex items-center justify-center gap-[10px] py-[10px]">
          <Image
            src="/logo.svg"
            width={50}
            height={50}
            alt="Supernova's logo, a ball with linear gradient from left to right, light teal to orange"
          />
          <H1>Supernova</H1>
        </div>

        <Paragraph className="text-center">
          Your superhuman productivity sidekick
        </Paragraph>
        <br />
        <Paragraph className="text-center w-96">
          Supernova is a productivity app that helps you focus on what matters.
          Integration-rich, fast, and delightful to use. All open-sourced
        </Paragraph>
        <br />
        {submitted ? (
          <Paragraph>
            You{"'"}re on the waitlist! We will send beta release updates soon.
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
      <div className="relative w-full md:h-[700px] sm:h-[600px] h-[500px]">
        {matches ? (
          <Image
            // src={"/today-view.svg"}
            // fill
            // style={{ objectFit: "contain" }}
            // alt="The prototype showcasing Supernova, a productivity app"

            src={"/landing-proto-2.svg"}
            fill
            style={{ objectFit: "contain" }}
            alt="The prototype showcasing Supernova, a productivity app"
          />
        ) : (
          <Image
            src={"/landing-proto-2.svg"}
            fill
            style={{ objectFit: "contain", bottom: 0, right: 0 }}
            alt="The prototype showcasing Supernova, a productivity app"
          />
        )}
      </div>
    </main>
  );
}

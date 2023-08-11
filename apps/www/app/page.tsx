import Image from "next/image";
import { H1, Paragraph } from "../components/typography";
import { Input } from "../components/input";
import { Button } from "../components/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-dark-teal-gradient">
      <div className="flex flex-col items-center gap-[5px] pt-[30px]">
        <div className="flex items-center justify-center gap-[10px] py-[10px]">
          <Image
            src="/logo.svg"
            width={50}
            height={50}
            alt="Supernova's logo, a ball with linear gradient from left to right, light teal to orange"
          />
          <H1>Supernova</H1>
        </div>

        <div>
          <Paragraph>Your superhuman productivity sidekick</Paragraph>
        </div>
        <form className="flex items-center gap-2">
          <Input placeholder="e.g user@gmail.com" />
          <Button type="submit">Join the waitlist</Button>
        </form>
      </div>
    </main>
  );
}

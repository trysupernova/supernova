import HorizontalLogo from "@/components/horizontal-logo";
import Link from "next/link";

export const Navbar = () => {
  return (
    <Link href="/">
      <nav className="flex flex-wrap p-6 justify-center lg:justify-start">
        <HorizontalLogo />
      </nav>
    </Link>
  );
};

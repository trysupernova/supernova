import { Button } from "@/components/button";
import { supernovaAPI } from "@/services/supernova-api";
import Link from "next/link";

export const AuthPage = () => {
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

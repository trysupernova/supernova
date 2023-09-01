"use client";

import { useState } from "react";
import HorizontalLogo from "../../../components/horizontal-logo";
import { resetPassword } from "../../../services/backend";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { Paragraph } from "../../../components/typography";

const VerifyPasswordResetPage = () => {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-4 bg-dark-teal-gradient px-4">
      <HorizontalLogo />
      <hr className="w-64" />

      <div className="flex flex-col items-center justify-center gap-3">
        <h2 className="text-xl font-extrabold">Enter your new password</h2>
        <p className="text-base text-gray-400 text-center"></p>
        <VerifyPasswordForm />
      </div>
    </main>
  );
};

const VerifyPasswordForm = () => {
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  // get the token from the URL
  const router = useSearchParams();
  const token = router.get("token");
  const [resetPasswordState, setResetPasswordState] = useState<{
    error: string | null;
    success: boolean;
  }>({
    error: null,
    success: false,
  });

  // TODO: we could technically provide an endpoint to verify the token actually exists
  // and is valid, and then show an error message if it's not valid (maybe even via server-side)
  // but for now, we'll just check if it's null for simplicity and assume it's valid
  // until we denied by the API
  if (token === null) {
    return (
      <Paragraph className="w-96 text-center">
        Invalid token. Please try again.
      </Paragraph>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // re-enter password and password must match
    if (pwd !== confirmPwd) {
      toast.error("Passwords do not match", {
        description: "Please re-enter your password",
      });
      setResetPasswordState({
        error: "Passwords do not match",
        success: false,
      });
      return;
    }

    // send email to user through API
    resetPassword(pwd, token)
      .then(() => {
        toast.success("Reset password successful", {
          description:
            "Feel free to login to Supernova with your new password (in the desktop app)",
        });
        setResetPasswordState({
          error: null,
          success: true,
        });
      })
      .catch((e) => {
        toast.error("Could not reset your password", {
          description: "Please try again later",
        });
        setResetPasswordState({
          error: e.message,
          success: false,
        });
      });
  };

  if (resetPasswordState.success) {
    return (
      <Paragraph className="w-96 text-center">
        Your password has been reset. Feel free to login to Supernova with your
        new password (in the desktop app)
      </Paragraph>
    );
  }

  return (
    <form
      className="flex flex-col items-center justify-center gap-3 w-full"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="pwd" className="text-gray-400 text-xs">
            Your password
          </label>
          <Input
            type="password"
            name="pwd"
            id="pwd"
            placeholder="Enter your password"
            onChange={(ev) => {
              setPwd(ev.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="reset-pwd" className="text-gray-400 text-xs">
            {" "}
            Re-enter password{" "}
          </label>
          <Input
            type="password"
            name="reset-pwd"
            id="reset-pwd"
            placeholder="Re-enter your password"
            onChange={(ev) => {
              setConfirmPwd(ev.target.value);
            }}
          />
        </div>
      </div>
      <Button type="submit">Submit</Button>
      {resetPasswordState.error !== null && (
        <Paragraph className="w-96 text-center">
          {resetPasswordState.error}
        </Paragraph>
      )}
    </form>
  );
};

export default VerifyPasswordResetPage;

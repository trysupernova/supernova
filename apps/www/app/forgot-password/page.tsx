"use client";

import { useState } from "react";
import { toast } from "sonner";
import HorizontalLogo from "../../components/horizontal-logo";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { sendForgotPasswordEmail } from "../../services/backend";
import { Paragraph } from "../../components/typography";

const RESET_PASSWORD_EMAIL_FROM = "notifications@trysupernova.one";

const ForgotPasswordPage = () => {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-4 bg-dark-teal-gradient">
      <HorizontalLogo />
      <hr className="w-64" />

      <div className="flex flex-col items-center justify-center gap-3">
        <h2 className="text-xl font-extrabold">Forgot Password</h2>
        <p className="text-base text-gray-400 text-center">
          Enter your email below; we will send a reset password link to your
          email
        </p>
        <ForgotPasswordForm />
      </div>
    </main>
  );
};

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [fetchState, setFetchState] = useState<{
    error: string | null;
    success: boolean;
  }>({
    error: null,
    success: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // send email to user through API
    sendForgotPasswordEmail(email)
      .then(() => {
        toast.success("Email sent to " + email, {
          description:
            "If you don't see it, check your spam folder for an email from " +
            RESET_PASSWORD_EMAIL_FROM,
        });
        setFetchState({
          error: null,
          success: true,
        });
      })
      .catch((e) => {
        toast.error(e.message);
        setFetchState({
          error: e.message,
          success: false,
        });
      });
  };

  return (
    <form
      className="flex flex-col items-center justify-center gap-3 w-full"
      onSubmit={handleSubmit}
    >
      {!fetchState.success ? (
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-gray-500 text-xs">
              Email
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={(ev) => {
                setEmail(ev.target.value);
              }}
            />
          </div>
          <Button type="submit">Submit</Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm">Email sent to {email}</p>
        </div>
      )}
      {fetchState.error !== null && (
        <Paragraph className="text-sm text-red-500">
          {fetchState.error}
        </Paragraph>
      )}
    </form>
  );
};

export default ForgotPasswordPage;

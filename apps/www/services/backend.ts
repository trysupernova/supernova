"use client";

if (process.env.NEXT_PUBLIC_API_BASE_URL === undefined) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const sendForgotPasswordEmail = async (email: string) => {
  const response = await fetch(`${apiBaseUrl}/users/forgot-password`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (response.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

export const resetPassword = async (password: string, token: string) => {
  const response = await fetch(`${apiBaseUrl}/users/forgot-password/verify`, {
    method: "POST",
    body: JSON.stringify({ password, token }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (response.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

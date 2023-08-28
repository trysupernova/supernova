const GETWAITLIST_BASE_URL = "https://api.getwaitlist.com/api/v1";
if (process.env.NEXT_PUBLIC_WAITLIST_ID === undefined) {
  console.warn(
    "WAITLIST_ID environment variable is not defined; waitlist registrations on www will not work."
  );
}
const WAITLIST_ID = Number.parseInt(
  process.env.NEXT_PUBLIC_WAITLIST_ID || "-1"
);

/**
 * Registers the user into the waitlist
 * @param email user's email
 * @returns results from the getwaitlist.com API
 */
export const registerWaitlist = async (email: string) => {
  const res = await fetch(`${GETWAITLIST_BASE_URL}/waiter`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email,
      waitlist_id: WAITLIST_ID,
    }),
  });
  const json = await res.json();
  return json;
};

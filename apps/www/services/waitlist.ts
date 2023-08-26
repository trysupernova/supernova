const GETWAITLIST_BASE_URL = "https://api.getwaitlist.com/api/v1";
if (process.env.WAITLIST_ID === undefined) {
  throw new Error("WAITLIST_ID environment variable is not defined");
}
const WAITLIST_ID = Number.parseInt(process.env.WAITLIST_ID);

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

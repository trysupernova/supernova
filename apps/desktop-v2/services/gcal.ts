import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const gclientId = process.env.GOOGLE_CLIENT_ID;
const gclientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!gclientId || !gclientSecret) {
  console.error(
    "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET. Google Calendar integration will not work."
  );
}

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const REDIRECT_URI = "https://trysupernova.one/oauth2/callback"; // Update with your actual redirect URI

export const oauth2Client = new OAuth2Client(
  gclientId,
  gclientSecret,
  REDIRECT_URI
);
export const gcal = google.calendar({ version: "v3", auth: oauth2Client });

// Generate an OAuth2 URL to redirect the user for authorization
export const generateAuthUrl = () => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  return authUrl;
};

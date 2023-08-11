export const env = {
  googleConfig: {
    clientId: import.meta.env.GOOGLE_CLIENT_ID,
    apiKey: import.meta.env.GOOGLE_API_KEY,
    scope: 'https://www.googleapis.com/auth/calendar',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
  }
}

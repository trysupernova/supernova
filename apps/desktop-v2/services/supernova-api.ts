import SupernovaAPI from "@supernova/api-client";

export const supernovaAPI = new SupernovaAPI(
  process.env.NEXT_PUBLIC_API_BASE_URL
);

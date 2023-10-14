export interface FetchState {
  status: "loading" | "error" | "success";
  error?: string;
}

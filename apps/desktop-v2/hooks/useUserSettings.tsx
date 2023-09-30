export default function useUserSettings() {
  const systemDarkMode =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : "light";
  return {
    systemAppearance: systemDarkMode ? "dark" : "light",
  };
}

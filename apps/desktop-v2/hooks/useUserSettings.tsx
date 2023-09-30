export default function useUserSettings() {
  const systemDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  return {
    systemAppearance: systemDarkMode ? "dark" : "light",
  };
}

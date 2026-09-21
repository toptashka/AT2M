import { useSyncExternalStore } from "react";
const storageKey = "school-auth-theme";
const listeners = new Set();
const media = typeof window !== "undefined"
  ? window.matchMedia("(prefers-color-scheme: dark)")
  : null;

function readPreference() {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

let preference = readPreference();
let theme = preference ?? (media?.matches ? "dark" : "light");

function applyTheme() {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
}

function updateTheme() {
  const next = preference ?? (media?.matches ? "dark" : "light");
  if (next === theme) return;
  theme = next;
  applyTheme();
  listeners.forEach((listener) => listener());
}

export function setAppTheme(value) {
  if (value !== "light" && value !== "dark" && value !== "system") return;
  preference = value === "system" ? null : value;
  try {
    if (preference === null) window.localStorage.removeItem(storageKey);
    else window.localStorage.setItem(storageKey, preference);
  } catch {
  }
  updateTheme();
}

function toggleTheme() {
  setAppTheme(theme === "dark" ? "light" : "dark");
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() { return theme; }
function getServerSnapshot() { return "light"; }

export function useAppTheme() {
  const currentTheme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { theme: currentTheme, toggleTheme };
}

function handleStorage(event) {
  if (event.key !== null && event.key !== storageKey) return;
  preference = readPreference();
  updateTheme();
}

applyTheme();
media?.addEventListener("change", updateTheme);
if (typeof window !== "undefined") window.addEventListener("storage", handleStorage);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    media?.removeEventListener("change", updateTheme);
    window.removeEventListener("storage", handleStorage);
    listeners.clear();
  });
}

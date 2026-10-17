// The site's color themes and modes. "default" is the blue look; each season has its own palette in globals.css.
// Every theme comes in a light and a dark version: the visitor picks Light or Dark, or Auto, which follows the
// device's setting. Both choices are kept in this browser only.
export const THEMES = [
  { id: "default", label: "Default", note: "Blue, the site's usual look", light: ["#1d4ed8", "#e8eefc"], dark: ["#7cb4ff", "#111a2e"] },
  { id: "summer", label: "Summer", note: "Warm sun and amber", light: ["#ad390a", "#fff1d6"], dark: ["#fbbf24", "#261c0f"] },
  { id: "autumn", label: "Autumn", note: "Rust and gold, with falling leaves", light: ["#a63d1a", "#f6e6d6"], dark: ["#f2995f", "#291c13"] },
  { id: "winter", label: "Winter", note: "Frost blue, with light snowfall", light: ["#0369a1", "#e4f0fa"], dark: ["#7dd3fc", "#102131"] },
  { id: "rain", label: "Rain", note: "Deep teal, with soft rain", light: ["#0f766e", "#e2efec"], dark: ["#5eead4", "#112320"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const MODES = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "auto", label: "Auto" },
] as const;

export type ModeId = (typeof MODES)[number]["id"];

export const STORAGE_KEY = "theme";
export const MODE_KEY = "mode";
export const THEME_EVENT = "themechange";

// The seasons are stored by name; "default" is stored as nothing at all. Likewise Light and Dark are stored, and Auto
// is nothing.
export const SEASON_IDS: ThemeId[] = THEMES.map((theme) => theme.id).filter((id) => id !== "default");

export function isSeason(value: unknown): value is ThemeId {
  return typeof value === "string" && value !== "default" && SEASON_IDS.includes(value as ThemeId);
}

export function isFixedMode(value: unknown): value is "light" | "dark" {
  return value === "light" || value === "dark";
}

// Runs in <head> before the page paints: sets the saved theme, and the mode (the saved one, or the device's), so a
// returning visitor never sees the wrong colors flash first. <html data-mode> always ends up "light" or "dark".
export const themeScript = `(function(){var d=document.documentElement,t=null,m=null;try{t=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)});m=localStorage.getItem(${JSON.stringify(MODE_KEY)})}catch(e){}if(${JSON.stringify(
  SEASON_IDS,
)}.indexOf(t)>-1)d.setAttribute("data-theme",t);if(m!=="light"&&m!=="dark")m=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.setAttribute("data-mode",m)})()`;

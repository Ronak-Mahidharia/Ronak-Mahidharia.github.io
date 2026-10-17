// The site's color themes. "default" is the blue look; each season has its own palette in globals.css, in a light
// and a dark version that follow the visitor's device setting. A visitor's choice is kept in this browser only.
export const THEMES = [
  { id: "default", label: "Default", note: "Blue, the site's usual look", swatch: ["#1d4ed8", "#e8eefc"] },
  { id: "summer", label: "Summer", note: "Warm sun and amber", swatch: ["#ad390a", "#fff1d6"] },
  { id: "autumn", label: "Autumn", note: "Rust and gold, with falling leaves", swatch: ["#a63d1a", "#f6e6d6"] },
  { id: "winter", label: "Winter", note: "Frost blue, with light snowfall", swatch: ["#0369a1", "#e4f0fa"] },
  { id: "rain", label: "Rain", note: "Deep teal, with soft rain", swatch: ["#0f766e", "#e2efec"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const STORAGE_KEY = "theme";
export const THEME_EVENT = "themechange";

// The seasons are stored by name; "default" is stored as nothing at all.
export const SEASON_IDS: ThemeId[] = THEMES.map((theme) => theme.id).filter((id) => id !== "default");

export function isSeason(value: unknown): value is ThemeId {
  return typeof value === "string" && value !== "default" && SEASON_IDS.includes(value as ThemeId);
}

// Runs in <head> before the page paints, so a returning visitor never sees the default colors flash first.
export const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(${JSON.stringify(
  SEASON_IDS,
)}.indexOf(t)>-1)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

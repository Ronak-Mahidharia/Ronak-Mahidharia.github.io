"use client";

import { useEffect, useSyncExternalStore, type ComponentType, type Ref } from "react";
import { CloudRainIcon, ContrastIcon, LeafIcon, SnowflakeIcon, SunIcon } from "@/components/Icons";
import {
  MODE_KEY,
  MODES,
  STORAGE_KEY,
  THEME_EVENT,
  THEMES,
  isFixedMode,
  isSeason,
  type ModeId,
  type ThemeId,
} from "@/components/themes";

const ICONS: Record<ThemeId, ComponentType<{ className?: string }>> = {
  default: ContrastIcon,
  summer: SunIcon,
  autumn: LeafIcon,
  winter: SnowflakeIcon,
  rain: CloudRainIcon,
};

const DARK_DEVICE = "(prefers-color-scheme: dark)";

// The theme and the mode live on <html data-theme> and <html data-mode>, set before the first paint by the script in
// layout.tsx; React reads them from there (and the mode choice from storage), so the picker always agrees with
// what's on screen.
function readTheme(): ThemeId {
  const value = document.documentElement.getAttribute("data-theme");
  return isSeason(value) ? value : "default";
}

function readModeChoice(): ModeId {
  try {
    const value = localStorage.getItem(MODE_KEY);
    return isFixedMode(value) ? value : "auto";
  } catch {
    return "auto";
  }
}

function readShownMode(): "light" | "dark" {
  return document.documentElement.getAttribute("data-mode") === "dark" ? "dark" : "light";
}

let fadeTimer = 0;

// Every color fades to the new theme or mode (no fade for visitors who ask for less motion).
function fade() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = document.documentElement;
  root.classList.add("theme-changing");
  window.clearTimeout(fadeTimer);
  fadeTimer = window.setTimeout(() => root.classList.remove("theme-changing"), 800);
}

function remember(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (a private window); the choice still applies for this visit.
  }
}

// Switches the theme and remembers it in this browser.
export function applyTheme(theme: ThemeId, save = true) {
  fade();
  const root = document.documentElement;
  if (theme === "default") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  if (save) remember(STORAGE_KEY, theme === "default" ? null : theme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

// Switches to Light, Dark, or Auto (the device's setting) and remembers it in this browser.
export function applyMode(mode: ModeId, save = true) {
  const shown = mode === "auto" ? (window.matchMedia(DARK_DEVICE).matches ? "dark" : "light") : mode;
  if (shown !== readShownMode()) fade();
  document.documentElement.setAttribute("data-mode", shown);
  if (save) remember(MODE_KEY, mode === "auto" ? null : mode);
  window.dispatchEvent(new Event(THEME_EVENT));
}

// React re-reads the theme and mode whenever either changes.
function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

type ThemePickerProps = {
  open: boolean;
  onToggle: () => void;
  buttonRef: Ref<HTMLButtonElement>;
};

// A button in the top bar that opens a panel with every theme, and Light, Dark, or Auto. A choice applies at once
// (with a fade), so a visitor can try them in turn; the panel closes with Escape or a tap outside, like the phone menu.
export function ThemePicker({ open, onToggle, buttonRef }: ThemePickerProps) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "default" as ThemeId);

  // A choice made in another tab of this site shows up here too; and on Auto, the page follows the device when its
  // setting changes (at sunset, say).
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) applyTheme(isSeason(event.newValue) ? event.newValue : "default", false);
      if (event.key === MODE_KEY) applyMode(isFixedMode(event.newValue) ? event.newValue : "auto", false);
    };
    const device = window.matchMedia(DARK_DEVICE);
    const onDevice = () => {
      if (readModeChoice() === "auto") applyMode("auto", false);
    };
    window.addEventListener("storage", onStorage);
    device.addEventListener("change", onDevice);
    return () => {
      window.removeEventListener("storage", onStorage);
      device.removeEventListener("change", onDevice);
    };
  }, []);
  const modeChoice = useSyncExternalStore(subscribe, readModeChoice, () => "auto" as ModeId);
  const shownMode = useSyncExternalStore(subscribe, readShownMode, () => "light" as const);
  const current = THEMES.find((item) => item.id === theme) ?? THEMES[0];
  const modeLabel = MODES.find((item) => item.id === modeChoice)?.label ?? "Auto";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="theme-panel"
        onClick={onToggle}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-foreground"
      >
        {/* globals.css shows the icon of the theme on screen, even before React starts. */}
        {THEMES.map((item) => {
          const Icon = ICONS[item.id];
          return <Icon key={item.id} className={`theme-icon theme-icon-${item.id} h-5 w-5`} />;
        })}
        <span className="sr-only">
          Theme: {current.label}, {modeLabel}
        </span>
      </button>

      <div
        id="theme-panel"
        data-open={open}
        className="panel absolute top-full right-5 mt-2 w-[min(19rem,calc(100vw-2.5rem))] rounded-2xl border border-border bg-card p-2 shadow-xl sm:right-6"
      >
        <fieldset>
          <legend className="px-2 pt-2 text-sm font-semibold">Theme</legend>
          <div className="mt-2 space-y-1">
            {THEMES.map((item) => {
              const Icon = ICONS[item.id];
              const checked = theme === item.id;
              const [swatchAccent, swatchBackground] = item[shownMode];
              return (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                    checked ? "bg-surface" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={item.id}
                    checked={checked}
                    onChange={() => applyTheme(item.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border"
                    style={{ background: swatchBackground, color: swatchAccent }}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="block text-xs text-muted">{item.note}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 shrink-0 rounded-full bg-accent transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
                  />
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-2 border-t border-border px-2 pt-3 pb-1">
          <legend className="sr-only">Mode</legend>
          <p aria-hidden="true" className="text-sm font-semibold">
            Mode
          </p>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-surface p-1">
            {MODES.map((item) => {
              const checked = modeChoice === item.id;
              return (
                <label
                  key={item.id}
                  className={`flex h-9 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                    checked ? "bg-accent text-accent-foreground shadow-sm" : "text-muted hover:text-foreground"
                  }`}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={item.id}
                    checked={checked}
                    onChange={() => applyMode(item.id)}
                    className="sr-only"
                  />
                  {item.label}
                </label>
              );
            })}
          </div>
          <p className="pt-2 text-xs text-muted">Auto follows your device&apos;s light or dark setting.</p>
        </fieldset>
      </div>
    </>
  );
}

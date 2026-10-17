"use client";

import { useSyncExternalStore, type ComponentType, type Ref } from "react";
import { CloudRainIcon, ContrastIcon, LeafIcon, SnowflakeIcon, SunIcon } from "@/components/Icons";
import { STORAGE_KEY, THEME_EVENT, THEMES, isSeason, type ThemeId } from "@/components/themes";

const ICONS: Record<ThemeId, ComponentType<{ className?: string }>> = {
  default: ContrastIcon,
  summer: SunIcon,
  autumn: LeafIcon,
  winter: SnowflakeIcon,
  rain: CloudRainIcon,
};

// The theme lives on <html data-theme>, set before the first paint by the script in layout.tsx; React reads it from
// there, so the picker always agrees with what's on screen.
function readTheme(): ThemeId {
  const value = document.documentElement.getAttribute("data-theme");
  return isSeason(value) ? value : "default";
}

let fadeTimer = 0;

// Switches the theme with a short fade (none for visitors who ask for less motion) and remembers it in this browser.
export function applyTheme(theme: ThemeId, remember = true) {
  const root = document.documentElement;
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("theme-changing");
    window.clearTimeout(fadeTimer);
    fadeTimer = window.setTimeout(() => root.classList.remove("theme-changing"), 800);
  }
  if (theme === "default") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  if (remember) {
    try {
      if (theme === "default") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage can be blocked (a private window); the theme still applies for this visit.
    }
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

function subscribe(onChange: () => void) {
  // A choice made in another tab of this site shows up here too.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) applyTheme(isSeason(event.newValue) ? event.newValue : "default", false);
  };
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

type ThemePickerProps = {
  open: boolean;
  onToggle: () => void;
  buttonRef: Ref<HTMLButtonElement>;
};

// A button in the top bar that opens a panel with every theme. Choosing one applies it at once (with a fade), so a
// visitor can try them in turn; the panel closes with Escape or a tap outside, like the phone menu.
export function ThemePicker({ open, onToggle, buttonRef }: ThemePickerProps) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "default" as ThemeId);
  const current = THEMES.find((item) => item.id === theme) ?? THEMES[0];

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
        <span className="sr-only">Theme: {current.label}</span>
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
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
                    style={{ background: item.swatch[1], color: item.swatch[0] }}
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
          <p className="px-2 pt-2 pb-1 text-xs text-muted">
            Each theme has a light and a dark version; your device&apos;s setting picks one.
          </p>
        </fieldset>
      </div>
    </>
  );
}

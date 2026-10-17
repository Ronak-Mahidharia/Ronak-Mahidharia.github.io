"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/Icons";

export type NavItem = { id: string; label: string };

// How long a section chosen from a link stays marked while the page scrolls to it.
const SCROLL_TIME = 1200;

// The top bar: the name, and a link to every section. Wide screens show the links in the bar; phones get a Menu
// button that opens the same links. The section on screen is marked, so a visitor always knows where they are.
export function SiteHeader({ name, items }: { name: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chosen = useRef<{ id: string; until: number } | null>(null);
  const initials = name.split(" ").map((word) => word[0]).join("");

  // The marked section: the one chosen from a link, while its heading is still near the top (a short last section
  // can't scroll all the way up); otherwise the last section whose top has passed just under the bar, or the last
  // section once the page can't scroll any further.
  useEffect(() => {
    const ids = items.map((item) => item.id);
    let frame = 0;
    const topOf = (id: string) => document.getElementById(id)?.getBoundingClientRect().top;
    const update = () => {
      frame = 0;
      const barBottom = barRef.current?.getBoundingClientRect().bottom ?? 0;
      const pick = chosen.current;
      if (pick) {
        const top = topOf(pick.id);
        if (top !== undefined && (performance.now() < pick.until || (top > barBottom - 48 && top < window.innerHeight * 0.6))) {
          setActive(pick.id);
          return;
        }
        chosen.current = null;
      }
      let current = "";
      for (const id of ids) {
        const top = topOf(id);
        if (top !== undefined && top <= barBottom + 96) current = id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActive(atBottom && current ? ids[ids.length - 1] : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Links elsewhere on the page (and an address with #section) choose a section too.
    const onHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (ids.includes(id)) chosen.current = { id, until: performance.now() + SCROLL_TIME };
      onScroll();
    };
    onHash();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onHash);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  // The open menu closes with Escape (focus goes back to its button) or a tap outside the bar.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  // Turning a phone sideways (or widening a window) past the menu's breakpoint closes the menu.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (wide.matches) setOpen(false);
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  // `at` is the click's time stamp, on the same clock as performance.now().
  const choose = (id: string, at: number) => {
    chosen.current = { id, until: at + SCROLL_TIME };
    setActive(id);
    setOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md"
    >
      <div ref={barRef} className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-6">
        <a href="#top" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg font-semibold tracking-tight">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-sm font-bold text-accent-foreground"
          >
            {initials}
          </span>
          <span>{name}</span>
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {items.map((item) => {
              const current = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={current ? "true" : undefined}
                    onClick={(event) => choose(item.id, event.timeStamp)}
                    className={`relative block rounded-md px-3 py-2 transition-colors hover:text-foreground ${
                      current ? "font-medium text-foreground" : "text-muted"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-accent transition-opacity ${
                        current ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="section-menu"
          onClick={() => setOpen((value) => !value)}
          className="-mr-2 flex h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium md:hidden"
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Opens over the page (below the bar), so nothing on the page moves. */}
      <nav
        id="section-menu"
        aria-label="Sections"
        hidden={!open}
        className="absolute inset-x-0 top-full border-y border-border bg-background shadow-lg md:hidden"
      >
        <ul className="mx-auto max-w-5xl px-3 py-2">
          {items.map((item) => {
            const current = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current ? "true" : undefined}
                  onClick={(event) => choose(item.id, event.timeStamp)}
                  className={`flex min-h-11 items-center rounded-lg border-l-2 px-3 text-base transition-colors ${
                    current ? "border-accent bg-surface font-medium text-foreground" : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

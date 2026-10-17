import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  // "muted" sections sit on a light band, so neighboring sections are easy to tell apart.
  tone?: "plain" | "muted";
  children: ReactNode;
};

// A full-width band with the section's heading. The top bar's links point at the band's id; the page's
// scroll-padding (globals.css) stops each one just below the sticky bar.
export function Section({ id, title, tone = "plain", children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`py-16 sm:py-20 ${tone === "muted" ? "border-y border-border bg-surface" : ""}`}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-accent" />
        <h2 id={`${id}-title`} className="mt-4 mb-8 text-2xl font-semibold tracking-tight sm:mb-10 sm:text-3xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

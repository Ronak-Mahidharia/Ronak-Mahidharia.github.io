import site from "@/content/site.json";
import { Section } from "@/components/Section";
import { ExternalLink } from "@/components/ExternalLink";
import { Tags } from "@/components/Tags";

// On phones only Contact fits next to the name; the full menu shows from the `sm` breakpoint up.
const nav = [
  { href: "#about", label: "About", phone: false },
  { href: "#experience", label: "Experience", phone: false },
  { href: "#projects", label: "Projects", phone: false },
  { href: "#skills", label: "Skills", phone: false },
  { href: "#contact", label: "Contact", phone: true },
];

const contactLinks = [
  { label: "Email", href: `mailto:${site.email}`, text: site.email },
  { label: "LinkedIn", href: site.links.linkedin, text: "linkedin.com/in/ronakmahidharia" },
  { label: "GitHub", href: site.links.github, text: "github.com/Ronak-Mahidharia" },
];

const linkStyle =
  "underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
          <a href="#top" className="shrink-0 font-semibold tracking-tight">
            {site.name}
          </a>
          <nav aria-label="Sections" className="-mr-2">
            <ul className="flex gap-1 text-sm text-muted">
              {nav.map((item) => (
                <li key={item.href} className={item.phone ? "" : "hidden sm:block"}>
                  <a href={item.href} className="block rounded-md px-2 py-1 transition-colors hover:text-foreground">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl px-5 sm:px-6">
        {/* Intro */}
        <section id="top" aria-label="Introduction" className="scroll-mt-20 py-16 sm:py-24">
          <p className="text-sm font-medium text-accent">{site.role}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{site.name}</h1>
          <p className="mt-6 text-xl leading-relaxed">{site.intro}</p>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">{site.summary}</p>
          <p className="mt-4 text-sm text-muted">{site.location}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${site.email}`}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Email me
            </a>
            <ExternalLink
              href={site.links.linkedin}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              LinkedIn
            </ExternalLink>
            <ExternalLink
              href={site.links.github}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              GitHub
            </ExternalLink>
          </div>
        </section>

        <Section id="about" title="About">
          <div className="space-y-4 leading-relaxed">
            {site.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <ol className="space-y-12">
            {site.experience.map((job) => (
              <li key={`${job.company}-${job.dates}`}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-lg font-semibold">
                    {job.role} · {job.company}
                  </h3>
                  <p className="shrink-0 text-sm text-muted">{job.dates}</p>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {"companyNote" in job && job.companyNote ? `${job.companyNote} · ` : ""}
                  {job.location}
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed marker:text-muted">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <Tags items={job.stack} label={`Technologies used at ${job.company}`} />
              </li>
            ))}
          </ol>
        </Section>

        <Section id="projects" title="Projects">
          <ul className="grid gap-6">
            {site.projects.map((project) => (
              <li key={project.name} className="rounded-xl border border-border bg-card p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="shrink-0 text-sm text-muted">{project.dates}</p>
                </div>
                <p className="mt-3 leading-relaxed">{project.description}</p>
                <Tags items={project.tags} label={`Technologies used in ${project.name}`} />
                <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
                  {project.links.map((link) => (
                    <ExternalLink key={link.href} href={link.href} className={linkStyle}>
                      {link.label}
                      <span className="sr-only"> for {project.name} (opens in a new tab)</span>
                    </ExternalLink>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="skills" title="Skills">
          <dl className="space-y-4">
            {site.skills.map((skill) => (
              <div key={skill.group} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="font-medium">{skill.group}</dt>
                <dd className="leading-relaxed text-muted">{skill.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="education" title="Education">
          <ul className="space-y-6">
            {site.education.map((school) => (
              <li key={school.school}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-semibold">{school.school}</h3>
                  <p className="shrink-0 text-sm text-muted">{school.dates}</p>
                </div>
                <p className="mt-1 text-muted">
                  {school.degree} · {school.location}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="contact" title="Contact">
          <p className="leading-relaxed">The quickest way to reach me is email or LinkedIn.</p>
          <ul className="mt-4 space-y-2">
            {contactLinks.map((link) => (
              <li key={link.label} className="flex gap-3">
                <span className="w-20 shrink-0 text-muted">{link.label}</span>
                <ExternalLink href={link.href} className={linkStyle}>
                  {link.text}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </Section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-5 py-8 text-sm text-muted sm:px-6">
          © {new Date().getFullYear()} {site.name}. Built with Next.js and Tailwind CSS.
        </div>
      </footer>
    </>
  );
}

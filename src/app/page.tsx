import site from "@/content/site.json";
import { Section } from "@/components/Section";
import { ExternalLink } from "@/components/ExternalLink";
import { Tags } from "@/components/Tags";
import { SiteHeader, type NavItem } from "@/components/SiteHeader";
import { SeasonEffects } from "@/components/SeasonEffects";
import { ArrowUp, ArrowUpRight, Mail, MapPin } from "@/components/Icons";

// The top bar links to every section, in page order (on phones, through its menu).
const sections: NavItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const contactLinks = [
  { label: "Email", href: `mailto:${site.email}`, text: site.email },
  { label: "LinkedIn", href: site.links.linkedin, text: "linkedin.com/in/ronakmahidharia" },
  { label: "GitHub", href: site.links.github, text: "github.com/Ronak-Mahidharia" },
];

const primaryButton =
  "inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition-opacity hover:opacity-90";
const secondaryButton =
  "inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent";
const card = "rounded-2xl border border-border bg-card";
const linkStyle =
  "underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent";

function ContactButtons() {
  return (
    <>
      <a href={`mailto:${site.email}`} className={primaryButton}>
        <Mail />
        Email me
      </a>
      <ExternalLink href={site.links.linkedin} className={secondaryButton}>
        LinkedIn
        <ArrowUpRight className="h-3.5 w-3.5" />
        <span className="sr-only"> (opens in a new tab)</span>
      </ExternalLink>
      <ExternalLink href={site.links.github} className={secondaryButton}>
        GitHub
        <ArrowUpRight className="h-3.5 w-3.5" />
        <span className="sr-only"> (opens in a new tab)</span>
      </ExternalLink>
    </>
  );
}

export default function Home() {
  const [currentJob] = site.experience;
  const [degree] = site.education;
  // The newest projects, for the summary card; the full list is in Projects.
  const recentProjects = site.projects.filter((project) => project.dates === site.projects[0].dates);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>

      <SiteHeader name={site.name} items={sections} />

      <main id="main">
        {/* Intro */}
        <section id="top" aria-label="Introduction" className="relative isolate overflow-hidden">
          <div aria-hidden="true" className="hero-glow absolute inset-0 -z-10" />
          <SeasonEffects />
          <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 sm:px-6 sm:py-24 md:grid-cols-[minmax(0,1fr)_17rem] md:items-center lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div>
              <p className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-accent">
                {site.role}
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{site.name}</h1>
              <p className="mt-6 text-xl leading-relaxed sm:text-2xl">{site.intro}</p>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted">{site.summary}</p>
              <p className="mt-5 flex items-center gap-2 text-sm text-muted">
                <MapPin />
                {site.location}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ContactButtons />
              </div>
            </div>

            <aside aria-label="At a glance" className={`${card} p-6 shadow-sm`}>
              <p className="text-sm font-semibold">At a glance</p>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-muted">Current role</dt>
                  <dd className="mt-1 font-medium">
                    {currentJob.role} · {currentJob.company}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Education</dt>
                  <dd className="mt-1 font-medium">{degree.degree}</dd>
                  <dd className="text-muted">{degree.school}</dd>
                </div>
                <div>
                  <dt className="text-muted">Recent projects</dt>
                  <dd className="mt-1 font-medium">{recentProjects.map((project) => project.name).join(", ")}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <Section id="about" title="About" tone="muted">
          <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
            {site.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <ol className="max-w-4xl space-y-12 border-l border-border pl-6 sm:pl-8">
            {site.experience.map((job) => (
              <li key={`${job.company}-${job.dates}`} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-[30px] h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background sm:-left-[38px]"
                />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="text-lg font-semibold">
                    {job.role} <span className="font-normal text-muted">·</span> {job.company}
                  </h3>
                  <p className="shrink-0 text-sm font-medium text-muted">{job.dates}</p>
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

        <Section id="projects" title="Projects" tone="muted">
          <ul className="grid gap-6 md:grid-cols-2">
            {site.projects.map((project) => (
              <li
                key={project.name}
                className={`${card} flex flex-col p-6 shadow-sm transition-shadow hover:shadow-md`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="shrink-0 text-sm text-muted">{project.dates}</p>
                </div>
                <p className="mt-3 leading-relaxed">{project.description}</p>
                <Tags items={project.tags} label={`Technologies used in ${project.name}`} />
                <p className="mt-auto flex flex-wrap gap-3 pt-6">
                  {project.links.map((link) => (
                    <ExternalLink
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      <span className="sr-only"> for {project.name} (opens in a new tab)</span>
                    </ExternalLink>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="skills" title="Skills">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {site.skills.map((skill) => (
              <li key={skill.group} className={`${card} p-5`}>
                <h3 className="font-semibold">{skill.group}</h3>
                <Tags items={skill.items} label={`${skill.group} skills`} className="mt-3" />
              </li>
            ))}
          </ul>
        </Section>

        <Section id="education" title="Education" tone="muted">
          <ul className="grid gap-4 md:grid-cols-2">
            {site.education.map((school) => (
              <li key={school.school} className={`${card} p-6`}>
                <p className="text-sm font-medium text-muted">{school.dates}</p>
                <h3 className="mt-1 text-lg font-semibold">{school.school}</h3>
                <p className="mt-2 leading-relaxed">{school.degree}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  {school.location}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="contact" title="Contact">
          <div className={`${card} p-6 shadow-sm sm:p-8 md:flex md:items-center md:justify-between md:gap-10`}>
            <div>
              <p className="text-lg leading-relaxed">The quickest way to reach me is email or LinkedIn.</p>
              <ul className="mt-5 space-y-2 text-sm">
                {contactLinks.map((link) => (
                  <li key={link.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                    <span className="shrink-0 text-muted sm:w-20">{link.label}</span>
                    <ExternalLink href={link.href} className={`${linkStyle} wrap-anywhere`}>
                      {link.text}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
              <ContactButtons />
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.name}. Built with Next.js and Tailwind CSS.
          </p>
          <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </footer>
    </>
  );
}

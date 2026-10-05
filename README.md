# Ronak Mahidharia's portfolio

My personal site: experience, projects, skills, and contact links in one page. Live at **https://ronak-mahidharia.github.io/**.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. It's exported as a static site, so there's no server to run.

## Edit the content
All text lives in [`src/content/site.json`](src/content/site.json): the intro, about, experience, projects, skills, and education. The page layout is in `src/app/page.tsx`.

The picture a shared link shows (on LinkedIn, Slack, and other sites) is [`src/app/opengraph-image.png`](src/app/opengraph-image.png), 1200 × 630, with its description in `opengraph-image.alt.txt`. It repeats the name, role, and intro, so update it if those change.

To add a project, add an entry to `projects` in `site.json`:

```json
{
  "name": "Project name",
  "dates": "Oct 2026",
  "description": "One or two sentences on what it does and how.",
  "tags": ["Python", "PostgreSQL"],
  "links": [{ "label": "Code", "href": "https://github.com/Ronak-Mahidharia/..." }]
}
```

## Run it locally
You need Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build
```bash
npm run build
```

This writes the finished static site to `out/`. `npm run lint` checks the code.

## Deploy
GitHub Pages publishes the site after every merge to `main` ([workflow](.github/workflows/pages.yml)). CI runs the linter and the build on every pull request ([workflow](.github/workflows/ci.yml)).

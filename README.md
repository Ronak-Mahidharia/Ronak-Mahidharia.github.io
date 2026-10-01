# Ronak Mahidharia — Portfolio

My personal site: experience, projects, skills, and contact links in one page.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. It's exported as a static site, so there's no server to run.

## Edit the content
All text lives in [`src/content/site.json`](src/content/site.json): the intro, about, experience, projects, skills, and education. The page layout is in `src/app/page.tsx`.

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
Import this repository in Vercel. It detects Next.js automatically, and every push to `main` redeploys the site.

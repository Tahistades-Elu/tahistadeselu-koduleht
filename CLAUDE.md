# Tähistades Elu — public marketing site

The public website for **Tähistades Elu (LSCANDLES OÜ)**, an Estonian company
arranging celebration-of-life ceremonies. Static Nuxt site, built in GitHub Actions
and served from GitHub Pages at **tahistadeselu.ee**.

Repo `wargunnerguy/tahistadeselu` — **public**. Nothing secret belongs in it.

## Scope

This repo is the marketing site and nothing else.

The self-service portal (`iseteenindus`) is a separate private project and is
**not developed from this folder** — it lives in WSL at
`~/projects/tahistadeselu-iseteenindus` (repo `Tahistades-Elu/tahistadeselu-iseteenindus`).
Do not add portal code, portal infrastructure, or client-data handling here.

## Rules

- **Marketing site only.** Pages, copy, images, links. Anything that needs a
  server, a login or a database belongs in the portal repo.
- **No API keys or secrets** — not in code, not in `.env.example`, not in commits.
  The repo and the built bundle are public.
- **No portal or client data** — no exports, test dumps or personal details of
  clients, even as fixtures.
- **No payment logic.** Prices are shown here; checkout and payment happen in the
  portal. Links to the portal are plain absolute `https://` links, never routed
  through `NuxtLink`/`localePath`.
- **Never touch `CNAME` or DNS** (see below).
- Line endings are LF, enforced by `.gitattributes`.

## Stack

- **Nuxt 4**, statically generated (`nuxt generate`) — output goes to `dist/`
- **Tailwind** via `@nuxtjs/tailwindcss`
- **`@nuxtjs/i18n`**, Estonian default, English at `/en/*`
  (`strategy: 'prefix_except_default'`)
- npm on CI; a `pnpm-lock.yaml` is also present in the repo

## Layout

| Path | What |
|---|---|
| `app/pages/` | one file per route — `index`, `teenused`, `pood`, `broneeri`, `kontakt`, `meist`, `privaatsus` |
| `app/components/` | `NavBar.vue`, `Footer.vue`, `PrePlanningPackages.vue` (the three pre-planning packages, shown on `index` and `teenused`; copy in `teenused.prePlanning`) |
| `app/composables/useScrollReveal.ts` | scroll-triggered reveal animation used across pages |
| `locales/et.ts`, `locales/en.ts` | all copy — pages read from these, they don't hardcode strings |
| `public/` | images and static assets |
| `google-apps-script/Code.gs` | the form backend, pasted by hand into script.google.com |
| `CNAME` | `tahistadeselu.ee` — required by GitHub Pages, don't delete it |

Adding user-visible text means adding it to **both** `locales/et.ts` and
`locales/en.ts`. Estonian is the primary language; English is the translation.

## Forms

`broneeri`, `kontakt` and `pood` POST JSON to a Google Apps Script web app at
`import.meta.env.VITE_APPS_SCRIPT_URL`, which appends to a Sheet, emails a
notification, and issues a `TE-<n>` reference.

- Locally the URL comes from `.env` (gitignored).
- In CI it comes from the repo variable `APPS_SCRIPT_URL`, injected at build time.
  It is a **repo variable, not a secret** — the URL is baked into the static bundle
  and is public by nature, so the endpoint must stay safe to call anonymously.
- `Code.gs` is not deployed by CI. Changing it means pasting it into the Apps Script
  editor and redeploying the web app there.

Eventually these forms move to the portal's `/api/public/booking` and
`/api/public/contact`. Until the portal is actually serving, they stay on Apps Script.

## Deploy

Push to `master` → `.github/workflows/deploy.yml` runs `npm run generate`, copies
`dist/index.html` to `dist/404.html` (so client-side routes survive a refresh on
Pages), and publishes to GitHub Pages. There is no manual deploy step.

The `npm run deploy` script in `package.json` is a leftover `gh-pages` path and is
not what production uses.

## DNS

Managed at Veebimajutus.ee. The site is the four A records at
`185.199.108–111.153` plus the `www` CNAME. **Do not touch those**, or the MX / SPF
/ DKIM / DMARC records — mail for the domain depends on them.

## Working style

Give exact PowerShell commands one step at a time, and wait for the output before
moving on. Where a result determines the next step, say what to look for.

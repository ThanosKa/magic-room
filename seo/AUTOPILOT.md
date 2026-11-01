# SEO autopilot: runbook

Every scheduled run follows this file from the top. It is the `seo-autopilot` skill with Magic Room's settings filled in and this repo's data sources added. Setup ran on 2026-11-01.

```
Site:          https://magic-room.dev
Product:       AI interior design web app: upload one room photo, pick a room type and a style, get a redesign of that same room in 30 s to 2 min. One-time credit packs (€9.99/20, €19.99/60, €29.99/120), no subscription, photos never stored. Bought by homeowners planning a makeover, and by agents and Airbnb hosts staging listing photos.
Conversion:    sign-up (Clerk) and then a credit pack purchase (Stripe)
Competitors:   RoomGPT, Interior AI, Reimagine Home, DecorAI, GenRoom, Visualizee, HomeDesigns AI, ArchitectGPT (see seo/context.md)
Ship mode:     PR for review
Language:      seo/reports/*.md and the email in Greek, plain words (the owner is not a design engineer). Other seo/ files, code, site copy, commits and PRs in English.
```

## This repo: read first, every run

- Read `AGENTS.md` and `.cursor/rules/general.mdc` and obey them (no `any`, `@/*` imports, design tokens only, no `dark:` classes, motion rules).
- **Branches.** `main` is production (what is live). `dev` is where work lands and is usually ahead of `main`. Branch from `origin/dev` (fall back to `origin/main` if `dev` does not exist) as `seo/daily-YYYY-MM-DD`, and open the PR against `dev`. Never push to `main` or `dev`, never `--force`, never merge.
- **GitHub in a cloud run: REST only.** GraphQL is blocked there, so `gh pr create`, `gh pr list` and `gh pr view` fail. Use the REST API instead: list open PRs with `gh api 'repos/ThanosKa/magic-room/pulls?state=open&per_page=50' --jq '.[] | {number, head: .head.ref, base: .base.ref}'`; open a PR with `gh api repos/ThanosKa/magic-room/pulls -f title="..." -f head="seo/daily-YYYY-MM-DD" -f base="dev" -F body=@/tmp/pr-body.md --jq .html_url`.
- **Fact source.** Product facts come from the code on `dev`, not from the live site, which may be behind. `seo/context.md` lists where each fact lives. Health checks run against the live site.
- **How the site is built** (details in `seo/context.md`): metadata in `lib/seo/metadata.ts`, schema in `lib/seo/schema.ts`, sitemap in `app/sitemap.ts` (hand-set per-surface dates, never `new Date()`; bump only the surface you changed), blog posts in `lib/seo/blog-data.ts`, design pages in `lib/seo/design-data.ts` + `lib/seo/priority-pages.ts`, competitor pages in `lib/seo/competitor-data.ts`, prune/noindex/redirects in `lib/seo/pruned.ts` (read `PRUNED.md` first), internal link blocks in `lib/seo/internal-links.ts`, AI fact files in `public/llms.txt`, `public/llms-full.txt`, `public/pricing.md`.
- **Do not touch** `lib/constants.ts` prices or credits, `app/api/`, `lib/stripe.ts`, `lib/supabase.ts`, `lib/openrouter.ts`, webhooks, or `components/generate/`. This job edits marketing content and SEO plumbing only.
- **The repo is public.** Never write user, revenue or sign-up numbers into any file, commit or PR. Search Console aggregates (clicks, impressions, positions) are fine.
- **Never commit** `.env*` files or any secret.

## Data sources in this repo

- **Search Console.** Locally: the `gsc` MCP server, property `https://magic-room.dev/`. In a cloud run: `node seo/gsc.mjs <command> --site https://magic-room.dev/` (commands: `queries`, `pages`, `page-queries`, `striking` for positions 8-20, `compare` for last N days vs the N before, `sitemaps`, `inspect --url <url>`; add `--days N` or `--limit N`; usage at the top of the file). It reads a read-only service-account key from the `GSC_SA_KEY_B64` env var and prints JSON. Never print, echo, log or commit that variable or its value. If it says the key is not set or exits with an error, treat Search Console as not connected for this run and say so once in the report. Cite the date range it prints next to every number.
- **Not connected:** keyword volume and difficulty, analytics with landing pages, Stripe and the production database (so no sign-up or revenue numbers), ChatGPT/Perplexity/AI Overviews. Say so once in the weekly report and carry on. Never guess a number.
- **After a deploy:** `node scripts/indexnow.mjs` submits the live sitemap to Bing and Yandex. Only useful once a PR has reached `main`; list it for the owner otherwise.

## Model use

You run on Opus. Keep the thinking work yourself: deciding what to ship, research, reading competitors, writing new pages and any claim about a competitor, and reviewing every diff before you commit.

Small, mechanical edits go to a Sonnet subagent to save cost: call the Agent tool with `model: "sonnet"` and give it the exact file(s), the exact old and new text or rule, and the evidence. Examples: a title or meta description, a fact swap across known files (backlog items tagged **[sonnet]**), adding internal links you already chose, a sitemap date, `seo/log.md`, `seo/keyword-map.csv` updates. Then read its diff yourself. Never give a subagent the GSC key or ask it to run `seo/gsc.mjs`.

## Ship procedure

1. `pnpm install --frozen-lockfile`.
2. `pnpm lint` and `pnpm type-check` must pass. A `type-check` error that only points into `.next/types/` (a stale generated file for a route that no longer exists) is not real: run `pnpm build` first, then `type-check` again.
3. `pnpm build`. If it fails only because env vars are missing in the cloud sandbox (Clerk, Supabase, Stripe, OpenRouter, Upstash keys), say so in the PR body and rely on the Vercel preview check on the PR. Any other failure: fix it or do not ship.
4. If the build passed: `pnpm exec next start -p 3517` in the background, curl every changed URL, confirm 200 and the expected title/H1/text, then stop the server.
5. Commit with a conventional message (`seo(scope): ...` or `fix(seo): ...`) ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push. Open the PR (REST, see "GitHub in a cloud run" above). PR body: each change with its URL and the evidence for it, then `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
6. If there is nothing worth shipping, do not open an empty PR.

---

You run search for this product, end to end. The owner should not have to think about SEO at all. Your goal is more buyers arriving from Google and from AI answers (ChatGPT, Perplexity, Google AI Overviews) and converting. Traffic that never converts does not count, and neither does word count.

You work in this repo. Everything you ship is a real change to the site: a new page, an edit, a redirect, a tool. Advice in a document is not work.

## Where you keep state

You have no memory between runs. All of it lives in `seo/` in this repo. Read it at the start of every run and update it before you finish.

- `seo/context.md`: the product, the buyer, prices, features, limits, claims and competitors. Build it from the code and the live pricing page, never from memory. Every fact gets the file or URL it came from.
- `seo/keyword-map.csv`: one row per search query. Columns: query, intent, monthly volume, difficulty, target URL, status (live, planned, gap), current position, last checked.
- `seo/backlog.md`: the queue, ordered by expected signups per hour of work. Each item names the query, the page and the change.
- `seo/log.md`: one dated line per change you shipped, with the URL.
- `seo/ai-prompts.md`: 25 questions a buyer would ask an AI assistant, and what each assistant answered on each check.
- `seo/competitors/`: a snapshot of each competitor's sitemap, so you can diff it.
- `seo/reports/`, `seo/social/`, `seo/outreach/`, `seo/directories.md`.

## What to do on each run

1. If `seo/` does not exist, do **Setup** and stop. (It exists: setup ran on 2026-11-01.)
2. Otherwise do **Daily**.
3. If the newest file in `seo/reports/` is 7 or more days old, also do **Weekly**.
4. If the keyword map was last rebuilt 30 or more days ago (date at the top of `seo/backlog.md`), also do **Monthly**.

Use every data source that is connected: Search Console, Ahrefs or a similar tool, analytics, web search. If one is missing, say so once in the report, name exactly what it would unlock, and carry on with what you have. Never fill the gap with a guess.

## Setup (first run)

1. Read the repo. Learn the framework, how routes and blog posts are made, where titles, meta, canonicals, the sitemap, robots.txt and structured data come from. From now on, add pages the way the repo already does.
2. Use the product, or read its code, until you can explain what it does better than its homepage. Write `context.md`.
3. Confirm the competitors, or find them: who ranks for the queries this product should own, and who AI assistants name alongside it.
4. Build the keyword map (see Monthly, step 1).
5. Crawl the whole site and list every problem (see Daily, step 1).
6. Write the backlog. Ship the three highest-value fixes today so the first run ends with real changes.

## Daily

1. **Health check.** Fetch the sitemap and request every URL on the live site. Flag and fix: anything that is not a 200, redirect chains, redirects to a wrong page, missing or wrong canonicals, stray `noindex`, pages blocked by robots.txt, broken internal links, pages no other page links to, duplicate or missing titles and descriptions, pages whose main content is absent from the server HTML, slow pages. Fix what you can in this run and put the rest in the backlog. (Known and correct: `/generate` returns 404 to bots and signed-out non-browser requests, because Clerk protects it; browsers are redirected to sign-in. The homepage canonical prints without the trailing slash; Google treats both forms of the root URL as the same.)
2. **Fact check.** Read the commits on `origin/dev` since your last run (`git log` since the last date in `seo/log.md`). If a price, plan, limit, feature or integration changed, find every page that states the old fact and correct it today. A new feature also gets a backlog item: which queries does it let this product win now?
3. **Ship one thing from the top of the backlog.** One finished page is better than three drafts. If the top item is blocked (it needs the owner, or data you cannot get), say why in the backlog and take the next one.
4. Add a line to `log.md`.

## Weekly

1. **Page 2 to page 1.** Pull the queries that rank in positions 8 to 20 and get real impressions. For each one, open the top three results and work out why they win: closer match to what the searcher wants, a section you lack, fresher data, more links. Then change your page: answer the query in the first paragraph, add what is missing, put the query in the title and H1 if it reads naturally, and add links to it from your strongest related pages with descriptive anchor text. If the position is good but the click rate is low, rewrite the title and description instead.
2. **Fixes to existing pages.** Aim for 12 or more a week. A fix counts only if it changes what a searcher or a crawler sees. Titles, internal links, speed, redirects, thin sections, outdated screenshots, missing structured data.
3. **Indexing.** For every URL in the sitemap, confirm Google has indexed it (`seo/gsc.mjs inspect`). For any that are not, find the cause (thin, duplicate, orphaned, blocked, canonical pointing elsewhere) and fix that cause. If you cannot verify indexing, say "not verified", not "indexed".
4. **AI answers.** Ask each assistant the 25 questions in `ai-prompts.md`. Record whether the product is named, what is said about it, which sources are cited, and anything that is wrong. Then act on it: wrong facts mean your own pages are unclear, so state the fact in plain text on the page that owns it. If you are absent, the cited sources are your target list for outreach and directories. If no assistant is reachable, write "not checked".
5. **Competitors.** Diff each competitor's sitemap against the snapshot in `seo/competitors/`, then save the new snapshot. List what they published and which queries they gained. Add a backlog item only where you can make a better page than theirs.
6. **Report.** Write `seo/reports/YYYY-MM-DD.md` in Greek, under 300 words: what shipped (with links), what moved (clicks, impressions, positions and signups against last week, each number with its source), what is broken, what is next, and at most three things you need from the owner.

## Monthly

1. **Rebuild the keyword map.** Start from buyers, not from volume: the problems they search, the category terms, competitor names, "alternative" and "vs" queries, integrations, use cases, and the questions they ask before buying. Give every existing page exactly one primary query. Two pages chasing one query is a bug: merge them and redirect. A query with no page is a gap, and gaps go in the backlog.
2. **Up to 12 articles.** Publish fewer if fewer are worth writing. See the rules below.
3. **Comparison pages.** One "alternatives to X" and one "this product vs X" for each competitor that buyers search for. Be fair: a page that admits where the competitor is better is the one that gets trusted, ranked and cited. Every claim about a competitor gets a source and an "as of" date.
4. **One free tool.** A calculator, generator, checker or template that people already search for and that sits close to what the product does. It must work without a signup and it must work well. Build it in this repo.
5. **Links.** Add relevant directories to `directories.md` with ready-to-paste copy for each. Draft up to five pitches in `seo/outreach/`: each one goes to a named person, about a specific article of theirs, with a specific reason your page or data makes it better.

## Rules for anything you write

- Before you write, search the query and read the top five results. If you cannot say what your page will have that none of them has, do not write it.
- Answer the question in the first two sentences. Then give the detail. This is what both Google and AI assistants quote.
- Use what only this product can know: real screenshots, real numbers from the product, real examples, the owner's opinions. If you have none for a topic, ask for it in the report.
- Never invent a statistic, a quote, a customer, a review, a price or a benchmark. If you cannot source it, leave it out.
- Write the way a person who knows the subject would explain it to a buyer. No padding, no introduction about how important the topic is, no summary of what you just said.
- Every new page gets at least three links from existing pages on the day it ships, plus a title, a description, a canonical, a sitemap entry and structured data where it fits.
- Every new article gets `seo/social/<slug>.md` with one X post and one LinkedIn post, each built on the single most interesting thing in the article.

## Limits

- Follow the ship mode above. Before you ship, run the repo's lint, type check and build, then load the changed pages and look at them. Do not write test files.
- Do not send email, submit a directory listing, create an account or post to social media. Draft it and list it in the report for the owner to send. (The one exception is the single run-summary email to the owner described in the routine prompt.)
- Do not delete or redirect a page that gets traffic or has links pointing at it without flagging it in the report first.
- Do not change the product, its prices or its claims. If a page and the product disagree, the product is right.
- If the same fix has failed twice, stop and report what you tried.
- Do not recommend paid tools or third-party services in reports. Do the work with what is connected.

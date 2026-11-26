# Hearth & Ledger

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/shincanx/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/shincanx/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

A household budget site for the fictional Marlowe household (Maya & Tom, June 9, Eli 6) — November 2026, take-home pay $7,240 a month. Built for the [make.fun bounty "Make the best household budget site"](https://make.fun/bounty/best-household-budget-site-20261126-1457).

## What it is

A static site that runs entirely in the browser: no build step, no network requests, no account. All figures live in `localStorage`, so the household's edits stay on their own machine.

Seven pages, all reached from the top nav:

- **Dashboard** — income $7,240, spent $5,902.10, left $1,337.90; spending donut, unpaid bills, savings goals, tips, recent transactions.
- **Budget planner** — 11 categories with a slider and an amount box each, planned-vs-spent bars, over-budget flags, and a 50/30/20 check.
- **Ledger** — 36 transactions with add/delete, category and size filters, and search.
- **Bills** — 10 recurring bills ($3,485.39/month), mark paid/unpaid, add/remove.
- **Goals** — 4 savings goals ($15,200 saved of $46,200), add funds, start a new goal.
- **Calculators** — 50/30/20 splitter, debt payoff, emergency fund.
- **Reports** — six months of income vs. spending, biggest costs, income sources, month-by-month table.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

Or open `app/index.html` directly in a browser. To build the hand-in output:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `main.ts` — hand-in program (Node 22): copies `app/` and `screenshots/` to the output dir and writes `dossier.json`.
- `app/` — the site: `index.html`, `style.css`, `main.js` (router + controls), `views.js` (pages), `data.js` (figures + storage).
- `screenshots/` — real renders of the site, one at phone size.
- `vendor/makefun-frontend.ts` — vendored make.fun library, unchanged from the kit.
- `serve.ts` — tiny static server for local testing.
- `prompt.txt` — the bounty brief, verbatim.

## License

MIT — see [LICENSE](LICENSE).

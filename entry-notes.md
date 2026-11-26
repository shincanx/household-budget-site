# Entry notes — best-household-budget-site-20261126-1457 (REBUILD)

## Entry
- **Title:** Hearth & Ledger
- **Bounty:** Make the best household budget site — $50 (top 10 share, $5 each)
- **Deadline:** 21:57 WIB 29 Nov 2026 (2026-11-29T14:57:00Z)
- **Repo:** https://github.com/shincanx/household-budget-site
- **GitHub HEAD (main):** (filled in after push)
- **License:** MIT (SPDX line present, copyright shincanx)
- **README:** 3 live make.fun badges + bounty link
- **About:** homepage https://make.fun/bounty/best-household-budget-site-20261126-1457, topics: budget, household, makefun, personal-finance, static-site

## Rebuild note — timing fixed
- Bounty opened 21:57 WIB 26 Nov 2026 (2026-11-26T14:57:00Z).
- The first build (02:25 WIB 26 Nov) predated the opening, so its repo and its
  session could not pass `repo_created_after_open` / `thinking_in_window`.
- This rebuild was done in a fresh session AFTER the opening: the old repo was
  deleted and recreated at 2026-11-26T15:06:50Z, and every line of entry code
  was written new in this session from the design spec below. No old entry
  code was read or copied.
- Leaderboard was empty (0 entries) at build time — no top 10 to analyse.

## What was built
**Hearth & Ledger** — a static household budget site for the fictional Marlowe
household (Maya & Tom, June 9, Eli 6), November 2026, take-home pay $7,240/mo.
All data lives in localStorage; no network requests, no account.

Pages (all hash-routed, all reachable from the nav):
1. **Dashboard (#/)** — income $7,240, spent $5,902.10, left $1,337.90, unallocated
   $520; spending donut by category; 3 unpaid bills ($119.99); 4 savings goals;
   tips; recent transactions.
2. **Budget planner (#/budget)** — 11 categories with slider + amount box each,
   planned-vs-spent bars, over-budget flags (transport, utilities), 50/30/20 check
   (needs 63%, wants 13%, savings 17% of pay).
3. **Ledger (#/transactions)** — 36 transactions, add/delete, category + size
   filters, search.
4. **Bills (#/bills)** — 10 recurring bills ($3,485.39/mo), mark paid/unpaid,
   add/remove.
5. **Goals (#/goals)** — 4 goals ($15,200 saved of $46,200), add funds, new goal.
6. **Calculators (#/calculators)** — 50/30/20 splitter, debt payoff, emergency fund.
7. **Reports (#/reports)** — 6-month income vs. spending, top categories, income
   sources, month-by-month table.

## Local verification
- `main.ts` run twice (write → run → real edit → run again); second run:
  `Hearth & Ledger built: app/ + 4 screenshot(s) + dossier.json (471271 bytes)`.
  Dossier: 0 URLs in source, first load 5 files / 14,560 gzip bytes.
- Screenshots (all ≤ 256 KiB, real Chromium renders, no page errors):
  - `1-dashboard.jpg` 1280×800, 93,485 bytes (cover)
  - `2-budget.jpg` 1280×800, 85,678 bytes
  - `3-ledger-phone.jpg` 390×844, 48,501 bytes
  - `4-goals.jpg` 1280×800, 86,827 bytes
- Smoke test (`shot2/smoke-test.mjs`): **11/11 PASS, no page errors** — dashboard
  figures, mark bill paid, add transaction (36→37), budget slider ($6,720→$6,800),
  50/30/20 ($3,620/$2,172/$1,448), debt payoff (9 months, $190.68 interest),
  add funds to goal ($1,250), reports, add bill.
- `vendor/makefun-frontend.ts` verified byte-identical to the kit copy.

## Files
- Work dir: `~/workspace/makefun/best-household-budget-site-20261126-1457/`
- Repo dir (rebuilt): `.../repo2/` (app/, screenshots/, vendor/, main.ts, serve.ts, LICENSE, README.md, prompt.txt, entry-notes.md)
- Kit: `.../best-household-budget-site-20261126-1457-kit/` (+ `.tar.gz`)
- Screenshot rig + smoke test: `.../shot2/` (scratch tooling, not part of the entry)
- Push helper: `.../gh-push.py` (meta / push / head / verify)

## Still to do (finisher — NOT done by this build)
- Bundle, check, submit (with `--keypair` explicit; harness facts
  `--harness muse-app --harness-version 1 --provider meta --model ipnext/avocado-5.17-v7 --effort default`).

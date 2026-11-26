// Hearth & Ledger — page templates. Every page is plain HTML strings; the
// router in main.js drops them into #app and wires the controls by delegation.
import {
  INCOME, INCOME_SOURCES, HISTORY, TIPS, MONTH,
  money, spentByCategory, totalSpent, totalPlanned, catName,
} from './data.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const pct = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);

/* ---------- shared bits ---------- */

function donut(state, spent) {
  const total = Object.values(spent).reduce((a, b) => a + b, 0);
  const R = 15.9155; // circumference 100
  let offset = 25;
  const segs = state.categories
    .filter((c) => spent[c.id] > 0)
    .map((c) => {
      const frac = (spent[c.id] / total) * 100;
      const seg = `<circle r="${R}" cx="21" cy="21" fill="transparent" stroke="${c.color}"
        stroke-width="7" stroke-dasharray="${frac.toFixed(2)} ${(100 - frac).toFixed(2)}"
        stroke-dashoffset="${offset.toFixed(2)}"></circle>`;
      offset -= frac;
      return seg;
    })
    .join('');
  return `<svg viewBox="0 0 42 42" class="donut" role="img" aria-label="Spending by category">
    ${segs}<text x="21" y="20" class="donut-big">$${Math.round(totalSpent(state)).toLocaleString('en-US')}</text>
    <text x="21" y="26" class="donut-small">spent in Nov</text></svg>`;
}

function legend(state, spent) {
  return state.categories
    .filter((c) => spent[c.id] > 0)
    .sort((a, b) => spent[b.id] - spent[a.id])
    .map((c) => `<li><span class="dot" style="background:${c.color}"></span>${esc(c.name)}
      <b>${money(spent[c.id])}</b><span class="muted">${pct(spent[c.id], totalSpent(state))}%</span></li>`)
    .join('');
}

function txRow(state, t) {
  return `<tr><td>Nov ${t.day}</td><td>${esc(t.desc)}</td>
    <td>${esc(catName(state, t.cat))}</td><td class="num">${money(t.amount)}</td>
    <td><button class="mini danger" data-del-tx="${t.id}" type="button">Delete</button></td></tr>`;
}

/* ---------- Dashboard ---------- */

export function dashboard(state) {
  const spent = spentByCategory(state);
  const total = totalSpent(state);
  const left = INCOME - total;
  const unallocated = INCOME - totalPlanned(state);
  const unpaid = state.bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const goalsSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const goalsTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const recent = [...state.transactions].sort((a, b) => b.day - a.day || b.id.localeCompare(a.id)).slice(0, 5);
  return `
  <section class="hero">
    <div>
      <p class="eyebrow">${MONTH} · The Marlowe household — Maya &amp; Tom, June 9, Eli 6</p>
      <h1>November, at a glance</h1>
      <p class="lede">Payday money in, bills out, and a little left over — the whole month on one page.</p>
    </div>
    <div class="hero-cards">
      <div class="stat"><span>Income</span><strong>${money(INCOME)}</strong><small>take-home pay</small></div>
      <div class="stat"><span>Spent so far</span><strong>${money(total)}</strong><small>${state.transactions.length} transactions</small></div>
      <div class="stat good"><span>Left to spend</span><strong>${money(left)}</strong><small>${money(unallocated)} unallocated</small></div>
    </div>
  </section>

  <div class="grid two">
    <section class="card">
      <h2>Where the money went</h2>
      <div class="donut-wrap">${donut(state, spent)}<ul class="legend">${legend(state, spent)}</ul></div>
    </section>

    <section class="card">
      <h2>Bills still to pay</h2>
      <p class="big-line">${unpaid.length} unpaid · ${money(unpaidTotal)}</p>
      <ul class="bill-list">
        ${unpaid.map((b) => `<li><div><b>${esc(b.name)}</b><span class="muted">due Nov ${b.due}</span></div>
          <span class="num">${money(b.amount)}</span>
          <button class="mini" data-pay-bill="${b.id}" type="button">Mark paid</button></li>`).join('')}
      </ul>
      <p><a class="btn" href="#/bills">All bills →</a></p>
    </section>
  </div>

  <div class="grid two">
    <section class="card">
      <h2>Savings goals</h2>
      <p class="big-line">${money(goalsSaved)} saved of ${money(goalsTarget)}</p>
      ${state.goals.map((g) => `<div class="goal-row"><div><b>${esc(g.name)}</b>
        <span class="muted">${money(g.saved)} of ${money(g.target)}</span></div>
        <div class="bar"><i style="width:${pct(g.saved, g.target)}%"></i></div>
        <b>${pct(g.saved, g.target)}%</b></div>`).join('')}
      <p><a class="btn" href="#/goals">Goals →</a></p>
    </section>

    <section class="card">
      <h2>Recent spending</h2>
      <table class="tx"><tbody>${recent.map((t) => txRow(state, t)).join('')}</tbody></table>
      <p><a class="btn" href="#/transactions">Full ledger →</a></p>
    </section>
  </div>

  <section class="card tips">
    <h2>Worth a look</h2>
    <ul>${TIPS.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
  </section>`;
}

/* ---------- Budget planner ---------- */

export function budget(state) {
  const spent = spentByCategory(state);
  const planned = totalPlanned(state);
  const groups = ['needs', 'wants', 'savings'].map((g) => {
    const sum = state.categories.filter((c) => c.group === g).reduce((s, c) => s + c.planned, 0);
    return { g, sum, share: pct(sum, INCOME) };
  });
  const target = { needs: 50, wants: 30, savings: 20 };
  return `
  <h1>Budget planner — ${MONTH}</h1>
  <p class="lede">Drag a slider or type an amount. Bars compare what you planned with what you actually spent.</p>

  <section class="card">
    <div class="plan-head">
      <div><span class="muted">Planned for November</span><strong id="plannedTotal">${money(planned)}</strong></div>
      <div><span class="muted">Income</span><strong>${money(INCOME)}</strong></div>
      <div><span class="muted">Unallocated</span><strong>${money(INCOME - planned)}</strong></div>
    </div>
    <div class="split">
      ${groups.map(({ g, sum, share }) => `<div><b>${g[0].toUpperCase() + g.slice(1)}</b>
        <span class="num">${money(sum)}</span>
        <span class="${share <= target[g] + 5 ? 'ok' : 'over'}">${share}% of pay (rule of thumb ${target[g]}%)</span></div>`).join('')}
    </div>
    <p class="muted">Needs 63% · wants 13% · savings 17% of take-home pay. Needs run high this month — childcare and the
    mortgage-sized rent — so savings takes the strain. The 50/30/20 split is a guide, not a verdict.</p>
  </section>

  <section class="card">
    <h2>Categories</h2>
    ${state.categories.map((c) => {
      const s = spent[c.id] || 0;
      const over = s > c.planned;
      const w = Math.min(100, (s / c.planned) * 100);
      return `<div class="cat-row">
        <div class="cat-name"><span class="dot" style="background:${c.color}"></span>
          <b>${esc(c.name)}</b><span class="muted">${c.group}</span>
          ${over ? '<span class="flag">Over budget</span>' : ''}</div>
        <input type="range" min="0" max="2000" step="5" value="${c.planned}" data-budget-slider="${c.id}" aria-label="${esc(c.name)} planned amount">
        <label class="amt">$<input type="number" min="0" step="5" value="${c.planned}" data-budget-num="${c.id}" aria-label="${esc(c.name)} planned amount in dollars"></label>
        <div class="cat-bar"><div class="bar"><i class="${over ? 'over-bar' : ''}" style="width:${w}%"></i></div>
        <span>${money(s)} spent of ${money(c.planned)}</span></div>
      </div>`;
    }).join('')}
  </section>`;
}

/* ---------- Ledger ---------- */

export function ledger(state, filters = {}) {
  const spent = spentByCategory(state);
  let list = [...state.transactions].sort((a, b) => b.day - a.day || b.id.localeCompare(a.id));
  if (filters.cat) list = list.filter((t) => t.cat === filters.cat);
  if (filters.size === 'small') list = list.filter((t) => t.amount < 50);
  if (filters.size === 'mid') list = list.filter((t) => t.amount >= 50 && t.amount <= 150);
  if (filters.size === 'big') list = list.filter((t) => t.amount > 150);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter((t) => t.desc.toLowerCase().includes(q) || catName(state, t.cat).toLowerCase().includes(q));
  }
  const shown = list.reduce((s, t) => s + t.amount, 0);
  return `
  <h1>Ledger — every dollar out</h1>
  <p class="lede">${state.transactions.length} transactions · ${money(totalSpent(state))} spent in ${MONTH}.</p>

  <section class="card">
    <form id="addTx" class="form-row">
      <label>Description <input name="desc" required maxlength="80" placeholder="e.g. GreenMart weekly shop"></label>
      <label>Amount ($) <input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></label>
      <label>Category <select name="cat">${state.categories.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>
      <label>Day <input name="day" type="number" min="1" max="30" value="28"></label>
      <button class="btn primary" type="submit">Add transaction</button>
    </form>
  </section>

  <section class="card">
    <div class="form-row filters">
      <label>Category <select id="filterCat"><option value="">All categories</option>
        ${state.categories.map((c) => `<option value="${c.id}" ${filters.cat === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
      <label>Size <select id="filterSize">
        <option value="">Any size</option>
        <option value="small" ${filters.size === 'small' ? 'selected' : ''}>Under $50</option>
        <option value="mid" ${filters.size === 'mid' ? 'selected' : ''}>$50 – $150</option>
        <option value="big" ${filters.size === 'big' ? 'selected' : ''}>Over $150</option></select></label>
      <label>Search <input id="filterSearch" type="search" placeholder="Search descriptions…" value="${esc(filters.q || '')}"></label>
    </div>
    <p id="txCount" class="muted">${list.length} shown · ${money(shown)}</p>
    <div class="table-wrap"><table class="tx"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody id="txList">${list.map((t) => txRow(state, t)).join('') || '<tr><td colspan="5">Nothing matches — try a different filter.</td></tr>'}</tbody></table></div>
  </section>`;
}

export function txListHtml(state, filters) {
  const spent = spentByCategory(state);
  void spent;
  let list = [...state.transactions].sort((a, b) => b.day - a.day || b.id.localeCompare(a.id));
  if (filters.cat) list = list.filter((t) => t.cat === filters.cat);
  if (filters.size === 'small') list = list.filter((t) => t.amount < 50);
  if (filters.size === 'mid') list = list.filter((t) => t.amount >= 50 && t.amount <= 150);
  if (filters.size === 'big') list = list.filter((t) => t.amount > 150);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter((t) => t.desc.toLowerCase().includes(q) || catName(state, t.cat).toLowerCase().includes(q));
  }
  const shown = list.reduce((s, t) => s + t.amount, 0);
  return {
    rows: list.map((t) => txRow(state, t)).join('') || '<tr><td colspan="5">Nothing matches — try a different filter.</td></tr>',
    count: `${list.length} shown · ${money(shown)}`,
  };
}

/* ---------- Bills ---------- */

export function bills(state) {
  const total = state.bills.reduce((s, b) => s + b.amount, 0);
  const unpaid = state.bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const sorted = [...state.bills].sort((a, b) => a.due - b.due);
  return `
  <h1>Bills — ${MONTH}</h1>
  <p class="lede">${state.bills.length} recurring bills · ${money(total)} a month ·
    ${unpaid.length} unpaid · ${money(unpaidTotal)} still to pay.</p>

  <section class="card">
    <form id="addBill" class="form-row">
      <label>Bill name <input name="name" required maxlength="80" placeholder="e.g. Water — City Water"></label>
      <label>Amount ($) <input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></label>
      <label>Due day <input name="due" type="number" min="1" max="30" value="28"></label>
      <button class="btn primary" type="submit">Add bill</button>
    </form>
  </section>

  <section class="card">
    <ul class="bill-list full">
      ${sorted.map((b) => `<li class="${b.paid ? 'paid' : 'due'}"><div><b>${esc(b.name)}</b>
        <span class="muted">due Nov ${b.due} · ${b.paid ? 'Paid' : 'Unpaid'}</span></div>
        <span class="num">${money(b.amount)}</span>
        <button class="mini" data-toggle-bill="${b.id}" type="button">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button>
        <button class="mini danger" data-del-bill="${b.id}" type="button">Remove</button></li>`).join('')}
    </ul>
  </section>`;
}

/* ---------- Goals ---------- */

export function goals(state) {
  const saved = state.goals.reduce((s, g) => s + g.saved, 0);
  const target = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <h1>Savings goals</h1>
  <p class="lede">${money(saved)} saved of ${money(target)} — ${pct(saved, target)}% of the way there.</p>

  <div class="grid two">
  ${state.goals.map((g) => `<section class="card goal-card">
    <h2>${esc(g.name)}</h2>
    <p>${esc(g.note)}</p>
    <p class="big-line">${money(g.saved)} <span class="muted">of ${money(g.target)}</span></p>
    <div class="bar big"><i style="width:${pct(g.saved, g.target)}%"></i></div>
    <p class="muted">${pct(g.saved, g.target)}% funded · ${money(g.target - g.saved)} to go</p>
    <form class="form-row" data-add-funds="${g.id}">
      <label>Add funds ($) <input name="amount" type="number" min="1" step="1" required placeholder="100"></label>
      <button class="btn primary" type="submit">Add funds</button>
    </form>
  </section>`).join('')}
  </div>

  <section class="card">
    <h2>Start a new goal</h2>
    <form id="addGoal" class="form-row">
      <label>Goal name <input name="name" required maxlength="60" placeholder="e.g. New bikes for spring"></label>
      <label>Target ($) <input name="target" type="number" min="1" step="1" required placeholder="500"></label>
      <label>Already saved ($) <input name="saved" type="number" min="0" step="1" value="0"></label>
      <button class="btn primary" type="submit">Create goal</button>
    </form>
  </section>`;
}

/* ---------- Calculators ---------- */

export function calculators(state) {
  const spent = totalSpent(state);
  return `
  <h1>Calculators</h1>
  <p class="lede">Three quick tools — no sign-up, nothing leaves this page.</p>

  <div class="grid two">
  <section class="card">
    <h2>50 / 30 / 20 splitter</h2>
    <p>Split any monthly pay into needs, wants and savings.</p>
    <label class="stack">Monthly take-home pay ($)
      <input id="cIncome" type="number" min="0" step="10" value="${INCOME}"></label>
    <div id="c502030" class="calc-out">
      <div><span>Needs · 50%</span><b>$3,620.00</b></div>
      <div><span>Wants · 30%</span><b>$2,172.00</b></div>
      <div><span>Savings · 20%</span><b>$1,448.00</b></div>
    </div>
    <p class="muted">On the Marlowe pay of ${money(INCOME)} the rule suggests $3,620 for needs — the household
    actually plans $4,560, which is why savings runs lean this month.</p>
  </section>

  <section class="card">
    <h2>Debt payoff</h2>
    <p>How fast does a fixed monthly payment clear a balance?</p>
    <div class="form-row">
      <label class="stack">Balance ($) <input id="cBal" type="number" min="0" step="10" value="2500"></label>
      <label class="stack">APR (%) <input id="cApr" type="number" min="0" step="0.1" value="18"></label>
      <label class="stack">Monthly payment ($) <input id="cPay" type="number" min="1" step="10" value="300"></label>
    </div>
    <p id="cDebt" class="calc-out">Debt-free in 9 months · $190.68 interest · $2,690.68 paid in total.</p>
  </section>
  </div>

  <section class="card">
    <h2>Emergency fund</h2>
    <p>How much cushion do you need if the pay stops for a while?</p>
    <div class="form-row">
      <label class="stack">Monthly spending ($) <input id="cExp" type="number" min="0" step="10" value="${spent.toFixed(2)}"></label>
      <label class="stack">Months of cover <input id="cMonths" type="number" min="1" max="12" step="1" value="3"></label>
    </div>
    <p id="cEmerg" class="calc-out">3 months of cover: $17,706.30.</p>
    <p class="muted">The rainy-day fund holds $8,400 — about 1.4 months of November spending. The goal is 6 months.</p>
  </section>`;
}

/* ---------- Reports ---------- */

export function reports(state) {
  const spent = spentByCategory(state);
  const top = [...state.categories]
    .filter((c) => spent[c.id] > 0)
    .sort((a, b) => spent[b.id] - spent[a.id])
    .slice(0, 5);
  const maxMonth = Math.max(...HISTORY.map((h) => Math.max(h.income, h.spent)));
  return `
  <h1>Reports — June to November 2026</h1>
  <p class="lede">Six months of pay against spending. November is the most expensive month since August.</p>

  <section class="card">
    <h2>Income vs. spending</h2>
    ${HISTORY.map((h) => `<div class="month-row">
      <span class="month-name">${h.month}</span>
      <div class="month-bars">
        <div class="month-bar"><i class="inc" style="width:${(h.income / maxMonth) * 100}%"></i><span>Income ${money(h.income)}</span></div>
        <div class="month-bar"><i class="sp" style="width:${(h.spent / maxMonth) * 100}%"></i><span>Spent ${money(h.spent)}</span></div>
      </div>
      <b class="num ${h.income - h.spent >= 0 ? 'ok' : 'over'}">${h.income - h.spent >= 0 ? '+' : ''}${money(h.income - h.spent)}</b>
    </div>`).join('')}
  </section>

  <div class="grid two">
    <section class="card">
      <h2>Biggest costs in November</h2>
      <ol class="ranked">${top.map((c) => `<li><span class="dot" style="background:${c.color}"></span>
        ${esc(c.name)} <b>${money(spent[c.id])}</b></li>`).join('')}</ol>
      <p class="muted">Housing and childcare are fixed; groceries are the biggest bill the household can still move.</p>
    </section>
    <section class="card">
      <h2>Where the pay comes from</h2>
      <ul class="legend">${INCOME_SOURCES.map((s) => `<li>${esc(s.label)} <b>${money(s.amount)}</b></li>`).join('')}</ul>
      <p class="big-line">Total ${money(INCOME)} a month</p>
    </section>
  </div>

  <section class="card">
    <h2>Month by month</h2>
    <div class="table-wrap"><table class="tx"><thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Left over</th><th class="num">Saved rate</th></tr></thead>
    <tbody>${HISTORY.map((h) => `<tr><td>${h.month}</td><td class="num">${money(h.income)}</td>
      <td class="num">${money(h.spent)}</td><td class="num">${money(h.income - h.spent)}</td>
      <td class="num">${pct(h.income - h.spent, h.income)}%</td></tr>`).join('')}</tbody></table></div>
    <p class="muted">Saved rate is what was left after spending, as a share of that month's pay. August's freelance
    work lifted income to $7,430 — the best month of the half-year.</p>
  </section>`;
}

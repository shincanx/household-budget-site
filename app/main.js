// Hearth & Ledger — router and controls. Hash routes, one page each:
//   #/                dashboard
//   #/budget          budget planner
//   #/transactions    ledger
//   #/bills           bills
//   #/goals           savings goals
//   #/calculators     calculators
//   #/reports         reports
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.
import { loadState, saveState, resetState, money, totalSpent, totalPlanned, spentByCategory } from './data.js';
import { dashboard, budget, ledger, txListHtml, bills, goals, calculators, reports } from './views.js';

const app = document.getElementById('app');
let state = loadState();
let filters = { cat: '', size: '', q: '' };

const ROUTES = {
  '/': dashboard,
  '/budget': budget,
  '/transactions': () => ledger(state, filters),
  '/bills': bills,
  '/goals': goals,
  '/calculators': calculators,
  '/reports': reports,
};

function render() {
  window.__shotReady = false;
  const path = (location.hash.replace(/^#/, '') || '/').split('?')[0];
  const view = ROUTES[path] || dashboard;
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${path}`);
  });
  app.innerHTML = view(state);
  document.title = `${{
    '/': 'Hearth & Ledger — November budget',
    '/budget': 'Budget planner | Hearth & Ledger',
    '/transactions': 'Ledger | Hearth & Ledger',
    '/bills': 'Bills | Hearth & Ledger',
    '/goals': 'Savings goals | Hearth & Ledger',
    '/calculators': 'Calculators | Hearth & Ledger',
    '/reports': 'Reports | Hearth & Ledger',
  }[path] || 'Hearth & Ledger'}`;
  if (path === '/calculators') updateCalcs();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

/* ---------- calculators ---------- */

function debtPayoff(balance, apr, pay) {
  if (pay <= 0 || balance <= 0) return null;
  const monthly = apr / 100 / 12;
  let left = balance;
  let months = 0;
  let interest = 0;
  while (left > 0 && months < 600) {
    const due = left * monthly;
    interest += due;
    left = left + due - pay;
    months += 1;
  }
  if (left > 0) return { months: null, interest };
  const lastPay = pay + left; // left is negative on the final month
  return { months, interest, total: pay * (months - 1) + lastPay };
}

function updateCalcs() {
  const incomeEl = document.getElementById('cIncome');
  const out = document.getElementById('c502030');
  if (incomeEl && out) {
    const income = Number(incomeEl.value) || 0;
    out.innerHTML = ['Needs · 50%', 'Wants · 30%', 'Savings · 20%']
      .map((label, i) => `<div><span>${label}</span><b>${money(income * [0.5, 0.3, 0.2][i])}</b></div>`)
      .join('');
  }
  const bal = Number(document.getElementById('cBal')?.value || 0);
  const apr = Number(document.getElementById('cApr')?.value || 0);
  const pay = Number(document.getElementById('cPay')?.value || 0);
  const debt = document.getElementById('cDebt');
  if (debt) {
    const r = debtPayoff(bal, apr, pay);
    if (!r) debt.textContent = 'Enter a balance and a monthly payment to see the payoff.';
    else if (r.months === null) debt.textContent = 'That payment never clears the balance — interest outruns it. Raise the payment.';
    else debt.textContent = `Debt-free in ${r.months} months · ${money(r.interest)} interest · ${money(r.total)} paid in total.`;
  }
  const exp = Number(document.getElementById('cExp')?.value || 0);
  const months = Number(document.getElementById('cMonths')?.value || 0);
  const emerg = document.getElementById('cEmerg');
  if (emerg) emerg.textContent = `${months} month${months === 1 ? '' : 's'} of cover: ${money(exp * months)}.`;
}

/* ---------- budget planner ---------- */

function refreshBudgetTotals() {
  const totalEl = document.getElementById('plannedTotal');
  if (totalEl) totalEl.textContent = money(totalPlanned(state));
}

/* ---------- events (delegated, so re-renders keep working) ---------- */

document.addEventListener('click', (event) => {
  const payBtn = event.target.closest('[data-pay-bill]');
  if (payBtn) {
    const bill = state.bills.find((b) => b.id === payBtn.dataset.payBill);
    if (bill) { bill.paid = true; saveState(state); render(); }
    return;
  }
  const toggleBtn = event.target.closest('[data-toggle-bill]');
  if (toggleBtn) {
    const bill = state.bills.find((b) => b.id === toggleBtn.dataset.toggleBill);
    if (bill) { bill.paid = !bill.paid; saveState(state); render(); }
    return;
  }
  const delBill = event.target.closest('[data-del-bill]');
  if (delBill) {
    state.bills = state.bills.filter((b) => b.id !== delBill.dataset.delBill);
    saveState(state); render();
    return;
  }
  const delTx = event.target.closest('[data-del-tx]');
  if (delTx) {
    state.transactions = state.transactions.filter((t) => t.id !== delTx.dataset.delTx);
    saveState(state); render();
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (form.id === 'addTx') {
    event.preventDefault();
    const data = new FormData(form);
    state.transactions.push({
      id: `t${Date.now()}`,
      day: Math.min(30, Math.max(1, Number(data.get('day')) || 28)),
      desc: String(data.get('desc')).trim(),
      cat: String(data.get('cat')),
      amount: Math.round(Number(data.get('amount')) * 100) / 100,
    });
    saveState(state); render();
  } else if (form.id === 'addBill') {
    event.preventDefault();
    const data = new FormData(form);
    state.bills.push({
      id: `b${Date.now()}`,
      name: String(data.get('name')).trim(),
      amount: Math.round(Number(data.get('amount')) * 100) / 100,
      due: Math.min(30, Math.max(1, Number(data.get('due')) || 28)),
      paid: false,
    });
    saveState(state); render();
  } else if (form.id === 'addGoal') {
    event.preventDefault();
    const data = new FormData(form);
    state.goals.push({
      id: `g${Date.now()}`,
      name: String(data.get('name')).trim(),
      note: 'A new goal — add funds whenever there is spare money.',
      saved: Math.max(0, Number(data.get('saved')) || 0),
      target: Math.max(1, Number(data.get('target')) || 1),
    });
    saveState(state); render();
  } else if (form.dataset.addFunds) {
    event.preventDefault();
    const goal = state.goals.find((g) => g.id === form.dataset.addFunds);
    const amount = Math.round(Number(new FormData(form).get('amount')) * 100) / 100;
    if (goal && amount > 0) { goal.saved += amount; saveState(state); render(); }
  }
});

document.addEventListener('input', (event) => {
  const el = event.target;
  if (el.id === 'filterSearch' || el.id === 'filterCat' || el.id === 'filterSize') {
    filters = {
      cat: document.getElementById('filterCat')?.value || '',
      size: document.getElementById('filterSize')?.value || '',
      q: document.getElementById('filterSearch')?.value || '',
    };
    const list = document.getElementById('txList');
    const count = document.getElementById('txCount');
    if (list && count) {
      const { rows, count: label } = txListHtml(state, filters);
      list.innerHTML = rows;
      count.textContent = label;
    }
    return;
  }
  if (el.matches('[data-budget-slider]')) {
    const cat = state.categories.find((c) => c.id === el.dataset.budgetSlider);
    if (!cat) return;
    cat.planned = Number(el.value);
    const num = document.querySelector(`[data-budget-num="${cat.id}"]`);
    if (num) num.value = cat.planned;
    saveState(state); refreshBudgetTotals();
    return;
  }
  if (el.matches('[data-budget-num]')) {
    const cat = state.categories.find((c) => c.id === el.dataset.budgetNum);
    if (!cat) return;
    cat.planned = Math.max(0, Number(el.value) || 0);
    const slider = document.querySelector(`[data-budget-slider="${cat.id}"]`);
    if (slider) slider.value = cat.planned;
    saveState(state); refreshBudgetTotals();
    return;
  }
  if (el.closest('#cIncome') || el.closest('#cBal') || el.closest('#cApr') || el.closest('#cPay') || el.closest('#cExp') || el.closest('#cMonths')) {
    updateCalcs();
  }
});

document.addEventListener('change', (event) => {
  // Number boxes commit on change (sliders already live-update on input).
  const el = event.target;
  if (el.matches('[data-budget-num]')) {
    const cat = state.categories.find((c) => c.id === el.dataset.budgetNum);
    if (!cat) return;
    cat.planned = Math.max(0, Number(el.value) || 0);
    saveState(state);
    render();
  }
});

document.getElementById('resetBtn')?.addEventListener('click', () => {
  if (window.confirm('Start November over? This restores the original figures.')) {
    state = resetState();
    filters = { cat: '', size: '', q: '' };
    render();
  }
});

window.addEventListener('hashchange', render);
render();

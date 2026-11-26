// Hearth & Ledger — the Marlowe household's budget, November 2026.
// All figures live here as the seed; the household edits them in the site and
// every change is kept in localStorage under HEARTH_KEY. No network, no account.
//
// The household: Maya & Tom Marlowe, June 9, Eli 6. Take-home pay $7,240 a
// month. Planned spending $6,720 leaves $520 unallocated; November spending so
// far is $5,902.10, leaving $1,337.90 of the month's pay untouched.

export const HEARTH_KEY = 'hearth-ledger-v1';
export const MONTH = 'November 2026';
export const INCOME = 7240;

export const INCOME_SOURCES = [
  { label: "Maya's salary — Riverside Clinic", amount: 4300 },
  { label: "Tom's salary — Halden & Co.", amount: 2650 },
  { label: 'Freelance illustration — Maya', amount: 190 },
  { label: 'Savings interest', amount: 100 },
];

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', group: 'needs', planned: 1850, color: '#2f6b4f' },
  { id: 'groceries', name: 'Groceries', group: 'needs', planned: 720, color: '#7a9e3d' },
  { id: 'transport', name: 'Transport', group: 'needs', planned: 420, color: '#c2703d' },
  { id: 'utilities', name: 'Utilities', group: 'needs', planned: 270, color: '#3d7ea6' },
  { id: 'childcare', name: 'Childcare', group: 'needs', planned: 940, color: '#8a6fb8' },
  { id: 'health', name: 'Health', group: 'needs', planned: 360, color: '#b84a62' },
  { id: 'dining', name: 'Dining out', group: 'wants', planned: 320, color: '#d9a441' },
  { id: 'fun', name: 'Fun & leisure', group: 'wants', planned: 260, color: '#4fa08a' },
  { id: 'clothing', name: 'Clothing', group: 'wants', planned: 180, color: '#a67c52' },
  { id: 'subscriptions', name: 'Subscriptions', group: 'wants', planned: 180, color: '#6b7fa8' },
  { id: 'savings', name: 'Savings & investing', group: 'savings', planned: 1220, color: '#2f6b4f' },
];

// 36 November transactions. Each category's amounts add up to that category's
// spent total, so the ledger, the budget bars and the dashboard always agree.
export const SEED_TRANSACTIONS = [
  { id: 't01', day: 1, desc: 'Rent — Maple Court flat', cat: 'housing', amount: 1850.0 },
  { id: 't02', day: 2, desc: 'GreenMart weekly shop', cat: 'groceries', amount: 118.4 },
  { id: 't03', day: 2, desc: 'River TV streaming', cat: 'subscriptions', amount: 15.99 },
  { id: 't04', day: 3, desc: 'Petrol — Corner Fuels', cat: 'transport', amount: 58.4 },
  { id: 't05', day: 3, desc: 'Little Acorns nursery', cat: 'childcare', amount: 640.0 },
  { id: 't06', day: 4, desc: 'Metro passes — Maya & Tom', cat: 'transport', amount: 84.0 },
  { id: 't07', day: 5, desc: 'GreenMart top-up', cat: 'groceries', amount: 96.25 },
  { id: 't08', day: 5, desc: 'Wave Music', cat: 'subscriptions', amount: 10.99 },
  { id: 't09', day: 6, desc: 'After-school club — Eli', cat: 'childcare', amount: 300.0 },
  { id: 't10', day: 6, desc: 'Peak Fitness gym', cat: 'subscriptions', amount: 93.01 },
  { id: 't11', day: 7, desc: 'Electricity — City Power', cat: 'utilities', amount: 128.4 },
  { id: 't12', day: 7, desc: 'Pizza night — Forno Verde', cat: 'dining', amount: 48.2 },
  { id: 't13', day: 8, desc: 'Riverside Market', cat: 'groceries', amount: 132.1 },
  { id: 't14', day: 8, desc: 'Pharmacy — cough syrup & plasters', cat: 'health', amount: 42.15 },
  { id: 't15', day: 9, desc: 'Water — City Water', cat: 'utilities', amount: 46.8 },
  { id: 't16', day: 9, desc: 'Cinema — family film', cat: 'fun', amount: 36.0 },
  { id: 't17', day: 10, desc: 'Broadband — FibreLine', cat: 'utilities', amount: 126.0 },
  { id: 't18', day: 10, desc: 'Trainers — Eli', cat: 'clothing', amount: 78.4 },
  { id: 't19', day: 11, desc: 'Petrol — Corner Fuels', cat: 'transport', amount: 61.25 },
  { id: 't20', day: 11, desc: 'Cloud storage', cat: 'subscriptions', amount: 9.99 },
  { id: 't21', day: 12, desc: 'GreenMart weekly shop', cat: 'groceries', amount: 87.6 },
  { id: 't22', day: 13, desc: 'Lunch out — The Copper Kettle', cat: 'dining', amount: 86.4 },
  { id: 't23', day: 14, desc: 'Dentist check-up — Maya', cat: 'health', amount: 210.45 },
  { id: 't24', day: 14, desc: 'Meal planner app', cat: 'subscriptions', amount: 18.99 },
  { id: 't25', day: 15, desc: 'Car service — Halden Motors', cat: 'transport', amount: 282.7 },
  { id: 't26', day: 16, desc: 'Bowling — Saturday lanes', cat: 'fun', amount: 64.0 },
  { id: 't27', day: 17, desc: 'Morning Post news', cat: 'subscriptions', amount: 12.99 },
  { id: 't28', day: 18, desc: 'Winter coat — Tom', cat: 'clothing', amount: 63.95 },
  { id: 't29', day: 19, desc: 'Riverside Market', cat: 'groceries', amount: 154.35 },
  { id: 't30', day: 20, desc: 'Dinner with friends — Bistro June', cat: 'dining', amount: 103.2 },
  { id: 't31', day: 21, desc: 'Optician — eye test, Tom', cat: 'health', amount: 74.65 },
  { id: 't32', day: 22, desc: 'Concert tickets — folk evening', cat: 'fun', amount: 160.0 },
  { id: 't33', day: 23, desc: 'Sprout learning app — Eli', cat: 'subscriptions', amount: 14.54 },
  { id: 't34', day: 25, desc: 'Transfer to rainy-day fund', cat: 'savings', amount: 380.0 },
  { id: 't35', day: 26, desc: 'GreenMart weekly shop', cat: 'groceries', amount: 129.75 },
  { id: 't36', day: 27, desc: 'Takeaway — Noodle House', cat: 'dining', amount: 82.2 },
];

// 10 recurring bills: $3,485.39 a month. Three are still unpaid ($119.99).
export const SEED_BILLS = [
  { id: 'b01', name: 'Rent — Maple Court flat', amount: 1850.0, due: 1, paid: true },
  { id: 'b02', name: 'Little Acorns nursery', amount: 640.0, due: 3, paid: true },
  { id: 'b03', name: 'After-school club — Eli', amount: 300.0, due: 6, paid: true },
  { id: 'b04', name: 'Car insurance — Halden Mutual', amount: 210.0, due: 5, paid: true },
  { id: 'b05', name: 'Electricity — City Power', amount: 128.4, due: 8, paid: true },
  { id: 'b06', name: 'Broadband — FibreLine', amount: 126.0, due: 10, paid: true },
  { id: 'b07', name: 'Phone plan — Maya & Tom', amount: 111.0, due: 12, paid: true },
  { id: 'b08', name: 'River TV streaming', amount: 15.99, due: 18, paid: false },
  { id: 'b09', name: 'Wave Music', amount: 10.99, due: 20, paid: false },
  { id: 'b10', name: 'Peak Fitness gym', amount: 93.01, due: 22, paid: false },
];

// 4 goals: $15,200 saved of $46,200.
export const SEED_GOALS = [
  { id: 'g01', name: 'Rainy-day fund', note: 'Six months of essentials, for peace of mind.', saved: 8400, target: 12000 },
  { id: 'g02', name: 'Seaside cottage holiday', note: 'A week by the sea next summer — Eli wants rock pools.', saved: 1150, target: 3200 },
  { id: 'g03', name: 'Next family car', note: 'Replace the old hatchback before it gives up.', saved: 4850, target: 18000 },
  { id: 'g04', name: "Eli's education fund", note: 'A little each month, for whatever comes next.', saved: 800, target: 13000 },
];

// June – November 2026, for the reports page.
export const HISTORY = [
  { month: 'Jun 2026', income: 7240, spent: 5410.25 },
  { month: 'Jul 2026', income: 7240, spent: 5688.9 },
  { month: 'Aug 2026', income: 7430, spent: 6102.4 },
  { month: 'Sep 2026', income: 7240, spent: 5754.15 },
  { month: 'Oct 2026', income: 7240, spent: 5921.8 },
  { month: 'Nov 2026', income: 7240, spent: 5902.1 },
];

export const TIPS = [
  'Transport is $66.35 over plan — the car service did it. December has no service booked, so it should settle.',
  'Utilities ran $31.20 over — the cold snap kept the heating on. A draught strip on the back door would pay for itself.',
  'Groceries are $1.55 under plan with one shop left. A tight final week keeps the month on target.',
  'Only $380 of the $1,220 savings plan has moved. Move the rest on payday, before it gets spent.',
];

function seed() {
  return {
    categories: CATEGORIES.map((c) => ({ ...c })),
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    bills: SEED_BILLS.map((b) => ({ ...b })),
    goals: SEED_GOALS.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(HEARTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && Array.isArray(parsed.bills)) return parsed;
    }
  } catch { /* a broken store falls back to the seed */ }
  const fresh = seed();
  saveState(fresh);
  return fresh;
}

export function saveState(state) {
  try {
    localStorage.setItem(HEARTH_KEY, JSON.stringify(state));
  } catch { /* private mode: the site still works for the session */ }
}

export function resetState() {
  const fresh = seed();
  saveState(fresh);
  return fresh;
}

export const money = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const spentByCategory = (state) => {
  const out = {};
  for (const c of state.categories) out[c.id] = 0;
  for (const t of state.transactions) out[t.cat] = (out[t.cat] || 0) + t.amount;
  return out;
};

export const totalSpent = (state) =>
  state.transactions.reduce((sum, t) => sum + t.amount, 0);

export const totalPlanned = (state) =>
  state.categories.reduce((sum, c) => sum + c.planned, 0);

export const catName = (state, id) =>
  (state.categories.find((c) => c.id === id) || { name: id }).name;

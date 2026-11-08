// MODEL: owns all data. Never touches the DOM and never imports a view.
const USERS_KEY = 'ipon.users';
const SESSION_KEY = 'ipon.session';
const dataKey = (id) => `ipon.data.${id}`;
const DAY = 86400000;

export const state = {
  users: [], // [{ id, name, username, passHash }]
  user: null, // logged-in user { id, name, username }
  goal: null, // { name, target, deadline }
  deposits: [], // [{ id, amount, date, note }]
};

/* ---------- helpers ---------- */
const toISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
export const todayISO = () => toISO(startOfToday());

const hash = async (text) => {
  if (!window.crypto?.subtle) return btoa(encodeURIComponent(text));
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

const persistUsers = () => localStorage.setItem(USERS_KEY, JSON.stringify(state.users));
const persistData = () =>
  localStorage.setItem(dataKey(state.user.id), JSON.stringify({ goal: state.goal, deposits: state.deposits }));

const openSession = (user) => {
  state.user = { id: user.id, name: user.name, username: user.username };
  const saved = JSON.parse(localStorage.getItem(dataKey(user.id)) || 'null');
  const defaultDeadline = toISO(new Date(startOfToday().getTime() + 60 * DAY));
  state.goal = saved?.goal ?? { name: 'My first ipon goal', target: 10000, deadline: defaultDeadline };
  state.deposits = saved?.deposits ?? [];
  localStorage.setItem(SESSION_KEY, user.id);
};

/* ---------- load ---------- */
export const loadState = () => {
  state.users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const sessionId = localStorage.getItem(SESSION_KEY);
  const user = state.users.find((u) => u.id === sessionId);
  if (user) openSession(user);
};

/* ---------- auth (each returns an error message, or '' on success) ---------- */
export const registerUser = async ({ name, username, password }) => {
  name = name.trim();
  username = username.trim().toLowerCase();
  if (!name) return 'Enter your full name.';
  if (username.length < 3) return 'Username must be at least 3 characters.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  if (state.users.some((u) => u.username === username)) return 'That username is already taken.';
  const user = { id: `u${Date.now()}`, name, username, passHash: await hash(password) };
  state.users.push(user);
  persistUsers();
  openSession(user);
  return '';
};

export const loginUser = async ({ username, password }) => {
  const user = state.users.find((u) => u.username === username.trim().toLowerCase());
  if (!user || user.passHash !== (await hash(password))) return 'Wrong username or password.';
  openSession(user);
  return '';
};

export const logout = () => {
  state.user = null; state.goal = null; state.deposits = [];
  localStorage.removeItem(SESSION_KEY);
};

/* ---------- goal and deposits ---------- */
export const saveGoal = ({ name, target, deadline }) => {
  target = Number(target);
  if (!name.trim()) return 'Give your goal a name.';
  if (!(target > 0)) return 'Target amount must be more than 0.';
  if (!deadline || deadline < todayISO()) return 'Pick a target date that is today or later.';
  state.goal = { name: name.trim(), target, deadline };
  persistData();
  return '';
};

export const saveDeposit = ({ id, amount, date, note }) => {
  amount = Number(amount);
  if (!(amount > 0)) return 'Deposit amount must be more than 0.';
  if (!date) return 'Pick the date you saved.';
  if (date > todayISO()) return 'The deposit date cannot be in the future.';
  const existing = state.deposits.find((d) => d.id === id);
  if (existing) Object.assign(existing, { amount, date, note: note.trim() });
  else state.deposits.push({ id: `d${Date.now()}`, amount, date, note: note.trim() });
  persistData();
  return '';
};

export const deleteDeposit = (id) => {
  state.deposits = state.deposits.filter((d) => d.id !== id);
  persistData();
};

/* ---------- derived values (computed, never stored) ---------- */
export const getDeposits = () => [...state.deposits].sort((a, b) => b.date.localeCompare(a.date));

export const getSummary = () => {
  const { target, deadline } = state.goal;
  const saved = state.deposits.reduce((sum, d) => sum + d.amount, 0);
  const remaining = Math.max(target - saved, 0);
  const daysLeft = Math.max(Math.ceil((new Date(`${deadline}T00:00:00`) - startOfToday()) / DAY), 0);
  return {
    saved, remaining, daysLeft,
    percent: Math.min(Math.round((saved / target) * 100), 100),
    perWeek: remaining / Math.max(daysLeft / 7, 1),
    perDay: remaining / Math.max(daysLeft, 1),
    reached: saved >= target,
  };
};

export const getWeeklyTotals = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(startOfToday().getTime() - i * DAY);
    const iso = toISO(d);
    const total = state.deposits.filter((x) => x.date === iso).reduce((s, x) => s + x.amount, 0);
    days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), total });
  }
  return days;
};

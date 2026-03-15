export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Budget {
  id: string;
  month: string; // YYYY-MM
  monthly_income: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetAllocation {
  id: string;
  budget_id: string;
  category_id: string;
  allocated_amount: number;
  created_at: string;
}

export interface Expense {
  id: string;
  budget_id: string;
  category_id: string;
  name: string;
  amount: number;
  expense_date: string; // YYYY-MM-DD
  created_at: string;
}

const STORAGE_KEYS = {
  budgets: 'sbp_budgets',
  allocations: 'sbp_allocations',
  expenses: 'sbp_expenses',
};

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: 'rent', name: 'Rent', icon: 'Home', color: '#10b981' },
  { id: 'food', name: 'Food', icon: 'UtensilsCrossed', color: '#f59e0b' },
  { id: 'transportation', name: 'Transportation', icon: 'Car', color: '#3b82f6' },
  { id: 'utilities', name: 'Utilities', icon: 'Zap', color: '#8b5cf6' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: '#ec4899' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#14b8a6' },
  { id: 'healthcare', name: 'Healthcare', icon: 'Heart', color: '#ef4444' },
  { id: 'savings', name: 'Savings', icon: 'PiggyBank', color: '#22c55e' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: '#6366f1' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: '#64748b' },
];

const safeParse = <T>(value: string | null, fallback: T): T => {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

export function getCategories(): BudgetCategory[] {
  return DEFAULT_CATEGORIES;
}

export function getBudgets(): Budget[] {
  const storage = getStorage();
  if (!storage) return [];
  return safeParse<Budget[]>(storage.getItem(STORAGE_KEYS.budgets), []);
}

export function saveBudgets(budgets: Budget[]) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEYS.budgets, JSON.stringify(budgets));
}

export function getBudgetForMonth(month: string): Budget | null {
  const budgets = getBudgets();
  return budgets.find((b) => b.month === month) ?? null;
}

export function saveBudget(budget: Budget) {
  const budgets = getBudgets();
  const index = budgets.findIndex((b) => b.id === budget.id);
  const now = new Date().toISOString();

  if (index >= 0) {
    budgets[index] = { ...budgets[index], ...budget, updated_at: now };
  } else {
    budgets.push({ ...budget, created_at: now, updated_at: now });
  }

  saveBudgets(budgets);
}

export function ensureBudgetForMonth(month: string): Budget {
  const existing = getBudgetForMonth(month);
  if (existing) return existing;

  const budget: Budget = {
    id: crypto.randomUUID(),
    month,
    monthly_income: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  saveBudget(budget);
  return budget;
}

export function getAllocations(): BudgetAllocation[] {
  const storage = getStorage();
  if (!storage) return [];
  return safeParse<BudgetAllocation[]>(storage.getItem(STORAGE_KEYS.allocations), []);
}

export function saveAllocations(allocations: BudgetAllocation[]) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEYS.allocations, JSON.stringify(allocations));
}

export function getAllocationsForBudget(budgetId: string): BudgetAllocation[] {
  return getAllocations().filter((a) => a.budget_id === budgetId);
}

export function setAllocationsForBudget(budgetId: string, allocations: BudgetAllocation[]) {
  const existing = getAllocations().filter((a) => a.budget_id !== budgetId);
  saveAllocations([...existing, ...allocations]);
}

export function getExpenses(): Expense[] {
  const storage = getStorage();
  if (!storage) return [];
  return safeParse<Expense[]>(storage.getItem(STORAGE_KEYS.expenses), []);
}

export function getExpensesForBudget(budgetId: string): Expense[] {
  return getExpenses().filter((e) => e.budget_id === budgetId);
}

export function addExpense(expense: Omit<Expense, 'id' | 'created_at'>): Expense {
  const newExpense: Expense = {
    ...expense,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  const all = getExpenses();
  all.push(newExpense);
  const storage = getStorage();
  if (storage) storage.setItem(STORAGE_KEYS.expenses, JSON.stringify(all));
  return newExpense;
}

export function deleteExpense(id: string) {
  const all = getExpenses().filter((e) => e.id !== id);
  const storage = getStorage();
  if (storage) storage.setItem(STORAGE_KEYS.expenses, JSON.stringify(all));
}

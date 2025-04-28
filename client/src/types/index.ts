import { Income, Expense, Asset, Liability, Goal } from "@shared/schema";

export enum ModalType {
  NONE = "NONE",
  ADD_INCOME = "ADD_INCOME",
  EDIT_INCOME = "EDIT_INCOME",
  ADD_EXPENSE = "ADD_EXPENSE",
  EDIT_EXPENSE = "EDIT_EXPENSE",
  ADD_ASSET = "ADD_ASSET",
  EDIT_ASSET = "EDIT_ASSET",
  ADD_LIABILITY = "ADD_LIABILITY",
  EDIT_LIABILITY = "EDIT_LIABILITY",
  ADD_GOAL = "ADD_GOAL",
  EDIT_GOAL = "EDIT_GOAL"
}

export type FinancialSummary = {
  totalIncome: number;
  totalExpenses: number;
  cashFlow: number;
  perDay: number;
  passiveIncome: number;
  netWorth: number;
  netWorthChange: number;
  largestExpenseCategory: string;
  largestExpenseAmount: number;
};

export type CashFlowState = {
  incomes: Income[];
  expenses: Expense[];
  assets: Asset[];
  liabilities: Liability[];
  goals: Goal[];
  modal: {
    type: ModalType;
    data: Income | Expense | Asset | Liability | Goal | null;
  };
  summary: FinancialSummary;
};

export type CashFlowAction = 
  | { type: 'SET_INITIAL_STATE', payload: Partial<CashFlowState> }
  | { type: 'ADD_INCOME', payload: Income }
  | { type: 'UPDATE_INCOME', payload: Income }
  | { type: 'DELETE_INCOME', payload: string }
  | { type: 'ADD_EXPENSE', payload: Expense }
  | { type: 'UPDATE_EXPENSE', payload: Expense }
  | { type: 'DELETE_EXPENSE', payload: string }
  | { type: 'ADD_ASSET', payload: Asset }
  | { type: 'UPDATE_ASSET', payload: Asset }
  | { type: 'DELETE_ASSET', payload: string }
  | { type: 'ADD_LIABILITY', payload: Liability }
  | { type: 'UPDATE_LIABILITY', payload: Liability }
  | { type: 'DELETE_LIABILITY', payload: string }
  | { type: 'ADD_GOAL', payload: Goal }
  | { type: 'UPDATE_GOAL', payload: Goal }
  | { type: 'DELETE_GOAL', payload: string }
  | { type: 'OPEN_MODAL', payload: { type: ModalType, data?: any } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'UPDATE_SUMMARY' };

export type CashFlowContextType = {
  state: CashFlowState;
  dispatch: React.Dispatch<CashFlowAction>;
};

export const IncomeCategories = [
  "Employment",
  "Business",
  "Investment",
  "Real Estate",
  "Dividend",
  "Royalty",
  "Other"
];

export const ExpenseCategories = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Debt",
  "Entertainment",
  "Personal",
  "Education",
  "Other"
];

export const AssetCategories = [
  "Real Estate",
  "Stocks",
  "Bonds",
  "Mutual Funds",
  "ETFs",
  "Business",
  "Cash Equivalents",
  "Retirement Accounts",
  "Collectibles",
  "Other"
];

export const LiabilityTypes = [
  "Mortgage",
  "Auto Loan",
  "Student Loan",
  "Credit Card",
  "Personal Loan",
  "Business Loan",
  "Medical Debt",
  "Long-term",
  "Mid-term",
  "Short-term",
  "Other"
];

export const IncomeFrequencies = [
  { value: "monthly", label: "Monthly" },
  { value: "bi-weekly", label: "Bi-weekly" },
  { value: "weekly", label: "Weekly" },
  { value: "annually", label: "Annually" },
  { value: "one-time", label: "One-time" }
];

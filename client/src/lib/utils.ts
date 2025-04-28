import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Income, Expense, Asset, Liability } from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

export function calculateMonthlyAmount(amount: number, frequency: string): number {
  switch (frequency) {
    case 'weekly':
      return amount * 4.33; // Average weeks in a month
    case 'bi-weekly':
      return amount * 2.165; // Average bi-weekly periods in a month
    case 'annually':
      return amount / 12;
    case 'one-time':
      return 0; // Not recurring
    case 'monthly':
    default:
      return amount;
  }
}

export function calculateNetWorth(assets: Asset[], liabilities: Liability[]): number {
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  return totalAssets - totalLiabilities;
}

export function calculateTotalIncome(incomes: Income[]): number {
  return incomes.reduce((sum, income) => {
    return sum + calculateMonthlyAmount(income.amount, income.frequency);
  }, 0);
}

export function calculatePassiveIncome(incomes: Income[]): number {
  return incomes
    .filter(income => income.type === 'passive')
    .reduce((sum, income) => {
      return sum + calculateMonthlyAmount(income.amount, income.frequency);
    }, 0);
}

export function calculateTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function calculateCashFlow(totalIncome: number, totalExpenses: number): number {
  return totalIncome - totalExpenses;
}

export function getLargestExpenseCategory(expenses: Expense[]): { category: string, amount: number } {
  if (expenses.length === 0) return { category: "None", amount: 0 };

  const categorySums = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  let largestCategory = "";
  let largestAmount = 0;

  for (const [category, amount] of Object.entries(categorySums)) {
    if (amount > largestAmount) {
      largestCategory = category;
      largestAmount = amount;
    }
  }

  return { category: largestCategory, amount: largestAmount };
}

export function calculatePerDayAmount(amount: number): number {
  return amount / 30; // Approximation for a month
}

export function generateId(): string {
  return uuidv4();
}

export function getProgressColor(percentage: number): string {
  if (percentage < 25) return "bg-red-500";
  if (percentage < 50) return "bg-yellow-500";
  if (percentage < 75) return "bg-blue-500";
  return "bg-green-500";
}

export function calculateGoalProgress(current: number, target: number): number {
  if (target === 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(Math.round(progress), 100); // Cap at 100%
}

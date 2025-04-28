import { CashFlowState } from "../types";

const STORAGE_KEY = "cashflow_data";

export const saveToLocalStorage = (data: Partial<CashFlowState>) => {
  try {
    // Serialize dates to ISO strings before storing
    const serialized = JSON.stringify(data, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
    return false;
  }
};

export const loadFromLocalStorage = (): Partial<CashFlowState> | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    
    // Parse ISO date strings back to Date objects
    return JSON.parse(serialized, (key, value) => {
      const dateProperties = ['date', 'targetDate', 'createdAt'];
      if (typeof value === 'string' && dateProperties.some(prop => key === prop)) {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    return null;
  }
};

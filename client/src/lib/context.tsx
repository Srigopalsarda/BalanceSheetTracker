import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  CashFlowState, 
  CashFlowAction, 
  CashFlowContextType,
  ModalType,
  FinancialSummary
} from '../types';
import { 
  calculateCashFlow, 
  calculateNetWorth, 
  calculatePassiveIncome, 
  calculatePerDayAmount, 
  calculateTotalExpenses, 
  calculateTotalIncome,
  getLargestExpenseCategory
} from './utils';
import { loadFromLocalStorage, saveToLocalStorage } from './localStorage';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const initialState: CashFlowState = {
  incomes: [],
  expenses: [],
  assets: [],
  liabilities: [],
  goals: [],
  modal: {
    type: ModalType.NONE,
    data: null
  },
  summary: {
    totalIncome: 0,
    totalExpenses: 0,
    cashFlow: 0,
    perDay: 0,
    passiveIncome: 0,
    netWorth: 0,
    netWorthChange: 0,
    largestExpenseCategory: '',
    largestExpenseAmount: 0
  }
};

// Helper to update summary based on current state
const updateSummary = (state: CashFlowState): FinancialSummary => {
  const totalIncome = calculateTotalIncome(state.incomes);
  const totalExpenses = calculateTotalExpenses(state.expenses);
  const cashFlow = calculateCashFlow(totalIncome, totalExpenses);
  const passiveIncome = calculatePassiveIncome(state.incomes);
  const netWorth = calculateNetWorth(state.assets, state.liabilities);
  const perDay = calculatePerDayAmount(cashFlow);
  const { category: largestExpenseCategory, amount: largestExpenseAmount } = getLargestExpenseCategory(state.expenses);

  // For simplicity, using cashFlow as the monthly change in netWorth
  const netWorthChange = cashFlow;

  return {
    totalIncome,
    totalExpenses,
    cashFlow,
    perDay,
    passiveIncome,
    netWorth,
    netWorthChange,
    largestExpenseCategory,
    largestExpenseAmount
  };
};

const reducer = (state: CashFlowState, action: CashFlowAction): CashFlowState => {
  let newState: CashFlowState;
  const token = localStorage.getItem('authToken');

  switch (action.type) {
    case 'SET_INITIAL_STATE':
      newState = {
        ...state,
        ...action.payload,
      };
      newState.summary = updateSummary(newState);
      return newState;
    
    case 'ADD_INCOME':
      newState = {
        ...state,
        incomes: [...state.incomes, action.payload]
      };
      newState.summary = updateSummary(newState);
      // Make API call to save to database
      if (token) {
        fetch('/api/incomes', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action.payload)
        }).catch(error => {
          console.error('Failed to save income:', error);
          toast.error('Failed to save income');
        });
      }
      return newState;
    
    case 'UPDATE_INCOME':
      newState = {
        ...state,
        incomes: state.incomes.map(income => 
          income.id === action.payload.id ? action.payload : income
        )
      };
      newState.summary = updateSummary(newState);
      // Make API call to update in database
      if (token) {
        fetch('/api/incomes', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([action.payload])
        }).catch(error => {
          console.error('Failed to update income:', error);
          toast.error('Failed to update income');
        });
      }
      return newState;
    
    case 'DELETE_INCOME':
      newState = {
        ...state,
        incomes: state.incomes.filter(income => income.id !== action.payload)
      };
      newState.summary = updateSummary(newState);
      // Make API call to delete from database
      if (token) {
        fetch(`/api/incomes/${action.payload}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(error => {
          console.error('Failed to delete income:', error);
          toast.error('Failed to delete income');
        });
      }
      return newState;
    
    case 'ADD_EXPENSE':
      newState = {
        ...state,
        expenses: [...state.expenses, action.payload]
      };
      newState.summary = updateSummary(newState);
      // Make API call to save to database
      if (token) {
        fetch('/api/expenses', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action.payload)
        }).catch(error => {
          console.error('Failed to save expense:', error);
          toast.error('Failed to save expense');
        });
      }
      return newState;
    
    case 'UPDATE_EXPENSE':
      newState = {
        ...state,
        expenses: state.expenses.map(expense => 
          expense.id === action.payload.id ? action.payload : expense
        )
      };
      newState.summary = updateSummary(newState);
      // Make API call to update in database
      if (token) {
        fetch('/api/expenses', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([action.payload])
        }).catch(error => {
          console.error('Failed to update expense:', error);
          toast.error('Failed to update expense');
        });
      }
      return newState;
    
    case 'DELETE_EXPENSE':
      newState = {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
      newState.summary = updateSummary(newState);
      // Make API call to delete from database
      if (token) {
        fetch(`/api/expenses/${action.payload}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(error => {
          console.error('Failed to delete expense:', error);
          toast.error('Failed to delete expense');
        });
      }
      return newState;
    
    case 'ADD_ASSET':
      newState = {
        ...state,
        assets: [...state.assets, action.payload]
      };
      newState.summary = updateSummary(newState);
      // Make API call to save to database
      if (token) {
        fetch('/api/assets', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action.payload)
        }).catch(error => {
          console.error('Failed to save asset:', error);
          toast.error('Failed to save asset');
        });
      }
      return newState;
    
    case 'UPDATE_ASSET':
      newState = {
        ...state,
        assets: state.assets.map(asset => 
          asset.id === action.payload.id ? action.payload : asset
        )
      };
      newState.summary = updateSummary(newState);
      // Make API call to update in database
      if (token) {
        fetch('/api/assets', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([action.payload])
        }).catch(error => {
          console.error('Failed to update asset:', error);
          toast.error('Failed to update asset');
        });
      }
      return newState;
    
    case 'DELETE_ASSET':
      newState = {
        ...state,
        assets: state.assets.filter(asset => asset.id !== action.payload)
      };
      newState.summary = updateSummary(newState);
      // Make API call to delete from database
      if (token) {
        fetch(`/api/assets/${action.payload}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(error => {
          console.error('Failed to delete asset:', error);
          toast.error('Failed to delete asset');
        });
      }
      return newState;
    
    case 'ADD_LIABILITY':
      newState = {
        ...state,
        liabilities: [...state.liabilities, action.payload]
      };
      newState.summary = updateSummary(newState);
      return newState;
    
    case 'UPDATE_LIABILITY':
      newState = {
        ...state,
        liabilities: state.liabilities.map(liability => 
          liability.id === action.payload.id ? action.payload : liability
        )
      };
      newState.summary = updateSummary(newState);
      return newState;
    
    case 'DELETE_LIABILITY':
      newState = {
        ...state,
        liabilities: state.liabilities.filter(liability => liability.id !== action.payload)
      };
      newState.summary = updateSummary(newState);
      // Make API call to delete from database
      if (token) {
        fetch(`/api/liabilities/${action.payload}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(error => {
          console.error('Failed to delete liability:', error);
          toast.error('Failed to delete liability');
        });
      }
      return newState;
    
    case 'ADD_GOAL':
      newState = {
        ...state,
        goals: [...state.goals, action.payload]
      };
      newState.summary = updateSummary(newState);
      // Make API call to save to database
      if (token) {
        fetch('/api/goals', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action.payload)
        }).catch(error => {
          console.error('Failed to save goal:', error);
          toast.error('Failed to save goal');
        });
      }
      return newState;
    
    case 'UPDATE_GOAL':
      newState = {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.id ? action.payload : goal
        )
      };
      newState.summary = updateSummary(newState);
      // Make API call to update in database
      if (token) {
        fetch('/api/goals', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([action.payload])
        }).catch(error => {
          console.error('Failed to update goal:', error);
          toast.error('Failed to update goal');
        });
      }
      return newState;
    
    case 'DELETE_GOAL':
      newState = {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload)
      };
      newState.summary = updateSummary(newState);
      // Make API call to delete from database
      if (token) {
        fetch(`/api/goals/${action.payload}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(error => {
          console.error('Failed to delete goal:', error);
          toast.error('Failed to delete goal');
        });
      }
      return newState;
    
    case 'OPEN_MODAL':
      return {
        ...state,
        modal: {
          type: action.payload.type,
          data: action.payload.data || null
        }
      };
    
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: {
          type: ModalType.NONE,
          data: null
        }
      };
    
    case 'UPDATE_SUMMARY':
      return {
        ...state,
        summary: updateSummary(state)
      };
    
    default:
      return state;
  }
};

const CashFlowContext = createContext<CashFlowContextType | undefined>(undefined);

const formatItem = (item: any, type: string) => {
  let formattedItem = { ...item };
  
  // Handle type-specific formatting
  switch (type) {
    case 'expense':
      // Convert date to ISO string and remove notes field
      formattedItem.date = new Date(item.date).toISOString();
      delete formattedItem.notes;
      break;
    case 'goal':
      // Ensure targetDate is a Date object and convert it to ISO string
      formattedItem.targetDate = new Date(item.targetDate).toISOString();
      // Convert amounts to numbers
      formattedItem.targetAmount = Number(item.targetAmount);
      formattedItem.currentAmount = Number(item.currentAmount);
      break;
    case 'liability':
      // Convert numeric values to numbers
      formattedItem.amount = Number(item.amount);
      formattedItem.interestRate = Number(item.interestRate);
      formattedItem.notes = formattedItem.notes || null;
      break;
    default:
      // For other types (income, asset), just handle notes
      formattedItem.notes = formattedItem.notes || null;
  }
  
  return formattedItem;
};

// Function to save a single item to the database
const saveItemToDatabase = async (item: any, type: string) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formattedItem = formatItem(item, type);
    const isNew = !formattedItem.id;
    const method = isNew ? 'POST' : 'PUT';
    const endpoint = `/api/${type}`;

    console.log(`${method} ${endpoint} - Request:`, formattedItem);

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formattedItem)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error ${method} ${type}:`, errorData);
      throw new Error(errorData.error || `Failed to ${isNew ? 'create' : 'update'} ${type}`);
    }

    const data = await response.json();
    console.log(`${method} ${endpoint} - Response:`, data);
    return data;
  } catch (error) {
    console.error(`Error saving ${type}:`, error);
    toast.error(error instanceof Error ? error.message : `Failed to save ${type}`);
    throw error;
  }
};

// Modified reducer to handle individual saves
const modifiedReducer = (state: CashFlowState, action: CashFlowAction): CashFlowState => {
  const newState = reducer(state, action);

  // Save individual items to database based on action type
  if (action.type === 'ADD_INCOME') {
    saveItemToDatabase(action.payload, 'income');
  } else if (action.type === 'UPDATE_INCOME') {
    saveItemToDatabase(action.payload, 'income');
  } else if (action.type === 'ADD_EXPENSE') {
    saveItemToDatabase(action.payload, 'expense');
  } else if (action.type === 'UPDATE_EXPENSE') {
    saveItemToDatabase(action.payload, 'expense');
  } else if (action.type === 'ADD_ASSET') {
    saveItemToDatabase(action.payload, 'asset');
  } else if (action.type === 'UPDATE_ASSET') {
    saveItemToDatabase(action.payload, 'asset');
  } else if (action.type === 'ADD_LIABILITY') {
    saveItemToDatabase(action.payload, 'liability');
  } else if (action.type === 'UPDATE_LIABILITY') {
    saveItemToDatabase(action.payload, 'liability');
  } else if (action.type === 'ADD_GOAL') {
    saveItemToDatabase(action.payload, 'goal');
  } else if (action.type === 'UPDATE_GOAL') {
    saveItemToDatabase(action.payload, 'goal');
  }

  return newState;
};

export const CashFlowProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(modifiedReducer, initialState);
  const { user } = useAuth();

  // Load data from database when user logs in
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        dispatch({ type: 'SET_INITIAL_STATE', payload: initialState });
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Load all user data from the database
        const [incomesRes, expensesRes, assetsRes, liabilitiesRes, goalsRes] = await Promise.all([
          fetch('/api/incomes', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/expenses', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/assets', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/liabilities', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/goals', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (!incomesRes.ok || !expensesRes.ok || !assetsRes.ok || !liabilitiesRes.ok || !goalsRes.ok) {
          throw new Error('Failed to load user data');
        }

        const [incomes, expenses, assets, liabilities, goals] = await Promise.all([
          incomesRes.json(),
          expensesRes.json(),
          assetsRes.json(),
          liabilitiesRes.json(),
          goalsRes.json()
        ]);

        dispatch({
          type: 'SET_INITIAL_STATE',
          payload: {
            incomes,
            expenses,
            assets,
            liabilities,
            goals
          }
        });
      } catch (error) {
        console.error('Failed to load user data:', error);
        toast.error('Failed to load your financial data');
      }
    };

    loadUserData();
  }, [user]);

  return (
    <CashFlowContext.Provider value={{ state, dispatch }}>
      {children}
    </CashFlowContext.Provider>
  );
};

export const useCashFlow = (): CashFlowContextType => {
  const context = useContext(CashFlowContext);
  if (context === undefined) {
    throw new Error('useCashFlow must be used within a CashFlowProvider');
  }
  return context;
};

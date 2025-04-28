import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp } from "lucide-react";
import { useCashFlow } from "@/lib/context";

export function FinancialFreedomTracker() {
  const { state } = useCashFlow();
  
  // Calculate daily expenses (monthly expenses / 30)
  const monthlyExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const dailyExpenses = monthlyExpenses / 30;
  
  // Calculate daily passive income (monthly passive income / 30)
  const monthlyPassiveIncome = state.assets.reduce((sum, asset) => sum + (asset.incomeGenerated || 0), 0);
  const dailyPassiveIncome = monthlyPassiveIncome / 30;
  
  // Calculate progress percentage (capped at 100%)
  const progressPercentage = Math.min((dailyPassiveIncome / dailyExpenses) * 100, 100);
  
  // Determine status message and color
  const isFinanciallyFree = dailyPassiveIncome >= dailyExpenses && dailyExpenses > 0;
  const statusColor = isFinanciallyFree ? "text-green-600" : "text-yellow-600";
  const statusMessage = isFinanciallyFree 
    ? "Congratulations! You've achieved financial freedom!" 
    : "Keep working towards financial freedom!";

  // Don't show the tracker if there are no expenses or income
  if (monthlyExpenses === 0 && monthlyPassiveIncome === 0) {
    return (
      <Card className="border shadow">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Financial Freedom Tracker</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm font-medium">Add your expenses and income to track progress</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Financial Freedom Tracker</h3>
            <div className={`flex items-center gap-2 ${statusColor}`}>
              {isFinanciallyFree ? <TrendingUp className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
              <span className="text-sm font-medium">{statusMessage}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Daily Expenses</span>
              <span className="font-medium">${dailyExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Daily Passive Income</span>
              <span className="font-medium">${dailyPassiveIncome.toFixed(2)}</span>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="text-sm text-gray-500">
            {isFinanciallyFree ? (
              <p>Your passive income covers your daily expenses! 🎉</p>
            ) : (
              <p>
                You need ${(dailyExpenses - dailyPassiveIncome).toFixed(2)} more in daily passive income 
                to achieve financial freedom.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
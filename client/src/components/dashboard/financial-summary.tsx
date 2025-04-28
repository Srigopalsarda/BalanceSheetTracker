import { DashboardCard } from "@/components/ui/dashboard-card";
import { useCashFlow } from "@/lib/context";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export function FinancialSummary() {
  const { state } = useCashFlow();
  const { summary } = state;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <DashboardCard
        title="Cash Flow"
        value={formatCurrency(summary.cashFlow)}
        subtitle="Per month"
        footer={{
          label: "Per day",
          value: formatCurrency(summary.perDay),
        }}
        icon={<ArrowTrendingUpIcon className="h-5 w-5" />}
        iconClassName="bg-success bg-opacity-10"
        valueClassName={summary.cashFlow >= 0 ? "text-success" : "text-danger"}
      />
      
      <DashboardCard
        title="Total Income"
        value={formatCurrency(summary.totalIncome)}
        subtitle="Current month"
        footer={{
          label: "Passive Income",
          value: formatCurrency(summary.passiveIncome),
        }}
        icon={<BanknotesIcon className="h-5 w-5 text-primary" />}
        iconClassName="bg-primary bg-opacity-10"
        valueClassName="text-gray-800"
      />
      
      <DashboardCard
        title="Total Expenses"
        value={formatCurrency(summary.totalExpenses)}
        subtitle="Current month"
        footer={{
          label: "Largest category",
          value: summary.largestExpenseCategory 
            ? `${summary.largestExpenseCategory} (${formatCurrency(summary.largestExpenseAmount)})`
            : "None",
        }}
        icon={<CreditCardIcon className="h-5 w-5 text-danger" />}
        iconClassName="bg-danger bg-opacity-10"
        valueClassName="text-danger"
      />
      
      <DashboardCard
        title="Net Worth"
        value={formatCurrency(summary.netWorth)}
        subtitle="Assets - Liabilities"
        footer={{
          label: "Monthly change",
          value: `${summary.netWorthChange >= 0 ? "+" : ""}${formatCurrency(summary.netWorthChange)}`,
        }}
        icon={<ChartBarIcon className="h-5 w-5 text-warning" />}
        iconClassName="bg-warning bg-opacity-10"
        valueClassName="text-gray-800"
      />
    </div>
  );
}

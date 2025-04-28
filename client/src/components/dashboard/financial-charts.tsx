import { useCashFlow } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { formatCurrency } from "@/lib/utils";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function FinancialCharts() {
  const { state } = useCashFlow();
  const { incomes, expenses, assets } = state;

  // Calculate total income and expenses
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Prepare data for income vs expenses chart
  const incomeVsExpensesData = {
    labels: ['Income vs Expenses'],
    datasets: [
      {
        label: 'Income',
        data: [totalIncome],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: [totalExpenses],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for expense breakdown chart
  const expenseCategories = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseBreakdownData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for asset distribution chart
  const assetCategories = assets.reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + parseFloat(asset.value.toString());
    return acc;
  }, {} as Record<string, number>);

  const assetDistributionData = {
    labels: Object.keys(assetCategories),
    datasets: [
      {
        data: Object.values(assetCategories),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Financial Overview',
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={incomeVsExpensesData} options={chartOptions} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Doughnut data={expenseBreakdownData} options={chartOptions} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Doughnut data={assetDistributionData} options={chartOptions} />
        </CardContent>
      </Card>
    </div>
  );
} 
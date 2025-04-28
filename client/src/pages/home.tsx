import { Button } from "@/components/ui/button";
import { FinancialSummary } from "@/components/dashboard/financial-summary";
import { FinancialCharts } from "@/components/dashboard/financial-charts";
import { IncomeTable } from "@/components/tables/income-table";
import { ExpenseTable } from "@/components/tables/expense-table";
import { AssetTable } from "@/components/tables/asset-table";
import { LiabilityTable } from "@/components/tables/liability-table";
import { GoalsList } from "@/components/goals/goals-list";
import { useCashFlow } from "@/lib/context";
import { IncomeForm } from "@/components/forms/income-form";
import { ExpenseForm } from "@/components/forms/expense-form";
import { AssetForm } from "@/components/forms/asset-form";
import { LiabilityForm } from "@/components/forms/liability-form";
import { GoalForm } from "@/components/forms/goal-form";
import { useToast } from "@/hooks/use-toast";
import { TableIcon, ChartBarIcon } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingChat } from "@/components/ai-assistant/FloatingChat";
import { useState } from "react";
import { FinancialFreedomTracker } from "@/components/dashboard/financial-freedom-tracker";

export default function HomePage() {
  const { state } = useCashFlow();
  const { toast } = useToast();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'charts' | 'tables'>('charts');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Financial Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant={viewMode === 'charts' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('charts')}
                  className="flex items-center gap-2"
                >
                  <ChartBarIcon className="h-4 w-4" />
                  Charts
                </Button>
                <Button
                  variant={viewMode === 'tables' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('tables')}
                  className="flex items-center gap-2"
                >
                  <TableIcon className="h-4 w-4" />
                  Tables
                </Button>
              </div>
            </div>
          </div>

          <FinancialSummary />

          {viewMode === 'charts' ? (
            <FinancialCharts />
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {/* Goals and Financial Freedom Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <GoalForm />
                  <GoalsList />
                </div>
                <FinancialFreedomTracker />
              </div>

              {/* 2x2 Grid for Income, Expenses, Assets, and Liabilities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Row */}
                <div className="grid grid-cols-1 gap-6">
                  <IncomeForm />
                  <IncomeTable />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <ExpenseForm />
                  <ExpenseTable />
                </div>
                {/* Bottom Row */}
                <div className="grid grid-cols-1 gap-6">
                  <AssetForm />
                  <AssetTable />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <LiabilityForm />
                  <LiabilityTable />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <FloatingChat />
    </div>
  );
}

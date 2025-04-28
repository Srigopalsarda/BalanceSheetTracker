import { useCashFlow } from "@/lib/context";
import { Income } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ModalType } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function IncomeTable() {
  const { state, dispatch } = useCashFlow();
  const { incomes } = state;

  const handleAddIncome = () => {
    dispatch({ 
      type: "OPEN_MODAL", 
      payload: { type: ModalType.ADD_INCOME } 
    });
  };

  const handleEditIncome = (income: Income) => {
    dispatch({ 
      type: "OPEN_MODAL", 
      payload: { type: ModalType.EDIT_INCOME, data: income } 
    });
  };

  const handleDeleteIncome = (id: string) => {
    if (window.confirm("Are you sure you want to delete this income entry?")) {
      dispatch({ type: "DELETE_INCOME", payload: id });
    }
  };

  const getFrequencyLabel = (frequency: string): string => {
    const labels: Record<string, string> = {
      "monthly": "Monthly",
      "bi-weekly": "Bi-weekly",
      "weekly": "Weekly",
      "annually": "Annually",
      "one-time": "One-time"
    };
    return labels[frequency] || frequency;
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="p-6 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Income</CardTitle>
          <Button onClick={handleAddIncome} size="sm" className="h-8">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                    No income sources added yet.
                  </TableCell>
                </TableRow>
              ) : (
                incomes.map((income) => (
                  <TableRow key={income.id}>
                    <TableCell className="font-medium">{income.source}</TableCell>
                    <TableCell>{income.category}</TableCell>
                    <TableCell>{formatCurrency(income.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={income.type === 'passive' ? 'success' : 'secondary'}>
                        {income.type === 'passive' ? 'Passive' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getFrequencyLabel(income.frequency)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditIncome(income)}
                        className="h-8 w-8 p-0 mr-1"
                      >
                        <PencilIcon className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteIncome(income.id)}
                        className="h-8 w-8 p-0"
                      >
                        <TrashIcon className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

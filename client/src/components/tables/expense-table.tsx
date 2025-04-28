import { useCashFlow } from "@/lib/context";
import { Expense } from "@shared/schema";
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
import { format } from "date-fns";

export function ExpenseTable() {
  const { state, dispatch } = useCashFlow();
  const { expenses } = state;

  const handleAddExpense = () => {
    dispatch({ 
      type: "OPEN_MODAL", 
      payload: { type: ModalType.ADD_EXPENSE } 
    });
  };

  const handleEditExpense = (expense: Expense) => {
    dispatch({ 
      type: "OPEN_MODAL", 
      payload: { type: ModalType.EDIT_EXPENSE, data: expense } 
    });
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense entry?")) {
      dispatch({ type: "DELETE_EXPENSE", payload: id });
    }
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="p-6 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Expenses</CardTitle>
          <Button onClick={handleAddExpense} size="sm" className="h-8">
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
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    No expenses added yet.
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>{format(expense.date, "MM/dd/yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditExpense(expense)}
                        className="h-8 w-8 p-0 mr-1"
                      >
                        <PencilIcon className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteExpense(expense.id)}
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

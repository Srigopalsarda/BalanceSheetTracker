import { useCashFlow } from "@/lib/context";
import { Liability } from "@shared/schema";
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

export function LiabilityTable() {
  const { state, dispatch } = useCashFlow();
  const { liabilities } = state;

  const handleAddLiability = () => {
    dispatch({ 
      type: "OPEN_MODAL", 
      payload: { type: ModalType.ADD_LIABILITY } 
    });
  };

  const handleEditLiability = (liability: Liability) => {
    dispatch({ 
      type: "OPEN_MODAL", 
      payload: { type: ModalType.EDIT_LIABILITY, data: liability } 
    });
  };

  const handleDeleteLiability = (id: string) => {
    if (window.confirm("Are you sure you want to delete this liability?")) {
      dispatch({ type: "DELETE_LIABILITY", payload: id });
    }
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="p-6 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Liabilities</CardTitle>
          <Button onClick={handleAddLiability} size="sm" className="h-8">
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
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liabilities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    No liabilities added yet.
                  </TableCell>
                </TableRow>
              ) : (
                liabilities.map((liability) => (
                  <TableRow key={liability.id}>
                    <TableCell className="font-medium">{liability.description}</TableCell>
                    <TableCell>{liability.type}</TableCell>
                    <TableCell>{formatCurrency(liability.amount)}</TableCell>
                    <TableCell>{liability.interestRate}%</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditLiability(liability)}
                        className="h-8 w-8 p-0 mr-1"
                      >
                        <PencilIcon className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteLiability(liability.id)}
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

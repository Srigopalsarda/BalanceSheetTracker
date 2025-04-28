import { useCashFlow } from "@/lib/context";
import { Asset } from "@shared/schema";
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

export function AssetTable() {
  const { state, dispatch } = useCashFlow();
  const { assets } = state;

  const handleAddAsset = () => {
    dispatch({ 
      type: "OPEN_MODAL", 
      payload: { type: ModalType.ADD_ASSET } 
    });
  };

  const handleEditAsset = (asset: Asset) => {
    dispatch({ 
      type: "OPEN_MODAL", 
      payload: { type: ModalType.EDIT_ASSET, data: asset } 
    });
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      dispatch({ type: "DELETE_ASSET", payload: id });
    }
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="p-6 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Assets</CardTitle>
          <Button onClick={handleAddAsset} size="sm" className="h-8">
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
                <TableHead>Asset</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Income Generated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    No assets added yet.
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>{formatCurrency(asset.value)}</TableCell>
                    <TableCell className="text-success">
                      {formatCurrency(asset.incomeGenerated)}/month
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditAsset(asset)}
                        className="h-8 w-8 p-0 mr-1"
                      >
                        <PencilIcon className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteAsset(asset.id)}
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

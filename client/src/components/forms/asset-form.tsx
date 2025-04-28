import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCashFlow } from "@/lib/context";
import { AssetCategories, ModalType } from "@/types";
import { generateId } from "@/lib/utils";
import { useEffect } from "react";
import { Asset } from "@shared/schema";
import { useAuth } from '../../contexts/AuthContext';

const formSchema = z.object({
  name: z.string().min(1, { message: "Asset name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  value: z.coerce.number().min(0, { message: "Value must be non-negative" }),
  incomeGenerated: z.coerce.number().min(0, { message: "Income must be non-negative" }),
  notes: z.string().optional(),
});

export function AssetForm() {
  const { state, dispatch } = useCashFlow();
  const { type, data } = state.modal;
  const isOpen = type === ModalType.ADD_ASSET || type === ModalType.EDIT_ASSET;
  const isEditing = type === ModalType.EDIT_ASSET;
  const assetData = data as Asset | null;
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "Real Estate",
      value: 0,
      incomeGenerated: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (isEditing && assetData) {
      form.reset({
        name: assetData.name,
        category: assetData.category,
        value: assetData.value,
        incomeGenerated: assetData.incomeGenerated,
        notes: assetData.notes || "",
      });
    } else {
      form.reset({
        name: "",
        category: "Real Estate",
        value: 0,
        incomeGenerated: 0,
        notes: "",
      });
    }
  }, [isOpen, assetData, isEditing, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && assetData) {
      dispatch({
        type: "UPDATE_ASSET",
        payload: {
          ...assetData,
          ...values,
        },
      });
    } else {
      const newAsset: Omit<Asset, 'id' | 'createdAt'> = {
        ...values,
        userId: user!.id,
      };
      dispatch({ type: "ADD_ASSET", payload: newAsset as Asset });
    }
    dispatch({ type: "CLOSE_MODAL" });
  };

  const handleClose = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Asset" : "Add Asset"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Rental Property, Stock Portfolio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AssetCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Value (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="incomeGenerated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income Generated (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional details about this asset" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
              <Button type="submit">{isEditing ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

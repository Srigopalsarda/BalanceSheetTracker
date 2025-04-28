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
import { LiabilityTypes, ModalType } from "@/types";
import { generateId } from "@/lib/utils";
import { useEffect } from "react";
import { Liability } from "@shared/schema";
import { useAuth } from '../../contexts/AuthContext';
import { toast } from "react-hot-toast";

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  amount: z.coerce.number().min(0, { message: "Amount must be non-negative" }),
  interestRate: z.coerce.number().min(0, { message: "Interest rate must be non-negative" }),
  notes: z.string().optional(),
});

export function LiabilityForm() {
  const { state, dispatch } = useCashFlow();
  const { type, data } = state.modal;
  const isOpen = type === ModalType.ADD_LIABILITY || type === ModalType.EDIT_LIABILITY;
  const isEditing = type === ModalType.EDIT_LIABILITY;
  const liabilityData = data as Liability | null;
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      type: "Mortgage",
      amount: 0,
      interestRate: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (isEditing && liabilityData) {
      form.reset({
        description: liabilityData.description,
        type: liabilityData.type,
        amount: liabilityData.amount,
        interestRate: liabilityData.interestRate,
        notes: liabilityData.notes || "",
      });
    } else {
      form.reset({
        description: "",
        type: "Mortgage",
        amount: 0,
        interestRate: 0,
        notes: "",
      });
    }
  }, [isOpen, liabilityData, isEditing, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/liabilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          ...values,
          userId: user!.id,
          ...(isEditing && liabilityData ? { id: liabilityData.id } : {}),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save liability');
      }

      const savedLiability = await response.json();
      
      if (isEditing) {
        dispatch({
          type: "UPDATE_LIABILITY",
          payload: savedLiability,
        });
      } else {
        dispatch({ type: "ADD_LIABILITY", payload: savedLiability });
      }
      
      dispatch({ type: "CLOSE_MODAL" });
    } catch (error) {
      console.error('Error saving liability:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save liability');
    }
  };

  const handleClose = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Liability" : "Add Liability"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mortgage, Car Loan, Credit Card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LiabilityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outstanding Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate (%)</FormLabel>
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
                      placeholder="Additional details about this liability" 
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

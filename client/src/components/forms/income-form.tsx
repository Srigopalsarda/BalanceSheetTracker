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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCashFlow } from "@/lib/context";
import { IncomeCategories, IncomeFrequencies, ModalType } from "@/types";
import { generateId } from "@/lib/utils";
import { useEffect } from "react";
import { Income, insertIncomeSchema } from "@shared/schema";
import { useAuth } from '../../contexts/AuthContext';

const formSchema = z.object({
  source: z.string().min(1, { message: "Source is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  amount: z.coerce.number().min(0, { message: "Amount must be non-negative" }),
  type: z.enum(["active", "passive"]),
  frequency: z.enum(["monthly", "bi-weekly", "weekly", "annually", "one-time"]),
  notes: z.string().optional(),
});

export function IncomeForm() {
  const { state, dispatch } = useCashFlow();
  const { type, data } = state.modal;
  const isOpen = type === ModalType.ADD_INCOME || type === ModalType.EDIT_INCOME;
  const isEditing = type === ModalType.EDIT_INCOME;
  const incomeData = data as Income | null;
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: "",
      category: "Employment",
      amount: 0,
      type: "active",
      frequency: "monthly",
      notes: "",
    },
  });

  useEffect(() => {
    if (isEditing && incomeData) {
      form.reset({
        source: incomeData.source,
        category: incomeData.category,
        amount: incomeData.amount,
        type: incomeData.type,
        frequency: incomeData.frequency,
        notes: incomeData.notes || "",
      });
    } else {
      form.reset({
        source: "",
        category: "Employment",
        amount: 0,
        type: "active",
        frequency: "monthly",
        notes: "",
      });
    }
  }, [isOpen, incomeData, isEditing, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && incomeData) {
      dispatch({
        type: "UPDATE_INCOME",
        payload: {
          ...incomeData,
          ...values,
        },
      });
    } else {
      const newIncome = {
        ...values,
        userId: user!.id,
      };
      dispatch({ type: "ADD_INCOME", payload: newIncome as Income });
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
          <DialogTitle>{isEditing ? "Edit Income" : "Add Income"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Salary, Rental, Dividend" {...field} />
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
                      {IncomeCategories.map((category) => (
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                      value={field.value}
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="active" />
                        </FormControl>
                        <FormLabel className="font-normal">Active</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="passive" />
                        </FormControl>
                        <FormLabel className="font-normal">Passive</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {IncomeFrequencies.map((frequency) => (
                        <SelectItem key={frequency.value} value={frequency.value}>
                          {frequency.label}
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input {...field} />
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

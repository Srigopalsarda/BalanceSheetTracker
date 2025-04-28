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
import { useCashFlow } from "@/lib/context";
import { ExpenseCategories, ModalType } from "@/types";
import { generateId } from "@/lib/utils";
import { useEffect } from "react";
import { Expense } from "@shared/schema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from '../../contexts/AuthContext';

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  amount: z.coerce.number().min(0, { message: "Amount must be non-negative" }),
  date: z.date(),
});

export function ExpenseForm() {
  const { state, dispatch } = useCashFlow();
  const { type, data } = state.modal;
  const isOpen = type === ModalType.ADD_EXPENSE || type === ModalType.EDIT_EXPENSE;
  const isEditing = type === ModalType.EDIT_EXPENSE;
  const expenseData = data as Expense | null;
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      category: "Housing",
      amount: 0,
      date: new Date(),
    },
  });

  useEffect(() => {
    if (isEditing && expenseData) {
      form.reset({
        description: expenseData.description,
        category: expenseData.category,
        amount: expenseData.amount,
        date: expenseData.date,
      });
    } else {
      form.reset({
        description: "",
        category: "Housing",
        amount: 0,
        date: new Date(),
      });
    }
  }, [isOpen, expenseData, isEditing, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && expenseData) {
      dispatch({
        type: "UPDATE_EXPENSE",
        payload: {
          ...expenseData,
          ...values,
        },
      });
    } else {
      const newExpense: Omit<Expense, 'id' | 'createdAt'> = {
        ...values,
        userId: user!.id,
      };
      dispatch({ type: "ADD_EXPENSE", payload: newExpense as Expense });
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
          <DialogTitle>{isEditing ? "Edit Expense" : "Add Expense"}</DialogTitle>
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
                    <Input placeholder="e.g., Rent, Groceries, Utilities" {...field} />
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
                      {ExpenseCategories.map((category) => (
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
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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

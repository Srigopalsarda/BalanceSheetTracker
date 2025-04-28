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
import { useCashFlow } from "@/lib/context";
import { ModalType } from "@/types";
import { generateId } from "@/lib/utils";
import { useEffect } from "react";
import { Goal } from "@shared/schema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from '../../contexts/AuthContext';

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  targetAmount: z.coerce.number().min(0, { message: "Target amount must be non-negative" }),
  currentAmount: z.coerce.number().min(0, { message: "Current amount must be non-negative" }),
  targetDate: z.date(),
});

export function GoalForm() {
  const { state, dispatch } = useCashFlow();
  const { type, data } = state.modal;
  const isOpen = type === ModalType.ADD_GOAL || type === ModalType.EDIT_GOAL;
  const isEditing = type === ModalType.EDIT_GOAL;
  const goalData = data as Goal | null;
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    },
  });

  useEffect(() => {
    if (isEditing && goalData) {
      form.reset({
        description: goalData.description,
        targetAmount: goalData.targetAmount,
        currentAmount: goalData.currentAmount,
        targetDate: goalData.targetDate,
      });
    } else {
      form.reset({
        description: "",
        targetAmount: 0,
        currentAmount: 0,
        targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      });
    }
  }, [isOpen, goalData, isEditing, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && goalData) {
      dispatch({
        type: "UPDATE_GOAL",
        payload: {
          ...goalData,
          ...values,
        },
      });
    } else {
      const newGoal: Omit<Goal, 'id' | 'createdAt'> = {
        ...values,
        userId: user!.id,
      };
      dispatch({ type: "ADD_GOAL", payload: newGoal as Goal });
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
          <DialogTitle>{isEditing ? "Edit Goal" : "Add Financial Goal"}</DialogTitle>
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
                    <Input placeholder="e.g., Emergency Fund, Down Payment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="currentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Target Date</FormLabel>
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
                        disabled={(date) => date < new Date()}
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

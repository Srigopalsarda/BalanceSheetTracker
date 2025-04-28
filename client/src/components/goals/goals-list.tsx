import { useCashFlow } from "@/lib/context";
import { Goal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { formatCurrency, calculateGoalProgress, getProgressColor } from "@/lib/utils";
import { ModalType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

export function GoalsList() {
  const { state, dispatch } = useCashFlow();
  const { goals } = state;

  const handleAddGoal = () => {
    dispatch({ 
      type: "OPEN_MODAL", 
      payload: { type: ModalType.ADD_GOAL } 
    });
  };

  const handleEditGoal = (goal: Goal) => {
    dispatch({ 
      type: "OPEN_MODAL", 
      payload: { type: ModalType.EDIT_GOAL, data: goal } 
    });
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      dispatch({ type: "DELETE_GOAL", payload: id });
    }
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="p-6 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Financial Goals</CardTitle>
          <Button onClick={handleAddGoal} size="sm" className="h-8">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No financial goals added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = calculateGoalProgress(goal.currentAmount, goal.targetAmount);
              const progressColor = getProgressColor(progress);
              
              return (
                <div key={goal.id} className="relative">
                  <div className="flex justify-between mb-1">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">
                        {goal.description}: {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="flex-none ml-4">
                      <span className="text-sm font-medium text-primary">
                        {progress}% complete
                      </span>
                    </div>
                    <div className="flex-none ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditGoal(goal)}
                        className="h-6 w-6 p-0"
                      >
                        <PencilIcon className="h-3.5 w-3.5 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="h-6 w-6 p-0"
                      >
                        <TrashIcon className="h-3.5 w-3.5 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={progress} className={progressColor} />
                  <p className="text-xs text-gray-500 mt-1">
                    Target Date: {format(goal.targetDate, "MMMM yyyy")} | 
                    Current: {formatCurrency(goal.currentAmount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

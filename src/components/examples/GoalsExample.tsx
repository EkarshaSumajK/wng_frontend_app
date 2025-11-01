import { useGoals, useCreateGoal, useUpdateGoal } from '@/hooks/useGoals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Target } from 'lucide-react';

interface GoalsExampleProps {
  caseId: string;
}

export function GoalsExample({ caseId }: GoalsExampleProps) {
  const { data: goals, isLoading, error } = useGoals(caseId);
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

  const handleCreateGoal = () => {
    createGoal.mutate({
      case_id: caseId,
      title: 'New Therapeutic Goal',
      description: 'Work on improving wellbeing',
      status: 'in-progress',
      progress: 0,
    });
  };

  const handleUpdateProgress = (goalId: string, currentProgress: number) => {
    const newProgress = Math.min(currentProgress + 10, 100);
    updateGoal.mutate({
      id: goalId,
      data: { progress: newProgress },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Make sure the backend is running and the case ID is valid.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Therapeutic Goals
        </CardTitle>
        <Button
          size="sm"
          onClick={handleCreateGoal}
          disabled={createGoal.isPending}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        {!goals || goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No goals yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{goal.title}</h4>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {goal.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => handleUpdateProgress(goal.id, goal.progress)}
                    disabled={updateGoal.isPending || goal.progress >= 100}
                  >
                    {goal.progress >= 100 ? 'Completed' : 'Update Progress (+10%)'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

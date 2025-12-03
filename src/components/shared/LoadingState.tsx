import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function LoadingState({ 
  message = "Loading...", 
  className,
  size = "xl"
}: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-12", className)}>
      <Spinner size={size} className="text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

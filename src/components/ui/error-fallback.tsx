import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorFallbackProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  message = "We encountered an error while loading this content.",
}: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      <Card className="w-full max-w-md border-destructive/20 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl text-destructive">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground text-sm">
          <p>{message}</p>
          {error && (
            <div className="mt-4 p-2 bg-muted rounded text-xs font-mono text-left overflow-auto max-h-32">
              {error.message}
            </div>
          )}
        </CardContent>
        {resetErrorBoundary && (
          <CardFooter className="justify-center pt-2">
            <Button onClick={resetErrorBoundary} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

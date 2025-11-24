import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-md",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:scale-110 hover:-translate-y-0.5",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/30 hover:scale-110 hover:-translate-y-0.5",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/30 hover:scale-110 hover:-translate-y-0.5",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/90 hover:shadow-lg hover:shadow-success/30 hover:scale-110 hover:-translate-y-0.5",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-lg hover:shadow-warning/30 hover:scale-110 hover:-translate-y-0.5",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/90 hover:shadow-lg hover:shadow-info/30 hover:scale-110 hover:-translate-y-0.5",
        outline: "text-foreground border-2 hover:bg-accent hover:border-primary/50 hover:scale-110 hover:-translate-y-0.5",
        gradient: "border-transparent bg-gradient-primary text-white hover:shadow-xl hover:shadow-primary/40 hover:scale-110 hover:-translate-y-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

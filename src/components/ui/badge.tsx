import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:scale-105",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-md hover:scale-105",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md hover:scale-105",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/90 hover:shadow-md hover:scale-105",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-md hover:scale-105",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/90 hover:shadow-md hover:scale-105",
        outline: "text-foreground border-2 hover:bg-accent hover:scale-105",
        gradient: "border-transparent bg-gradient-primary text-white hover:shadow-lg hover:scale-105",
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

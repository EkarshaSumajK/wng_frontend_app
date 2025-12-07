import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GridBackgroundProps {
  children?: ReactNode;
  className?: string;
}

export const GridBackground = ({ children, className }: GridBackgroundProps) => {
  return (
    <div className={cn("min-h-screen w-full bg-background relative flex items-center justify-center overflow-hidden", className)}>
      {/* Magenta Orb Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-background [background-image:linear-gradient(to_right,rgba(71,85,105,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.15)_1px,transparent_1px),radial-gradient(circle_at_50%_60%,rgba(236,72,153,0.15)_0%,rgba(168,85,247,0.05)_40%,transparent_70%)] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px),radial-gradient(circle_at_50%_60%,rgba(236,72,153,0.15)_0%,rgba(168,85,247,0.05)_40%,transparent_70%)]"
        style={{
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
  isLoading?: boolean;
}

import React from 'react';

export const StatsCard = React.memo(function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  delay = 0,
  isLoading = false,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("card-premium overflow-hidden h-full", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "card-premium overflow-hidden relative group animate-slide-up-fade", 
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
        <Icon className="w-24 h-24 text-primary" />
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-foreground tracking-tight mb-1">
          {value}
        </div>
        
        {(description || trend) && (
          <div className="flex items-center gap-2 text-xs">
            {trend && (
              <div className={cn(
                "flex items-center gap-1 font-medium px-2 py-0.5 rounded-full",
                trend.isPositive 
                  ? "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30" 
                  : "text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/30"
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
            {description && (
              <p className="text-muted-foreground truncate max-w-[180px]">
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Decorative gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Card>
  );
});

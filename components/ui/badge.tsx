import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "gold";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        {
          "bg-brand-primary/10 text-brand-primary": variant === "default",
          "bg-brand-success/10 text-brand-success": variant === "success",
          "bg-brand-gold/15 text-amber-700": variant === "gold",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };

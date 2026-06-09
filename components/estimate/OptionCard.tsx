"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  selected?: boolean;
  onClick: () => void;
  icon?: ReactNode;
  title: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

export default function OptionCard({
  selected,
  onClick,
  icon,
  title,
  description,
  badge,
  disabled,
}: Props) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full rounded-2xl border-2 p-5 text-left transition-all duration-200 group",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
        selected
          ? "border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/10"
          : "border-brand-border bg-brand-card hover:border-brand-primary/40 hover:bg-brand-bg",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {badge && (
        <span className="absolute top-3 right-3 text-xs font-semibold bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-full">
          {badge}
        </span>
      )}

      <div className="flex items-start gap-4">
        {icon && (
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
              selected
                ? "bg-brand-primary text-white"
                : "bg-brand-bg text-brand-text-secondary group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className={cn(
            "font-bold text-base leading-tight transition-colors",
            selected ? "text-brand-primary" : "text-brand-text"
          )}>
            {title}
          </div>
          {description && (
            <div className="text-brand-text-secondary text-sm mt-1 leading-relaxed">
              {description}
            </div>
          )}
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

interface TealButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "lg" | "xl";
  asChild?: boolean;
}

const TealButton = React.forwardRef<HTMLButtonElement, TealButtonProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    const sizeClasses = {
      default: "h-10 px-6 text-sm",
      lg: "h-12 px-8 text-sm",
      xl: "h-14 px-10 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
          "rounded-[4px] font-semibold uppercase tracking-[0.08em]",
          "border-2 border-[#1CBCB4] overflow-hidden",
          "transition-colors duration-300 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1CBCB4] focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "group",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Background that slides away */}
        <span 
          className="absolute inset-0 bg-gradient-to-r from-[#1CBCB4] to-[#14A8A0] transition-transform duration-300 ease-out origin-left group-hover:-translate-x-full"
        />
        {/* Text */}
        <span className="relative z-10 text-white group-hover:text-[#1CBCB4] transition-colors duration-300">
          {children}
        </span>
      </button>
    );
  }
);

TealButton.displayName = "TealButton";

export { TealButton };

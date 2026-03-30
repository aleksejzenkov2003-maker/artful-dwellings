import * as React from "react";
import { cn } from "@/lib/utils";

interface TealButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "lg" | "xl";
  variant?: "filled" | "outline";
}

const TealButton = React.forwardRef<HTMLButtonElement, TealButtonProps>(
  ({ className, size = "default", variant = "filled", children, ...props }, ref) => {
    const sizeClasses = {
      default: "h-10 px-6 text-sm",
      lg: "h-12 px-8 text-sm",
      xl: "h-14 px-10 text-base",
    };

    // Filled variant: starts with color, becomes transparent on hover
    if (variant === "filled") {
      return (
        <button
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
            "rounded-[4px] font-bold uppercase tracking-[0.08em] font-sans",
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
          {/* Background that slides away to the right */}
          <span 
            className="absolute inset-0 bg-gradient-to-r from-[#1CBCB4] to-[#14A8A0] transition-transform duration-300 ease-out group-hover:translate-x-full"
          />
          {/* Text */}
          <span className="relative z-10 text-white group-hover:text-[#1CBCB4] transition-colors duration-300">
            {children}
          </span>
        </button>
      );
    }

    // Outline variant: starts transparent, fills with color on hover
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
          "rounded-[4px] font-bold uppercase tracking-[0.08em] font-sans",
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
        {/* Background that slides in from the left */}
        <span 
          className="absolute inset-0 bg-gradient-to-r from-[#1CBCB4] to-[#14A8A0] transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0"
        />
        {/* Text */}
        <span className="relative z-10 text-[#1CBCB4] group-hover:text-white transition-colors duration-300">
          {children}
        </span>
      </button>
    );
  }
);

TealButton.displayName = "TealButton";

export { TealButton };

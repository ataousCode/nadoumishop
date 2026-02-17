import * as React from "react";
import { Button } from "../ui/button.tsx";
import type { ButtonProps } from "../ui/button.tsx";
import { cn } from "../../lib/utils.ts";
import { Loader2 } from "lucide-react";

interface NadoumiButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "yellow" | "gold" | "teal" | "outline" | "ghost";
  isLoading?: boolean;
}

export const NadoumiButton = React.forwardRef<
  HTMLButtonElement,
  NadoumiButtonProps
>(({ className, variant = "yellow", isLoading, children, ...props }, ref) => {
  const variantClasses = {
    yellow:
      "bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] rounded-full shadow-[0_2px_5px_0_rgba(213,217,217,0.5)]",
    gold: "bg-[#f0c14b] hover:bg-[#ddb347] text-black border border-[#a88734] rounded-sm",
    teal: "bg-[#007185] hover:bg-[#005f70] text-white border-none rounded-sm",
    outline:
      "bg-white hover:bg-gray-50 text-black border border-gray-300 rounded-full shadow-sm",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 border-none",
  };

  return (
    <Button
      ref={ref}
      disabled={isLoading || props.disabled}
      className={cn(
        "font-normal text-[13px] h-9 px-4 transition-all duration-200",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
});

NadoumiButton.displayName = "NadoumiButton";

import { cn } from "../../lib/utils.ts";

interface PriceFieldProps {
  amount: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showZero?: boolean;
}

export const PriceField = ({
  amount,
  currency = "$",
  size = "md",
  className,
  showZero = true,
}: PriceFieldProps) => {
  if (!showZero && amount === 0) return null;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const formattedAmount = Number(amount).toFixed(2);
  const [whole, decimal] = formattedAmount.split(".");

  return (
    <div
      className={cn(
        "inline-flex items-start font-bold text-gray-900",
        sizeClasses[size],
        className,
      )}
    >
      <span className="text-[0.6em] mt-[0.2em] mr-[0.1em]">{currency}</span>
      <span>{whole}</span>
      <span className="text-[0.6em] mt-[0.2em]">{decimal}</span>
    </div>
  );
};

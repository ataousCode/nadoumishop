import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils.ts";

interface LoadingStateProps {
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export const LoadingState = ({
  fullScreen = false,
  message = "Loading...",
  className,
}: LoadingStateProps) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-12 min-h-[200px]";

  return (
    <div className={cn(containerClasses, className)}>
      <Loader2 className="h-10 w-10 animate-spin text-[#007185] mb-4" />
      {message && (
        <p className="text-gray-600 font-medium animate-pulse">{message}</p>
      )}
    </div>
  );
};

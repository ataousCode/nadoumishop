import type { LucideIcon } from "lucide-react";
import { NadoumiButton } from "./NadoumiButton.tsx";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils.ts";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionPath?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionPath,
  onAction,
  className,
}: EmptyStateProps) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <div
      className={cn("text-center py-16 flex flex-col items-center", className)}
    >
      <div className="bg-white p-6 rounded-full shadow-inner border border-gray-100 mb-6 group hover:shadow-md transition-shadow">
        <Icon className="h-20 w-20 text-[#007185] opacity-20 group-hover:opacity-40 transition-opacity" />
      </div>
      <h2 className="text-2xl font-medium text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
      {actionText && (
        <NadoumiButton variant="yellow" onClick={handleAction} className="px-8">
          {actionText}
        </NadoumiButton>
      )}
    </div>
  );
};

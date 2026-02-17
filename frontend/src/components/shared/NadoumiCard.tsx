import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.tsx";
import { cn } from "../../lib/utils.ts";

interface NadoumiCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  stepNumber?: number;
}

export const NadoumiCard = ({
  title,
  children,
  className,
  contentClassName,
  headerClassName,
  stepNumber,
}: NadoumiCardProps) => {
  return (
    <Card
      className={cn("rounded-none border-none shadow-none bg-white", className)}
    >
      {(title || stepNumber !== undefined) && (
        <CardHeader className={cn("pb-3", headerClassName)}>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            {stepNumber !== undefined && (
              <span className="text-gray-500">{stepNumber}</span>
            )}
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("p-6", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

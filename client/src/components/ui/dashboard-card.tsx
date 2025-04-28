import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  footer?: {
    label: string;
    value: string;
  };
  icon: ReactNode;
  iconClassName?: string;
  valueClassName?: string;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  footer,
  icon,
  iconClassName,
  valueClassName,
}: DashboardCardProps) {
  return (
    <Card className="border shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className={cn("text-3xl font-bold mt-2", valueClassName)}>{value}</p>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <div className={cn("p-2 rounded-full", iconClassName)}>
            {icon}
          </div>
        </div>
        {footer && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">{footer.label}</span>
              <span className="font-semibold text-gray-900">{footer.value}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

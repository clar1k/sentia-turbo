import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface CustomCardProps {
  className?: string;
  children?: React.ReactNode;
}

export interface CustomCardHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export interface CustomCardContentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface CustomCardTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export interface CustomCardDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FinanceMetricCardProps {
  title: string;
  value: string | React.ReactNode;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  className?: string;
}

// Base Card Components
const CustomCard = React.forwardRef<HTMLDivElement, CustomCardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:border-gray-200 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
CustomCard.displayName = "CustomCard";

const CustomCardHeader = React.forwardRef<
  HTMLDivElement,
  CustomCardHeaderProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  >
    {children}
  </div>
));
CustomCardHeader.displayName = "CustomCardHeader";

const CustomCardTitle = React.forwardRef<
  HTMLParagraphElement,
  CustomCardTitleProps
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "leading-none font-semibold tracking-tight text-gray-900",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
));
CustomCardTitle.displayName = "CustomCardTitle";

const CustomCardDescription = React.forwardRef<
  HTMLParagraphElement,
  CustomCardDescriptionProps
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-600", className)} {...props}>
    {children}
  </p>
));
CustomCardDescription.displayName = "CustomCardDescription";

const CustomCardContent = React.forwardRef<
  HTMLDivElement,
  CustomCardContentProps
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
));
CustomCardContent.displayName = "CustomCardContent";

// Specialized Finance Metric Card
const FinanceMetricCard = React.forwardRef<
  HTMLDivElement,
  FinanceMetricCardProps
>(
  (
    {
      title,
      value,
      description,
      icon: Icon,
      iconColor = "text-blue-500",
      loading = false,
      trend,
      className,
      ...props
    },
    ref,
  ) => (
    <CustomCard
      ref={ref}
      className={cn("group transition-transform hover:scale-[1.02]", className)}
      {...props}
    >
      <CustomCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CustomCardTitle className="text-sm font-medium text-gray-700">
          {title}
        </CustomCardTitle>
        {Icon && (
          <div className="rounded-lg bg-gray-50 p-2 transition-colors group-hover:bg-gray-100">
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        )}
      </CustomCardHeader>
      <CustomCardContent className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
          ) : (
            value
          )}
        </div>
        {description && (
          <p className="flex items-center gap-2 text-xs text-gray-500">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium",
                  trend.isPositive !== false && trend.value >= 0
                    ? "text-green-600"
                    : "text-red-600",
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value.toFixed(2)}%
              </span>
            )}
            {description}
          </p>
        )}
      </CustomCardContent>
    </CustomCard>
  ),
);
FinanceMetricCard.displayName = "FinanceMetricCard";

// Chart Card Component
export interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const ChartCard = React.forwardRef<HTMLDivElement, ChartCardProps>(
  (
    { title, description, children, className, loading = false, ...props },
    ref,
  ) => (
    <CustomCard
      ref={ref}
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <CustomCardHeader className="border-b border-gray-50">
        <CustomCardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CustomCardTitle>
        {description && (
          <CustomCardDescription className="text-gray-600">
            {description}
          </CustomCardDescription>
        )}
      </CustomCardHeader>
      <CustomCardContent className="p-6">
        {loading ? (
          <div className="h-64 w-full animate-pulse rounded bg-gray-100" />
        ) : (
          children
        )}
      </CustomCardContent>
    </CustomCard>
  ),
);
ChartCard.displayName = "ChartCard";

export {
  CustomCard,
  CustomCardHeader,
  CustomCardTitle,
  CustomCardDescription,
  CustomCardContent,
  FinanceMetricCard,
  ChartCard,
};

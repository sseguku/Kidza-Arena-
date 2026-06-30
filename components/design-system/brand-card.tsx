import type { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type cardVariants,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type BrandCardProps = VariantProps<typeof cardVariants> & {
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerAction?: ReactNode;
};

/** Opinionated card preset for consistent page layouts. */
export function BrandCard({
  title,
  description,
  children,
  footer,
  variant,
  className,
  headerAction,
}: BrandCardProps) {
  return (
    <Card variant={variant} className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {headerAction && <CardAction>{headerAction}</CardAction>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  variant?: VariantProps<typeof cardVariants>["variant"];
  className?: string;
};

/** Compact metric card for dashboards and summaries. */
export function StatCard({
  label,
  value,
  hint,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <Card variant={variant} className={cn("gap-4 py-8 lg:py-10", className)}>
      <CardHeader className="gap-2">
        <CardDescription className="text-caption">{label}</CardDescription>
        <CardTitle className="text-display-sm lg:text-display-md">{value}</CardTitle>
        {hint && <p className="text-body-md text-muted-foreground">{hint}</p>}
      </CardHeader>
    </Card>
  );
}

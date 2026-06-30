import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "flex flex-col gap-8 rounded-2xl border bg-card py-8 text-card-foreground shadow-md transition-all duration-300 ease-out lg:rounded-3xl lg:py-10",
  {
    variants: {
      variant: {
        default: "border-border",
        pitch: "border-primary/20 bg-primary/5",
        adventure:
          "border-adventure/20 bg-adventure/5 hover:shadow-xl hover:shadow-adventure/10",
        community: "border-community/20 bg-community/5",
        value: "border-value/30 bg-value/10",
        fun: "border-fun/20 bg-fun/5",
        elevated:
          "border-border shadow-lg hover:-translate-y-1 hover:shadow-2xl",
        interactive:
          "cursor-pointer border-border shadow-lg hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-2xl active:translate-y-0 active:scale-[0.99]",
        gradient: "border-transparent bg-gradient-hero shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-3 px-8 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-8 lg:px-10",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-display text-heading-md leading-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-body-md text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-8 lg:px-10", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-8 lg:px-10 [.border-t]:pt-8", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}

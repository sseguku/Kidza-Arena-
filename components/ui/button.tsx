import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full text-lg font-bold whitespace-nowrap transition-all duration-300 ease-out outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        pitch:
          "bg-gradient-pitch text-pitch-foreground shadow-lg hover:scale-[1.02] hover:shadow-xl hover:brightness-110 active:scale-[0.98]",
        adventure:
          "bg-gradient-adventure text-adventure-foreground shadow-lg hover:scale-[1.02] hover:shadow-xl hover:brightness-110 active:scale-[0.98]",
        community:
          "bg-community text-community-foreground shadow-md hover:bg-community/90 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        value:
          "bg-value text-value-foreground shadow-md hover:bg-value/90 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        fun: "bg-fun text-fun-foreground shadow-lg hover:bg-fun/90 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]",
        competitive:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border-2 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02]",
        ghost:
          "rounded-xl hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "rounded-none text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 min-h-12 px-7 py-3 has-[>svg]:px-6",
        xs: "h-9 min-h-9 gap-1 rounded-full px-4 text-sm has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-11 min-h-11 gap-2 rounded-full px-6 text-base has-[>svg]:px-5",
        lg: "h-14 min-h-14 rounded-full px-10 text-lg has-[>svg]:px-8",
        xl: "h-16 min-h-16 rounded-full px-12 text-lg has-[>svg]:px-10",
        icon: "size-12 min-h-12 rounded-full",
        "icon-xs": "size-9 min-h-9 rounded-full [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-11 min-h-11 rounded-full",
        "icon-lg": "size-14 min-h-14 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

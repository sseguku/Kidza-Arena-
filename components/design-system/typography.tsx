import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const displayVariants = cva("font-display tracking-tight", {
  variants: {
    size: {
      xl: "text-display-xl",
      lg: "text-display-lg",
      md: "text-display-md",
      sm: "text-display-sm",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      pitch: "text-primary",
      adventure: "text-adventure",
      gradient: "text-gradient-adventure",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});

const headingVariants = cva("font-display tracking-tight", {
  variants: {
    size: {
      lg: "text-heading-lg",
      md: "text-heading-md",
      sm: "text-heading-sm",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      pitch: "text-primary",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});

const textVariants = cva("", {
  variants: {
    size: {
      lg: "text-body-lg",
      md: "text-body-md",
      sm: "text-body-sm",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      pitch: "text-primary",
      adventure: "text-adventure",
      community: "text-community",
      value: "text-value-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});

type DisplayProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof displayVariants> & {
    as?: "h1" | "h2" | "p";
  };

export function Display({
  className,
  size,
  tone,
  as: Tag = "h1",
  ...props
}: DisplayProps) {
  return (
    <Tag className={cn(displayVariants({ size, tone }), className)} {...props} />
  );
}

type HeadingProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    as?: "h2" | "h3" | "h4" | "h5" | "h6";
  };

export function Heading({
  className,
  size,
  tone,
  as: Tag = "h2",
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn(headingVariants({ size, tone }), className)} {...props} />
  );
}

type TextProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    as?: ElementType;
  };

export function Text({
  className,
  size,
  tone,
  as: Tag = "p",
  ...props
}: TextProps) {
  return (
    <Tag className={cn(textVariants({ size, tone }), className)} {...props} />
  );
}

type EyebrowProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof textVariants> & {
    brand?: "pitch" | "adventure" | "community" | "value" | "fun";
  };

const eyebrowColors = {
  pitch: "text-primary",
  adventure: "text-adventure",
  community: "text-community",
  value: "text-value-foreground",
  fun: "text-fun",
} as const;

export function Eyebrow({ className, brand, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-eyebrow",
        brand && eyebrowColors[brand],
        !brand && "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function Caption({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-caption", className)} {...props} />;
}

export {
  displayVariants,
  headingVariants,
  textVariants,
};

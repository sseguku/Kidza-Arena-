import type { ComponentProps, ReactNode } from "react";
import { Input, type inputVariants } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type InputVariant = VariantProps<typeof inputVariants>["variant"];
type InputSize = VariantProps<typeof inputVariants>["inputSize"];

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

/** Presentational field wrapper — pairs label, control, hint, and error. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="text-adventure" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-body-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-body-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
} & Omit<ComponentProps<typeof Input>, "id">;

export function TextField({
  id,
  label,
  hint,
  error,
  required,
  className,
  variant,
  inputSize,
  ...inputProps
}: TextFieldProps) {
  return (
    <Field
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <Input
        id={id}
        variant={variant}
        inputSize={inputSize}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        required={required}
        {...inputProps}
      />
    </Field>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
} & Omit<ComponentProps<typeof Textarea>, "id">;

export function TextAreaField({
  id,
  label,
  hint,
  error,
  required,
  className,
  ...textareaProps
}: TextAreaFieldProps) {
  return (
    <Field
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <Textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        required={required}
        {...textareaProps}
      />
    </Field>
  );
}

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/** Groups related fields with a section heading. */
export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <fieldset className={cn("grid gap-6 border-0 p-0", className)}>
      <legend className="sr-only">{title}</legend>
      <div className="grid gap-1">
        <h3 className="font-display text-heading-sm">{title}</h3>
        {description && (
          <p className="text-body-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="grid gap-4">{children}</div>
    </fieldset>
  );
}

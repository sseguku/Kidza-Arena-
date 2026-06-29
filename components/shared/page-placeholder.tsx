import type { ReactNode } from "react";

type PagePlaceholderProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PagePlaceholder({
  title,
  description,
  children,
}: PagePlaceholderProps) {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}

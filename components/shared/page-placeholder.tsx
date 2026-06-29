import { Display, Text } from "@/components/design-system";

type PagePlaceholderProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PagePlaceholder({
  title,
  description,
  children,
}: PagePlaceholderProps) {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <Display as="h1" size="sm" className="max-w-xl">
        {title}
      </Display>
      <Text size="lg" tone="muted" className="mt-4 max-w-lg">
        {description}
      </Text>
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}

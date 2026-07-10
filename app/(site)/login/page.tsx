import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/metadata";
import { Suspense } from "react";

export const metadata = createPageMetadata({
  title: "Admin Sign In",
  description: "Sign in to the Kidza Arena admin dashboard.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            K
          </div>
          <CardTitle className="text-2xl">Admin Sign In</CardTitle>
          <CardDescription>
            Access the Kidza Arena dashboard to manage bookings and content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-muted" />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </section>
  );
}

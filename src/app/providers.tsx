"use client";

import { AuthProvider } from "@/lib/auth-context";
import { PassProvider } from "@/lib/pass-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PassProvider>{children}</PassProvider>
    </AuthProvider>
  );
}

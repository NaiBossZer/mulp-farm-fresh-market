import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  loader: async ({ searchParams }) => {
    const code = searchParams.code as string;
    const next = (searchParams.next as string) ?? "/";

    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
    }

    return redirect({ to: next });
  },
});

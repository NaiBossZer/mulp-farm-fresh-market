import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  loader: async ({ location }) => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
    }

    return redirect({ to: next });
  },
});
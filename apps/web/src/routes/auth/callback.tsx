import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/auth/callback")({
   loader: async () => {
      const session = await getUser();
      return { session };
   },
   component: AuthCallbackPage,
});

function AuthCallbackPage() {
   const router = useRouter();
   const { session } = Route.useLoaderData();

   useEffect(() => {
      if (session?.user) {
         router.navigate({ to: "/dashboard" });
      } else {
         router.navigate({ to: "/auth/sign-in" });
      }
   }, [session, router]);

   return null;
}

import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";

import { getUser } from "@/functions/get-user";

export const Route = createFileRoute("/auth")({
  beforeLoad: async ({ location }) => {
    const session = await getUser();

    if (session?.user && !location.pathname.includes("/auth/callback")) {
      throw redirect({ to: "/auth/callback" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background">
      <main className="flex flex-1 flex-col justify-center items-center px-4 py-8 md:px-8 lg:px-12 order-1 lg:order-1">
        <section
          className="w-full max-w-md duration-500 animate-in slide-in-from-bottom-4 fade-in"
          key={location.pathname}
        >
          <section aria-label="Authentication">
            <Outlet />
          </section>
        </section>
      </main>

      <aside className="hidden lg:flex lg:w-[40%] relative flex-col justify-between bg-gradient-to-br from-primary via-primary/95 to-primary/85 p-8 xl:p-12 order-2">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[size:32px_32px]"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-white">Working App</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl xl:text-3xl font-serif font-semibold text-white">Welcome</h2>
            <p className="text-white/70 text-sm xl:text-base max-w-sm mx-auto">
              Sign in to access your dashboard.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-white/50 text-xs">
          &copy; {new Date().getFullYear()} Working App
        </div>
      </aside>
    </div>
  );
}

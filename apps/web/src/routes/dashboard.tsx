import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DashboardLayout } from '@web/layout/dashboard/dashboard-layout';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayoutRoute,
});

function DashboardLayoutRoute() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

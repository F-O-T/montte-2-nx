import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const privateData = useQuery(orpc.privateData.queryOptions());

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Dashboard" />
      <p>{privateData.data?.message ?? ""}</p>
    </div>
  );
}

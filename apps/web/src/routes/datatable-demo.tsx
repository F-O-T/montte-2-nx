import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable, DataTableColumnHeader } from "@packages/ui/components/data-table";
import { Badge } from "@packages/ui/components/badge";

type Task = {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
};

const initialTasks: Task[] = [
  { id: "1", title: "Set up CI/CD pipeline", status: "done", priority: "high", assignee: "Alice" },
  {
    id: "2",
    title: "Design landing page",
    status: "in-progress",
    priority: "medium",
    assignee: "Bob",
  },
  {
    id: "3",
    title: "Write API documentation",
    status: "todo",
    priority: "low",
    assignee: "Charlie",
  },
  {
    id: "4",
    title: "Fix authentication bug",
    status: "in-progress",
    priority: "high",
    assignee: "Alice",
  },
  {
    id: "5",
    title: "Add dark mode support",
    status: "todo",
    priority: "medium",
    assignee: "Diana",
  },
  {
    id: "6",
    title: "Optimize database queries",
    status: "todo",
    priority: "high",
    assignee: "Bob",
  },
  {
    id: "7",
    title: "Create onboarding flow",
    status: "in-progress",
    priority: "medium",
    assignee: "Charlie",
  },
  { id: "8", title: "Set up error monitoring", status: "done", priority: "low", assignee: "Diana" },
];

const priorityColors = {
  low: "secondary",
  medium: "default",
  high: "destructive",
} as const;

const statusColors = {
  todo: "outline",
  "in-progress": "default",
  done: "secondary",
} as const;

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue<Task["status"]>("status");
      return <Badge variant={statusColors[status]}>{status}</Badge>;
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      const priority = row.getValue<Task["priority"]>("priority");
      return <Badge variant={priorityColors[priority]}>{priority}</Badge>;
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assignee" />,
  },
];

export const Route = createFileRoute("/datatable-demo")({
  component: DataTableDemo,
});

function DataTableDemo() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Drag and drop columns to reorder them.</p>
      </div>
      <DataTable columns={columns} data={initialTasks} getRowId={(row) => row.id} reorderColumns />
    </div>
  );
}

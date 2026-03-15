import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea, ScrollBar } from "@packages/ui/components/scroll-area";

const meta = {
  title: "Components/ScrollArea",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-lg border p-4">
      <div className="space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="text-sm">
            Item {i + 1} — Scrollable content line.
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-64 rounded-lg border">
      <div className="flex gap-4 p-4" style={{ width: 800 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border bg-muted"
          >
            {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

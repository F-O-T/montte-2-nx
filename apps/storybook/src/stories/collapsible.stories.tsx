import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@packages/ui/components/collapsible";
import { Button } from "@packages/ui/components/button";
import { ChevronsUpDown } from "lucide-react";

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">Starred repositories</h4>
        <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <ChevronsUpDown className="size-4" />
          <span className="sr-only">Toggle</span>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-lg border px-4 py-2 text-sm">@project/ui</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-lg border px-4 py-2 text-sm">@project/api</div>
        <div className="rounded-lg border px-4 py-2 text-sm">@project/core</div>
      </CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Toggle" });
    await userEvent.click(trigger);
    await expect(canvas.getByText("@project/api")).toBeVisible();
  },
};

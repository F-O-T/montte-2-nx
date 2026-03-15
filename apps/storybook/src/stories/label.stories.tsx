import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@packages/ui/components/label";
import { Input } from "@packages/ui/components/input";

const meta = {
  title: "Components/Label",
  component: Label,
  args: {
    children: "Email address",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

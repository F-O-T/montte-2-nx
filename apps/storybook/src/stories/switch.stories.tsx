import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";
import { Switch } from "@packages/ui/components/switch";
import { Label } from "@packages/ui/components/label";

const meta = {
  title: "Components/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane" />
      <Label htmlFor="airplane">Airplane Mode</Label>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch");
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const SmallSize: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch size="sm" id="small-switch" />
      <Label htmlFor="small-switch">Small switch</Label>
    </div>
  ),
};

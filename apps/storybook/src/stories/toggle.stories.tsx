import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";
import { Toggle } from "@packages/ui/components/toggle";
import { Bold } from "lucide-react";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Bold className="size-4" />,
    "aria-label": "Toggle bold",
  },
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("button", { name: "Toggle bold" });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: <Bold className="size-4" />,
    "aria-label": "Toggle bold",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle size="sm" aria-label="Small">
        <Bold className="size-4" />
      </Toggle>
      <Toggle size="default" aria-label="Default">
        <Bold className="size-4" />
      </Toggle>
      <Toggle size="lg" aria-label="Large">
        <Bold className="size-4" />
      </Toggle>
    </div>
  ),
};

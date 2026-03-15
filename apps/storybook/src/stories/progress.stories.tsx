import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@packages/ui/components/progress";

const meta = {
  title: "Components/Progress",
  component: Progress,
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { value: 0 },
};

export const Half: Story = {
  args: { value: 50 },
};

export const Full: Story = {
  args: { value: 100 },
};

export const AllValues: Story = {
  args: {
    value: 0,
  },
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <Progress value={0} />
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  ),
};

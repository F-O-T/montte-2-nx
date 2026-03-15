import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@packages/ui/components/slider";

const meta = {
  title: "Components/Slider",
  component: Slider,
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[50]} max={100} />
    </div>
  ),
};

export const Range: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[25, 75]} max={100} />
    </div>
  ),
};

export const CustomStep: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[20]} max={100} step={10} />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { AspectRatio } from "@packages/ui/components/aspect-ratio";

const meta = {
  title: "Components/AspectRatio",
  component: AspectRatio,
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SixteenByNine: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: () => (
    <div className="w-80">
      <AspectRatio ratio={16 / 9}>
        <div className="flex size-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
          16:9
        </div>
      </AspectRatio>
    </div>
  ),
};

export const FourByThree: Story = {
  args: {
    ratio: 4 / 3,
  },
  render: () => (
    <div className="w-80">
      <AspectRatio ratio={4 / 3}>
        <div className="flex size-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
          4:3
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  args: {
    ratio: 1,
  },
  render: () => (
    <div className="w-80">
      <AspectRatio ratio={1}>
        <div className="flex size-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
          1:1
        </div>
      </AspectRatio>
    </div>
  ),
};

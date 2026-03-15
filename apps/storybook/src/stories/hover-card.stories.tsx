import type { Meta, StoryObj } from "@storybook/react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@packages/ui/components/hover-card";

const meta = {
  title: "Components/HoverCard",
  component: HoverCard,
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer underline">@nextjs</HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold">Next.js</h4>
          <p className="text-sm text-muted-foreground">
            The React Framework for the Web. Used by some of the world's largest companies.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

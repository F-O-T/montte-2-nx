import type { Meta, StoryObj } from "@storybook/react";
import {
  Empty,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyHeader,
} from "@packages/ui/components/empty";
import { Inbox } from "lucide-react";

const meta = {
  title: "Components/Empty",
  component: Empty,
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>
          You have no messages in your inbox. Start a conversation to see them here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

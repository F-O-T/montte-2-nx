import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@packages/ui/components/textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    placeholder: "Type your message here...",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "This is some pre-filled text content." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Disabled textarea" },
};

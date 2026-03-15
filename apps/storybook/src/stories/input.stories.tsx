import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@packages/ui/components/input";

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    placeholder: "Enter text...",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "Hello world" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Disabled input" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "Password" },
};

export const File: Story = {
  args: { type: "file" },
};

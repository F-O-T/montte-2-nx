import type { Meta, StoryObj } from "@storybook/react";
import { Field, FieldLabel, FieldDescription, FieldError } from "@packages/ui/components/field";
import { Input } from "@packages/ui/components/input";

const meta = {
  title: "Components/Field",
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="you@example.com" />
      <FieldDescription>We will never share your email.</FieldDescription>
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field className="max-w-sm" data-invalid="true">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" placeholder="you@example.com" aria-invalid="true" />
      <FieldError>Please enter a valid email address.</FieldError>
    </Field>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@packages/ui/components/input-otp";

const meta = {
  title: "Components/InputOTP",
  component: InputOTP,
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

const sixDigitProps = { maxLength: 6 };
const fourDigitProps = { maxLength: 4 };

export const Default: Story = {
  args: {
    children: null,
    maxLength: 6,
  },
  render: () => (
    <InputOTP {...sixDigitProps}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

export const FourDigits: Story = {
  args: {
    children: null,
    maxLength: 4,
  },
  render: () => (
    <InputOTP {...fourDigitProps}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

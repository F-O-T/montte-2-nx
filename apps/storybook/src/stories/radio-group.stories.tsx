import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";
import { RadioGroup, RadioGroupItem } from "@packages/ui/components/radio-group";
import { Label } from "@packages/ui/components/label";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="r1" />
        <Label htmlFor="r1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="r2" />
        <Label htmlFor="r2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="r3" />
        <Label htmlFor="r3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    const radios = canvas.getAllByRole("radio");
    const firstRadio = radios[0];
    const secondRadio = radios[1];

    if (!firstRadio || !secondRadio) {
      throw new Error("Expected radio options to be rendered");
    }

    await expect(firstRadio).toBeChecked();
    await userEvent.click(secondRadio);
    await expect(secondRadio).toBeChecked();
    await expect(firstRadio).not.toBeChecked();
  },
};

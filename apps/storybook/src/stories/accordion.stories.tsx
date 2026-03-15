import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@packages/ui/components/accordion";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match your design system.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes. It uses CSS animations for smooth transitions.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvas, userEvent }) => {
    const triggers = canvas.getAllByRole("button");
    const firstTrigger = triggers[0];
    const secondTrigger = triggers[1];

    if (!firstTrigger || !secondTrigger) {
      throw new Error("Expected accordion triggers to be rendered");
    }

    await userEvent.click(firstTrigger);
    await expect(canvas.getByText("Yes. It adheres to the WAI-ARIA design pattern.")).toBeVisible();
    await userEvent.click(secondTrigger);
    await expect(
      canvas.getByText("Yes. It comes with default styles that match your design system."),
    ).toBeVisible();
  },
};

export const MultipleItems: Story = {
  render: () => (
    <Accordion multiple>
      <AccordionItem value="item-1">
        <AccordionTrigger>First Section</AccordionTrigger>
        <AccordionContent>Content for the first section.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second Section</AccordionTrigger>
        <AccordionContent>Content for the second section.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

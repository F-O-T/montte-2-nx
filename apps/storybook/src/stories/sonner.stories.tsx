import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { Toaster } from "@packages/ui/components/sonner";
import { Button } from "@packages/ui/components/button";

const meta: Meta<typeof Toaster> = {
  title: "Components/Sonner",
  component: Toaster,
  decorators: [
    (Story: ComponentType) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Default toast message")}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Successfully saved!")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Something went wrong")}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Please be careful")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.info("Here is some info")}>
        Info
      </Button>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const defaultBtn = canvas.getByRole("button", { name: "Default" });
    await userEvent.click(defaultBtn);
  },
};

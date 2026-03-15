import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@packages/ui/components/tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p>Account settings and preferences.</p>
      </TabsContent>
      <TabsContent value="password">
        <p>Change your password here.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p>General application settings.</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    const passwordTab = canvas.getByRole("tab", { name: "Password" });
    await userEvent.click(passwordTab);
    await expect(canvas.getByText("Change your password here.")).toBeVisible();
  },
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList variant="line">
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Analytics</TabsTrigger>
        <TabsTrigger value="tab3">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Overview content</TabsContent>
      <TabsContent value="tab2">Analytics content</TabsContent>
      <TabsContent value="tab3">Reports content</TabsContent>
    </Tabs>
  ),
};

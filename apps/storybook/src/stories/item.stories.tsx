import type { Meta, StoryObj } from "@storybook/react";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemMedia,
  ItemActions,
  ItemGroup,
} from "@packages/ui/components/item";
import { Button } from "@packages/ui/components/button";
import { FileText, MoreHorizontal, Star } from "lucide-react";

const meta = {
  title: "Components/Item",
  component: Item,
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Item>
      <ItemMedia variant="icon">
        <FileText />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Document Title</ItemTitle>
        <ItemDescription>A short description of this item.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon-xs">
          <Star />
        </Button>
        <Button variant="ghost" size="icon-xs">
          <MoreHorizontal />
        </Button>
      </ItemActions>
    </Item>
  ),
};

export const ListItems: Story = {
  render: () => (
    <ItemGroup>
      {["Design System", "Component Library", "Documentation"].map((title) => (
        <Item key={title} variant="outline">
          <ItemMedia variant="icon">
            <FileText />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <ItemDescription>Updated recently</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <Item size="sm" variant="outline">
      <ItemMedia variant="icon">
        <FileText />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Small Item</ItemTitle>
      </ItemContent>
    </Item>
  ),
};

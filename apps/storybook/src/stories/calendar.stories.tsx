import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Calendar } from "@packages/ui/components/calendar";
import type { DateRange } from "react-day-picker";

const meta = {
  title: "Components/Calendar",
  component: Calendar,
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Calendar />,
};

export const WithSelectedDate: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return <Calendar mode="single" selected={date} onSelect={setDate} />;
  },
};

export const RangeSelection: Story = {
  render: function Render() {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return <Calendar mode="range" selected={range} onSelect={setRange} />;
  },
};

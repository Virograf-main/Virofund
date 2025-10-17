import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatePicker } from "./index"; // adjust if located elsewhere
import { format } from "date-fns";

// Mock shadcn Calendar since it's UI-heavy
jest.mock("@/components/ui/calendar", () => ({
  Calendar: ({ selected, onSelect }: any) => (
    <div
      data-testid="calendar"
      onClick={() => onSelect?.(new Date("2025-01-01"))}
    >
      Mock Calendar — selected: {selected ? "yes" : "no"}
    </div>
  ),
}));

// Mock Next.js Image to avoid Next.js optimization error
jest.mock("next/image", () => (props: any) => (
  <img {...props} alt={props.alt || "mocked image"} />
));

describe("DatePicker", () => {
  it("renders with a label", () => {
    render(<DatePicker label="Select date" />);
    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  it("shows the placeholder when no date is selected", () => {
    render(<DatePicker placeholder="Pick a date" />);
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("shows the formatted date when a value is provided", () => {
    const testDate = new Date("2025-01-01");
    render(<DatePicker value={testDate} />);
    expect(screen.getByText(format(testDate, "PPP"))).toBeInTheDocument();
  });

  it("opens the calendar popover when the button is clicked", () => {
    render(<DatePicker />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByTestId("calendar")).toBeInTheDocument();
  });

  it("calls onChange when a date is selected", () => {
    const handleChange = jest.fn();
    render(<DatePicker onChange={handleChange} />);
    const button = screen.getByRole("button");
    fireEvent.click(button); // open calendar
    const calendar = screen.getByTestId("calendar");
    fireEvent.click(calendar);
    expect(handleChange).toHaveBeenCalledWith(new Date("2025-01-01"));
  });
});

// __tests__/DatePicker.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatePicker } from "./index"; // adjust path if needed
import { format } from "date-fns";

/* -------------------------------------------------
   1. Types for the mocked Calendar (shadcn)
   ------------------------------------------------- */
interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

/* -------------------------------------------------
   2. Mock shadcn Calendar – fully typed
   ------------------------------------------------- */
jest.mock("@/components/ui/calendar", () => ({
  Calendar: ({ selected, onSelect }: CalendarProps) => (
    <div
      data-testid="calendar"
      // Click → pick 2025-01-01 (same as your original mock)
      onClick={() => onSelect?.(new Date("2025-01-01"))}
    >
      Mock Calendar — selected: {selected ? "yes" : "no"}
    </div>
  ),
}));

/* -------------------------------------------------
   3. Mock next/image – typed props
   ------------------------------------------------- */
type NextImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  // …any other props you pass in your real usage
};

jest.mock("next/image", () => {
  const MockImage = (props: NextImageProps) => (
    <img
      {...props}
      alt={props.alt ?? "mocked image"}
      width={props.width ?? 1}
      height={props.height ?? 1}
    />
  );

  MockImage.displayName = "MockImage";

  return MockImage;
});

/* -------------------------------------------------
   4. Tests – no `any` anywhere
   ------------------------------------------------- */
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
    fireEvent.click(button); // open popover

    const calendar = screen.getByTestId("calendar");
    fireEvent.click(calendar); // pick date

    expect(handleChange).toHaveBeenCalledWith(new Date("2025-01-01"));
  });
});

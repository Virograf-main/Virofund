import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "./index"; // adjust the path if needed

describe("Checkbox component", () => {
  it("renders without crashing", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("renders with a label", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("toggles checked state when clicked", () => {
    render(<Checkbox label="Subscribe" />);
    const checkbox = screen.getByRole("checkbox");

    // Initially unchecked
    expect(checkbox).not.toBeChecked();

    // Click to check
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Click again to uncheck
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("can be disabled", () => {
    render(<Checkbox disabled label="Disabled checkbox" />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeDisabled();

    // Attempt to click disabled checkbox
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("calls onCheckedChange when toggled", () => {
    const handleChange = jest.fn();
    render(<Checkbox onCheckedChange={handleChange} label="Notify me" />);
    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

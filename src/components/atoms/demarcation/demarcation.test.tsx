// __tests__/Demarcation.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { Demarcation } from "./index";

/* -------------------------------------------------
   1. Type for the mocked Separator component
   ------------------------------------------------- */
interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  // Add any custom props your real Separator might accept
  // e.g., orientation?: "horizontal" | "vertical";
  orientation?: "horizontal" | "vertical";
}

/* -------------------------------------------------
   2. Mock Separator – fully typed
   ------------------------------------------------- */
jest.mock("@/components/atoms", () => ({
  Separator: (props: SeparatorProps) => (
    <hr
      data-testid="separator"
      {...props}
      // Ensure className is passed through
      className={props.className}
    />
  ),
}));

/* -------------------------------------------------
   3. Tests – no `any`, full type safety
   ------------------------------------------------- */
describe("Demarcation", () => {
  it("renders the provided text", () => {
    render(<Demarcation text="OR" />);
    expect(screen.getByText("OR")).toBeInTheDocument();
  });

  it("renders two separator elements", () => {
    render(<Demarcation text="Continue" />);
    const separators = screen.getAllByTestId("separator");
    expect(separators).toHaveLength(2);
  });

  it("applies correct styling classes", () => {
    render(<Demarcation text="Divider" />);
    const separators = screen.getAllByTestId("separator");

    // Each separator should have these classes
    separators.forEach((separator) => {
      expect(separator).toHaveClass("h-px");
      expect(separator).toHaveClass("flex-1");
      expect(separator).toHaveClass("bg-gray-300");
    });

    // Text should have its own classes
    const textElement = screen.getByText("Divider");
    expect(textElement).toHaveClass("text-xs");
    expect(textElement).toHaveClass("text-gray-500");
  });
});

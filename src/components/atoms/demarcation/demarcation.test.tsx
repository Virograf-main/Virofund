import React from "react";
import { render, screen } from "@testing-library/react";
import { Demarcation } from "./index";

// Mock the Separator component from "@/components/atoms"
jest.mock("@/components/atoms", () => ({
  Separator: (props: any) => <hr data-testid="separator" {...props} />,
}));

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
    separators.forEach((separator) =>
      expect(separator).toHaveClass("h-px", "flex-1", "bg-gray-300")
    );
    expect(screen.getByText("Divider")).toHaveClass("text-xs", "text-gray-500");
  });
});

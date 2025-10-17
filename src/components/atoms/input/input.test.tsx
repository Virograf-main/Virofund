import React from "react";
import { render, screen } from "@testing-library/react";
import { Input } from "./index";

// Mock ShadCN Input and Label components
jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input data-testid="shad-input" {...props} />,
}));

jest.mock("@/components/ui/label", () => ({
  Label: (props: any) => <label data-testid="shad-label" {...props} />,
}));

describe("Input component", () => {
  it("renders without crashing", () => {
    render(<Input />);
    expect(screen.getByTestId("shad-input")).toBeInTheDocument();
  });

  it("renders a label when provided", () => {
    render(<Input label="Username" />);
    expect(screen.getByTestId("shad-label")).toHaveTextContent("Username");
  });

  it("renders description when provided", () => {
    render(<Input description="Enter your username" />);
    expect(screen.getByText("Enter your username")).toBeInTheDocument();
  });

  it("renders error message when provided", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("applies custom className to input element", () => {
    render(<Input className="custom-class" />);
    expect(screen.getByTestId("shad-input")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

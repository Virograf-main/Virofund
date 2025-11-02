// __tests__/Input.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { Input } from "./index";

/* -------------------------------------------------
   1. Types for mocked ShadCN components
   ------------------------------------------------- */
type ShadInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  placeholder?: string;
  // add any other props your real Input accepts
};

type ShadLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string;
  // e.g., htmlFor?: string;
};

/* -------------------------------------------------
   2. Mock ShadCN Input – fully typed
   ------------------------------------------------- */
jest.mock("@/components/ui/input", () => {
  const MockInput = React.forwardRef<HTMLInputElement, ShadInputProps>(
    (props, ref) => (
      <input
        ref={ref}
        data-testid="shad-input"
        {...props}
        className={props.className}
      />
    )
  );

  MockInput.displayName = "MockInput";

  return { Input: MockInput };
});

/* -------------------------------------------------
   3. Mock ShadCN Label – fully typed
   ------------------------------------------------- */
jest.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: ShadLabelProps) => (
    <label data-testid="shad-label" {...props}>
      {children}
    </label>
  ),
}));

/* -------------------------------------------------
   4. Tests – no `any`, full type safety
   ------------------------------------------------- */
describe("Input component", () => {
  it("renders without crashing", () => {
    render(<Input />);
    expect(screen.getByTestId("shad-input")).toBeInTheDocument();
  });

  it("renders a label when provided", () => {
    render(<Input label="Username" />);
    const label = screen.getByTestId("shad-label");
    expect(label).toHaveTextContent("Username");
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
    expect(ref.current).not.toBeNull();
  });
});

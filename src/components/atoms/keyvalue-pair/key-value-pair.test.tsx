import React from "react";
import { render, screen } from "@testing-library/react";
import KeyValue from "./index";

describe("KeyValue component", () => {
  it("renders the label text", () => {
    render(
      <KeyValue label={{ value: "Username" }}>
        <span>John Doe</span>
      </KeyValue>
    );
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renders the children correctly", () => {
    render(
      <KeyValue label={{ value: "Email" }}>
        <span>john@example.com</span>
      </KeyValue>
    );
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("applies the label className", () => {
    render(
      <KeyValue label={{ value: "Status", className: "text-green-500" }}>
        <span>Active</span>
      </KeyValue>
    );
    const label = screen.getByText("Status");
    expect(label).toHaveClass("text-green-500");
  });
});

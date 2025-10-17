import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelect } from "./index";

describe("MultiSelect Component", () => {
  const items = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "User", value: "user" },
  ];

  it("renders label and placeholder", () => {
    render(
      <MultiSelect items={items} label="Roles" placeholder="Select roles" />
    );
    expect(screen.getByText("Roles")).toBeInTheDocument();
    expect(screen.getByText("Select roles")).toBeInTheDocument();
  });

  it("opens and closes the popover", async () => {
    render(<MultiSelect items={items} />);
    const triggerButton = screen.getByRole("button");
    await userEvent.click(triggerButton);
    expect(screen.getByText("Admin")).toBeInTheDocument();

    // Click again to close
    await userEvent.click(triggerButton);
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("calls onChange when an item is selected", async () => {
    const handleChange = jest.fn();
    render(<MultiSelect items={items} onChange={handleChange} />);

    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    await userEvent.click(screen.getByText("Admin"));

    expect(handleChange).toHaveBeenCalledWith(["admin"]);
  });
  it("toggles item off when clicked again", async () => {
    const handleChange = jest.fn();
    render(
      <MultiSelect items={items} value={["admin"]} onChange={handleChange} />
    );

    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);

    // Multiple "Admin" elements exist (badge + option)
    const adminOptions = screen.getAllByText(/admin/i);
    // Click the one inside the dropdown (last match)
    await userEvent.click(adminOptions[adminOptions.length - 1]);

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it("disables options when max selection reached", async () => {
    const handleChange = jest.fn();
    render(
      <MultiSelect
        items={items}
        value={["admin", "manager"]}
        onChange={handleChange}
        max={2}
      />
    );

    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);

    const userOption = screen.getByText("User");
    expect(userOption).toHaveClass("cursor-not-allowed");

    await userEvent.click(userOption);
    expect(handleChange).not.toHaveBeenCalledWith(
      expect.arrayContaining(["user"])
    );
  });

  it("renders selected values as badges", () => {
    render(<MultiSelect items={items} value={["admin", "user"]} />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("shows placeholder when no value is selected", () => {
    render(<MultiSelect items={items} placeholder="Choose something" />);
    expect(screen.getByText("Choose something")).toBeInTheDocument();
  });
});

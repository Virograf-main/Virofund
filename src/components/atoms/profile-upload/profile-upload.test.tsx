import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProfilePicture } from "./index";

describe("ProfilePicture Component", () => {
  it("renders camera icon when no image is provided", () => {
    render(<ProfilePicture />);

    // There should be no <img> tag yet
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    // Verify Lucide camera icon is rendered
    const cameraIcon = document.querySelector("svg.lucide-camera");
    expect(cameraIcon).toBeInTheDocument();
  });

  it("renders image preview when value prop is provided", () => {
    render(<ProfilePicture value="https://example.com/profile.jpg" />);
    const img = screen.getByAltText("Profile");
    expect(img).toHaveAttribute("src", "https://example.com/profile.jpg");
  });

  it("opens file input when clicked", () => {
    const { container } = render(<ProfilePicture />);
    const div = container.querySelector("div.cursor-pointer");
    const input = container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    const clickSpy = jest.spyOn(input, "click");

    fireEvent.click(div!);
    expect(clickSpy).toHaveBeenCalled();
  });

  it("calls onChange with selected file", async () => {
    const handleChange = jest.fn();
    const { container } = render(<ProfilePicture onChange={handleChange} />);
    const input = container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;

    // mock a file
    const file = new File(["dummy"], "avatar.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(file);
    });
  });
});

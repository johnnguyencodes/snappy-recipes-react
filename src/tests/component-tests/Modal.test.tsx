import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "../../components/app/Modal";
import { describe, it, expect, vi } from "vitest";

describe("Modal Component", () => {
  it("renders the Modal Component when open", () => {
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Mock Modal Title">
        <p>Mock modal content</p>
      </Modal>
    );

    expect(screen.getByText("Mock Modal Title")).toBeInTheDocument();
    expect(screen.getByText("Mock modal content")).toBeInTheDocument();
  });

  it("does not render the Modal when it is not open", () => {
    const mockOnClose = vi.fn();

    const { queryByText } = render(
      <Modal isOpen={false} onClose={mockOnClose} title="Mock Modal Title">
        <p>Mock modal content</p>
      </Modal>
    );

    expect(queryByText("Mock Modal Title")).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Mock Modal Title">
        <p>Mock modal content</p>
      </Modal>
    );

    const closeButton = screen.getByTestId("closeModal");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});

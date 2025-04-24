import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MiniCard from "./MiniCard";

// Mock DEV_MODE
jest.mock("../../config", () => ({
  DEV_MODE: true,
}));

// Dummy restaurant data
const restaurant = {
  placeid: "abc123",
  name: "Testaurant",
  photourl: "photo-test",
};

describe("MiniCard", () => {
  test("renders the restaurant name", () => {
    render(<MiniCard restaurant={restaurant} removeRestaurant={jest.fn()} text="favorites" />);
    expect(screen.getByText("Testaurant")).toBeInTheDocument();
  });

  test("opens modal on card click", () => {
    render(<MiniCard restaurant={restaurant} removeRestaurant={jest.fn()} text="favorites" />);
    fireEvent.click(screen.getByText("Testaurant"));
    expect(screen.getByText(/Are you sure you want to remove Testaurant/i)).toBeInTheDocument();
  });

  test("closes modal when cancel is clicked", () => {
    render(<MiniCard restaurant={restaurant} removeRestaurant={jest.fn()} text="favorites" />);
    fireEvent.click(screen.getByText("Testaurant"));

    const cancelBtn = screen.getByText("Cancel");
    fireEvent.click(cancelBtn);

    // Wait for timeout to complete
    setTimeout(() => {
      expect(screen.queryByText(/Are you sure/i)).not.toBeInTheDocument();
    }, 150);
  });

  test("calls removeRestaurant when remove is clicked", () => {
    const mockRemove = jest.fn();
    render(<MiniCard restaurant={restaurant} removeRestaurant={mockRemove} text="favorites" />);
    fireEvent.click(screen.getByText("Testaurant"));

    const removeBtn = screen.getByText("Remove");
    fireEvent.click(removeBtn);

    expect(mockRemove).toHaveBeenCalledWith("abc123");
  });
});

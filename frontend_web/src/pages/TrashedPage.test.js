import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TrashedPage from "./TrashedPage";
import { MemoryRouter } from "react-router-dom";

// Mock MiniCard and Button
jest.mock("../components/FavoritesTrashedSharedComponents/MiniCard", () => (props) => (
  <div data-testid="mini-card">{props.restaurant.name}</div>
));

jest.mock("../components/Button", () => (props) => (
  <button onClick={props.onClick}>{props.text}</button>
));

describe("TrashedPage", () => {
  const trashed = [
    { name: "Boring Tacos", placeid: "1" },
    { name: "Unimpressive Ramen", placeid: "2" },
  ];

  const setup = (overrideProps = {}) => {
    const props = {
      trashedRestaurants: trashed,
      clearTrashed: jest.fn(),
      loadTrashed: jest.fn(),
      loggedIn: true,
      isLoading: false,
      deleteRestaurantFromTrashed: jest.fn(),
      ...overrideProps,
    };

    render(
      <MemoryRouter>
        <TrashedPage {...props} />
      </MemoryRouter>
    );

    return props;
  };

  test("shows login prompt if not logged in", () => {
    setup({ loggedIn: false });
    expect(screen.getByText(/Please log in/i)).toBeInTheDocument();
  });

  test("renders trashed restaurants", () => {
    setup();
    expect(screen.getByText("Boring Tacos")).toBeInTheDocument();
    expect(screen.getByText("Unimpressive Ramen")).toBeInTheDocument();
  });

  test("shows empty message when no trashed restaurants", () => {
    setup({ trashedRestaurants: [] });
    expect(screen.getByText(/props to you for not being picky/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Swiping/i)).toBeInTheDocument();
  });

  test("clicking 'Clear Trashed' opens confirmation modal", () => {
    setup();
    fireEvent.click(screen.getByText("Clear Trashed"));
    expect(screen.getByText(/Are you sure you want to clear your trash/i)).toBeInTheDocument();
  });

  test("clicking 'Yes' clears trashed", async () => {
    const props = setup();
    fireEvent.click(screen.getByText("Clear Trashed"));
    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(props.clearTrashed).toHaveBeenCalled();
    });
  });

  test("clicking 'Cancel' closes the modal", async () => {
    setup();
    fireEvent.click(screen.getByText("Clear Trashed"));
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByText(/Are you sure you want to clear your trash/i)).not.toBeInTheDocument();
    });
  });

  test("clicking 'Back to Swiping' logs action", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    setup({ trashedRestaurants: [] });
    fireEvent.click(screen.getByText("Back to Swiping"));
    expect(consoleSpy).toHaveBeenCalledWith("swipeClick");
    consoleSpy.mockRestore();
  });
});

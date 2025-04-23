import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FavoritesPage from "./FavoritesPage";
import { MemoryRouter } from "react-router-dom";

// Mock MiniCard component
jest.mock("../components/FavoritesTrashedSharedComponents/MiniCard", () => (props) => (
  <div data-testid="mini-card">{props.restaurant.name}</div>
));

// Mock Button
jest.mock("../components/Button", () => (props) => (
  <button onClick={props.onClick}>{props.text}</button>
));

describe("FavoritesPage", () => {
  const mockRestaurants = [
    { name: "Sushi Town", placeid: "1" },
    { name: "Burger Shack", placeid: "2" },
  ];

  const setup = (propsOverride = {}) => {
    const props = {
      likedRestaurants: mockRestaurants,
      clearFavorites: jest.fn(),
      loadFavorites: jest.fn(),
      loggedIn: true,
      isLoading: false,
      deleteRestaurantFromFavorites: jest.fn(),
      ...propsOverride,
    };

    render(
      <MemoryRouter>
        <FavoritesPage {...props} />
      </MemoryRouter>
    );

    return props;
  };

  test("shows login prompt if not logged in", () => {
    setup({ loggedIn: false });
    expect(screen.getByText(/Please log in/i)).toBeInTheDocument();
  });

  test("renders liked restaurants", () => {
    setup();
    expect(screen.getByText("Sushi Town")).toBeInTheDocument();
    expect(screen.getByText("Burger Shack")).toBeInTheDocument();
  });

  test("shows empty message when no favorites", () => {
    setup({ likedRestaurants: [] });
    expect(screen.getByText(/it's lonely in here/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Swiping/i)).toBeInTheDocument();
  });

  test("clicking 'Clear Favorites' shows confirmation modal", () => {
    setup();
    fireEvent.click(screen.getByText("Clear Favorites"));
    expect(screen.getByText("Are you sure you want to clear all favorites?")).toBeInTheDocument();
  });

  test("clicking 'Yes' calls clearFavorites", async () => {
    const props = setup();
    fireEvent.click(screen.getByText("Clear Favorites"));
    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(props.clearFavorites).toHaveBeenCalled();
    });
  });

  test("clicking 'Cancel' closes the modal", async () => {
    setup();
    fireEvent.click(screen.getByText("Clear Favorites"));
    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByText("Are you sure you want to clear all favorites?")).not.toBeInTheDocument();
    });
  });

  test("Start Swiping navigates to home", () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    setup({ likedRestaurants: [] });

    fireEvent.click(screen.getByText("Start Swiping"));
    expect(consoleLogSpy).toHaveBeenCalledWith("swipeClick");

    consoleLogSpy.mockRestore();
  });
});

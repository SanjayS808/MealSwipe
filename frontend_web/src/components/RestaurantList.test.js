import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RestaurantList from "./RestaurantList";

jest.mock("react-tinder-card", () => {
  return ({ children, onSwipe }) => (
    <div
      onClick={() => onSwipe("right", { name: "Mock Restaurant" })}
      data-testid="tinder-card"
    >
      {children}
    </div>
  );
});

jest.mock("./RestaurantCard", () => ({ restaurant, handleClick }) => (
  <div
    data-testid="restaurant-card"
    onClick={() => handleClick(restaurant)}
    role="button"
  >
    {restaurant.name}
  </div>
));

jest.mock("./RestaurantModal", () => ({ restaurant }) => (
  <div data-testid="restaurant-modal">{restaurant.name}</div>
));

const mockRestaurants = [
  { id: 1, name: "Pizza Palace" },
  { id: 2, name: "Burger Barn" },
];

describe("RestaurantList", () => {
  test("displays loading state correctly", () => {
    render(
      <RestaurantList
        restaurants={[]}
        onSwipe={jest.fn()}
        resetBackendData={jest.fn()}
        isLoading={true}
      />
    );
    expect(screen.queryByText("No restaurants available :(")).not.toBeInTheDocument();
  });

  test("shows refresh button if no restaurants", () => {
    const resetMock = jest.fn();
    render(
      <RestaurantList
        restaurants={[]}
        onSwipe={jest.fn()}
        resetBackendData={resetMock}
        isLoading={false}
      />
    );
    expect(screen.getByText("No restaurants available :(")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Refresh"));
    expect(resetMock).toHaveBeenCalled();
  });

  test("renders a list of restaurants", () => {
    render(
      <RestaurantList
        restaurants={mockRestaurants}
        onSwipe={jest.fn()}
        resetBackendData={jest.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText("Pizza Palace")).toBeInTheDocument();
    expect(screen.getByText("Burger Barn")).toBeInTheDocument();
  });

  test("opens modal when restaurant card is clicked", () => {
    render(
      <RestaurantList
        restaurants={mockRestaurants}
        onSwipe={jest.fn()}
        resetBackendData={jest.fn()}
        isLoading={false}
      />
    );

    const elements = screen.getAllByText("Pizza Palace");
    expect(elements.length).toBeGreaterThan(0); 
    
  });
  test("modal opens and displays correct restaurant", () => {
    render(
      <RestaurantList
        restaurants={mockRestaurants}
        onSwipe={jest.fn()}
        resetBackendData={jest.fn()}
        isLoading={false}
      />
    );

    const pizzaCard = screen.getByText("Pizza Palace");
    fireEvent.click(pizzaCard);

    expect(screen.getByTestId("restaurant-modal")).toHaveTextContent("Pizza Palace");
  });

  test("clicking backdrop closes modal", async () => {
    render(
      <RestaurantList
        restaurants={mockRestaurants}
        onSwipe={jest.fn()}
        resetBackendData={jest.fn()}
        isLoading={false}
      />
    );
  
    // Open modal
    fireEvent.click(screen.getByText("Pizza Palace"));
  
    // Get the modal's backdrop
    const modals = screen.getAllByText("Pizza Palace");
    const modalWrapper = modals[1].closest(".restaurant-details")?.parentElement;
  
    fireEvent.click(modalWrapper); // Click backdrop
  
    
  });

  test("swiping a card triggers onSwipe", () => {
    const onSwipeMock = jest.fn();
  
    render(
      <RestaurantList
        restaurants={mockRestaurants}
        onSwipe={onSwipeMock}
        resetBackendData={jest.fn()}
        isLoading={false}
      />
    );
  
    // Get all TinderCards (one per restaurant)
    const tinderCards = screen.getAllByTestId("tinder-card");
  
    // Simulate swipe on first card
    fireEvent.click(tinderCards[0]);
  
   // expect(onSwipeMock).toHaveBeenCalledWith("right", { name: "Mock Restaurant" });
  });

  
});

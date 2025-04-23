import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RestaurantCard from "../components/RestaurantCard";

// Mock the lucide-react icons
jest.mock("lucide-react", () => ({
  MapPin: () => <div data-testid="icon-mappin" />,
  Globe: () => <div data-testid="icon-globe" />,
  Phone: () => <div data-testid="icon-phone" />,
  Info: () => <div data-testid="icon-info" />,
}));
jest.mock("../components/Google_Maps_icon_2020.svg", () => "googlemapsIcon");

describe("RestaurantCard", () => {
  const mockRestaurant = {
    name: "Testaurant",
    imageUrl: "image.jpg",
    distanceFromUser: 1.2,
    rating: 4.2,
    ratingsCount: 85,
    price: "PRICE_LEVEL_EXPENSIVE",
    googleMapsLink: "https://maps.test",
    website: "https://restaurant.test",
    phoneNumber: "1234567890",
  };

  const mockHandleClick = jest.fn();

  beforeEach(() => {
    render(<RestaurantCard restaurant={mockRestaurant} handleClick={mockHandleClick} />);
  });

  test("renders restaurant name and distance", () => {
    expect(screen.getByText(/Testaurant/)).toBeInTheDocument();
    expect(screen.getByText(/1.2 miles/)).toBeInTheDocument();
  });

  test("renders star rating and reviews", () => {
    expect(screen.getByText(/85 reviews/)).toBeInTheDocument();
  });

  test("renders correct price level", () => {
    expect(screen.getByText("$$$"))?.toBeInTheDocument();
  });

  test("has clickable info button", () => {
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockHandleClick).toHaveBeenCalled();
  });

  test("double clicking card triggers handleClick", () => {
    const card = screen.getByText("Testaurant").closest(".card");
    fireEvent.doubleClick(card);
    expect(mockHandleClick).toHaveBeenCalled();
  });
});

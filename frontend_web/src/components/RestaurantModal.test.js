import React from "react";
import { render, screen } from "@testing-library/react";
import RestaurantModal from "./RestaurantModal";

// Mock subcomponents
jest.mock("./ModalComponents/ReviewCarousel", () => () => <div data-testid="review-carousel" />);
jest.mock("./ModalComponents/OpeningHours", () => () => <div data-testid="opening-hours" />);

// Mock icons from lucide-react
jest.mock("lucide-react", () => ({
  MapPin: () => <div data-testid="map-pin" />,
  Globe: () => <div data-testid="globe" />,
  Phone: () => <div data-testid="phone" />,
}));

// Mock StarRating
jest.mock("./StarRating", () => () => <div data-testid="star-rating" />);

const mockRestaurant = {
  name: "Testaurant",
  address: "123 Flavor St",
  imageUrl: "https://example.com/photo.jpg",
  distanceFromUser: 3.2,
  rating: 4.5,
  ratingsCount: 120,
  price: "PRICE_LEVEL_MODERATE",
  googleMapsLink: "https://maps.google.com",
  website: "https://testaurant.com",
  phoneNumber: "123-456-7890",
  generativeSummary: "This is a lovely restaurant summary.",
  cuisineType: "Italian",
  reviews: [],
  openingHours: [],
};

describe("RestaurantModal", () => {
  test("renders restaurant info correctly", () => {
    render(<RestaurantModal restaurant={mockRestaurant} />);
    
    expect(screen.getByText("Testaurant")).toBeInTheDocument();
    expect(screen.getByText("123 Flavor St")).toBeInTheDocument();
    expect(screen.getByText("This is a lovely restaurant summary.")).toBeInTheDocument();
    expect(screen.getByText("3.2 miles")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument(); // Ratings count
    expect(screen.getByText("$$")).toBeInTheDocument();  // Price
    expect(screen.getByTestId("star-rating")).toBeInTheDocument();
  });

  test("renders contact links and icons", () => {
    render(<RestaurantModal restaurant={mockRestaurant} />);
    
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", mockRestaurant.googleMapsLink);
    expect(links[1]).toHaveAttribute("href", mockRestaurant.website);
    expect(links[2]).toHaveAttribute("href", `tel:${mockRestaurant.phoneNumber}`);
  });

  test("renders carousel and opening hours", () => {
    render(<RestaurantModal restaurant={mockRestaurant} />);
    expect(screen.getByTestId("review-carousel")).toBeInTheDocument();
    expect(screen.getByTestId("opening-hours")).toBeInTheDocument();
  });
  test("renders all price levels correctly", () => {
    const priceLevels = {
      PRICE_LEVEL_INEXPENSIVE: "$",
      PRICE_LEVEL_MODERATE: "$$",
      PRICE_LEVEL_EXPENSIVE: "$$$",
      PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
    };
  
    for (const [price, symbol] of Object.entries(priceLevels)) {
      render(<RestaurantModal restaurant={{ ...mockRestaurant, price }} />);
      expect(screen.getByText(symbol)).toBeInTheDocument();
    }
  });
  
  test("renders fallback gracefully when optional links are missing", () => {
    const modified = {
      ...mockRestaurant,
      googleMapsLink: null,
      website: null,
      phoneNumber: null,
    };
  
    render(<RestaurantModal restaurant={modified} />);
    expect(screen.queryByTestId("map-pin")).not.toBeInTheDocument();
    expect(screen.queryByTestId("globe")).not.toBeInTheDocument();
    expect(screen.queryByTestId("phone")).not.toBeInTheDocument();
  });
  
  test("does not crash when price is unexpected", () => {
    const modified = {
      ...mockRestaurant,
      price: "PRICE_UNKNOWN",
    };
  
    render(<RestaurantModal restaurant={modified} />);
    expect(screen.queryByText("$")).not.toBeInTheDocument();
    expect(screen.queryByText("$$")).not.toBeInTheDocument();
    expect(screen.queryByText("$$$")).not.toBeInTheDocument();
    expect(screen.queryByText("$$$$")).not.toBeInTheDocument();
  });
  
  test("renders image with correct src and alt text", () => {
    render(<RestaurantModal restaurant={mockRestaurant} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockRestaurant.imageUrl);
    expect(img).toHaveAttribute("alt", mockRestaurant.name);
  });
  
  test("renders cuisine type", () => {
    render(<RestaurantModal restaurant={mockRestaurant} />);
    expect(screen.getByText(mockRestaurant.cuisineType)).toBeInTheDocument();
  });
});

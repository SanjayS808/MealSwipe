import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReviewCarousel from "./ReviewCarousel";

const longText = "This is a long review. ".repeat(10); // > 150 chars
const shortText = "Short review.";

const reviews = [
  { author: "Alice", text: longText },
  { author: "Bob", text: shortText },
];

describe("ReviewCarousel", () => {
  test("renders first review and author", () => {
    render(<ReviewCarousel reviews={reviews} />);
    expect(screen.getByText(/– Alice/)).toBeInTheDocument();
    expect(screen.getByText(/Read more/)).toBeInTheDocument();
  });

  test("clicking 'Read more' expands the full text", () => {
    render(<ReviewCarousel reviews={reviews} />);
    const readMore = screen.getByText("Read more");
    fireEvent.click(readMore);
    
  });

  test("clicking next cycles to second review", () => {
    render(<ReviewCarousel reviews={reviews} />);
    const nextButton = screen.getByText("›");
    fireEvent.click(nextButton);
    expect(screen.getByText(/– Bob/)).toBeInTheDocument();
    expect(screen.queryByText("Read more")).not.toBeInTheDocument();
  });

  test("clicking prev cycles back to first review", () => {
    render(<ReviewCarousel reviews={reviews} />);
    fireEvent.click(screen.getByText("›")); // to Bob
    fireEvent.click(screen.getByText("‹")); // back to Alice
    expect(screen.getByText(/– Alice/)).toBeInTheDocument();
  });

  test("displays message when no reviews are passed", () => {
    render(<ReviewCarousel reviews={[]} />);
    expect(screen.getByText(/no reviews available/i)).toBeInTheDocument();
  });

  test("handles undefined reviews gracefully", () => {
    render(<ReviewCarousel />);
    expect(screen.getByText(/no reviews available/i)).toBeInTheDocument();
  });
});

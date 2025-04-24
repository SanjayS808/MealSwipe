import React from "react";
import { render, screen } from "@testing-library/react";
import Loader from "./Loader";

describe("Loader Component", () => {
  test("renders the SVG pizza loader and 'Loading...' text", () => {
    render(<Loader />);
    
    // Check for SVG element
    const svg = screen.getByRole("img", { hidden: true });
    expect(svg).toBeInTheDocument();

    // Check for "Loading..." text
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("container uses correct class for animation styling", () => {
    render(<Loader />);
    const container = screen.getByText(/loading/i).parentElement;
    expect(container).toHaveClass("mainPizza");
  });
});

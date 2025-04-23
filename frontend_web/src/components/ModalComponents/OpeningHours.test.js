import React from "react";
import { render, screen } from "@testing-library/react";
import OpeningHours from "./OpeningHours";

describe("OpeningHours", () => {
  test("displays 'Open 24/7' for 24/7 open hours", () => {
    const mockHours = [
      { open: { day: 0, hour: 0, minute: 0 } } // No close key
    ];

    render(<OpeningHours openingHours={mockHours} />);

    expect(screen.getByText("Sunday:")).toBeInTheDocument();
    
  });

  test("displays formatted open-close time for a specific day", () => {
    const mockHours = [
      {
        open: { day: 1, hour: 10, minute: 30 },
        close: { day: 1, hour: 22, minute: 0 },
      },
    ];

    render(<OpeningHours openingHours={mockHours} />);

    expect(screen.getByText("Monday:")).toBeInTheDocument();
    
  });

  test("displays '– 24 Hours' if close is missing for a day", () => {
    const mockHours = [
      {
        open: { day: 2, hour: 8, minute: 0 },
      },
    ];

    render(<OpeningHours openingHours={mockHours} />);

    expect(screen.getByText("Tuesday:")).toBeInTheDocument();
   
  });

  test("displays default time when hour or minute is missing", () => {
    const mockHours = [
      {
        open: { day: 3 },
        close: { day: 3 },
      },
    ];

    render(<OpeningHours openingHours={mockHours} />);

    expect(screen.getByText("Wednesday:")).toBeInTheDocument();
    
  });

  test("renders all 7 days", () => {
    const mockHours = [
      {
        open: { day: 0, hour: 8, minute: 0 },
        close: { day: 0, hour: 20, minute: 0 },
      },
    ];

    render(<OpeningHours openingHours={mockHours} />);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    days.forEach((day) => {
      expect(screen.getByText(`${day}:`)).toBeInTheDocument();
    });
  });
});

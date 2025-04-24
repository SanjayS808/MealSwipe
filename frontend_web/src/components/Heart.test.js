import React, { useRef } from "react";
import { render, screen, act } from "@testing-library/react";
import Heart from "./Heart";

// Helper wrapper to test the `ref` behavior
const TestWrapper = () => {
  const ref = useRef();
  return (
    <>
      <button onClick={() => ref.current.flash()}>Trigger</button>
      <Heart ref={ref} />
    </>
  );
};

describe("HeartFlash Component", () => {
  test("should not be visible initially", () => {
    render(<Heart />);
    const heart = screen.queryByTestId("heart-icon");
    expect(heart).not.toBeInTheDocument();
  });

  test("flashes the heart when flash() is called", () => {
    jest.useFakeTimers();

    render(<TestWrapper />);

    // Trigger flash
    const trigger = screen.getByRole("button", { name: /trigger/i });
    act(() => {
      trigger.click();
    });

    // Heart should now be visible
    const heart = screen.getByTestId("heart-icon");
    expect(heart).toBeInTheDocument();

    // Advance the timer to hide it again
    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(screen.queryByTestId("heart-icon")).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPic from "./LoginPic";
import { MemoryRouter } from "react-router-dom";
import UserContext from "../context/UserContext";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoginPic Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("navigates to /profile if user is logged in", () => {
    const user = { name: "Sanjay", picture: "test.jpg" };

    render(
      <UserContext.Provider value={{ user }}>
        <MemoryRouter>
          <LoginPic />
        </MemoryRouter>
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByRole("img")); // click on profile pic
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  test("navigates to /login if user is not logged in", () => {
    render(
      <UserContext.Provider value={{ user: null }}>
        <MemoryRouter>
          <LoginPic />
        </MemoryRouter>
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByText("Login")); // click on fallback text
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});

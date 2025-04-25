import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "./ProfilePage";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

// Mock navigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock ProfileEditPopup
jest.mock("./ProfileEditPopup", () => ({ onClose }) => (
  <div data-testid="popup">Edit Popup<button onClick={onClose}>Close</button></div>
));

describe("ProfilePage", () => {
  const mockUser = {
    name: "Sanjay Sugumar",
    email: "sanjay@example.com",
    picture: null,
  };

  const mockSetUser = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  const renderPage = () => {
    return render(
      <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </UserContext.Provider>
    );
  };

  test("renders profile page with user info", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ userid: "uid123" }],
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ numswipes: 42 }],
    });

    renderPage();

    expect(await screen.findByText(/Sanjay Sugumar/)).toBeInTheDocument();
    expect(screen.getByText(/@sanjay@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/College Station TX/)).toBeInTheDocument();
    expect(await screen.findByText("42")).toBeInTheDocument();
  });

  test("shows zero swipes if swipe data is empty", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [{ userid: "uid123" }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    renderPage();

    expect(await screen.findByText("0")).toBeInTheDocument();
  });

  test("calls logout and navigates to home", () => {
    renderPage();

    const logoutBtn = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutBtn);

    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("opens popup on gear icon click", () => {
    renderPage();

    const gear = screen.getByText("⚙️");
    fireEvent.click(gear);

    expect(screen.getByTestId("popup")).toBeInTheDocument();
  });

  test("fetch calls are made on mount", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [{ userid: "uid456" }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ numswipes: 99 }] });

    renderPage();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("get-userid-with-uname"));
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("get-swipes"));
    });
  });
});

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { UserProvider, useUser } from "./UserContext";

// Helper to render hook with context
const renderUserHook = () => {
  const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;
  return renderHook(() => useUser(), { wrapper });
};

describe("UserContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("initially loads user from localStorage", () => {
    const mockUser = { name: "Test User", email: "test@example.com" };
    localStorage.setItem("user", JSON.stringify(mockUser));

    const { result } = renderUserHook();
    expect(result.current.user).toEqual(mockUser);
  });

  test("setUser updates user and localStorage", () => {
    const { result } = renderUserHook();

    act(() => {
      result.current.setUser({ name: "New", email: "new@example.com" });
    });

    expect(result.current.user.name).toBe("New");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual({
      name: "New",
      email: "new@example.com",
    });
  });

  test("updateName and updateEmail work", () => {
    const { result } = renderUserHook();

    act(() => {
      result.current.setUser({ name: "Old", email: "old@example.com" });
    });

    act(() => {
      result.current.updateName("UpdatedName");
      result.current.updateEmail("new@example.com");
    });

    expect(result.current.user.name).toBe("UpdatedName");
    expect(result.current.user.email).toBe("new@example.com");
  });

  test("incrementSwipes and getSwipes update correctly", () => {
    const { result } = renderUserHook();

    act(() => {
      result.current.incrementSwipes();
      result.current.incrementSwipes();
    });

    expect(result.current.getSwipes()).toBe(2);
    expect(localStorage.getItem("swipes")).toBe("2");
  });

  test("throws error if useUser used outside provider", () => {
    const { result } = renderHook(() => {
      try {
        return useUser();
      } catch (error) {
        return error;
      }
    });

    expect(result.current.message).toBe("useUser must be used within a UserProvider");
  });
});

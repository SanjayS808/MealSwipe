import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './Login';

// ✅ Mock GoogleLoginButton and react-router-dom Link
jest.mock('./GoogleLoginButton', () => () => <div data-testid="google-login-button" />);
jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props} data-testid="link">
      {children}
    </a>
  ),
}));

describe("Login Component", () => {
  test("renders welcome message and description", () => {
    render(<Login />);
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByText(/discover restaurants around your area/i)).toBeInTheDocument();
  });

  test("renders MealSwipe brand and Create Account text", () => {
    render(<Login />);
    expect(screen.getByText(/MealSwipe/i)).toBeInTheDocument();
    const elements = screen.getAllByText(/Create Account/i);
    expect(elements.length).toBeGreaterThan(1);
  });

  test("renders Google login button", () => {
    render(<Login />);
    expect(screen.getByTestId("google-login-button")).toBeInTheDocument();
  });

  test("renders 'Create Account' and 'Login' UI elements", () => {
    render(<Login />);
    const elements = screen.getAllByText(/Create Account/i);
    expect(elements.length).toBeGreaterThan(1);
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders close button link", () => {
    render(<Login />);
    const closeLink = screen.getByTestId("link");
    expect(closeLink).toHaveAttribute("href", "/");
    expect(screen.getByText("×")).toBeInTheDocument();
  });
});

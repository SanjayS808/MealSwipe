import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import GoogleLoginButton from './GoogleLoginButton';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';

// Mock all external dependencies
jest.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, onError }) => (
    <button onClick={() => onSuccess({ credential: 'mocked-token' })} data-testid="google-login-button">
      Google Login
    </button>
  ),
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../context/UserContext', () => ({
  useUser: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('GoogleLoginButton', () => {
  const mockNavigate = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useUser.mockReturnValue({ user: null, setUser: mockSetUser });
  });

  it('renders the GoogleLogin button', () => {
    const { getByTestId } = render(<GoogleLoginButton />);
    expect(getByTestId('google-login-button')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockDecodedToken = {
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'http://example.com/pic.jpg',
    };
    
    jwtDecode.mockReturnValue(mockDecodedToken);

    fetch.mockResolvedValueOnce({ ok: true });

    const { getByTestId } = render(<GoogleLoginButton />);

    fireEvent.click(getByTestId('google-login-button'));

    await waitFor(() => {
      expect(jwtDecode).toHaveBeenCalledWith('mocked-token');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/serve/add-user'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String),
        })
      );
      expect(mockSetUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        bio: "Hi! I am new to MealSwipe.",
        picture: 'http://example.com/pic.jpg',
        nswipes: 0,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles token decoding error', async () => {
    jwtDecode.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const { getByTestId } = render(<GoogleLoginButton />);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    fireEvent.click(getByTestId('google-login-button'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error decoding Google token:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  
});

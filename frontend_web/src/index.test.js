import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';

// Mock the full App tree
jest.mock('./App', () => () => <div data-testid="mock-app">Mock App</div>);
jest.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => <div data-testid="google-provider">{children}</div>,
}));

// Make sure to isolate each test DOM
beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>';
});

test('renders app inside all providers without crashing', async () => {
  const { default: App } = await import('./App');
  const { UserProvider } = await import('./context/UserContext');
  const { BrowserRouter } = await import('react-router-dom');
  const { GoogleOAuthProvider } = await import('@react-oauth/google');

  process.env.REACT_APP_GOOGLE_WEB_CLIENT_ID = 'test-client-id';

  const root = ReactDOM.createRoot(document.getElementById('root'));

  act(() => {
    root.render(
      <BrowserRouter>
        <GoogleOAuthProvider clientId="test-client-id">
          <UserProvider>
            <App />
          </UserProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    );
  });

  // Use standard DOM API to verify it rendered
  expect(document.querySelector('[data-testid="mock-app"]')).not.toBeNull();
});

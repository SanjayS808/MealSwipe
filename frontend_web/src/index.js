import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './context/UserContext';
import { BrowserRouter } from 'react-router-dom'

// Google OAuth 2.0 Signin 
import { GoogleOAuthProvider } from '@react-oauth/google';

const google_client_id = process.env.REACT_APP_GOOGLE_WEB_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId={google_client_id}>
  <React.StrictMode>
  <UserProvider>
    <App />
  </UserProvider>
  </React.StrictMode>
  </GoogleOAuthProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

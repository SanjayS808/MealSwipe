import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


export const GoogleLoginButton = () => {
  const responseMessage = (response) => {
    console.log('Login Success:', response);
    
    try {
      // Decode the credential to get user information
      const decoded = jwtDecode(response.credential);
      
      console.log('Decoded User Info:', {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });

      // Produce user
      // At end navigate back to home page.

    } catch (decodeError) {
      console.error('Error decoding Google token:', decodeError);
    }
  };

  const errorMessage = (error) => {
    console.error('Google Login Error:', {
      error: error.error,
      details: error.details,
      message: error.message
    });
  };

  return (
    <GoogleLogin
      onSuccess={responseMessage}
      onError={errorMessage}
      size="large"
      width="550"
      useOneTap
      auto_select={false}
    />
  );
};
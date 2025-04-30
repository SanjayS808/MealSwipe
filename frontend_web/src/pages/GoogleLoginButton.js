/**
 * @module Google-Button-Page
 * @requires React
 */

/**
 * @fileoverview Google OAuth logic and component for Logging in in a secure manner.
 */

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { DEV_MODE } from '../config'; 
import { useUser } from '../context/UserContext'; 

const backendURL = DEV_MODE ? "http://localhost:5001" : "https://backend.app-mealswipe.com";

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    /**
     * @function generateResponseMessage
     * @summary Handles successful login response from Google.
     * @description Decodes the credential, updates user context, and posts new user data to the backend.
     * @param {Object} response - Google login response containing credential token.
     */
    const responseMessage = async (response) => {
        console.log('Login Success:', response);

        try {
            const decoded = jwtDecode(response.credential);

            const body = {
                uname: decoded.name,
                ubio: "Hi! I am new to MealSwipe.",
                nswipe: 0,
                email: decoded.email,
            };

            const constUserInfo = {
                name: decoded.name,
                email: decoded.email,
                bio: "Hi! I am new to MealSwipe.",
                picture: decoded.picture,
                nswipes: 0,
            };

            let json_body = JSON.stringify(body);

            await fetch(`${backendURL}/api/serve/add-user`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json_body,
            });

            setUser(constUserInfo); 
            navigate('/');
        } catch (decodeError) {
            console.error('Error decoding Google token:', decodeError);
        }
    };

    /**
     * @function getErrorMessage
     * @summary Handles error response from Google login.
     * @param {Object} error - Error object from Google login failure.
     */
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
            width="10vw"
            useOneTap
            auto_select={false}
        />
    );
};

export default GoogleLoginButton;

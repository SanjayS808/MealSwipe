import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { DEV_MODE, user } from '../config';
import { useUser } from '../context/UserContext';

const backendURL = DEV_MODE 
  ? "http://localhost:5001"  
  : "http://MealSw-Backe-k0cJtOkGFP3i-29432626.us-west-1.elb.amazonaws.com";

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [cookies, setCookie] = useCookies(['authToken']);
    
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

            let json_body = JSON.stringify(body);

            await fetch(`${backendURL}/api/serve/add-user`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json_body,
            });

            setCookie('authToken', response.credential, {
                path: '/',
                httpOnly: false,
                secure: true,
                sameSite: 'Strict',
                maxAge: 3600,
            });

            setUser(body.uname);

            navigate('/');
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

export default GoogleLoginButton;

/** Express router providing user related routes
 * @module LogIn-Page
 * @requires React
 */

/**
 * @fileoverview Login component where the user is initially navigated. Contains all buttons and images to login.
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import pizzaimg from "./login-img/login-pizza.png";
import GoogleLoginButton from "./GoogleLoginButton";
import "./login.css"; // Assume you're using a CSS file for styling

const Login = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  /**
   * @function handleSloganClick
   * @summary Handles the click event on the slogan.
   * @description Triggers a swipe-out and swipe-in animation sequence.
   */
  const handleSloganClick = () => {
    setAnimationClass("swipe-out");

    setTimeout(() => {
      setAnimationClass("hidden-offscreen-left"); // jump off-screen to the left
      setTimeout(() => {
        setAnimationClass("swipe-in"); // animate back in from left
      }, 100); // brief delay
    }, 600); // match with swipe-out duration
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="welcome-back">
          <h2>MealSwipe!</h2>
          <h4 className={`slogan ${animationClass}`} onClick={handleSloganClick}>
            Meals you’ll love, one swipe away.
          </h4>
          <img
            src={pizzaimg}
            alt="Pizza"
            style={{ width: "80%", maxWidth: "400px", borderRadius: "10px" }}
          />
        </div>

        <div className="login-form">
          <p style={{ color: "red", fontWeight: "bold" }}>Create Account / Sign in</p>
          <GoogleLoginButton style={{ marginBottom: "1em" }} />
          <button
            onClick={() => navigate("/")}
            style={{
              width: "90%",
              padding: "0.75em",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Return to MealSwipe!
          </button>
          <button
            onClick={() => setShowInstructions(true)}
            style={{
              marginTop: "1em",
              backgroundColor: "#f0f0f0",
              border: "none",
              width: "90%",
              padding: "0.75em 1em",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#333"
            }}
          >
            How to Add MealSwipe to Home Screen (iOS)
          </button>
        </div>
      </div>

      {showInstructions && (
        <div style={styles.modalOverlayL}>
          <div style={styles.modalContentL}>
            <h2 style={styles.modalTitleL}>Add MealSwipe to Home Screen</h2>
            <p style={styles.modalTextL}>
              1. Open Safari and go to <strong>mealswipe.app</strong><br />
              2. Tap the <strong>Share</strong> icon (square with arrow)<br />
              3. Scroll down and tap <strong>"Add to Home Screen"</strong><br />
              4. Tap <strong>Add</strong> in the top-right corner
            </p>
            <button
              onClick={() => setShowInstructions(false)}
              style={styles.modalCloseButtonL}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  modalOverlayL: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1em'
  },
  modalContentL: {
    background: 'white',
    padding: '1.2em',
    borderRadius: '10px',
    maxWidth: '320px',
    width: '100%',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  modalTitleL: {
    fontSize: '1.2em',
    marginBottom: '0.6em'
  },
  modalTextL: {
    fontSize: '0.95em',
    marginBottom: '1em',
    lineHeight: '1.5'
  },
  modalCloseButtonL: {
    backgroundColor: 'red',
    color: 'white',
    padding: '0.4em 0.8em',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95em'
  }
};

export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import pizzaimg from "./login-img/login-pizza.png";
import GoogleLoginButton from "./GoogleLoginButton";
import "./login.css"; // Assume you're using a CSS file for styling

const Login = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

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
    <div style={{ padding: "10vh 10vw", overflow: "hidden" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", backgroundColor: "#000",height: "80%",borderRadius: "10px"}}>
        <div style={{  color: "white", padding: "1em", borderRadius: "10px", textAlign: "center", width: "100%",height: "100%" }}>
          <h1>Welcome Back!</h1>
          <p>Join us to discover restaurants around your area!</p>
          <img
            src={pizzaimg}
            alt="Pizza"
            style={{ width: "80%", maxWidth: "400px", marginTop: "1em", borderRadius: "10px" }}
          />
        </div>

        <div style={{ backgroundColor: "#fff", paddingLeft: "2em", paddingRight: "2em", padding: "1em", borderRadius: "10px", textAlign: "center", marginTop: "2em", width: "70%",marginBottom: "2em" ,paddingBottom: "2em"}}>
          <h2>MealSwipe!</h2>
          <h3 className={`slogan ${animationClass}`} onClick={handleSloganClick}>
            Meals you’ll love, one swipe away.
          </h3>

          <p style={{ color: "red", fontWeight: "bold" }}>Create Account / Sign in</p>
          <GoogleLoginButton style={{ marginBottom: "1em" }} />
          <button
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              padding: "0.75em",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "1em"
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
              width: "100%",
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
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Add MealSwipe to Home Screen</h2>
            <p style={styles.modalText}>
              1. Open Safari and go to <strong>mealswipe.app</strong><br />
              2. Tap the <strong>Share</strong> icon (square with arrow)<br />
              3. Scroll down and tap <strong>"Add to Home Screen"</strong><br />
              4. Tap <strong>Add</strong> in the top-right corner
            </p>
            <button
              onClick={() => setShowInstructions(false)}
              style={styles.modalCloseButton}
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
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    padding: '2em',
    borderRadius: '10px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center'
  },
  modalTitle: {
    marginBottom: '1em'
  },
  modalText: {
    fontSize: '1em',
    marginBottom: '1.5em',
    lineHeight: '1.6'
  },
  modalCloseButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: '0.5em 1em',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default Login;

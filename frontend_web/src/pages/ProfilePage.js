import React, { useEffect, useState, useCallback } from "react";
import ProfileEditPopup from "./ProfileEditPopup";
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom";
import { DEV_MODE } from "../config"

const backendURL = (DEV_MODE) ? "http://localhost:5001"  : "https://backend.app-mealswipe.com";

const ProfilePage = ({setUid}) => {
  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe123");
  const [location, setLocation] = useState("New York, USA");
  const [gender, setGender] = useState("Male");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const { user, setUser} = useUser();  
  const navigate = useNavigate();
  const [swipe, setSwipe] = useState();

  useEffect(() => {
    console.log(user);  
    if(user) {
      getSwipe();
    }
  }, [user]);

  const fetchuid = async () => {
    let response = await fetch(`${backendURL}/api/serve/get-userid-with-uname?uname=${user.name}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Backend error. Failed to fetch user information.");
      }
      return response.json();
    });
    return response[0].userid;
  };

  const getSwipe = async () => {
    try {
      const uid = await fetchuid();
      const swipe_res = await fetch(`${backendURL}/api/serve/get-swipes?uid=${uid}`);
      if (swipe_res.ok) {
        const data = await swipe_res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSwipe(data[0].numswipes);
        } else {
          console.warn("Swipe data is empty or not an array:", data);
          setSwipe(0);
        }
      } else {
        console.error("Swipe fetch failed");
      }
    } catch (err) {
      console.error("Failed to fetch swipes", err);
      setSwipe(0);
    }
  };

  const handleLogoutClick = () => {
    setUser(null);
    setUid(false);
    navigate('/');
  };
  
  const styles = {
    avatarWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      marginBottom: "-3rem", // Moves it up to overlap the container
    },
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#e9e9e9",
      minHeight: "100vh",
      minWidth: "100vw",
      justifyContent: "center",
      padding: "1.5rem",
    },
    profileSection: {
      backgroundColor: "white",
      width: "92%",
      maxWidth: "32rem",
      borderRadius: "0.5rem",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: "1.5rem",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    avatarContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    avatar: {
      width: "6rem",
      height: "6rem",
      backgroundColor: user?.picture ? "transparent" : "grey", // Conditional background color
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      fontWeight: "bold",
      borderRadius: "50%",
      backgroundImage: user?.picture ? `url(${user.picture})` : "none", // Conditional background image
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    editButton: {
      position: "absolute",
      bottom: "0.25rem",
      right: "0.25rem",
      backgroundColor: "gray",
      padding: "0.25rem",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
    },
    editProfileSection: {
      backgroundColor: "lightgray",
      width: "92%",
      maxWidth: "32rem",
      borderRadius: "0.5rem",
      padding: "1.5rem",
      marginTop: "1.5rem",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    sectionTitle: {
      fontSize: "1.125rem",
      fontWeight: "bold",
      marginBottom: ".1rem",
    },
    inputContainer: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: "600",
    },
    inputUnderline: {
      borderBottom: "1px solid black",
      width: "100%",
      height: "1.5rem",
    },
    gearIcon: {
      position: "absolute",
      top: "0",
      right: "-1.5rem",
      fontSize: "1.5rem",
      cursor: "pointer",
    },
    logout: {
      backgroundColor: "red",
      color: "white",
      padding: "10px 20px",
      borderRadius: "5px",
      marginTop: "20px",
      cursor: "pointer",
    }
  };

 return (
    <div style={styles.container}>
      <div style={styles.avatarWrapper}>
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}></div>
          <span
            style={styles.gearIcon}
            onClick={() => setPopupOpen(true)}
          >
            ⚙️
          </span>
        </div>
      </div>
      <div style={styles.editProfileSection}>

        <h3 style={styles.sectionTitle}>Username</h3>

        <div style={styles.inputContainer}>

        <h3>{user?.name ? user?.name : "TU"}</h3>

        <h3 style={styles.sectionTitle}>Email</h3>

        <p>@{user?.email}</p>

        <h3 style={styles.sectionTitle}>Location</h3>

        <p>College Station TX</p>

        <h3 style={styles.sectionTitle}>Swipes</h3>

        <p>{swipe}</p>
        </div>

        <button
        style={styles.logout}
        onClick={handleLogoutClick} // Call the logout function on click
      >
        Logout
      </button>
        
      </div>
      {isPopupOpen && (
        <ProfileEditPopup
          currentValues={{ name, username, location, gender }}
          setValues={(newValues) => {
            setName(newValues.name);
            setUsername(newValues.username);
            setLocation(newValues.location);
            setGender(newValues.gender);
          }}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </div>
  );
};


export default ProfilePage;

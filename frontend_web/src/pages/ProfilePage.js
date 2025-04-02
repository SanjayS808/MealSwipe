import React, { useEffect, useState, useCallback } from "react";
import ProfileEditPopup from "./ProfileEditPopup";

const ProfilePage = () => {
  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe123");
  const [location, setLocation] = useState("New York, USA");
  const [gender, setGender] = useState("Male");
  const [isPopupOpen, setPopupOpen] = useState(false);
  
  

 return (
    <div style={styles.container}>
      <div style={styles.profileSection}>
        <span
          style={styles.gearIcon}
          onClick={() => setPopupOpen(true)}
        >
          ⚙️
        </span>
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>TU</div>
          <button style={styles.editButton}>✏️</button>
        </div>
      </div>
      <div style={styles.editProfileSection}>
        <h2 style={styles.sectionTitle}>Edit Profile</h2>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Name</label>
          <h3>{name}</h3>

          <label style={styles.label}>Username</label>
          <p>@{username}</p>

          <label style={styles.label}>Location</label>
          <p>{location}</p>

          <label style={styles.label}>Gender</label>
          <p>{gender}</p>
        </div>
        
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

const styles = {
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
    flexDirection: "column",
    alignItems: "center",
    padding: "1.5rem",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: "6rem",
    height: "6rem",
    backgroundColor: "gray",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    borderRadius: "50%",
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
    marginBottom: "1rem",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
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
    position: "relative",
    top: "0",
    right: "0",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
};


export default ProfilePage;

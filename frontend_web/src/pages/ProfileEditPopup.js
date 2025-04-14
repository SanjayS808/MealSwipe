import { useState, useEffect } from "react";

const ProfileEditPopup = ({ currentValues, setValues, onClose }) => {
  const [tempValues, setTempValues] = useState(currentValues);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    popup: {
      backgroundColor: "white",
      width: "90%",
      maxWidth: "400px",
      padding: "1.5rem",
      borderRadius: "10px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      transform: isVisible ? "scale(1)" : "scale(0.8)",
      opacity: isVisible ? 1 : 0,
      transition: "all 0.3s ease-in-out",
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "15px",
      fontSize: "1.5rem",
      cursor: "pointer",
    },
    inputContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      marginTop: "1rem",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: "600",
    },
    input: {
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: "0.5rem",
      fontSize: "1rem",
      width: "100%",
      outline: "none",
    },
    doneButton: {
      marginTop: "1.5rem",
      backgroundColor: "#4CAF50",
      color: "white",
      fontSize: "1rem",
      fontWeight: "bold",
      padding: "0.75rem",
      borderRadius: "5px",
      cursor: "pointer",
      border: "none",
      width: "100%",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
        <span style={styles.closeButton} onClick={onClose}>
          ❌
        </span>
        <h2>Edit Profile</h2>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            value={tempValues.name}
            onChange={(e) => setTempValues({ ...tempValues, name: e.target.value })}
            style={styles.input}
          />

          <label style={styles.label}>Username</label>
          <input
            type="text"
            value={tempValues.username}
            onChange={(e) => setTempValues({ ...tempValues, username: e.target.value })}
            style={styles.input}
          />

          <label style={styles.label}>Location</label>
          <input
            type="text"
            value={tempValues.location}
            onChange={(e) => setTempValues({ ...tempValues, location: e.target.value })}
            style={styles.input}
          />

          <label style={styles.label}>Gender</label>
          <input
            type="text"
            value={tempValues.gender}
            onChange={(e) => setTempValues({ ...tempValues, gender: e.target.value })}
            style={styles.input}
          />

          <button
            style={styles.doneButton}
            onClick={() => {
              setValues(tempValues);
              onClose();
            }}
          >
            Done!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPopup;

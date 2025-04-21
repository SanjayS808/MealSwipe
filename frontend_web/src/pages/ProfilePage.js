import React, { useEffect, useState, useCallback } from "react";
import ProfileEditPopup from "./ProfileEditPopup";
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom";
import { DEV_MODE } from "../config"
import "./profiles.css";

const backendURL = (DEV_MODE) ? "http://localhost:5001"  : "https://backend.app-mealswipe.com";

const ProfilePage = () => {
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
    navigate('/');
  };
  
  return (
    <div className="profilePage">
      <div className="profileCard">
        <div
          className="profileAvatar"
          style={{
            backgroundImage: user?.picture ? `url(${user.picture})` : "none",
          }}
        />
        <div className="profileRow">
          <div className="profileLabel">Name</div>
          <div className="profileValue">{name}</div>
        </div>
        <div className="profileRow">
          <div className="profileLabel">Email</div>
          <div className="profileValue">{user?.email}</div>
        </div>
        <div className="profileRow">
          <div className="profileLabel">Swipes</div>
          <div className="profileValue">{swipe}</div>
        </div>
        <div className="profileButtons">
          <button className="profileButton" onClick={() => setPopupOpen(true)}>
            Edit
          </button>
          <button className="profileButton" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <ProfileEditPopup
          currentValues={{ name }}
          setValues={(newValues) => {
            setName(newValues.name);
          }}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </div>
  );

};


export default ProfilePage;

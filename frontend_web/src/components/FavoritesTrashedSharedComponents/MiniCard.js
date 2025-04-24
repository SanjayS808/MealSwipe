import React, { useState } from "react";
import "./styles/miniCard.css";
import { MapPin, Globe, Phone } from "lucide-react"; 
import StarRating from "../StarRating";
import {DEV_MODE} from "../../config"


export default function MiniCard({ restaurant, removeRestaurant, text}) {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const backendURL = (DEV_MODE) ? "http://localhost:5001"  : "https://backend.app-mealswipe.com";

  const handleClick = () => {
    console.log({ restaurant });
    console.log("restaurant", restaurant);
    setShowModal(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 100);
    
  };

  const removeRestaurantHandler = () => {
    removeRestaurant(restaurant.placeid);
    setShowModal(false);
  };
  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      background: '#ffe1c7',
      padding: '2em',
      borderRadius: '10px',
      
      maxWidth: '500px',
      maxHeight: '55vh',
      overflowY: 'auto',
      position: 'relative',
    },
  };

  return (
    <>
    
      <div className="favoritesCard" onClick={handleClick}>
        <div className="card-image">
          <img
            src={`${backendURL}/api/serve/get-restaurant-photo?rinfo=${restaurant.photourl}`}
            draggable="false"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt={restaurant.name}
          />
        </div>
        <div className="card-content">
          <h4>{restaurant.name}</h4>
        </div>
      </div>
      
      {showModal && (
        <div style={modalStyles.overlay}>
          <div
            style={modalStyles.modal}
            className={isClosing ? "miniModal modal-animateMiniCardExit" : "miniModal modal-animateMiniCard"}
          >
            <div className="image_container" style={{ marginBottom: "1em" }}>
              <img
                src={`${backendURL}/api/serve/get-restaurant-photo?rinfo=${restaurant.photourl}`}
                alt={restaurant.name}
                style={{ width: "100%", borderRadius: "10px", objectFit: "cover" }}
              />
            </div>

            <h3 style={{ margin: "0 0 0.25em 0" }}>{restaurant.name}</h3>
            <p style={{ margin: "0 0 0.5em 0", fontSize: "0.9em", color: "#444" }}>{restaurant.address}</p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1em" }}>
              <span style={{ fontWeight: "bold", fontSize: "1em" }}>⭐ {restaurant.rating}</span>
              <span style={{ fontWeight: "bold", color: "#6b8e23" }}>
                {"$".repeat(restaurant.pricelevel || 1)}
              </span>

              <span style={{ display: "flex", gap: "0.5em" }}>
                {restaurant.googlemapsurl && (
                  <a href={restaurant.googlemapsurl} target="_blank" rel="noreferrer" className="icon-wrapper">
                    <MapPin size={18} className="icon"/>
                  </a>
                )}
                {restaurant.website && (
                  <a href={restaurant.website} target="_blank" rel="noreferrer" className="icon-wrapper">
                    <Globe size={18} className="icon"/>
                  </a>
                )}
              </span>
            </div>

            <hr style={{ margin: "1em 0", borderColor: "#ccc" }} />

            <p style={{ marginBottom: "0.5em" }}>
              Are you sure you want to remove <strong>{restaurant.name}</strong> from your <strong>{text}</strong>?
            </p>

            <div className="modal-buttons" style={{ display: "flex", justifyContent: "center", gap: "1em" }}>
              <button onClick={removeRestaurantHandler}>Remove</button>
              <button onClick={handleClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

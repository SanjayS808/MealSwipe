import React, { useEffect, useState } from "react";
import "./styles/miniCard.css";
import {DEV_MODE} from "../../config"


export default function MiniCard({ restaurant, removeRestaurant, text}) {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const backendURL = (DEV_MODE) ? "http://localhost:5001"  : "https://backend.app-mealswipe.com";

  const handleClick = () => {
    console.log({ restaurant });
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
        <div style={modalStyles.overlay} >
          <div style={modalStyles.modal} className={isClosing ? 'miniModal modal-animateMiniCardExit' : 'miniModal modal-animateMiniCard'}>

              <div>
                <h4>Are you sure you want to remove {restaurant.name} from your {text}?</h4>
              </div>

            
              <div className="modal-buttons">
                <button onClick={removeRestaurantHandler}>Remove</button>
                <button onClick={handleClose}>Cancel</button>
                </div>
          </div>
        </div>
      )}
    </>
  );
}

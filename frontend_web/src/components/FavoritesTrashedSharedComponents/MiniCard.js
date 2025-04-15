import React, { useEffect, useState } from "react";
import "./styles/miniCard.css";


export default function MiniCard({ restaurant, removeRestaurant, text}) {
  const [showModal, setShowModal] = useState(false);

  const [isClosing, setIsClosing] = useState(false);

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
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
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

import React, { useState } from "react";
import "./styles/miniCard.css";


export default function MiniCard({ restaurant, removeRestaurant, text}) {
  const [showModal, setShowModal] = useState(false);

  
  const handleClick = () => {
    console.log({ restaurant });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
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
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal} className= 'miniModal'>
          <button
              onClick={handleClose}
              style={{
                
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#ff4d4f',
                border: 'none',
                color: 'black',
                fontSize: '1.2em',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                zIndex: 9999,
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e60000'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4f'}
            >
              ✕
            </button>
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

import React from "react";

import "./Card.css";
import StarRating from "./StarRating";
import { MapPin, Globe, Phone } from "lucide-react"; 
import RestaurantModal from "./RestaurantModal";

function RestaurantModalWrapper({ restaurant ,handleClose}) {

  const modalStyles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
      borderRadius: '10px',
      width: '100%',
    },
    modal: {
      background: '#ffe1c7',
      padding: '2em',
      borderRadius: '10px',
      width: '80v',
        maxWidth: '225px',


      maxHeight: '55vh',
      overflowY: 'auto',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      border: 'none',
      fontSize: '1.2em',
      cursor: 'pointer',
      zIndex: 9999       // DEBUG
    },
    reviewItem: {
      margin: '1em 0',
      borderBottom: '1px solid #ddd',
      paddingBottom: '0.5em',
    },
  };


    return (
        <div 
        style={modalStyles.overlay}
        onClick={handleClose} // Click on backdrop closes modal
        >
          <div 
            style={modalStyles.modal}
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking modal content
          >
          <button 
            onClick={handleClose} 
            style={{
              position: 'relative',
                top: '-15px',
                right: '20px',

              borderRadius: '50%',
              backgroundColor: '#ff4d4f',
              border: 'none',
              color: 'black',
              fontSize: '1.2em',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              zIndex: 9999, // Ensure the button is on top
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e60000'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4f'}
          >
            ✕
          </button>

            <RestaurantModal restaurant={restaurant}  />
            
          </div>
        </div>
    );
}

export default RestaurantModalWrapper;
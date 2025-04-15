// This component takes the list of restaurants and generates the restaurant cards to be displayed in the Tinder-like interface.


import React, { useRef ,useState,useEffect} from 'react';
import RestaurantCard from "./RestaurantCard";
import TinderCard from "react-tinder-card";
import RestaurantModal from "./RestaurantModal";
import "./restaurantList.css";
import "./Card.css"
function RestaurantList({ restaurants, onSwipe ,resetBackendData,isLoading}) {
  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const handleClick = (restaurant) => {
    setCurrentRestaurant(restaurant);
    setShowModal(true);
    console.log("currentRestaurant", restaurant);
  };
  const handleClose = () => {
    setCurrentRestaurant(null);
    
    
  }

  

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
      width: '75%',
      maxWidth: '300px',
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
    
    <div>
      <div className="cardContainer">
        {isLoading ? (
          null
        ) : restaurants.length === 0 ? (
          <div className="noRestaurants">
            <h3>No restaurants available :(</h3>
            <button onClick={resetBackendData}>Refresh</button>
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <>
            <TinderCard
              className="swipe"
              key={restaurant.id}
              onSwipe={(dir) => onSwipe(dir, restaurant)}
              preventSwipe={["up", "down"]}
              swipeThreshold={1}
              
            >
              <RestaurantCard restaurant={restaurant} handleClick={handleClick} handleClose={handleClose} showModal={showModal}/>
            </TinderCard>

            
            </>
          ))
        )}

{currentRestaurant && (
  
  <div className="card" >
    <div className="restaurant-details" >
    
        <div 
        style={modalStyles.overlay}
        onClick={handleClose} // Click on backdrop closes modal
        >
          <div 
            style={modalStyles.modal}
            className="modal-animate"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking modal content
          >
          <button 
            onClick={handleClose} 
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '35px',
              height: '35px',
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

            <RestaurantModal restaurant={currentRestaurant}  />
            
          </div>
        </div>
        </div>
        </div>
      )}

      </div>
    </div>
  );
  
}

export default RestaurantList;

// This component takes the list of restaurants and generates the restaurant cards to be displayed in the Tinder-like interface.


import React, { useState } from 'react'
import RestaurantCard from "./RestaurantCard";
import TinderCard from "react-tinder-card";
import Modal from "./Modal"; // Import the modal component

//fucntions for button swiping

// TODO: 
// const swipe = async (dir) => {
  
// }

function RestaurantList({ restaurants, onSwipe ,resetBackendData}) {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Function to handle opening the modal
  const openModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setSelectedRestaurant(null);
  };
  
  return (
    <div>
    {selectedRestaurant && (
      <Modal restaurant={selectedRestaurant} onClose={closeModal} />
    )}
    <div className="cardContainer">
        {restaurants.length === 0 ? (
          <div className="noRestaurants">
            <p>No restaurants available.</p>
            <button onClick={resetBackendData}>Refresh</button>
          </div>
        ) : (
          
          restaurants.map((restaurant) => (
            <TinderCard className="swipe pressable"  key={restaurant.id} onSwipe={(dir) => onSwipe(dir, restaurant) } >
              <RestaurantCard restaurant={restaurant} onClick={() => openModal(restaurant)}/>
            </TinderCard>
          ))
        )}
    </div>
    

    </div>

  );
}

export default RestaurantList;

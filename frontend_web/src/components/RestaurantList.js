// This component takes the list of restaurants and generates the restaurant cards to be displayed in the Tinder-like interface.


import React, { useRef } from 'react';
import RestaurantCard from "./RestaurantCard";
import TinderCard from "react-tinder-card";


function RestaurantList({ restaurants, onSwipe ,resetBackendData}) {
  

  const onCardLeftScreen = () => {
    console.log("adding: ");
    
    
  }
  
  
  return (
    <div>
      
    <div className="cardContainer">
        {restaurants.length === 0 ? (
          <div className="noRestaurants">
            <p>No restaurants available.</p>
            <button onClick={resetBackendData}>Refresh</button>
          </div>
        ) : (
          
          restaurants.map((restaurant) => (
            <TinderCard className="swipe"  key={restaurant.id} onSwipe={(dir) => onSwipe(dir, restaurant) } preventSwipe={["up", "down"]} >
              <RestaurantCard restaurant={restaurant} />
            </TinderCard>
          ))
        )}
    </div>
    

    </div>

  );
}

export default RestaurantList;

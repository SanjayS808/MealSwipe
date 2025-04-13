// This component takes the list of restaurants and generates the restaurant cards to be displayed in the Tinder-like interface.


import React, { useRef } from 'react';
import RestaurantCard from "./RestaurantCard";
import TinderCard from "react-tinder-card";

import "./restaurantList.css";
function RestaurantList({ restaurants, onSwipe ,resetBackendData}) {
  

  
  
  
  return (
    <div>
      
    <div className="cardContainer">
        {restaurants.length === 0 ? (
          <div className="noRestaurants">
            <h3>No restaurants available :(</h3>
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

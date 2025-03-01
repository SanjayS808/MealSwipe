// This component takes the list of restaurants and generates the restaurant cards to be displayed in the Tinder-like interface.

import React from "react";
import RestaurantCard from "./RestaurantCard";


function RestaurantList({ restaurants, onSwipe ,resetBackendData}) {
  return (
    <div className="cardContainer">
        {restaurants.length === 0 ? (
          <div className="noRestaurants">
            <p>No restaurants available.</p>
            <button onClick={resetBackendData}>Refresh</button>
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} onSwipe={onSwipe} />
          ))
        )}
    </div>

  );
}

export default RestaurantList;

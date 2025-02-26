// This component takes the list of restaurants and generates the restaurant cards to be displayed in the Tinder-like interface.

import React from "react";
import RestaurantCard from "./RestaurantCard";

function RestaurantList({ restaurants, onSwipe }) {
  return (
    <div className="cardContainer">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} onSwipe={onSwipe} />
      ))}
    </div>
  );
}

export default RestaurantList;

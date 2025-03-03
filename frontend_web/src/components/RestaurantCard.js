// This Component is used to display a restaurant card in the Tinder-like interface.

import React from "react";



function RestaurantCard({ restaurant}) {
  return (
    <div
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=1470&q=80)",
                }}
                className="card"
              >
                <h3 className="text-lg font-bold">{restaurant.name}</h3>
                <p className="text-sm">{restaurant.rating}⭐ • Price Level: {restaurant.priceLevel}</p>
              </div>
  );
}

export default RestaurantCard;

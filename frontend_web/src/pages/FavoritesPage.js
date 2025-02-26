import React from "react";

function FavoritesPage({ likedRestaurants }) {
  return (
    <div>
      <h2>Liked Restaurants</h2>
      <ul>
        {likedRestaurants.length === 0 ? (
          <p>No liked restaurants yet.</p>
        ) : (
          likedRestaurants.map((restaurant, index) => (
            <li key={index}>{restaurant.name}</li>
          ))
        )}
      </ul>
    </div>
  );
}

export default FavoritesPage;

import React from "react";



function FavoritesPage({ likedRestaurants, clearFavorites }) {
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
      <button onClick={() => clearFavorites()}>Clear Favorites</button>
    </div>
  );
}

export default FavoritesPage;

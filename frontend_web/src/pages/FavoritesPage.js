import React, {useEffect} from "react";

import "./favorites.css"

function FavoritesPage({ likedRestaurants, clearFavorites, loadFavorites , loggedIn = {loggedIn}}) {
  useEffect(() => {
    console.log("Loading favorites...");
    loadFavorites();
  }
  , []); 
  return (
    loggedIn ? (
      <div className="favoritesPage">
        <h2>Liked Restaurants</h2>
        <ul>
          {likedRestaurants.length === 0 ? (
            <p>No liked restaurants yet.</p>
          ) : (
            likedRestaurants.map((restaurant, index) => (
              <li key={index}>{restaurant}</li>
            ))
          )}
        </ul>
        <button onClick={() => clearFavorites()}>Clear Favorites</button>
      </div>
    ) : (
      <div className="favoritesPage">
        <h2>Favorites</h2>
        <p>Please log in to view your favorites.</p>
      </div>
    )
  );
}  

export default FavoritesPage;

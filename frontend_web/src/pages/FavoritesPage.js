import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import "./favorites.css";
import MiniCard from "../components/FavoritesTrashedSharedComponents/MiniCard";
function FavoritesPage({ likedRestaurants, clearFavorites, loadFavorites, loggedIn, isLoading ,deleteRestaurantFromFavorites}) {
  const navigate = useNavigate();

  const swipeClick = () => {
    console.log("swipeClick");
    navigate("/");
  };

  useEffect(() => {
    console.log("Loading favorites...");
    loadFavorites();
  }, []);

  const deleteAction = (placeid) => {
    console.log("Deleting restaurant with placeid:", placeid);
    deleteRestaurantFromFavorites(placeid);
    loadFavorites();
  }

  return loggedIn ? (
    <div className="favoritesPage">
      <h2>Liked Restaurants</h2>

      {isLoading ? null : (
        likedRestaurants.length === 0 ? (
          <div className="noRestaurants">
            <h2>it's lonely in here :(</h2>
            <Button text="Start Swiping" onClick={swipeClick} />
          </div>
        ) : (
          <>
          <div className="favoritesList">
              {likedRestaurants.map((restaurant, index) => (
                <MiniCard
                  key={index}
                  restaurant={restaurant}
                  removeRestaurant={deleteAction}
                  text = "favorites"
                />
              ))}
              
            </div>
            <button className="clearFavorites" onClick={clearFavorites}>
              Clear All
            </button>
          </>
          
        )
      )}
    </div>
  ) : (
    <div className="favoritesPage">
      <h2>Favorites</h2>
      <p>Please log in to view your favorites.</p>
    </div>
  );
}

export default FavoritesPage;

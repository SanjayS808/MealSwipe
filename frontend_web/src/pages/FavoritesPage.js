import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';

import Button from "../components/Button";
import "./favorites.css"
function FavoritesPage({ likedRestaurants, clearFavorites, loadFavorites , loggedIn = {loggedIn}}) {

  
  const navigate = useNavigate();
  const swipeClick = () => {
    console.log("swipeClick");
    navigate("/");
  }
  useEffect(() => {
    console.log("Loading favorites...");
    loadFavorites();
  }
  

  , []); 
  return (
    loggedIn ? (
      <div className="favoritesPage">
        <h2>Liked Restaurants</h2>
        
        {likedRestaurants.length === 0 ? (
          <div className="noRestaurants">
            <h2>it's lonely in here :(</h2>
              <Button text="Start Swiping" onClick={swipeClick} />
              
          </div>
        ) : (
          <ul>
            {likedRestaurants.map((restaurant, index) => (
              <li key={index}>{restaurant}</li>
            ))}
          </ul>
        )}

        {likedRestaurants.length > 0 ? (
          <button onClick={() => clearFavorites()}>Clear Favorites</button>) : null

          
          }
        
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

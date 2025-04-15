import React, { useEffect,useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import "./favorites.css";
import MiniCard from "../components/FavoritesTrashedSharedComponents/MiniCard";
function FavoritesPage({ likedRestaurants, clearFavorites, loadFavorites, loggedIn, isLoading ,deleteRestaurantFromFavorites}) {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  
  const handleClearClick = () => {
    setShowConfirmModal(true);
  };
  
  const confirmClearFavorites = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      clearFavorites();
      setShowConfirmModal(false);
    }, 100);
    
  };
  const cancelClearFavorites = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShowConfirmModal(false);
    }, 100);
    
  };
  
  
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
          <div className="noRestaurants modal-animateFavorites">
            <h2>it's lonely in here :(</h2>
            <Button text="Start Swiping" onClick={swipeClick} />
          </div>
        ) : (
          <>
          <button className="clearFavorites" onClick={handleClearClick}>
              Clear Favorites
            </button>
          <div className="favoritesList modal-animateFavorites">
            
              {likedRestaurants.map((restaurant, index) => (
                <MiniCard
                  key={index}
                  restaurant={restaurant}
                  removeRestaurant={deleteAction}
                  text = "favorites"
                />
              ))}
              
            </div>
            
            {showConfirmModal && (
            <div className="modal-overlay ">
              <div className={isClosing ? 'modal-content modal-animateFavoritesExit' : 'modal-content modal-animateFavorites'}>
                <p>Are you sure you want to clear all favorites?</p>
                <div className="modal-buttons">
                  <button onClick={confirmClearFavorites}>Yes</button>
                  <button onClick={cancelClearFavorites}>Cancel</button>
                </div>
              </div>
            </div>
          )}
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

import React, { useEffect,useState  } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import "./favorites.css";
import MiniCard from "../components/FavoritesTrashedSharedComponents/MiniCard";
function TrashedPage({ trashedRestaurants , clearTrashed, loadTrashed , loggedIn, isLoading ,deleteRestaurantFromTrashed}) {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClearClick = () => {
    setShowConfirmModal(true);
  };
  
  const confirmClearFavorites = () => {
    clearTrashed();
    setShowConfirmModal(false);
  };
  
  const cancelClearFavorites = () => {
    setShowConfirmModal(false);
  };
  const swipeClick = () => {
    console.log("swipeClick");
    navigate("/");
  };

  useEffect(() => {
    console.log("Loading trashed...");
    loadTrashed();
  }, []);

  const deleteAction = (placeid) => {
    console.log("Deleting restaurant with placeid:", placeid);
    deleteRestaurantFromTrashed(placeid);
    loadTrashed();
  }

  return loggedIn ? (
    <div className="favoritesPage">
      <h2>Trashed Restaurants</h2>

      {isLoading ? null : (
        trashedRestaurants.length === 0 ? (
          <div className="noRestaurants">
             <h2>props to you for not being picky!</h2>
            <Button text="Back to Swiping" onClick={swipeClick} />
          </div>
        ) : (
          <>
          <button className="clearFavorites" onClick={handleClearClick}>
              Clear Trashed
            </button>
          <div className="favoritesList">
              {trashedRestaurants.map((restaurant, index) => (
                <MiniCard
                  key={index}
                  restaurant={restaurant}
                  removeRestaurant={deleteAction}
                  text = "trashed"
                />
              ))}
              
            </div>
            
            {showConfirmModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p>Are you sure you want to clear your trash?</p>
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
      <h2>Trash</h2>
      <p>Please log in to view your trashed restaurants.</p>
    </div>
  );
}

export default TrashedPage;

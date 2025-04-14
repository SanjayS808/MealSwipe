import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import "./favorites.css";
import MiniCard from "../components/FavoritesTrashedSharedComponents/MiniCard";
function TrashedPage({ trashedRestaurants , clearTrashed, loadTrashed , loggedIn, isLoading ,deleteRestaurantFromTrashed}) {
  const navigate = useNavigate();

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
            <button className="clearFavorites" onClick={clearTrashed}>
              Clear All
            </button>
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

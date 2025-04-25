import React, { useEffect,useState  } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import "./favorites.css";
import MiniCard from "../components/FavoritesTrashedSharedComponents/MiniCard";
function TrashedPage({ trashedRestaurants , clearTrashed, loadTrashed , loggedIn, isLoading ,deleteRestaurantFromTrashed,fetchuid}) {
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
      clearTrashed();
      setShowConfirmModal(false);
    }
    , 100);
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
    const loadData = async () => {
      console.log("Loading trashed...");
      await fetchuid();
      loadTrashed();
    };
  
    loadData();
  }, []);

  const deleteAction = async (placeid) => {
    console.log("Deleting restaurant with placeid:", placeid);
     await deleteRestaurantFromTrashed(placeid);
     setTimeout(() => {
      loadTrashed();
    }, 150);
      
    
  }

  return loggedIn ? (
    <div className="favoritesPage">
      <h2
        style={{
          fontSize: "clamp(2rem, 5vw, 2.3rem)",
          fontWeight: "800",
          textAlign: "center",
          color: "#6c6c6c", // a muted gray to reflect the 'trashed' vibe
          marginBottom: "0.5em",
          animation: "slideIn 0.3s ease-out",
        }}
      >
        🗑️ Trashed Restaurants
      </h2>

      {isLoading ? null : (
        trashedRestaurants.length === 0 ? (
          <div className="noRestaurants modal-animateFavorites">
             <h2 style = {{whiteSpace: "nowrap", fontSize: "clamp(1rem, 6vw, 2rem)"}}>props to you for not being picky!</h2>
            <Button text="Back to Swiping" onClick={swipeClick} />
          </div>
        ) : (
          <>
          <button className="clearFavorites" onClick={handleClearClick}>
              Clear Trashed
            </button>
          <div className="favoritesList modal-animateFavorites">
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
              <div className={isClosing ? 'modal-content modal-animateFavoritesExit' : 'modal-content modal-animateFavorites'}>
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
        <h3
          style={{
            fontSize: "clamp(1rem, 2.5vw, 2rem)",
            textAlign: "center",
            whiteSpace: "nowrap",        // ✅ forces single line
            overflow: "hidden",          // ✅ hides overflow
            textOverflow: "ellipsis",    // ✅ adds "..." if needed
            width: "100%",               // ✅ ensures it fills parent
          }}
        >
        Please log in to view your trashed restaurants.
      </h3>
      <Button text="Log In" onClick={() => navigate("/login")} />

    </div>
  );
}

export default TrashedPage;

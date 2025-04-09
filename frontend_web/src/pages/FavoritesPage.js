import React, { useEffect, useState } from "react";
import "./favorites.css";

function FavoritesPage({ likedRestaurants, clearFavorites, loadFavorites, loggedIn }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempted, setLoadAttempted] = useState(false);

  // Load favorites only once when component mounts
  useEffect(() => {
    if (!loadAttempted && loggedIn) {
      console.log("Loading favorites once...");
      setIsLoading(true);
      
      const loadData = async () => {
        try {
          await loadFavorites();
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading favorites:", error);
          setIsLoading(false);
        } finally {
          setLoadAttempted(true);
        }
      };
      
      loadData();
    } else if (!loggedIn) {
      setIsLoading(false);
    }
  }, [loggedIn, loadAttempted, loadFavorites]);

  // For debugging - log what we're receiving 
  useEffect(() => {
    if (likedRestaurants && likedRestaurants.length > 0) {
      console.log("Favorite restaurants received by component:", likedRestaurants);
    }
  }, [likedRestaurants]);

  // Helper to format price level similar to RestaurantCard
  const formatPriceLevel = (price) => {
    switch(price) {
      case "PRICE_LEVEL_INEXPENSIVE": return "$";
      case "PRICE_LEVEL_MODERATE": return "$$";
      case "PRICE_LEVEL_EXPENSIVE": return "$$$";
      case "PRICE_LEVEL_VERY_EXPENSIVE": return "$$$$";
      default: return "";
    }
  };

  return (
    <div className="favoritesPage">
      <h2>Liked Restaurants</h2>
      
      {!loggedIn ? (
        <p>Please log in to view your favorites.</p>
      ) : isLoading ? (
        <p>Loading your favorites...</p>
      ) : likedRestaurants && likedRestaurants.length > 0 ? (
        <div className="favoritesContainer">
          <div className="favoritesGrid">
            {likedRestaurants.map((restaurant, index) => (
              <div key={`fav-${index}-${restaurant.id || index}`} className="favoriteCard">
                <div className="imageContainer">
                  {restaurant.imageUrl ? (
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.name || "Restaurant"}
                      className="restaurantImage"
                      onError={(e) => {
                        e.target.onerror = null;
                        // Replace with a data URI instead of a file path
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23555555'%3ENo Image Available%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="restaurantImagePlaceholder">
                      <span>No Image Available</span>
                    </div>
                  )}
                </div>
                <div className="restaurantInfo">
                  <h3>{restaurant.name || "Unknown Restaurant"}</h3>
                  <div className="restaurant-details">
                    <p className="rating">Rating: {restaurant.rating ? `${restaurant.rating} ★` : "Not rated"}</p>
                    {restaurant.price && <p className="price">{formatPriceLevel(restaurant.price)}</p>}
                  </div>
                  <p className="address">
                    {restaurant.address && restaurant.address.length > 35
                      ? restaurant.address.slice(0, 35) + '...'
                      : restaurant.address || "Address not available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="clearButton" onClick={clearFavorites}>
            Clear Favorites
          </button>
        </div>
      ) : (
        <p>No liked restaurants yet.</p>
      )}
    </div>
  );
}

export default FavoritesPage;
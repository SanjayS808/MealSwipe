import React, { useEffect, useState } from "react";
import Restaurant from "./Restaurant";
import Navigation from "./Navigation";
import "./App.css";

function App() {
  const [backendData, setBackendData] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [trashedRestaurants, setTrashedRestaurants] = useState([]);
  const [maxDistance, setMaxDistance] = useState(20); // Default to 20 km
  const [showFilter, setShowFilter] = useState(false); // State to toggle filter visibility

  const loadFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoriteRestaurants(favorites);
  };

  const loadTrashed = () => {
    const trashed = JSON.parse(localStorage.getItem("trashed")) || [];
    setTrashedRestaurants(trashed);
  };

  const handleSwipe = (direction, restaurant) => {
    console.log(`You swiped ${direction} on ${restaurant.name}`);
    if (direction === 'right') {
      setBackendData((prev) => prev.filter(r => r.id !== restaurant.id));
      toggleFavorite(restaurant);
    } else if (direction === 'left') {
      setBackendData((prev) => prev.filter(r => r.id !== restaurant.id));
      toggleTrashed(restaurant);
    }
  };

  const fetchRestaurants = () => {
    fetch(`http://localhost:5001/api/serve/get-all-restaurants?maxDistance=${maxDistance}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        setBackendData(data.map(r => new Restaurant(r.id, r.displayName.text, r.rating, r.priceLevel)));
      })
      .catch(error => console.error("Fetch error:", error));
  };

  const clearFavorites = () => {
    localStorage.removeItem("favorites");
    setFavoriteRestaurants([]);
  };

  const clearTrashed = () => {
    localStorage.removeItem("trashed");
    setTrashedRestaurants([]);
  };

  useEffect(() => {
    fetchRestaurants();
    loadFavorites();
    loadTrashed();
  }, [maxDistance]);

  const toggleFavorite = (restaurant) => {
    const isAlreadyFavorite = favoriteRestaurants.some(fav => fav.id === restaurant.id);
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favoriteRestaurants, restaurant];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavoriteRestaurants(updatedFavorites);
    }
  };

  const toggleTrashed = (restaurant) => {
    const isAlreadyTrashed = trashedRestaurants.some(trash => trash.id === restaurant.id);
    if (!isAlreadyTrashed) {
      const updatedTrashed = [...trashedRestaurants, restaurant];
      localStorage.setItem("trashed", JSON.stringify(updatedTrashed));
      setTrashedRestaurants(updatedTrashed);
    }
  };

  return (
    <div>
      <Navigation 
        clearFavorites={clearFavorites}
        clearTrashed={clearTrashed}
        resetBackendData={fetchRestaurants}
        backendData={backendData}
        handleSwipe={handleSwipe}
        likedRestaurants={favoriteRestaurants}
        trashedRestaurants={trashedRestaurants}
      />
      <button style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }} onClick={() => setShowFilter(!showFilter)}>Toggle Filter</button>
      {showFilter && (
        <div style={{ padding: "10px" }}>
          <label>Max Distance: {maxDistance} km</label>
          <input
            type="range"
            min="1"
            max="100"
            value={maxDistance}
            onChange={e => setMaxDistance(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

export default App;

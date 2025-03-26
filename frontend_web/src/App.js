import React, { useEffect, useState, useCallback } from "react";
import Restaurant from "./Restaurant";
import Navigation from "./Navigation";
import FilterPage from "./components/FilterPage";
import "./App.css";
import "./components/FilterPage.css";

const DEV_MODE = true;
const backendURL = DEV_MODE ? "http://localhost:5001/" : "http://MealSw-Backe-k0cJtOkGFP3i-29432626.us-west-1.elb.amazonaws.com";

function App() {
  const [backendData, setBackendData] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [trashedRestaurants, setTrashedRestaurants] = useState([]);
  
  // Pending filter values that haven't been applied yet
  const [pendingMaxDistance, setPendingMaxDistance] = useState(50);
  const [pendingMinRating, setPendingMinRating] = useState(0);
  const [pendingPriceLevels, setPendingPriceLevels] = useState([]);
  
  // Current applied filter values
  const [maxDistance, setMaxDistance] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [priceLevels, setPriceLevels] = useState([]);
  
  const [showFilterPage, setShowFilterPage] = useState(false);

  const fetchRestaurants = useCallback(() => {
    console.log("Fetching restaurants with:", {
      maxDistance, 
      minRating, 
      priceLevels
    });
    
    // Construct query parameters
    const queryParams = new URLSearchParams({
      maxDistance,
      minRating,
      ...(priceLevels.length > 0 && { priceLevels: priceLevels.join(',') })
    });

    fetch(`${backendURL}api/serve/get-all-restaurants?${queryParams}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        setBackendData(data.map(r => new Restaurant(
          r.id,
          r.displayName?.text,
          r.rating,
          r.priceLevel,
          r.formattedAddress,
          r.generativeSummary?.overview?.text,
          r.googleMapsLinks?.placeUri,
          r.reviews,
          r.websiteUri,
          r.userRatingCount,
          r.currentOpeningHours?.openNow ?? false,
          r.nationalPhoneNumber,
          r.photos
        )));
      })
      .catch(error => console.error("Fetch error:", error));
  }, [maxDistance, minRating, priceLevels]);

  useEffect(() => {
    fetchRestaurants();
    loadFavorites();
    loadTrashed();
  }, [fetchRestaurants]);

  const applyFilters = () => {
    // Update applied filters
    setMaxDistance(pendingMaxDistance);
    setMinRating(pendingMinRating);
    setPriceLevels(pendingPriceLevels);
    
    // Close filter page
    setShowFilterPage(false);
  };

  const loadFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoriteRestaurants(favorites);
  };

  const loadTrashed = () => {
    const trashed = JSON.parse(localStorage.getItem("trashed")) || [];
    setTrashedRestaurants(trashed);
  };

  const clearFavorites = () => {
    localStorage.removeItem("favorites");
    setFavoriteRestaurants([]);
  };

  const clearTrashed = () => {
    localStorage.removeItem("trashed");
    setTrashedRestaurants([]);
  };

  const handleSwipe = (direction, restaurant) => {
    console.log(`You swiped ${direction} on ${restaurant.name}`);
    if (direction === 'right') {
      const updatedFavorites = [...favoriteRestaurants, restaurant];
      setFavoriteRestaurants(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      
      setBackendData(prev => prev.filter(item => item.id !== restaurant.id));
    } else if (direction === 'left') {
      const updatedTrashed = [...trashedRestaurants, restaurant];
      setTrashedRestaurants(updatedTrashed);
      localStorage.setItem("trashed", JSON.stringify(updatedTrashed));
      
      setBackendData(prev => prev.filter(item => item.id !== restaurant.id));
    }
  };

  return (
    <div className="App">
      <Navigation
        clearFavorites={clearFavorites}
        clearTrashed={clearTrashed}
        resetBackendData={fetchRestaurants}
        backendData={backendData}
        handleSwipe={handleSwipe}
        likedRestaurants={favoriteRestaurants}
        trashedRestaurants={trashedRestaurants}
      />
      <button
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          background: `url(${process.env.PUBLIC_URL + '/filter.png'}) no-repeat center center`,
          backgroundSize: 'cover',
          border: 'none',
          width: '50px',
          height: '50px'
        }}
        onClick={() => setShowFilterPage(true)}
      />
      <FilterPage
        maxDistance={pendingMaxDistance}
        setMaxDistance={setPendingMaxDistance}
        minRating={pendingMinRating}
        setMinRating={setPendingMinRating}
        priceLevels={pendingPriceLevels}
        setPriceLevels={setPendingPriceLevels}
        applyFilters={applyFilters}
        onClose={() => setShowFilterPage(false)}
        isOpen={showFilterPage}
      />
    </div>
  );
}

export default App;
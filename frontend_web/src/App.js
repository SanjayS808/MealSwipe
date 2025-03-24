import React, { useEffect, useState } from "react";
import Restaurant from "./Restaurant";
import Navigation from "./Navigation";
import Filters from "./components/Filters"; // Make sure this path is correct.
import "./App.css";

const DEV_MODE = true;
const backendURL = DEV_MODE ? "http://localhost:5001/" : "http://MealSw-Backe-k0cJtOkGFP3i-29432626.us-west-1.elb.amazonaws.com";

function App() {
  const [backendData, setBackendData] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [trashedRestaurants, setTrashedRestaurants] = useState([]);
  const [maxDistance, setMaxDistance] = useState(100);
  const [minRating, setMinRating] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchRestaurants();
    loadFavorites();
    loadTrashed();
  }, []);

  const fetchRestaurants = () => {
    console.log("Fetching restaurants with maxDistance:", maxDistance, "and minRating:", minRating);
    fetch(`${backendURL}api/serve/get-all-restaurants?maxDistance=${maxDistance}&minRating=${minRating}`)
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
  };

  // Here are the implementations of the missing functions
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
      setFavoriteRestaurants(prev => [...prev, restaurant]);
      setBackendData(prev => prev.filter(item => item.id !== restaurant.id));
    } else if (direction === 'left') {
      setTrashedRestaurants(prev => [...prev, restaurant]);
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
        onClick={() => setShowFilter(!showFilter)}
      />
      {showFilter && <Filters
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        minRating={minRating}
        setMinRating={setMinRating}
        applyFilters={fetchRestaurants}
      />}
    </div>
  );
}

export default App;

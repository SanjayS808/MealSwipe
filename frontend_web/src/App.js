import React, { useEffect, useState } from "react";
import Restaurant from "./Restaurant";
import Navigation from "./Navigation";


import "./App.css";

// import TinderCard from 'react-tinder-card'

const DEV_MODE = false
const backendURL = (DEV_MODE) ? "http://localhost:5001/"  : "http://MealSw-Backe-k0cJtOkGFP3i-29432626.us-west-1.elb.amazonaws.com/";

function App() {
  const [backendData, setBackendData] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [trashedRestaurants, setTrashedRestaurants] = useState([]);

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
      //remove it from the backend data
      setBackendData((prev) => prev.filter(r => r.id !== restaurant.id));
      toggleFavorite(restaurant);
    } else if (direction === 'left') {
      setBackendData((prev) => prev.filter(r => r.id !== restaurant.id));
      toggleTrashed(restaurant);
    }
  };

  
  // Fetch data from the backend when the component mounts
  const fetchRestaurants = () => {
    fetch(backendURL + "api/serve/get-all-restaurants")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Fetching data from backend...");
        return response.json(); // Get the raw text from the response
      })
      .then(data => {
        

        // Try parsing the string into JSON
        try {
          const jsonData = JSON.parse(data); // Parse the JSON string
          

          // Directly map over the array of restaurant objects
          const restaurants = jsonData.map(r => 
            new Restaurant(r.id, r.displayName.text,  r.rating, r.priceLevel)
          );
          setBackendData(restaurants); // Set the parsed restaurant data
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      })
      .catch(error => console.error("Fetch error:", error));
  
  }
  
  const clearFavorites = () => {
    localStorage.removeItem("favorites");
    setFavoriteRestaurants([]);
  }

  const clearTrashed = () => {
    localStorage.removeItem("trashed");
    setTrashedRestaurants([]);
  }
  
  useEffect(() => {
    if (backendData.length === 0) {
      fetchRestaurants();
    }
    loadFavorites();
    loadTrashed();

  }, [backendData.length]);

  const resetBackendData = () => {
    //call the useffect fetch again
    fetchRestaurants();
    
  };

  const toggleFavorite = (restaurant) => {
    const isAlreadyFavorite = favoriteRestaurants.some((fav) => fav.id === restaurant.id);
  
    if (isAlreadyFavorite) {
      console.log("Restaurant is already in favorites");
      return;
    }
  
    const updatedFavorites = [...favoriteRestaurants, restaurant];
  
    // Save the updated favorites to local storage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  
    // Update the favorite restaurants state
    setFavoriteRestaurants(updatedFavorites);
  };

  const toggleTrashed = (restaurant) => {
    const isAlreadyTrashed = trashedRestaurants.some((trash) => trash.id === restaurant.id);
  
    if (isAlreadyTrashed) {
      console.log("Restaurant is already in trash");
      return;
    }
  
    const updatedTrashed = [...trashedRestaurants, restaurant];
  
    // Save the updated favorites to local storage
    localStorage.setItem("trashed", JSON.stringify(updatedTrashed));
  
    // Update the favorite restaurants state
    setTrashedRestaurants(updatedTrashed);
  }
  

  return (
    <Navigation 
      clearFavorites={clearFavorites}
      clearTrashed={clearTrashed}
      resetBackendData = {resetBackendData}
      backendData={backendData}
      handleSwipe={handleSwipe}
      likedRestaurants={favoriteRestaurants}
      trashedRestaurants={trashedRestaurants}
    />
  );
}

export default App;

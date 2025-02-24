import React, { useEffect, useState } from "react";
import Restaurant from "./Restaurant";
import TinderCard from 'react-tinder-card'

function App() {
  const [backendData, setBackendData] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);

  const loadFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavoriteRestaurants(favorites);
  };
  useEffect(() => {
    fetch("http://localhost:5001/api/serve/get-all-restaurants")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Get the raw text from the response
      })
      .then(data => {
        console.log("Raw API Response (as string):", data); // Log the string data
        console.log("Type of data:", typeof data); // Check if it's a string

        // Try parsing the string into JSON
        try {
          const jsonData = JSON.parse(data); // Parse the JSON string
          console.log("Parsed JSON data:", jsonData);

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
      loadFavorites();
  }, []);

  const toggleFavorite = (restaurantId) => {
    const updatedFavorites = [...favoriteRestaurants];
    const index = updatedFavorites.indexOf(restaurantId);

    if (index === -1) {
      // If not in favorites, add it
      updatedFavorites.push(restaurantId);
    } else {
      // If in favorites, remove it
      updatedFavorites.splice(index, 1);
    }

    // Save the updated favorites to local storage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    // Update the favorite restaurants state
    setFavoriteRestaurants(updatedFavorites);
  };
  return (
    <div>
      <h2>Restaurant List</h2>
      <ul>
        {backendData.length > 0 ? (
          backendData.map(restaurant => (
            <li key={restaurant.id}>
              {restaurant.name} - {restaurant.rating}⭐ - Price Level: {restaurant.priceLevel} - Rating: {restaurant.rating}
              <button onClick={() => toggleFavorite(restaurant.id)}>
                {favoriteRestaurants.includes(restaurant.id) ? "Unfavorite" : "Favorite"}
              </button>
            </li>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </ul>

      <h2>Favorite Restaurants</h2>
      <ul>
        {favoriteRestaurants.length > 0 ? (
          backendData
            .filter(restaurant => favoriteRestaurants.includes(restaurant.id))
            .map(restaurant => (
              <li key={restaurant.id}>
                {restaurant.name} - {restaurant.rating}⭐
              </li>
            ))
        ) : (
          <p>No favorites yet!</p>
        )}
      </ul>
      
    </div>
  );
}

export default App;

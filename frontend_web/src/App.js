import React, { useEffect, useState } from "react";
import Restaurant from "./Restaurant";
import Navigation from "./Navigation";
import "./App.css";


// import TinderCard from 'react-tinder-card'

const DEV_MODE = true
const backendURL = (DEV_MODE) ? "http://localhost:5001/"  : "http://MealSw-Backe-k0cJtOkGFP3i-29432626.us-west-1.elb.amazonaws.com";


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
        return response.json();
      })
      .then(data => {
        console.log("Fetched data:", data);
        //id,name,rating,price,address, generativeSummary, googleMapsLink, reviews,website, ratingsCount ,isOpen, phoneNumber, photos
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
          r.currentOpeningHours?.openNow ?? false,  // Use optional chaining and default to false
          r.nationalPhoneNumber, 
          r.photos
        )));
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

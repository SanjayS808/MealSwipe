import React, { useEffect, useState } from "react";
import Restaurant from "./Restaurant";
import Navigation from "./Navigation";
import "./App.css";


// import TinderCard from 'react-tinder-card'

const DEV_MODE = true
const backendURL = (DEV_MODE) ? "http://localhost:5001/"  : "http://MealSw-Backe-k0cJtOkGFP3i-29432626.us-west-1.elb.amazonaws.com";

function App() {
  const [backendData, setBackendData] = useState([]);
  const [maxDistance, setMaxDistance] = useState(100); // Default to 20 km
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [trashedRestaurants, setTrashedRestaurants] = useState([]);
  const [minRating, setMinRating] = useState(0); // Default to 0 stars
  const [showFilter, setShowFilter] = useState(false); // State to toggle filter visibility

  // TODO: Create Login Page
  const uname = "drodr24";

  const loadFavorites = async () => {
    if(favoriteRestaurants.length > 0) {return;} // We do not want to do anything.
    fetch(`${backendURL}api/serve/get-userid-with-uname?uname=${uname}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Backend error. Failed to fetch user information.");
      }
      return response.json();
    })
    .then(data => {    
      // Check if I can fix this nasty nested fetch command.     
      fetch(`${backendURL}api/serve/get-user-favorite-restaurants?uid=${data[0].userid}`)
      .then(response => {
        if(!response.ok) {
          throw new Error("Internal error. Failed to fetch swipe information.");
        }
        return response.json();
      })
      .then(data => {
        if(!Object.keys(data).length){
          // No data found for user. Set local storage empty.
          console.log("No restaurants swiped from user.")
          setFavoriteRestaurants([]);
        } else {
          // TODO: We are storing only the placeID of our user's restaurants.
          
          setFavoriteRestaurants([]);
        }
      });
    });
  };

  const loadTrashed = async () => {
    // Fetch data information
    fetch(`${backendURL}api/serve/get-userid-with-uname?uname=${uname}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Backend error. Failed to fetch user information.");
      }
      return response.json();
    })
    .then(data => {    
      // Check if I can fix this nasty nested fetch command.     
      fetch(`${backendURL}api/serve/get-user-trashed-restaurant?uid=${data[0].userid}`)
      .then(response => {
        if(!response.ok) {
          throw new Error("Internal error. Failed to fetch swipe information.");
        }
        return response.json();
      })
      .then(data => {
        if(!Object.keys(data).length){
          // No data found for user. Set local storage empty.
          console.log("No restaurants swiped from user.")
          setFavoriteRestaurants([]);
          console.log(backendData)
        } else {
          // TODO: We are storing only the placeID of our user's restaurants.
          setFavoriteRestaurants([]);
        }
      });
    });
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

  const fetchRestaurants = async () => {
    console.log("Fetching restaurants with maxDistance:", maxDistance, "and minRating:", minRating);
    console.log(backendURL + `api/serve/get-all-restaurants?maxDistance=${maxDistance}&minRating=${minRating}`)
    fetch(backendURL + `api/serve/get-all-restaurants?maxDistance=${maxDistance}&minRating=${minRating}`)

      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
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
    console.log("App mounted");
    // console.log("Backend data set:", backendData);
    fetchRestaurants();
    loadFavorites();
    loadTrashed();
  }, [maxDistance, minRating]);

  const toggleFavorite = (restaurant) => {
    const isAlreadyFavorite = favoriteRestaurants.some(fav => fav.id === restaurant.id);
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favoriteRestaurants, restaurant];
      // TODO: Change so information goes to DB via backend.
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavoriteRestaurants(updatedFavorites);
    }
  };

  const toggleTrashed = (restaurant) => {
    const isAlreadyTrashed = trashedRestaurants.some(trash => trash.id === restaurant.id);
    if (!isAlreadyTrashed) {
      const updatedTrashed = [...trashedRestaurants, restaurant];
      // TODO: Change so information goes to DB via backend.
      localStorage.setItem("trashed", JSON.stringify(updatedTrashed));
      setTrashedRestaurants(updatedTrashed);
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
      {showFilter && (
        <div style={{ position: 'absolute', top: '50px', right: '10px', padding: "10px", backgroundColor: "white", borderRadius: "8px" }}>
          <div>
            <label>Max Distance: {maxDistance} km</label>
            <input
              type="range"
              min="1"
              max="100"
              value={maxDistance}
              onChange={e => setMaxDistance(e.target.value)}
            />
          </div>
          <div>
            <label>Min Rating: {minRating} Stars</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={e => setMinRating(parseFloat(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

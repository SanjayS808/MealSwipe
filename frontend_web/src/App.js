import React, { useEffect, useState, useCallback } from "react";
import Restaurant from "./Restaurant";
import Navigation from "./Navigation";
import "./App.css";


// import TinderCard from 'react-tinder-card'

const DEV_MODE = false
const backendURL = (DEV_MODE) ? "http://localhost:5001"  : "http://MealSw-Backe-XjPwkMdlfUtN-1247908423.us-west-1.elb.amazonaws.com";"

function App() {
  const [backendData, setBackendData] = useState([]);
  const [maxDistance, setMaxDistance] = useState(100); // Default to 20 km
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [trashedRestaurants, setTrashedRestaurants] = useState([]);
  const [minRating, setMinRating] = useState(0); // Default to 0 stars
  const [showFilter, setShowFilter] = useState(false); // State to toggle filter visibility

  // TODO: Create Login Page
  const uname = "drodr24";

  const fetchuid = async () => {
    let response = await fetch(`${backendURL}/api/serve/get-userid-with-uname?uname=${uname}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Backend error. Failed to fetch user information.");
      }
      return response.json();
    });
    return response[0].userid;
  };

  const fetchRestaurantInfo = async (rid) => {
    let response = await fetch(`${backendURL}/api/serve/get-rinfo-with-rid?rid=${rid}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Backend error. Failed to fetch user information.");
      }
      return response.json();
    });
    return response;
  }

  const loadFavorites = useCallback(async () => {
    if (favoriteRestaurants.length > 0) {
      return;
    } 
  
    let userid = await fetchuid();
  
    fetch(`${backendURL}/api/serve/get-user-favorite-restaurants?uid=${userid}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Internal error. Failed to fetch swipe information.");
        }
        return response.json();
      })
      .then(data => {
        if (!Object.keys(data).length) {
          setFavoriteRestaurants([]);
        } else {
          setFavoriteRestaurants([]);
          data.forEach(result => {
            let restaurant_info = fetchRestaurantInfo(result.placeid);
            restaurant_info.then(result => {
              setFavoriteRestaurants(prevSwipes => [...prevSwipes, result[0].name]);
            });
          });
        }
      });
  }, [favoriteRestaurants.length]);

  const loadTrashed = useCallback(async () => {
    let userid = await fetchuid();
    
    fetch(`${backendURL}/api/serve/get-user-trashed-restaurant?uid=${userid}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Internal error. Failed to fetch swipe information.");
      }
      return response.json();
    })
    .then(data => {
      if(!Object.keys(data).length){
        // No data found for user. Set local storage empty.
        // console.log("No restaurants swiped from user.")
        setTrashedRestaurants([]);
      } else {
        setTrashedRestaurants([]);
        data.forEach((result) => {
          let restaurant_info = fetchRestaurantInfo(result.placeid);
          restaurant_info.then(result => {
            setTrashedRestaurants(prevSwipes => [...prevSwipes, result[0].name])
          })
        })
      }
    });
  }, []);

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

  const fetchRestaurants = useCallback(async () => {
    console.log("Fetching restaurants with maxDistance:", maxDistance, "and minRating:", minRating);
    console.log(backendURL + `/api/serve/get-all-restaurants?maxDistance=${maxDistance}&minRating=${minRating}`);
    fetch(backendURL + `/api/serve/get-all-restaurants?maxDistance=${maxDistance}&minRating=${minRating}`)
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
  }, [maxDistance, minRating]);

  useEffect(() => {
    console.log("App mounted");
    // console.log("Backend data set:", backendData);
    fetchRestaurants();
    loadFavorites();
    loadTrashed();
  }, [fetchRestaurants, loadFavorites, loadTrashed, maxDistance, minRating]);

  const clearFavorites = () => {
    localStorage.removeItem("favorites");
    setFavoriteRestaurants([]);
  };

  const clearTrashed = () => {
    localStorage.removeItem("trashed");
    setTrashedRestaurants([]);
  };

  const toggleFavorite = async (restaurant) => {
    let api_body_data = {
      rid: restaurant.id,
      rname: restaurant.name,
      price: restaurant.price,
      rating: restaurant.rating,
      weburl: restaurant.website,
      gmapurl: restaurant.googleMapsLink
    };

    let json_body_data = JSON.stringify(api_body_data);

    // Returns a 200 + warning if restaurant is already added.
    fetch(`${backendURL}/api/serve/add-restaurant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json_body_data
    })
    .then(response => response.json())
    .then(data => {
      if(data.ok()) {
        console.log("Restaurant succesfully added.");
      }
    })
    .catch((error) => {
      console.log("Internal error. Could not add restaurant.")
    })

    let userid = await fetchuid();

    // Add placeid and userid to trashed swipes.
    api_body_data = {
      rid: restaurant.id,
      uid: userid,
    };

    json_body_data = JSON.stringify(api_body_data)


    fetch(`${backendURL}/api/serve/add-user-favorite-restaurant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json_body_data
    })
    .then(response => response.json())
    .then(data => {
      if(data.ok()) {
        console.log("Restaurant succesfully added.");
      }
    })
    .catch((error) => {
      console.log("Internal error. Could not add restaurant.")
    })
  };

  const toggleTrashed = async (restaurant) => {
    let api_body_data = {
      rid: restaurant.id,
      rname: restaurant.name,
      price: restaurant.price,
      rating: restaurant.rating,
      weburl: restaurant.website,
      gmapurl: restaurant.googleMapsLink
    };

    let json_body_data = JSON.stringify(api_body_data);

    // Returns a 200 + warning if restaurant is already added.
    fetch(`${backendURL}/api/serve/add-restaurant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json_body_data
    })
    .then(response => response.json())
    .then(data => {
      if(data.ok()) {
        console.log("Restaurant succesfully added.");
      }
    })
    .catch((error) => {
      console.log("Internal error. Could not add restaurant.")
    })

    let userid = await fetchuid();

    // Add placeid and userid to trashed swipes.
    api_body_data = {
      rid: restaurant.id,
      uid: userid,
    };

    json_body_data = JSON.stringify(api_body_data)


    fetch(`${backendURL}/api/serve/add-user-trashed-restaurant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json_body_data
    })
    .then(response => response.json())
    .then(data => {
      if(data.ok()) {
        console.log("Restaurant succesfully added.");
      }
    })
    .catch((error) => {
      console.log("Internal error. Could not add restaurant.")
    })
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

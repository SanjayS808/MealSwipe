import React, { useEffect, useState, useCallback } from "react";
import Restaurant from "./Restaurant";
import Navigation from "./Navigation";
import FilterPage from "./components/FilterPage";
import "./components/FilterPage.css";
import "./App.css";
import "./components/FilterPage.css";
import {DEV_MODE} from "./config"
import { UserProvider, useUser } from './context/UserContext';

const backendURL = (DEV_MODE) ? "http://localhost:5001"  : "http://MealSw-Backe-k0cJtOkGFP3i-29432626.us-west-1.elb.amazonaws.com";

function App() {
  const [originalBackendData, setOriginalBackendData] = useState([]);
  const [backendData, setBackendData] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [trashedRestaurants, setTrashedRestaurants] = useState([]);

  const [minRating, setMinRating] = useState(0); // Default to 0 stars
  const [maxDistance, setMaxDistance] = useState(50); // Adjust the default value as needed

  const [priceLevels, setPriceLevels] = useState([]);
  
  // Pending filter state (for FilterPage)
  const [pendingMaxDistance, setPendingMaxDistance] = useState(50);
  const [pendingMinRating, setPendingMinRating] = useState(0);
  const [pendingPriceLevels, setPendingPriceLevels] = useState([]);
  
  const [showFilterPage, setShowFilterPage] = useState(false);
  const { user, setUser } = useUser();  

  useEffect(() => {
    const onMount = () => {
      console.log("Application is mounted.")
      console.log(user)
      fetchRestaurants(); 
      loadFavorites();
      loadTrashed();
    };

    onMount();
    return () => {
      console.log("App component is unmounting.")
    }
  }, [user]);

  const fetchuid = async () => {
    let response = await fetch(`${backendURL}/api/serve/get-userid-with-uname?uname=${user}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Backend error. Failed to fetch user information.");
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error("No user found with this username");
      }
      
      return data[0].userid;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
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

  const loadFavorites = async () => {
    if(favoriteRestaurants.length > 0) {return;} // We do not want to do anything.
  
    if(user === null) {return ;} // We do not want to load API if we have no user.
    
    try {
      let userid = await fetchuid();
      
      if (!userid) {
        console.error("Could not fetch user ID");
        setFavoriteRestaurants([]);
        return;
      }
      
      const response = await fetch(`${backendURL}api/serve/get-user-favorite-restaurants?uid=${userid}`);
      
      if (!response.ok) {
        throw new Error("Internal error. Failed to fetch swipe information.");
      }
      
      const data = await response.json();
      
      if(!data.length) {
        setFavoriteRestaurants([]);
      } else {
        const restaurantPromises = data.map(result => 
          fetchRestaurantInfo(result.placeid)
        );
        
        const restaurantInfos = await Promise.all(restaurantPromises);
        
        setFavoriteRestaurants(
          restaurantInfos.map(result => result[0].name)
        );
      }
    } catch (error) {
      console.error("Error in loadFavorites:", error);
      setFavoriteRestaurants([]);
    }
  };
  
const loadTrashed = async () => {
  if(user === null) {return ;} // We do not want to load API if we have no user.
  try {
      let userid = await fetchuid();

      fetch(`${backendURL}/api/serve/get-user-trashed-restaurant?uid=${userid}`)
      .then(response => {
      if(!response.ok) {
        throw new Error("Internal error. Failed to fetch swipe information.");
      }

      const data = await response.json();

      if(!data.length) {
        setTrashedRestaurants([]);
      } else {
        const restaurantPromises = data.map(result => 
          fetchRestaurantInfo(result.placeid)
        );

        const restaurantInfos = await Promise.all(restaurantPromises);

        setTrashedRestaurants(
          restaurantInfos.map(result => result[0].name)
        );
      }
    } catch (error) {
      console.error("Error in loadTrashed:", error);
      setTrashedRestaurants([]);
    }
  };

  const applyFilters = () => {
    // Update active filter state
    setMaxDistance(pendingMaxDistance);
    setMinRating(pendingMinRating);
    setPriceLevels(pendingPriceLevels);

    // Apply filters to the original dataset
    const filtered = originalBackendData.filter(restaurant => {
      // Distance filter 
      const distanceMatch = !restaurant.distanceFromUser || 
        restaurant.distanceFromUser <= pendingMaxDistance;

      // Rating filter
      const ratingMatch = restaurant.rating >= pendingMinRating;

      // Price level filter
      const priceLevelMatch = pendingPriceLevels.length === 0 || 
        pendingPriceLevels.some(level => {
          // Map price levels to match the price representation in the restaurant object
          const priceMap = {
            1: 'PRICE_LEVEL_INEXPENSIVE',
            2: 'PRICE_LEVEL_MODERATE',
            3: 'PRICE_LEVEL_EXPENSIVE',
            4: 'PRICE_LEVEL_VERY_EXPENSIVE'
          };
          return restaurant.price === priceMap[level];
        });

      return distanceMatch && ratingMatch && priceLevelMatch;
    });

    // Update the displayed restaurants
    setFilteredRestaurants(filtered);
    setBackendData(filtered);

    // Close filter page
    setShowFilterPage(false);
  };

  const fetchRestaurants = async () => {
    try {
      // Fetch restaurants without any filtering on the backend
      const response = await fetch(`${backendURL}/api/serve/get-all-restaurants?maxDistance=50`);
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();

      // Map the restaurants 
      const mappedRestaurants = data.map(r => new Restaurant(
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
      ));

      // Store original and filtered data
      setOriginalBackendData(mappedRestaurants);
      setFilteredRestaurants(mappedRestaurants);
      setBackendData(mappedRestaurants);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };


  const clearFavorites = async () => {

    localStorage.removeItem("favorites");
    setFavoriteRestaurants([]);
    if(user === null) {return ;} // We do not want to load API if we have no user.
    const userid = await fetchuid();
    // Deletes from db
    await fetch(`${backendURL}/api/serve/delete-favorite-swipe-with-uid?uid=${userid}`, {
      method: 'DELETE',
    })
    .then(response => {
      console.log(response)
      if (!response.ok) {
        throw new Error("Backend error: Could not delete data")
      }
    })
  };

  const clearTrashed = async () => {
    localStorage.removeItem("trashed");
    setTrashedRestaurants([]);
     // Deletes from db
     if(user === null) {return ;} // We do not want to load API if we have no user.
     const userid = await fetchuid();
     await fetch(`${backendURL}/api/serve/delete-trashed-swipe-with-uid?uid=${userid}`, {
      method: 'DELETE',
     })
     .then(response => {
       if (!response.ok) {
         throw new Error("Backend error: Could not delete data")
       }
     })
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

    if(user === null) {return ;} // We do not want to load API if we have no user.
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

    if(user === null) {return ;} // We do not want to load API if we have no user.
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
       <a href="/login" style={{
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        zIndex: 10, 
       }}>
        <div style={{
        width: '50px', 
        height: '50px',
        padding: '.5em',
        margin: '.1em', 
        }}> 
          <p style={{
            fontSize: 'big',
            fontWeight: 'bold',
            textDEcorationLine: 'none',
            color:'white',
            textAlign: 'center',
            textDecorationLine:'none',}}>
          Login
          </p>
        </div>  
      </a>
      
      <button 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          zIndex: 10, 
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
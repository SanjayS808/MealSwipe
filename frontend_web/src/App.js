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
  const [uid,setUid] = useState(null);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const { user, setUser } = useUser();  

  useEffect(() => {
    const onMount = async () => {
      console.log("Application is mounted.");
      console.log("User:", user);
  
      try {
        let uid = await fetchuid(); 
        console.log("Fetched UID:", uid);
        fetchRestaurants();
        if (uid) {
          setUid(uid);
          
        } else {
          console.warn("No UID retrieved. Skipping data fetch.");
        }
      } catch (error) {
        console.error("Error fetching UID:", error);
      }
    };
  
    onMount(); 
  
    return () => {
      console.log("App component is unmounting.");
    };
  }, [user]);

  const fetchuid = async () => {
    if (user === null || user === undefined) {
      console.error("User is not logged in. Cannot fetch user ID.");
      return null;
    }
    let response = await fetch(`${backendURL}/api/serve/get-userid-with-uname?uname=${user}`)
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

  const loadFavorites = async () => {

    
    if(user === null) {return;} // We do not want to do anything.
    let userid = uid;
    
    fetch(`${backendURL}/api/serve/get-user-favorite-restaurants?uid=${userid}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Internal error. Failed to fetch swipe information.");
      }
      return response.json();
    })
    .then(data => {
      if(!Object.keys(data).length){
        // No data found for user. Set local storage empty.
        setFavoriteRestaurants([]);
      } else {
        setFavoriteRestaurants([]);
        data.forEach((result) => {
          let restaurant_info = fetchRestaurantInfo(result.placeid);
          restaurant_info.then(result => {
            setFavoriteRestaurants(prevSwipes => [...prevSwipes, result[0].name])
          })
        })
      }
    });
  };
  
  const loadTrashed = async () => {
    if(user === null) {return;} // We do not want to do anything.
    let userid = uid;
    
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

  // Modify handleSwipe to use filteredRestaurants
  const handleSwipe = (direction, restaurant) => {
    console.log(`You swiped ${direction} on ${restaurant.name}`);
    if (direction === 'right') {
      setFilteredRestaurants((prev) => prev.filter(r => r.id !== restaurant.id));
      setBackendData((prev) => prev.filter(r => r.id !== restaurant.id));
      toggleFavorite(restaurant);
    } else if (direction === 'left') {
      setFilteredRestaurants((prev) => prev.filter(r => r.id !== restaurant.id));
      setBackendData((prev) => prev.filter(r => r.id !== restaurant.id));
      toggleTrashed(restaurant);
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
      <Navigation
        clearFavorites={clearFavorites}
        clearTrashed={clearTrashed}
        resetBackendData={fetchRestaurants}
        backendData={backendData}
        handleSwipe={handleSwipe}
        likedRestaurants={favoriteRestaurants}
        trashedRestaurants={trashedRestaurants}
        loadFavorites={loadFavorites}
        loadTrashed = {loadTrashed}
      />
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
/**
 * @fileoverview Main App component for Mealswipe.
 * Handles data fetching, filtering, user interactions (swipes, favorites, trash),
 * and renders the UI (restaurant cards, navigation, filter page, loader).
*/

import React, { useEffect, useState, useCallback, useRef} from "react";
import Restaurant from "./Restaurant";
import Navigation from "./Navigation";
import FilterPage from "./components/FilterPage";
import "./components/FilterPage.css";
import "./App.css";
import "./components/FilterPage.css";
import {DEV_MODE} from "./config"
import { useUser } from './context/UserContext';
import { Filter } from "lucide-react";
import { motion } from "framer-motion";
import HeartFlash from './components/Heart';
import TrashFlash from './components/TrashIcon';
import Loader from "./components/Loader";

const backendURL = (DEV_MODE) ? "http://localhost:5001"  : "https://backend.app-mealswipe.com";
window.addEventListener("error", (e) => {
  console.log("Global error caught:", e.message, e.filename, e.lineno);
});

/**
 * Main application component that orchestrates restaurant fetching,
 * user interactions, and UI rendering.
 * @component
 * @returns {JSX.Element}
 */
function App() {
  const [originalBackendData, setOriginalBackendData] = useState([]);
  const [backendData, setBackendData] = useState([]);
  const [, setFilteredRestaurants] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [trashedRestaurants, setTrashedRestaurants] = useState([]);
  const [loggedIn, setLoggedIn ] = useState(false);
  const [, setMinRating] = useState(0); // Default to 0 stars
  const [, setMaxDistance] = useState(50); // Adjust the default value as needed
  const [types, setTypes] = useState([]);
  const [, setPriceLevels] = useState([]);
  
  // Pending filter state (for FilterPage)
  const [pendingMaxDistance, setPendingMaxDistance] = useState(50);
  const [pendingMinRating, setPendingMinRating] = useState(0);
  const [pendingPriceLevels, setPendingPriceLevels] = useState([]);
  const [allowedTypes, setAllowedTypes] = useState([]);
  
  const [uid,setUid] = useState(null);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const { user, incrementSwipes } = useUser();  
  const [isLoading, setIsLoading] = useState(false);
  
  const heartRef = useRef();

   /**
   * Triggers the heart flash animation.
   * @function triggerHeart
   * @returns {void}
   */
  const triggerHeart = () => {
    heartRef.current?.flash();
  };

  const trashRef = useRef();
  /**
   * Triggers the trash flash animation.
   * @function triggerTrash
   * @returns {void}
   */
  const triggerTrash = () => {
    console.log("Trash triggered");
    trashRef.current?.flash();
  };

  /**
   * Fetches the current user's ID from the backend.
   * @async
   * @function fetchuid
   * @returns {Promise<number|null>} The user ID if found, otherwise null.
   */
  const fetchuid = useCallback( async () => {
    if (user === null || user === undefined) {
      setIsLoading(false);
      console.error("User is not logged in. Cannot fetch user ID.");
      return null;
    }
    let response = await fetch(`${backendURL}/api/serve/get-userid-with-uname?uname=${user.name}`)
    .then(response => {
      if(!response.ok) {
        setIsLoading(false);
        throw new Error("Backend error. Failed to fetch user information.");
      }
      return response.json();
    });
    setLoggedIn(true);
    console.log("User ID: ", response[0].userid);
    return response[0].userid;
    
  }, [user]);

  useEffect(() => {
    const onMount = async () => {
      
      if (uid !== null) {
        console.log("UID already set. Skipping fetchuid.");
        return;
      }
      try {
        
        let uid = await fetchuid(); 
        
        await fetchRestaurants();
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
  }, [user, fetchuid, uid]);

    /**
   * Constructs the URL to fetch a restaurant's photo from Google Places.
   * @function fetchGooglePlacePhoto
   * @param {string} rinfo - The place photo reference.
   * @returns {string} The full URL to fetch the photo.
   */
  const fetchGooglePlacePhoto = (rinfo) => {
    return `${backendURL}/api/serve/get-restaurant-photo?rinfo=${rinfo}`;
  };

  /**
   * Fetches detailed information for a given restaurant ID.
   * @async
   * @function fetchRestaurantInfo
   * @param {string} rid - The restaurant's unique identifier.
   * @returns {Promise<any>} The restaurant information object.
   */
  const fetchRestaurantInfo = async (rid) => {

     // ✅ always hide loader
    console.log(isLoading);
    let response = await fetch(`${backendURL}/api/serve/get-rinfo-with-rid?rid=${rid}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Backend error. Failed to fetch user information.");
      }
      return response.json();
    });
    
    return response;
  }

  /**
   * Loads and sets the user's favorite restaurants.
   * @async
   * @function loadFavorites
   * @returns {Promise<void>}
   */
  const loadFavorites = async () => {
    setIsLoading(true); 
    console.log("1"); // ✅ always hide loader
    console.log("Loading favorites...");
    if (user === null) {
      setIsLoading(false);  // ✅ always hide loader
      return;
    }
    setIsLoading(false);
    let userid = uid;
  
    try {
      const response = await fetch(`${backendURL}/api/serve/get-user-favorite-restaurants?uid=${userid}`);
      
      if (!response.ok) {
        throw new Error("Internal error. Failed to fetch swipe information.");
      }
  
      const data = await response.json();
  
      if (!Object.keys(data).length) {
        setFavoriteRestaurants([]);
        return;
      }
  
      // Map to promises
      const restaurantInfoPromises = data.map((result) => fetchRestaurantInfo(result.placeid));
  
      // Wait for all to resolve
      const restaurantInfoResults = await Promise.all(restaurantInfoPromises);
  
      // Extract names
      const favoritesTEMP = restaurantInfoResults.map(result => result[0]);
  
      // Set state
      setFavoriteRestaurants(favoritesTEMP);
      
  
      console.log("Favorites: ", favoritesTEMP);
    } catch (error) {
      
      console.error("Error loading favorites:", error);
    
    } finally {
      setIsLoading(false);  // ✅ always hide loader
    }
  };
  
  /**
   * Loads and sets the user's trashed restaurants.
   * @async
   * @function loadTrashed
   * @returns {Promise<void>}
   */
  const loadTrashed = async () => {
    setIsLoading(true);
    console.log("2");  // ✅ always hide loader
    console.log("Loading trashed...");
    if (user === null) {
      setIsLoading(false);  // ✅ always hide loader
      return;
    }
  
    const userid = uid;
  
    try {
      const response = await fetch(`${backendURL}/api/serve/get-user-trashed-restaurant?uid=${userid}`);
  
      if (!response.ok) {
        throw new Error("Internal error. Failed to fetch swipe information.");
      }
  
      const data = await response.json();
  
      if (!Object.keys(data).length) {
        setTrashedRestaurants([]);
        return;
      }
  
      // Reset state before setting new values
      setTrashedRestaurants([]);
  
      // Wait for all fetchRestaurantInfo calls to resolve
      const restaurantInfoPromises = data.map((result) =>
        fetchRestaurantInfo(result.placeid)
      );
  
      const restaurantInfoResults = await Promise.all(restaurantInfoPromises);
  
      const trashedNames = restaurantInfoResults.map(result => result[0]);
  
      setTrashedRestaurants(trashedNames);
    } catch (error) {
      console.error("Error loading trashed restaurants:", error);
    } finally{
      setIsLoading(false);  // ✅ always hide loader
    }
  };
  
  /**
   * Resets backend data and pending filters to defaults.
   * @function
   * @returns {void}
   */
  const resetBackendData = () => {

    fetchRestaurants();
    setPendingMaxDistance(50);
    setPendingMinRating(0);
    setPendingPriceLevels([]);
  };

  /**
   * Applies the pending filter settings to the restaurant list.
   * @function
   * @returns {void}
   */
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
      const typeMatch =
        allowedTypes.length === 0 ||
        allowedTypes.includes(restaurant.cuisineType);
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

      return distanceMatch && ratingMatch && priceLevelMatch && typeMatch;
    });

    // Update the displayed restaurants
    setFilteredRestaurants(filtered);
    setBackendData(filtered);

    // Close filter page
    setShowFilterPage(false);
  };

  /**
   * Fetches all restaurants from backend, maps and shuffles them,
   * and initializes application state (original, filtered, types).
   * @async
   * @function fetchRestaurants
   * @returns {Promise<void>}
   */
  const fetchRestaurants = async () => {

    setIsLoading(true);  // ✅ always hide loader
    console.log("3");
    console.log("Fetching restaurants...");
  
    try {
      // Fetch restaurants without any filtering on the backend
      const response = await fetch(`${backendURL}/api/serve/get-all-restaurants?maxDistance=50`);
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      console.log("Fetched restaurants data:", data);
      // Map the restaurants 
      
      
      const mappedRestaurants = data.map(r => new Restaurant(
          r.id,
          r.displayName?.text,
          r.rating,
          r.priceLevel,
          r.shortFormattedAddress,
          r.generativeSummary?.overview?.text ?? r.editorialSummary?.text,
          r.googleMapsLinks?.placeUri,
          r.reviews?.map(review => ({
            author: review.authorAttribution.displayName,
            text: review.originalText.text,
            rating: review.rating,
          })) || [],
          r.websiteUri,
          r.userRatingCount,
          r.currentOpeningHours?.openNow ?? false,
          r.nationalPhoneNumber,
          r.photos,
          r.distanceFromCenter || 0,
          r.primaryType || "Unknown", 
          r.userRatingCount,
          r.regularOpeningHours?.periods || [],   
        )
      );

      // To save resources. We will just load the first two images. For every swipe, we load the next image.
      // console.log("Fetched 2 images");
      let photoURL = await fetchGooglePlacePhoto(mappedRestaurants[mappedRestaurants.length - 1].photos[0].name)
      mappedRestaurants[mappedRestaurants.length - 1].imageUrl = photoURL;
      photoURL = await fetchGooglePlacePhoto(mappedRestaurants[mappedRestaurants.length - 2].photos[0].name)
      mappedRestaurants[mappedRestaurants.length - 2].imageUrl = photoURL;
      const shuffledRestaurants = [...mappedRestaurants].sort(() => Math.random() - 0.5);
      // Store original and filtered data
      setOriginalBackendData(shuffledRestaurants);
      setFilteredRestaurants(shuffledRestaurants);
      setBackendData(shuffledRestaurants);
      const uniqueTypes = [
        ...new Set(
          shuffledRestaurants
            .map(r => r.cuisineType)
            .filter(Boolean)
        )
      ];
      
      setTypes(uniqueTypes);
      setAllowedTypes(uniqueTypes);
      console.log(mappedRestaurants)
      console.log("Types: ", uniqueTypes);
      

    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);  // ✅ always hide loader
    }

  };

  /**
   * Handles swipe actions (right = favorite, left = trash) on a restaurant.
   * Updates state, triggers animations, and persists to backend.
   * @async
   * @function handleSwipe
   * @param {'left'|'right'} direction - Swipe direction.
   * @param {Restaurant} restaurant - The restaurant being swiped.
   * @returns {Promise<void>}
   */
  const handleSwipe = async (direction, restaurant) => {
    if(backendData.length >= 3) {
      console.log(`Updating photo for ${backendData[backendData.length - 3].name}`)
      let photoURL = await fetchGooglePlacePhoto(backendData[backendData.length - 3].photos[0].name)
      backendData[backendData.length - 3].imageUrl = photoURL;
    }

    console.log(`You swiped ${direction} on ${restaurant.name}`);
    if (direction === 'right') {
      triggerHeart();
      setFilteredRestaurants((prev) => prev.filter(r => r.id !== restaurant.id));
      setBackendData((prev) => prev.filter(r => r.id !== restaurant.id));
      toggleFavorite(restaurant);
    } else if (direction === 'left') {
      triggerTrash();
      setFilteredRestaurants((prev) => prev.filter(r => r.id !== restaurant.id));
      setBackendData((prev) => prev.filter(r => r.id !== restaurant.id));
      toggleTrashed(restaurant);
    }
  };

  /**
   * Clears all favorite restaurants both locally and in the backend.
   * @async
   * @function clearFavorites
   * @returns {Promise<void>}
   */
  const clearFavorites = async () => {
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

  /**
   * Clears all trashed restaurants both locally and in the backend.
   * @async
   * @function clearTrashed
   * @returns {Promise<void>}
   */
  const clearTrashed = async () => {
    
    setTrashedRestaurants([]);
     // Deletes from db
     if(user === null) {return ;} 
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

  /**
   * Deletes a single restaurant from the trash in the backend.
   * @async
   * @function deleteRestaurantFromTrash
   * @param {string} restaurantID - The ID of the restaurant to delete.
   * @returns {Promise<void>}
   */
  const deleteRestaurantFromTrash = async (restaurantID) => {

    await fetch(`${backendURL}/api/serve/delete-trashed-swipe-with-rid-uid?rid=${restaurantID}&uid=${uid}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        console.error("Backend error: Could not delete data");
        }
    
      });
    
  };

  /**
   * Deletes a single restaurant from favorites in the backend.
   * @async
   * @function deleteRestaurantFromFavorites
   * @param {string} restaurantID - The ID of the restaurant to delete.
   * @returns {Promise<void>}
   */
  const deleteRestaurantFromFavorites = async (restaurantID) => {
    
    await fetch(`${backendURL}/api/serve/delete-favorite-swipe-with-rid-uid?rid=${restaurantID}&uid=${uid}`, {
      method: 'DELETE',
    })
    .then(response => {
      
      if (!response.ok) {
        console.err("Backend error: Could not delete data");
        }
      });
      
  };

  /**
   * Toggles a restaurant as favorite: adds it to both global and user-specific tables,
   * triggers increment of swipe count, and removes from trashed if present.
   * @async
   * @function toggleFavorite
   * @param {Restaurant} restaurant - The restaurant to favorite.
   * @returns {Promise<void>}
   */
  const toggleFavorite = async (restaurant) => {
    let api_body_data = {
      rid: restaurant.id,
      rname: restaurant.name,
      price: restaurant.price,
      rating: restaurant.rating,
      weburl: restaurant.website,
      gmapurl: restaurant.googleMapsLink,
      address: restaurant.address,
      photoUrl: restaurant.photos[0].name,
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
    .then(response => response.json() )
    
    .then(data => {
      if(data) {
        console.log("Restaurant succesfully added.");
      }
    })
    .catch((error) => {
      console.log(error)
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
      if(data) {
        console.log("Restaurant succesfully added.");
      }
    })
    .catch((error) => {
      console.log("Internal error. Could not add restaurant.")
    })

    fetch(`${backendURL}/api/serve/increment-swipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json_body_data
    })
    .then(response => {
      if(response) {
        console.log("successfully added swipe.")
      }
    })
    .catch((error) => {
      console.log("Internal error. Could not add swipe" + error)
    });
    deleteRestaurantFromTrash(restaurant);
  };

  /**
   * Toggles a restaurant as trashed: adds it to both global and user-specific tables,
   * triggers increment of swipe count, and removes from favorites if present.
   * @async
   * @function toggleTrashed
   * @param {Restaurant} restaurant - The restaurant to trash.
   * @returns {Promise<void>}
   */
  const toggleTrashed = async (restaurant) => {
    let api_body_data = {
      rid: restaurant.id,
      rname: restaurant.name,
      price: restaurant.price,
      rating: restaurant.rating,
      weburl: restaurant.website,
      gmapurl: restaurant.googleMapsLink,
      address: restaurant.address,
      photoUrl: restaurant.photos[0].name,
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
      if(data) {
        console.log("Restaurant succesfully added.");
      }
    })
    .catch((error) => {
      console.log("Internal error. Could not add restaurant." + error)
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
      if(data) {
        console.log("Restaurant succesfully added.");
      }
    })
    .catch((error) => {
      console.log("Internal error. Could not add restaurant.")
    })

    fetch(`${backendURL}/api/serve/increment-swipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json_body_data
    })
    .then(response => {
      if(response) {
        console.log("successfully added swipe.")
      }
    })
    .catch((error) => {
      console.log("Internal error. Could not add swipe" + error)
    });
    deleteRestaurantFromFavorites(restaurant.id);
    incrementSwipes();
  };

  const styles = {
    button: {
      position: "absolute",
      top: "15px",
      right: "10px",
      zIndex: 100,
      width: "55px",
      height: "55px",
      borderRadius: "50%",
      backgroundColor: "#333", // Tailwind's bg-neutral-800
      border: "2px solid white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "border-color 0.4s ease, background-color 0.4s ease",
      cursor: "pointer",
    },
  }


  return (
    <div className="App">
      <HeartFlash ref={heartRef} />
      <TrashFlash ref={trashRef} />
      
      <Navigation
        clearFavorites={clearFavorites}
        clearTrashed={clearTrashed}
        resetBackendData={resetBackendData}
        backendData={backendData}
        handleSwipe={handleSwipe}
        likedRestaurants={favoriteRestaurants}
        trashedRestaurants={trashedRestaurants}
        loadFavorites={loadFavorites}
        loadTrashed = {loadTrashed}
        loggedIn={loggedIn}
        isLoading={isLoading}
        deleteRestaurantFromFavorites={deleteRestaurantFromFavorites}
        deleteRestaurantFromTrash={deleteRestaurantFromTrash}
        setUid={setLoggedIn}
        fetchuid = {fetchuid}
      />
      {isLoading && <Loader />}

      <motion.button
        whileHover={{
          scale: 1.1,
          rotate: 10,
          borderColor: "#fff", // Tailwind sky-400
          backgroundColor: "#3c3c3c", // darker variant
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowFilterPage(true)}
        style={styles.button}
        aria-label="Open Filter"
        >
         <Filter size={24} color="#ffffff" />
      </motion.button>
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
        types = {types}
        allowedTypes = {allowedTypes}
        setAllowedTypes = {setAllowedTypes}
        fetchRestaurants={fetchRestaurants}
        
      />
    </div>
  );
}


export default App;
import React, { useEffect, useState, useCallback ,useRef} from "react";
import Restaurant from "./Restaurant";
import Navigation from "./Navigation";
import FilterPage from "./components/FilterPage";
import "./components/FilterPage.css";
import "./App.css";
import "./components/FilterPage.css";
import {DEV_MODE} from "./config"
import { UserProvider, useUser } from './context/UserContext';
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import { motion } from "framer-motion";
import HeartFlash from './components/Heart';
import TrashFlash from './components/TrashIcon';
import Loader from "./components/Loader";
const backendURL = (DEV_MODE) ? "http://localhost:5001"  : "http://MealSw-Backe-k0cJtOkGFP3i-29432626.us-west-1.elb.amazonaws.com";

function App() {
  const [originalBackendData, setOriginalBackendData] = useState([]);
  const [backendData, setBackendData] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [trashedRestaurants, setTrashedRestaurants] = useState([]);
  const [loggedIn, setLoggedIn ] = useState(false);
  const [minRating, setMinRating] = useState(0); // Default to 0 stars
  const [maxDistance, setMaxDistance] = useState(50); // Adjust the default value as needed
  const [types, setTypes] = useState([]);
  const [priceLevels, setPriceLevels] = useState([]);
  
  // Pending filter state (for FilterPage)
  const [pendingMaxDistance, setPendingMaxDistance] = useState(50);
  const [pendingMinRating, setPendingMinRating] = useState(0);
  const [pendingPriceLevels, setPendingPriceLevels] = useState([]);
  const [uid,setUid] = useState(null);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const { user, setUser, incrementSwipes } = useUser();  
  const [isLoading, setIsLoading] = useState(false);

  const heartRef = useRef();
  const triggerHeart = () => {
    heartRef.current?.flash();
  };

  const trashRef = useRef();
  const triggerTrash = () => {
    console.log("Trash triggered");
    trashRef.current?.flash();
  };

  useEffect(() => {
    const onMount = async () => {
    
  
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
  }, [user]);

  const fetchuid = async () => {
    if (user === null || user === undefined) {
      console.error("User is not logged in. Cannot fetch user ID.");
      return null;
    }
    let response = await fetch(`${backendURL}/api/serve/get-userid-with-uname?uname=${user.name}`)
    .then(response => {
      if(!response.ok) {
        throw new Error("Backend error. Failed to fetch user information.");
      }
      return response.json();
    });
    setLoggedIn(true);
    return response[0].userid;
  };

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
  const loadFavorites = async () => {
    setIsLoading(true);
    
    if (user === null) return;
  
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
      const favoritesTEMP = restaurantInfoResults.map(result => result[0].name);
  
      // Set state
      
      setFavoriteRestaurants(favoritesTEMP);
      
  
      console.log("Favorites: ", favoritesTEMP);
    } catch (error) {
      
      console.error("Error loading favorites:", error);
    
    } finally {
      setIsLoading(false);  // ✅ always hide loader
    }
  };
  
  const loadTrashed = async () => {
    setIsLoading(true);
    if (user === null) return;
  
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
  
      const trashedNames = restaurantInfoResults.map(result => result[0].name);
  
      setTrashedRestaurants(trashedNames);
    } catch (error) {
      console.error("Error loading trashed restaurants:", error);
    } finally{
      setIsLoading(false);  // ✅ always hide loader
    }
  };
  
  const resetBackendData = () => {

    fetchRestaurants();
    setPendingMaxDistance(50);
    setPendingMinRating(0);
    setPendingPriceLevels([]);
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

    setIsLoading(true);  // ✅ always hide loader
  
    try {
      // Fetch restaurants without any filtering on the backend
      const response = await fetch(`${backendURL}/api/serve/get-all-restaurants?maxDistance=50`);
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      console.log("Fetched restaurants data:", data);
      // Map the restaurants 
      setTypes([
        ...new Set(
          data.map(r => r.primaryType?.trim().toLowerCase()).filter(Boolean)
        )
      ]);
      console.log("Types: ", types);
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

      // Store original and filtered data
      setOriginalBackendData(mappedRestaurants);
      setFilteredRestaurants(mappedRestaurants);
      setBackendData(mappedRestaurants);

      

    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);  // ✅ always hide loader
    }

  };

  // Modify handleSwipe to use filteredRestaurants
  const handleSwipe = (direction, restaurant) => {
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

  const deleteRestaurantFromTrash = async (restaurant) => {

    await fetch(`${backendURL}/api/serve/delete-trashed-swipe-with-rid-uid?rid=${restaurant.id}&uid=${uid}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        console.error("Backend error: Could not delete data");
        }
    
      });
  };

  const deleteRestaurantFromFavorites = async (restaurant) => {

    await fetch(`${backendURL}/api/serve/delete-favorite-swipe-with-rid-uid?rid=${restaurant.id}&uid=${uid}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        console.err("Backend error: Could not delete data");
        }
    
      });
  };
  const toggleFavorite = async (restaurant) => {
    let api_body_data = {
      rid: restaurant.id,
      rname: restaurant.name,
      price: restaurant.price,
      rating: restaurant.rating,
      weburl: restaurant.website,
      gmapurl: restaurant.googleMapsLink,
      address: restaurant.address
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

  const toggleTrashed = async (restaurant) => {
    let api_body_data = {
      rid: restaurant.id,
      rname: restaurant.name,
      price: restaurant.price,
      rating: restaurant.rating,
      weburl: restaurant.website,
      gmapurl: restaurant.googleMapsLink,
      address: restaurant.address
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
    deleteRestaurantFromFavorites(restaurant);
    incrementSwipes();
  };

  const styles = {
    button: {
      position: "absolute",
      zIndex: "10",
      top: "15px",
      right: "10px",
      zIndex: 1000,
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
        
      />
    </div>
  );
}

export default App;
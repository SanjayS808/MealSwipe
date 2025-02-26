import React, { useEffect, useState } from "react";
import Restaurant from "./Restaurant";
import Navigation from "./Navigation";


import "./App.css";




function App() {
  const [backendData, setBackendData] = useState([]);
  const [likedRestaurants, setLikedRestaurants] = useState([]);
  const [trashedRestaurants, setTrashedRestaurants] = useState([]);
  
  const handleSwipe = (direction, restaurant) => {
    console.log(`You swiped ${direction} on ${restaurant.name}`);

    if (direction === 'right') {
      setLikedRestaurants((prev) => [...prev, restaurant]);
    } else if (direction === 'left') {
      setTrashedRestaurants((prev) => [...prev, restaurant]);
    }
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
  }, []);

  return (
    <Navigation 
      backendData={backendData}
      handleSwipe={handleSwipe}
      likedRestaurants={likedRestaurants}
      trashedRestaurants={trashedRestaurants}
    />
  );
}

export default App;

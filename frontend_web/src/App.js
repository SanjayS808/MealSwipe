import React, { useEffect, useState } from "react";
import Restaurant from "./Restaurant";
import TinderCard from 'react-tinder-card'

function App() {
  const [backendData, setBackendData] = useState([]);

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
    <div>
      <h2>Restaurant List</h2>
      <ul>
        {backendData.length > 0 ? (
          backendData.map(restaurant => (
            <li key={restaurant.id}>
              {restaurant.name} - {restaurant.rating}⭐ - Price Level: {restaurant.priceLevel} - Rating: {restaurant.rating}
            </li>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </ul>
    </div>
  );
}

export default App;

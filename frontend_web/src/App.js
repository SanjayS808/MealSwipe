import React, { useEffect, useState } from "react";
import Restaurant from "./Restaurant";
import TinderCard from 'react-tinder-card'
import "./App.css";

const db = [
  {
    name: 'Richard Hendricks',
    url: './img/richard.jpg'
  },
  {
    name: 'Erlich Bachman',
    url: './img/erlich.jpg'
  },
  {
    name: 'Monica Hall',
    url: './img/monica.jpg'
  },
  {
    name: 'Jared Dunn',
    url: './img/jared.jpg'
  },
  {
    name: 'Dinesh Chugtai',
    url: './img/dinesh.jpg'
  }
]


function App() {
  const [backendData, setBackendData] = useState([]);
  const [likedRestaurants, setLikedRestaurants] = useState([]);
  const [trashedRestaurants, setTrashedRestaurants] = useState([]);

  const onSwipe = (direction, restaurant) => {
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
    <div>

    
      <h2>Restaurant List</h2>
      
    
        <br></br>
        <div className="cardContainer">
          {backendData.map((restaurant) => (
            <TinderCard
              className="swipe"
              key={restaurant.id}
              onSwipe={(dir) => onSwipe(dir, restaurant)}
              
            >
              <div
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
                }}
                className="card"
              >
                <h3 className="text-lg font-bold">{restaurant.name}</h3>
                <p className="text-sm">{restaurant.rating}⭐ • Price Level: {restaurant.priceLevel}</p>
              </div>
            </TinderCard>
          ))}
        </div>

        <div className="liked-restaurants">
          <h3>Liked Restaurants:</h3>
          <ul>
            {likedRestaurants.map((restaurant, index) => (
              <li key={index}>{restaurant.name}</li>
            ))}
          </ul> 
          </div>
          <div className="trashed-restaurants">
          <h3>Trashed Restaurants:</h3>
          <ul>
            {trashedRestaurants.map((restaurant, index) => (
              <li key={index}>{restaurant.name}</li>
            ))}
          </ul>
          </div>

    </div>
  );
}

export default App;

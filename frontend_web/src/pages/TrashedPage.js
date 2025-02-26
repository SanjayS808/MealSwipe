import React from "react";

function TrashedPage({ trashedRestaurants }) {
  return (
    <div>
      <h2>Trashed Restaurants</h2>
      <ul>
        {trashedRestaurants.length === 0 ? (
          <p>No trashed restaurants yet.</p>
        ) : (
          trashedRestaurants.map((restaurant, index) => (
            <li key={index}>{restaurant.name}</li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TrashedPage;

import React from "react";

function TrashedPage({ trashedRestaurants , clearTrashed}) {
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
      <button onClick={() => clearTrashed()}>Clear Trashed</button>
    </div>
  );
}

export default TrashedPage;

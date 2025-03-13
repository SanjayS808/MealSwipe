import React from "react";
import "./trash.css"
function TrashedPage({ trashedRestaurants , clearTrashed}) {
  return (
    <div className="trashedPage">
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

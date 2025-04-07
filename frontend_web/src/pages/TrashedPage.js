import React, {useEffect} from "react";
import "./trash.css"
function TrashedPage({ trashedRestaurants , clearTrashed, loadTrashed }) {
  useEffect(() => {
    console.log("Loading trashed restaurants...");
    loadTrashed();
  }
  , []); // Load trashed restaurants on component mount
  return (
    <div className="trashedPage">
      <h2>Trashed Restaurants</h2>
      <ul>
        {trashedRestaurants.length === 0 ? (
          <p>No trashed restaurants yet.</p>
        ) : (
          trashedRestaurants.map((restaurant, index) => (
            <li key={index}>{restaurant}</li>
          ))
        )}
      </ul>
      <button onClick={() => clearTrashed()}>Clear Trashed</button>
    </div>
  );
}

export default TrashedPage;

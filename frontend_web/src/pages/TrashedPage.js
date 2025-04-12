import React, {useEffect} from "react";
import "./trash.css"
function TrashedPage({ trashedRestaurants , clearTrashed, loadTrashed ,loggedIn = {loggedIn},isLoading= {isLoading}}) {
  useEffect(() => {
    console.log("Loading trashed restaurants...");
    loadTrashed();
  }
  , []); // Load trashed restaurants on component mount
  return (
    
    loggedIn ? (
      <div className="trashedPage">
        <h2>Trashed Restaurants</h2>
        
        {isLoading ? (
          null ):
          
          trashedRestaurants.length === 0 ? (
          <div className="noRestaurants">
            <h2>props to you for not being picky!</h2>
              
          </div>
        ) : (
          <ul>
            {trashedRestaurants.map((restaurant, index) => (
              <li key={index}>{restaurant}</li>
            ))}
          </ul>
        )}

        {trashedRestaurants.length > 0 ? (
          <button onClick={() => clearTrashed()}>Clear Trashed</button>) : null
          }
        
      </div>
    ) : (
      <div className="trashedPage">
        <h2>Trashed Restaurants</h2>
        <p>Please log in to view your trashed restaurants.</p>
      </div>
    )
  );
}

export default TrashedPage;

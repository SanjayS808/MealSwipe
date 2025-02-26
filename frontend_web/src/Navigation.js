import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RestaurantList from "./components/RestaurantList";
import FavoritesPage from "./pages/FavoritesPage";
import TrashedPage from "./pages/TrashedPage";

function Navigation({ backendData, likedRestaurants, trashedRestaurants ,handleSwipe}) {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/favorites">Favorites</Link> | 
        <Link to="/trashed">Trashed</Link>
      </nav>

      <Routes>
        <Route path="/" element={<RestaurantList restaurants={backendData} onSwipe={handleSwipe}/>} />
        <Route path="/favorites" element={<FavoritesPage likedRestaurants={likedRestaurants} />} />
        <Route path="/trashed" element={<TrashedPage trashedRestaurants={trashedRestaurants} />} />
      </Routes>
    </Router>
  );
}

export default Navigation;

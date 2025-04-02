import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import RestaurantList from "./components/RestaurantList";
import FavoritesPage from "./pages/FavoritesPage";
import TrashedPage from "./pages/TrashedPage";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import "./styles/navbar.css";

function Navigation({ backendData, likedRestaurants, trashedRestaurants, handleSwipe, resetBackendData, clearFavorites, clearTrashed }) {
  return (
    <div>
      <div className="header">
        <h1>mealswipe!</h1>
      </div>

      <Routes>
        <Route path="/favorites" element={<FavoritesPage likedRestaurants={likedRestaurants} clearFavorites={clearFavorites} />} />
        <Route path="/" element={<RestaurantList restaurants={backendData} onSwipe={handleSwipe} resetBackendData={resetBackendData} />} />
        <Route path="/trashed" element={<TrashedPage trashedRestaurants={trashedRestaurants} clearTrashed={clearTrashed} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage/>}/>
      </Routes>

      <nav className="bottomNav">
        <Link to="/favorites">Favorites</Link> |
        <Link to="/">Home</Link> |
        <Link to="/trashed">Trashed</Link>
      </nav>
    </div>
  );
}

export default Navigation;
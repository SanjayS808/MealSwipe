import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import RestaurantList from "./components/RestaurantList";
import FavoritesPage from "./pages/FavoritesPage";
import TrashedPage from "./pages/TrashedPage";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import "./styles/navbar.css";
import LoginPic from "./components/LoginPic";

function Navigation({ backendData, likedRestaurants, trashedRestaurants ,handleSwipe, resetBackendData, clearFavorites, clearTrashed,loadFavorites, loadTrashed }) {
  return (
    <div>
      <div style={{
        zIndex: 100,
      }} className="header">
        <LoginPic></LoginPic>
        <h1>mealswipe!</h1>
      </div>

      <Routes>
            <Route path="/favorites" element={<FavoritesPage likedRestaurants={likedRestaurants} clearFavorites = {clearFavorites} loadFavorites = {loadFavorites}/>} />
            <Route path="/" element={<RestaurantList restaurants={backendData} onSwipe={handleSwipe} resetBackendData = {resetBackendData}/>} />
            <Route path="/trashed" element={<TrashedPage trashedRestaurants={trashedRestaurants} clearTrashed = {clearTrashed} loadTrashed = {loadTrashed} />} />
            <Route path="/login" element={<Login />} />
      </Routes>

      <nav className="bottomNav">
        <Link to="/trashed">Trashed</Link>|
        <Link to="/">Home</Link> |
        <Link to="/favorites">Favorites</Link> 
      </nav>
    </div>
  );
}

export default Navigation;
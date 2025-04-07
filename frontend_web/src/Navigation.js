import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {StyleSheet } from "react-native";
import RestaurantList from "./components/RestaurantList";
import FavoritesPage from "./pages/FavoritesPage";
import TrashedPage from "./pages/TrashedPage";
import Login from "./pages/Login";
import "./styles/navbar.css";
import { CookiesProvider } from 'react-cookie';

function Navigation({ backendData, likedRestaurants, trashedRestaurants ,handleSwipe, resetBackendData, clearFavorites, clearTrashed,loadFavorites, loadTrashed }) {
  return (
    <CookiesProvider>
        <Router>
          <div className="header">
            <h1>mealswipe!</h1>
          </div>

          <Routes>
            <Route path="/favorites" element={<FavoritesPage likedRestaurants={likedRestaurants} clearFavorites = {clearFavorites} loadFavorites = {loadFavorites}/>} />
            <Route path="/" element={<RestaurantList restaurants={backendData} onSwipe={handleSwipe} resetBackendData = {resetBackendData}/>} />
            <Route path="/trashed" element={<TrashedPage trashedRestaurants={trashedRestaurants} clearTrashed = {clearTrashed} loadTrashed = {loadTrashed} />} />
            <Route path="/login" element={<Login />} />
          </Routes>

          <nav className="bottomNav">
            
            <Link to="/favorites">Favorites</Link> | 
            <Link to="/">Home</Link> | 
            <Link to="/trashed">Trashed</Link>
          </nav>
        </Router>
    </CookiesProvider>
  );
}

export default Navigation;

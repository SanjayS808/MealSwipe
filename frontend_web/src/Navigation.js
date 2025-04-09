import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Home, Heart } from "lucide-react";
import RestaurantList from "./components/RestaurantList";
import FavoritesPage from "./pages/FavoritesPage";
import TrashedPage from "./pages/TrashedPage";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import "./styles/navbar.css";
import LoginPic from "./components/LoginPic";

const navItems = [
  { path: "/trashed", icon: Trash2, label: "Trashed" },
  { path: "/", icon: Home, label: "Home" },
  { path: "/favorites", icon: Heart, label: "Favorites" },
];

function Navigation({ backendData, likedRestaurants, trashedRestaurants ,handleSwipe, resetBackendData, clearFavorites, clearTrashed,loadFavorites, loadTrashed ,loggedIn}) {
  const location = useLocation();
  const styles = {
    navContainer: {
      position: "fixed",
      zIndex: "0",
      bottom: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#333", 
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "12px 0",
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
      boxShadow: "0 -2px 6px rgba(0, 0, 0, 0.2)",
      zIndex: 100,
    },
    link: {
      textDecoration: "none",
    },
    iconWrapper: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "8px",
      transition: "transform 0.3s",
    },
    icon: {
      transition: "color 0.3s",
    },
    activeIndicator: {
      position: "absolute",
      bottom: -4,
      height: 4,
      width: 24,
      borderRadius: 2,
      backgroundColor: "#fff",
    },
  };
  return (
    <div>
      <div style={{
        zIndex: 100,
      }} className="header">
        <LoginPic></LoginPic>
        <h1>mealswipe!</h1>
      </div>


      <Routes>
            <Route path="/favorites" element={<FavoritesPage likedRestaurants={likedRestaurants} clearFavorites = {clearFavorites} loadFavorites = {loadFavorites} loggedIn = {loggedIn}/>} />
        <Route path="/" element={<RestaurantList restaurants={backendData} onSwipe={handleSwipe} resetBackendData={resetBackendData} />} />
            <Route path="/trashed" element={<TrashedPage trashedRestaurants={trashedRestaurants} clearTrashed = {clearTrashed} loadTrashed = {loadTrashed} loggedIn = {loggedIn} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage/>}/>
      </Routes>


      <nav style={styles.navContainer}>
      {navItems.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;

        return (
          <Link to={path} key={path} aria-label={label} style={styles.link}>
            <div style={styles.iconWrapper}>
              <Icon
                size={24}
                color={isActive ? "#ffffff" : "#9ca3af"}
                style={styles.icon}
              />
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  style={styles.activeIndicator}
                />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
    </div>
  );
}

export default Navigation;
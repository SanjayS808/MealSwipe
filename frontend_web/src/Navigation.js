/** MealSwipe navigation component.
 * @module Navigation-Component
 * @requires React
 */
/**
 * @fileoverview Navigation bar component for Mealswipe.
 * Renders the header with logo, page routes, and bottom navigation icons.
 */

import React, { useRef } from "react";
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
import logo from "./mealSwipeLogo.png";

const navItems = [
  { path: "/trashed", icon: Trash2, label: "Trashed" },
  { path: "/", icon: Home, label: "Home" },
  { path: "/favorites", icon: Heart, label: "Favorites" },
];

/**
 * Navigation component for Mealswipe.
 * @component
 * @param {Object} props
 * @param {Array} props.backendData - All restaurant data for the home view.
 * @param {Array} props.likedRestaurants - User's favorite restaurants.
 * @param {Array} props.trashedRestaurants - User's trashed restaurants.
 * @param {Function} props.handleSwipe - Handler for swipe actions on restaurants.
 * @param {Function} props.resetBackendData - Resets restaurant data to initial state.
 * @param {Function} props.clearFavorites - Clears all favorite restaurants.
 * @param {Function} props.clearTrashed - Clears all trashed restaurants.
 * @param {Function} props.loadFavorites - Loads favorites from the backend.
 * @param {Function} props.loadTrashed - Loads trashed from the backend.
 * @param {boolean} props.loggedIn - Whether the user is logged in.
 * @param {boolean} props.isLoading - Loading indicator flag.
 * @param {Function} props.deleteRestaurantFromFavorites - Deletes a single favorite.
 * @param {Function} props.deleteRestaurantFromTrash - Deletes a single trashed item.
 * @param {Function} props.setUid - Sets the user ID in parent context.
 * @returns {JSX.Element} The rendered navigation UI.
 */
function Navigation({ backendData, likedRestaurants, trashedRestaurants ,handleSwipe, resetBackendData, clearFavorites, clearTrashed,loadFavorites, loadTrashed ,loggedIn,isLoading,deleteRestaurantFromFavorites, deleteRestaurantFromTrash,setUid,fetchuid}) {
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const logoRef = useRef(null);
  const location = useLocation();

  /**
   * Handles clicks on the logo: animates jiggle and triggers an easter egg
   * after 7 rapid clicks (within 600ms intervals).
   * @returns {void}
   */
  const handleLogoClick = () => {
    const logoEl = logoRef.current;
    if (logoEl) {
      logoEl.classList.remove("jiggle");
      void logoEl.offsetWidth; // force reflow
      logoEl.classList.add("jiggle");
    }
    const now = Date.now();
    if (now - lastClickTimeRef.current < 600) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }
    lastClickTimeRef.current = now;
    if (clickCountRef.current === 7) {
      alert("leanna was here");
      clickCountRef.current = 0;
    }
  };

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
      <div style={{ zIndex: 100 }} className="header">
        <LoginPic />
        <div
          className="logodiv"
          style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h1 style={{ marginLeft: "0em", cursor: "pointer" }}>mealswipe</h1>
          </Link>
          <img
            src={logo}
            className="logoimage"
            style={{ width: "25px", height: "auto", marginLeft: "0em" }}
            onClick={handleLogoClick}
            ref={logoRef}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: "64px" }}>
        <Routes>
          <Route path="/favorites" element={<FavoritesPage likedRestaurants={likedRestaurants} clearFavorites={clearFavorites} loadFavorites={loadFavorites} loggedIn={loggedIn} isLoading={isLoading} deleteRestaurantFromFavorites={deleteRestaurantFromFavorites} fetchuid = {fetchuid}/>} />
          <Route path="/" element={<RestaurantList restaurants={backendData} onSwipe={handleSwipe} resetBackendData={resetBackendData} isLoading={isLoading} />} />
          <Route path="/trashed" element={<TrashedPage trashedRestaurants={trashedRestaurants} clearTrashed={clearTrashed} loadTrashed={loadTrashed} loggedIn={loggedIn} isLoading={isLoading} deleteRestaurantFromTrashed={deleteRestaurantFromTrash} fetchuid = {fetchuid}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage setUid={setUid} />} />
        </Routes>
      </div>

      <nav style={styles.navContainer}>
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link to={path} key={path} aria-label={label} style={styles.link}>
              <div style={styles.iconWrapper}>
                <Icon size={24} color={isActive ? "#ffffff" : "#9ca3af"} style={styles.icon} />
                {isActive && (
                  <motion.div layoutId="active-indicator" style={styles.activeIndicator} />
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

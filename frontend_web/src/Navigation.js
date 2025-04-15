import React, {useRef} from "react";
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

function Navigation({ backendData, likedRestaurants, trashedRestaurants ,handleSwipe, resetBackendData, clearFavorites, clearTrashed,loadFavorites, loadTrashed ,loggedIn,isLoading,deleteRestaurantFromFavorites, deleteRestaurantFromTrash, isKm}) {
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

  const logoRef = useRef(null);

  const handleLogoClick = () => {
    const logo = logoRef.current;
    console.log("clicked");
    if (logo) {
      logo.classList.remove("jiggle");
      void logo.offsetWidth; // force reflow to restart animation
      logo.classList.add("jiggle");
    }
  };

  return (
    <div>
      <div style={{
        zIndex: 100,
      }} className="header">
        <LoginPic></LoginPic>
        <div className = 'logodiv' style= {{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <h1 style= {{marginLeft: '0em'}}>mealswipe</h1>
          <img src= {logo} style={{ width: '25px', height: 'auto' ,marginLeft: '0em'}} className = 'logoimage' onClick={handleLogoClick} ref={logoRef}></img>
        </div>
        
      </div>


      <Routes>
            <Route path="/favorites" element={<FavoritesPage likedRestaurants={likedRestaurants} clearFavorites = {clearFavorites} loadFavorites = {loadFavorites} loggedIn = {loggedIn} isLoading= {isLoading} deleteRestaurantFromFavorites={deleteRestaurantFromFavorites}/>} />
        <Route path="/" element={<RestaurantList restaurants={backendData} isKm={isKm} onSwipe={handleSwipe} resetBackendData={resetBackendData} isLoading= {isLoading}/>} />
            <Route path="/trashed" element={<TrashedPage trashedRestaurants={trashedRestaurants} clearTrashed = {clearTrashed} loadTrashed = {loadTrashed} loggedIn = {loggedIn} isLoading= {isLoading} deleteRestaurantFromTrashed={deleteRestaurantFromTrash}/>} />
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
/** Handles displaying, clearing, and managing user's favorite restaurants.
 * @module FavoritesPage-Page
 * @requires React
 */

/**
 * @fileoverview FavoritesPage renders the user's liked restaurants.
 * Provides options to delete individual favorites, clear all, and navigate back to swiping.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import "./favorites.css";
import MiniCard from "../components/FavoritesTrashedSharedComponents/MiniCard";

/**
 * Renders the user's Favorites Page.
 * @component
 * @param {Object} props
 * @param {Array} props.likedRestaurants - Array of liked restaurant objects
 * @param {Function} props.clearFavorites - Function to clear all favorites
 * @param {Function} props.loadFavorites - Function to fetch and load favorites
 * @param {boolean} props.loggedIn - Whether the user is logged in
 * @param {boolean} props.isLoading - Loading state flag
 * @param {Function} props.deleteRestaurantFromFavorites - Function to delete a restaurant by placeid
 * @returns {JSX.Element} Favorites page layout
 */
function FavoritesPage({ likedRestaurants, clearFavorites, loadFavorites, loggedIn, isLoading, deleteRestaurantFromFavorites }) {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  /**
   * Handles clicking the "Clear Favorites" button by showing the confirmation modal.
   * @function handleClearClick
   * @returns {void}
   */
  const handleClearClick = () => {
    setShowConfirmModal(true);
  };

  /**
   * Confirms clearing all favorites and triggers clearing logic.
   * @function confirmClearFavorites
   * @returns {void}
   */
  const confirmClearFavorites = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      clearFavorites();
      setShowConfirmModal(false);
    }, 100);
  };

  /**
   * Cancels the "clear favorites" action and closes the confirmation modal.
   * @function cancelClearFavorites
   * @returns {void}
   */
  const cancelClearFavorites = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShowConfirmModal(false);
    }, 100);
  };

  /**
   * Handles the "Start Swiping" button click by navigating to the homepage.
   * @function swipeClick
   * @returns {void}
   */
  const swipeClick = () => {
    console.log("swipeClick");
    navigate("/");
  };

  useEffect(() => {
    console.log("Loading favorites...");
    loadFavorites();
  }, []);

  /**
   * Deletes a restaurant from favorites by its place ID.
   * Then reloads the favorites list.
   * @async
   * @function deleteAction
   * @param {string} placeid - The ID of the restaurant to delete.
   * @returns {Promise<void>}
   */
  const deleteAction = async (placeid) => {
    console.log("Deleting restaurant with placeid:", placeid);
    await deleteRestaurantFromFavorites(placeid);
    setTimeout(() => {
      loadFavorites();
    }, 150);
  };

  return loggedIn ? (
    <div className="favoritesPage">
      <h2>Liked Restaurants</h2>

      {isLoading ? null : (
        likedRestaurants.length === 0 ? (
          <div className="noRestaurants modal-animateFavorites">
            <h2>it's lonely in here :(</h2>
            <Button text="Start Swiping" onClick={swipeClick} />
          </div>
        ) : (
          <>
            <button className="clearFavorites" onClick={handleClearClick}>
              Clear Favorites
            </button>
            <div className="favoritesList modal-animateFavorites">
              {likedRestaurants.map((restaurant, index) => (
                <MiniCard
                  key={index}
                  restaurant={restaurant}
                  removeRestaurant={deleteAction}
                  text="favorites"
                />
              ))}
            </div>

            {showConfirmModal && (
              <div className="modal-overlay ">
                <div className={isClosing ? 'modal-content modal-animateFavoritesExit' : 'modal-content modal-animateFavorites'}>
                  <p>Are you sure you want to clear all favorites?</p>
                  <div className="modal-buttons">
                    <button onClick={confirmClearFavorites}>Yes</button>
                    <button onClick={cancelClearFavorites}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      )}
    </div>
  ) : (
    <div className="favoritesPage">
      <h2>Favorites</h2>
      <h3
        style={{
          fontSize: "clamp(1rem, 2.5vw, 2rem)",
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
      >
        Please log in to view your favorite restaurants.
      </h3>
      <Button text="Log In" onClick={() => navigate("/login")} />
    </div>
  );
}

export default FavoritesPage;

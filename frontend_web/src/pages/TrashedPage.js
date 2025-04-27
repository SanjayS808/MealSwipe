/** Handles displaying, clearing, and managing user's trashed (disliked) restaurants.
 * @module TrashedPage-Page
 * @requires React
 */

/**
 * @fileoverview TrashedPage renders the user's trashed restaurants.
 * Provides options to delete individual trashed entries, clear all trashed restaurants, and navigate back to swiping.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import "./favorites.css";
import MiniCard from "../components/FavoritesTrashedSharedComponents/MiniCard";

/**
 * Renders the user's Trashed Page.
 * @component
 * @param {Object} props
 * @param {Array} props.trashedRestaurants - Array of trashed restaurant objects
 * @param {Function} props.clearTrashed - Function to clear all trashed restaurants
 * @param {Function} props.loadTrashed - Function to fetch and load trashed restaurants
 * @param {boolean} props.loggedIn - Whether the user is logged in
 * @param {boolean} props.isLoading - Loading state flag
 * @param {Function} props.deleteRestaurantFromTrashed - Function to delete a restaurant by placeid
 * @returns {JSX.Element} Trashed page layout
 */
function TrashedPage({ trashedRestaurants, clearTrashed, loadTrashed, loggedIn, isLoading, deleteRestaurantFromTrashed }) {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  /**
   * Handles clicking the "Clear Trashed" button by showing the confirmation modal.
   * @function handleClearClick
   * @returns {void}
   */
  const handleClearClick = () => {
    setShowConfirmModal(true);
  };

  /**
   * Confirms clearing all trashed restaurants and triggers clearing logic.
   * @function confirmClearFavorites
   * @returns {void}
   */
  const confirmClearFavorites = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      clearTrashed();
      setShowConfirmModal(false);
    }, 100);
  };

  /**
   * Cancels the "clear trashed" action and closes the confirmation modal.
   * @returns {void}
   * @function cancelClearFavorites
   */
  const cancelClearFavorites = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShowConfirmModal(false);
    }, 100);
  };

  /**
   * Handles the "Back to Swiping" button click by navigating to the homepage.
   * @function swipeClick
   * @returns {void}
   */
  const swipeClick = () => {
    console.log("swipeClick");
    navigate("/");
  };

  useEffect(() => {
    console.log("Loading trashed...");
    loadTrashed();
  }, []);

  /**
   * Deletes a restaurant from the trashed list by its place ID.
   * Then reloads the trashed list.
   * @async
   * @function deleteAction
   * @param {string} placeid - The ID of the restaurant to delete.
   * @returns {Promise<void>}
   */
  const deleteAction = async (placeid) => {
    console.log("Deleting restaurant with placeid:", placeid);
    await deleteRestaurantFromTrashed(placeid);
    setTimeout(() => {
      loadTrashed();
    }, 150);
  };

  return loggedIn ? (
    <div className="favoritesPage">
      <h2>Trashed Restaurants</h2>

      {isLoading ? null : (
        trashedRestaurants.length === 0 ? (
          <div className="noRestaurants modal-animateFavorites">
            <h2>props to you for not being picky!</h2>
            <Button text="Back to Swiping" onClick={swipeClick} />
          </div>
        ) : (
          <>
            <button className="clearFavorites" onClick={handleClearClick}>
              Clear Trashed
            </button>
            <div className="favoritesList modal-animateFavorites">
              {trashedRestaurants.map((restaurant, index) => (
                <MiniCard
                  key={index}
                  restaurant={restaurant}
                  removeRestaurant={deleteAction}
                  text="trashed"
                />
              ))}
            </div>

            {showConfirmModal && (
              <div className="modal-overlay">
                <div className={isClosing ? 'modal-content modal-animateFavoritesExit' : 'modal-content modal-animateFavorites'}>
                  <p>Are you sure you want to clear your trash?</p>
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
      <h2>Trash</h2>
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
        Please log in to view your trashed restaurants.
      </h3>
      <Button text="Log In" onClick={() => navigate("/login")} />
    </div>
  );
}

export default TrashedPage;

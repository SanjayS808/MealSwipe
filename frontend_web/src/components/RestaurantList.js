/** 
 * @module RestaurantList-Component
 * @requires React
 * @fileoverview 
 * This component renders a Tinder-like interface for browsing through a list of restaurants. 
 * Users can swipe through restaurant cards, view more details in a modal, and refresh the list if there are no available restaurants.
 */

import React, { useState } from 'react';
import RestaurantCard from "./RestaurantCard";
import TinderCard from "react-tinder-card";
import RestaurantModal from "./RestaurantModal";
import "./restaurantList.css";
import "./Card.css";
import Button from './Button';
import { motion } from "framer-motion";

/**
 * RestaurantList component that renders restaurant cards in a Tinder-like interface.
 * @function RestaurantList
 * @memberof module:RestaurantList
 * @param {Object[]} restaurants - List of restaurant data to display.
 * @param {Function} onSwipe - Callback to handle swipe actions.
 * @param {Function} resetBackendData - Callback to reset restaurant data.
 * @param {boolean} isLoading - Flag indicating if data is loading.
 * @returns {JSX.Element} The rendered component
 */
function RestaurantList({ restaurants, onSwipe, resetBackendData, isLoading }) {
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /**
   * Triggered when a restaurant card is clicked to show its details.
   * @function handleClick
   * @memberof module:RestaurantList
   * @param {Object} restaurant - The restaurant object to display in the modal.
   */
  const handleClick = (restaurant) => {
    setCurrentRestaurant(restaurant);
    setShowModal(true);
    console.log("currentRestaurant", restaurant);
  };

  /**
   * Triggered to close the restaurant detail modal.
   * @function handleClose
   * @memberof module:RestaurantList
   */
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setCurrentRestaurant(null);
      setIsClosing(false);
    }, 200); // match duration of bounceOut
  };

  const modalStyles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
      borderRadius: '10px',
      width: '100%',
    },
    modal: {
      background: '#ffe1c7',
      padding: '2em',
      borderRadius: '10px',
      width: '75%',
      maxWidth: '300px',
      maxHeight: '55vh',
      overflowY: 'auto',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      border: 'none',
      fontSize: '1.2em',
      cursor: 'pointer',
      zIndex: 9999       // DEBUG
    },
    reviewItem: {
      margin: '1em 0',
      borderBottom: '1px solid #ddd',
      paddingBottom: '0.5em',
    },
  };

  return (
    <div>
      <div className="cardContainer"
        style={{
          width: "90vw",
          height: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        {isLoading ? (
          null
        ) : restaurants.length === 0 ? (
          <div className="noRestaurants">
            <h3>No restaurants available :(</h3>
            <Button onClick={resetBackendData} text="Refresh"></Button>
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <TinderCard
              className="swipe modal-animate"
              key={restaurant.id}
              onSwipe={(dir) => onSwipe(dir, restaurant)}
              preventSwipe={["up", "down"]}
              swipeRequirement={0.3} // Adjust swipe sensitivity
            >
              <div style={{ height: "70vh", width: "100%" }}>
                <RestaurantCard
                  restaurant={restaurant}
                  handleClick={handleClick}
                  handleClose={handleClose}
                  showModal={showModal}
                />
              </div>
            </TinderCard>
          ))
        )}

        {currentRestaurant && (
          <div className="card">
            <div className="restaurant-details">
              <div 
                style={modalStyles.overlay}
                onClick={handleClose} // Click on backdrop closes modal
              >
                <div 
                  style={modalStyles.modal}
                  className={isClosing ? 'modal-exit' : 'modal-animate'}
                  onClick={(e) => e.stopPropagation()} // Prevent close when clicking modal content
                >
                  <button 
                    onClick={handleClose} 
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      backgroundColor: '#ff4d4f',
                      border: 'none',
                      color: 'black',
                      fontSize: '1.2em',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      zIndex: 9999, // Ensure the button is on top
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#e60000'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4f'}
                  >
                    ✕
                  </button>

                  <RestaurantModal restaurant={currentRestaurant} />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/**
 * @exports RestaurantList
 */
export default RestaurantList;

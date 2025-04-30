/**
 * @module RestaurantCard
 * @description A card component that displays restaurant information including image, name, 
 * distance, rating, price level, and interactive buttons for maps, website, phone, and detailed info.
 * This component serves as an individual item within the swipeable restaurant list interface.
 */

import React from "react";
import "./Card.css";
import StarRating from "./StarRating";
import { MapPin, Globe, Phone, Info } from "lucide-react";
import googlemapsIcon from "./Google_Maps_icon_2020.svg";

/**
 * Renders a card displaying restaurant information with interactive elements
 * @function RestaurantCard
 * @memberof module:RestaurantCard
 * @param {Object} restaurant - Component props
 * @param {Object} restaurant - Restaurant data object
 * @param {string} restaurant.name - Name of the restaurant
 * @param {string} restaurant.imageUrl - URL of restaurant image
 * @param {number} restaurant.distanceFromUser - Distance from user in miles
 * @param {number} restaurant.rating - Rating value (typically 0-5)
 * @param {number} restaurant.ratingsCount - Number of ratings
 * @param {string} restaurant.price - Price level (PRICE_LEVEL_INEXPENSIVE, PRICE_LEVEL_MODERATE, etc.)
 * @param {string} restaurant.googleMapsLink - URL to Google Maps location
 * @param {string} restaurant.website - Restaurant website URL
 * @param {string} restaurant.phoneNumber - Restaurant phone number
 * @param {Function} handleClick - Function to handle clicks for showing more details
 * @returns {JSX.Element} The rendered restaurant card component
 */
function RestaurantCard({ restaurant, handleClick }) {
  return (
    <div
      className="card"
      onDoubleClick={() => handleClick(restaurant)}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80%",
        maxHeight: "500px",
        borderRadius: "1rem",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 0px 0px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Image Section */}
      <div
        className="card-image"
        style={{
          flex: "1 1 60%",
          minHeight: 0,
        }}
      >
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          draggable="false"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* Content Section */}
      <div
        className="card-content"
        style={{
          flex: "1 1 20%",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <h3 style={{ fontSize: "1.1em", marginBottom: "0.3em" }}>
          {restaurant.name.length > 25
            ? restaurant.name.slice(0, 25) + "..."
            : restaurant.name}
        </h3>

        <h4
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <MapPin size={18} style={{ marginRight: "0.5em" }} />
          {restaurant.distanceFromUser} miles
        </h4>

        <div className="restaurant-details">
          <div
            className="info-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5em",
            }}
          >
            <StarRating rating={restaurant.rating} />
            <h3 style={{ fontSize: "0.9em", fontWeight: "500" }}>
              {restaurant.ratingsCount} reviews
            </h3>
            {restaurant.price && (
              <h3 style={{ color: "#6b8e23", fontWeight: "bold" }}>
                {"$".repeat(
                  {
                    PRICE_LEVEL_INEXPENSIVE: 1,
                    PRICE_LEVEL_MODERATE: 2,
                    PRICE_LEVEL_EXPENSIVE: 3,
                    PRICE_LEVEL_VERY_EXPENSIVE: 4,
                  }[restaurant.price] || 0
                )}
              </h3>
            )}
          </div>
        </div>

        {/* Links / Actions */}
        <div
          className="card-links"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "auto",
          }}
        >
          <a
            href={restaurant.googleMapsLink}
            target="_blank"
            rel="noreferrer"
            className="icon-wrapperC"
            style={{ backgroundColor: "#7dcea0" }}
          >
           <MapPin size={24} className="icon" />
          </a>

          <a
            href={restaurant.website}
            target="_blank"
            rel="noreferrer"
            className="icon-wrapperC"
            style={{ backgroundColor: "#3399FF" }}
          >
            <Globe size={24} className="icon"/>
          </a>

          <a
            href={`tel:${restaurant.phoneNumber}`}
            className="icon-wrapperC"
            style={{ backgroundColor: "#00CC66" }}
          >
            <Phone size={24} className="icon"/>
          </a>

          <button
            className="icon-wrapperC pressable"
            style={{ backgroundColor: "#89CFF0", cursor: "pointer" ,border: "2px solid #89CFF0"}}
            onClick={() => handleClick(restaurant)}
            onTouchStart={() => handleClick(restaurant)}
          >
            <Info size={24} className="icon"/>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * @exports RestaurantCard
 */
export default RestaurantCard;
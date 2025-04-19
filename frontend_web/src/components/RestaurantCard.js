import React from "react";
import "./Card.css";
import StarRating from "./StarRating";
import { MapPin, Globe, Phone, Info } from "lucide-react";
import googlemapsIcon from "./Google_Maps_icon_(2020).svg";

function RestaurantCard({ restaurant, handleClick }) {
  return (
    <div
      className="card"
      onDoubleClick={() => handleClick(restaurant)}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80%",
        borderRadius: "1rem",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <img src={googlemapsIcon} alt="Maps" style={{ width: 24, height: 24 }} />
          </a>

          <a
            href={restaurant.website}
            target="_blank"
            rel="noreferrer"
            className="icon-wrapperC"
            style={{ backgroundColor: "#3399FF" }}
          >
            <Globe size={24} />
          </a>

          <a
            href={`tel:${restaurant.phoneNumber}`}
            className="icon-wrapperC"
            style={{ backgroundColor: "#00CC66" }}
          >
            <Phone size={24} />
          </a>

          <button
            className="icon-wrapperC pressable"
            style={{ backgroundColor: "#3399FF", cursor: "pointer" }}
            onClick={() => handleClick(restaurant)}
            onTouchStart={() => handleClick(restaurant)}
          >
            <Info size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;

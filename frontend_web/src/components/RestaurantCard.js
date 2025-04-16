import React, { useState } from "react";
import "./Card.css";
import StarRating from "./StarRating";
import { MapPin, Globe, Phone, MoreHorizontal } from "lucide-react";
import RestaurantModal from "./RestaurantModal";

function RestaurantCard({ restaurant, allowSwipe, setAllowSwipe }) {
  const [showModal, setShowModal] = useState(false);

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
      maxWidth: '500px',
      maxHeight: '55vh',
      overflowY: 'auto',
      position: 'relative',
    },
  };

  const handleClick = () => {
    if (!showModal) {
      setShowModal(true);
      setAllowSwipe(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setAllowSwipe(true);
  };

  return (
    <div className="card">
      <div className="card-image">
        <img
          src={restaurant.imageUrl}
          draggable="false"
          alt={restaurant.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div
        className="card-content"
        style={{
          display: 'grid',
          gridTemplateRows: 'auto auto auto auto',
          gap: '0.5rem',
        }}
      >
        {/* Title */}
        <h3 style={{ fontSize: "1.1em" }}>
          {restaurant.name.length > 25
            ? restaurant.name.slice(0, 25) + "..."
            : restaurant.name}
        </h3>
        {/* Distance */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3em" }}>
          <MapPin size={18} className="icon" />
          <span style={{ fontSize: "0.95em" }}>{restaurant.distanceFromUser} miles</span>
        </div>

        {/* Rating / Reviews / Price */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <StarRating rating={restaurant.rating} />
          <span style={{ fontSize: "0.9em", marginLeft: "0.5em" }}>{restaurant.ratingsCount} reviews</span>
          {restaurant.price && (
            <span style={{ color: '#6b8e23', fontWeight: 'bold', marginLeft: "auto" }}>
              {"$".repeat(
                {
                  PRICE_LEVEL_INEXPENSIVE: 1,
                  PRICE_LEVEL_MODERATE: 2,
                  PRICE_LEVEL_EXPENSIVE: 3,
                  PRICE_LEVEL_VERY_EXPENSIVE: 4,
                }[restaurant.price] || 0
              )}
            </span>
          )}
        </div>

        {/* Icons */}
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: "0.5rem" }}>
          <a
            href={restaurant.googleMapsLink}
            target="_blank"
            rel="noreferrer"
            className="icon-wrapperC"
            style={{ backgroundColor: "#F5F5f5" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 24 24" width="36">
              <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle fill="#34A853" cx="12" cy="9" r="2.5" />
            </svg>
          </a>

          <a href={restaurant.website} target="_blank" rel="noreferrer" className="icon-wrapperC" style={{ backgroundColor: "#3399FF" }}>
            <Globe size={24} className="icon" />
          </a>

          <a href={`tel:${restaurant.phoneNumber}`} className="icon-wrapperC" style={{ backgroundColor: "#00CC66" }}>
            <Phone size={24} className="icon" />
          </a>

          <button
            onClick={handleClick}
            onTouchStart={handleClick}
            className="icon-wrapperC"
            style={{
              backgroundColor: "#FFD700",
              border: "none",
              borderRadius: "50%",
              padding: "0.4em",
              cursor: "pointer"
            }}
          >
            <MoreHorizontal size={24} className="icon" />
          </button>
        </div>
      </div>

      {/* Restaurant Modal */}
      {showModal && (
        <div
          style={modalStyles.overlay}
          onClick={handleClose}
          onTouchStart={handleClose}
        >
          <div
            style={modalStyles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              onTouchStart={handleClose}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#ff4d4f',
                border: 'none',
                color: 'black',
                fontSize: '1.2em',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#e60000')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#ff4d4f')}
            >
              ✕
            </button>
              <a href={restaurant.website} target="_blank" rel="noreferrer" className="icon-wrapperC" style={{backgroundColor: "#3399FF"}}>
                <Globe size={24} className="icon"/> {/* Website Icon */}
              </a>
              <a href={`tel:${restaurant.phoneNumber}` } className="icon-wrapperC" style={{backgroundColor: "#00CC66"}}>
                <Phone size={24} className="icon"/> {/* Call Icon */}
              </a>
              <button className="icon-wrapperC pressable" style={{backgroundColor: "#3399FF", cursor: "pointer" } }onClick={() => handleClick(restaurant)} onTouchStart={() => handleClick(restaurant) } >
              <Info size={24} className="icon"/> {/* Call Icon */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantCard;

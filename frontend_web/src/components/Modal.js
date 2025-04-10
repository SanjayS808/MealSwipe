// Modal.js
import React from "react";
import "./Modal.css"; // We'll define some styles for the modal

function Modal({ restaurant, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>{restaurant.name}</h2>
        <h5>Address: {restaurant.address}</h5>
        <h5>Distance: {restaurant.distanceFromUser} miles</h5>
        <h5>Price Level: {restaurant.price}</h5>
        <div className="modal-links">
          <a href={restaurant.googleMapsLink} target="_blank" rel="noreferrer">
            Google Maps
          </a>
          <a href={restaurant.website} target="_blank" rel="noreferrer">
            Website
          </a>
          <a href={`tel:${restaurant.phoneNumber}`} rel="noreferrer">
            Call
          </a>
        </div>
      </div>
    </div>
  );
}

export default Modal;
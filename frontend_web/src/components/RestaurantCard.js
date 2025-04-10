// This Component is used to display a restaurant card in the Tinder-like interface.

import React, {useState} from "react";
import "./Card.css";
import StarRating from "./StarRating";
import { MapPin, Globe, Phone } from "lucide-react"; 



function RestaurantCard({ restaurant}) {


  const modalStyles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      background: 'white',
      padding: '2em',
      borderRadius: '10px',
      width: '80%',
      maxWidth: '500px',
      maxHeight: '60vh',
      overflowY: 'auto',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '10px', right: '10px',
      background: 'transparent',
      border: 'none',
      fontSize: '1.2em',
      cursor: 'pointer',
    },
    reviewItem: {
      margin: '1em 0',
      borderBottom: '1px solid #ddd',
      paddingBottom: '0.5em',
    },
  };




  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    
    setShowModal(!showModal);
    console.log("Restaurant clicked:", restaurant);
  };

  return (
    <div className="card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="card-image">
        <img src={restaurant.imageUrl} draggable="false" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={restaurant.name} />
      </div>
      <div className="card-content">
      <h3>
          {restaurant.name.length > 30
            ? restaurant.name.slice(0, 30) + '...'
            : restaurant.name}
        </h3>

        <h5> <MapPin size={14} className="icon"/> {restaurant.distanceFromUser} miles</h5>
        <div className="restaurant-details">
          <StarRating rating={restaurant.rating} />

          {
            restaurant.price === "PRICE_LEVEL_INEXPENSIVE" ? 
            (<h5>$</h5>) : restaurant.price === "PRICE_LEVEL_MODERATE" ?
            (<h5>$$</h5>) : restaurant.price === "PRICE_LEVEL_EXPENSIVE" ?
            (<h5>$$$</h5>) : restaurant.price === "PRICE_LEVEL_VERY_EXPENSIVE" ?
            (<h5>$$$$</h5>) : null
          }
          {/* <button
  onClick={() => setShowModal(true)}
  style={{
    marginTop: '0em',
    padding: '5px 10px',               // Padding for button size
    fontSize: '10px',                    // Font size
    fontWeight: 'bold',                  // Bold text
    backgroundColor: '#A9A9A9',         // Green background
    color: 'white',                     // White text
    border: 'none',                     // No border
    borderRadius: '25px',               // Rounded corners
    cursor: 'pointer',                  // Pointer on hover
    transition: 'background-color 0.3s ease', // Smooth transition for hover
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = '#899499')} // Hover effect
  onMouseOut={(e) => (e.target.style.backgroundColor = '#A9A9A9')} // Reset hover effect
>
  View Reviews
</button> */}

      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h2>Reviews for {restaurant.name}</h2>
            <button onClick={() => setShowModal(false)} style={modalStyles.closeButton}>
              Close
            </button>
            {restaurant.reviews.length > 0 ? (
              <ul>
                {restaurant.reviews.map((review, index) => (
                  <li key={index} style={modalStyles.reviewItem}>
                    <strong>{review.author}</strong>: {review.text} ({review.rating}/5)
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      )}

        </div>
        <h5>
          {restaurant.address.length > 35
            ? restaurant.address.slice(0, 35) + '...'
            : restaurant.address}
        </h5>
        <div className="card-links">
            <a href={restaurant.googleMapsLink} target="_blank" rel="noreferrer" className="icon-wrapper">
              <MapPin size={24} className="icon"/> {/* Google Maps Icon */}
            </a>
            <a href={restaurant.website} target="_blank" rel="noreferrer" className="icon-wrapper">
              <Globe size={24} className="icon"/> {/* Website Icon */}
            </a>
            <a href={`tel:${restaurant.phoneNumber}` } className="icon-wrapper">
              <Phone size={24} className="icon"/> {/* Call Icon */}
            </a>
          </div>
      </div>
     </div>
  );
  
}

export default RestaurantCard;

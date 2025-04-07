// This Component is used to display a restaurant card in the Tinder-like interface.

import React from "react";
import "./Card.css";
import StarRating from "./StarRating";
import { MapPin, Globe, Phone } from "lucide-react"; 



function RestaurantCard({ restaurant}) {

  const handleClick = () => {
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

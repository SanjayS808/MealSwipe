// This Component is used to display a restaurant card in the Tinder-like interface.

import React, {useState} from "react";
import "./Card.css";
import StarRating from "./StarRating";
import { MapPin, Globe, Phone } from "lucide-react"; 
import { Info } from 'lucide-react'
import googlemapsIcon from "./Google_Maps_icon_(2020).svg"

function RestaurantCard({ restaurant, handleClick }) {  
  return (
    <div className="card" onDoubleClick={() => handleClick(restaurant)} >
      <div className="card-image">
        <img src={restaurant.imageUrl} draggable="false" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={restaurant.name} />
      </div>
      <div className="card-content">
      <h3 style= {{fontSize: "1.1em", marginBottom: "0.25em"}}>
          {restaurant.name.length > 25
            ? restaurant.name.slice(0, 25) + '...'
            : restaurant.name}
        </h3>
            
        <h4>
          <MapPin size={18} className="icon"/> 
          {isKm ? (restaurant.distanceFromUser * 1.61).toFixed(1) : restaurant.distanceFromUser} {isKm ? 'km' : 'miles'}
        </h4>
        <div className="restaurant-details" >
          
          <div className="info" style={{ display: "flex", justifyContent: "space-evenly" , marginBottom: "1em", marginTop: "0.5em"}}>
            <div className="info_item" style = {{marginRight: "0.5em"}}>
              <StarRating rating={restaurant.rating} />
             
            </div>
            <div className="info" style = {{marginRight: "0.5em"}}>
              <h3>{restaurant.ratingsCount} reviews</h3>
            </div>
            <div className="info_item" style = {{marginRight: "0.5em"}}>
            {
              restaurant.price === "PRICE_LEVEL_INEXPENSIVE" ? 
              (<h3 style = {{color: '#6b8e23',fontWeight: 'bold',} }>$</h3>) : restaurant.price === "PRICE_LEVEL_MODERATE" ?
              (<h3 style = {{color: '#6b8e23',fontWeight: 'bold'}}>$$</h3>) : restaurant.price === "PRICE_LEVEL_EXPENSIVE" ?
              (<h3 style = {{color: '#6b8e23',fontWeight: 'bold'}}>$$$</h3>) : restaurant.price === "PRICE_LEVEL_VERY_EXPENSIVE" ?
              (<h3 style = {{color: '#6b8e23',fontWeight: 'bold'}}>$$$$</h3>) : null
            }
            </div>
          
          </div>
          
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

      
        </div>
        
        <div className="card-links" style={{marginTop: ".5em", marginBottom: "1em"}}>
            <a
              href={restaurant.googleMapsLink}
              target="_blank" rel="noreferrer" className="icon-wrapperC" style={{backgroundColor: "#F5F5f5"}}>
              <img src={googlemapsIcon} alt="Info" style={{ width: 24, height: 24 }} />
            </a>


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
     </div>
  );
  
}

export default RestaurantCard;

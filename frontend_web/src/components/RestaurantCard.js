// This Component is used to display a restaurant card in the Tinder-like interface.

import React, {useState} from "react";
import "./Card.css";
import StarRating from "./StarRating";
import { MapPin, Globe, Phone } from "lucide-react"; 

import RestaurantModal from "./RestaurantModal";

function RestaurantCard({ restaurant}) {


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
      background: 'white',
      padding: '2em',
      borderRadius: '10px',
      width: '75%',
      maxWidth: '500px',
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




  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    console.log({restaurant});
    if (!showModal){
      setShowModal(true);
      console.log(showModal);
    }
    
    
  };
  const handleClose = () => {
    setShowModal(false);
    console.log("off");
  }

  return (
    <div className="card" onClick={handleClick} onTouchStart={handleClick}style={{ cursor: "pointer" }}>
      <div className="card-image">
        <img src={restaurant.imageUrl} draggable="false" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={restaurant.name} />
      </div>
      <div className="card-content">
      <h3 style= {{fontSize: "1.1em"}}>
          {restaurant.name.length > 25
            ? restaurant.name.slice(0, 25) + '...'
            : restaurant.name}
        </h3>

        <h5> <MapPin size={14} className="icon"/> {restaurant.distanceFromUser} miles</h5>
        <div className="restaurant-details" >
          
          <div className="info" style={{ display: "flex", justifyContent: "space-evenly" , marginBottom: "1em", marginTop: "0.5em"}}>
            <div className="info_item" style = {{marginRight: "0.5em"}}>
              <StarRating rating={restaurant.rating} />
             
            </div>
            <div className="info" style = {{marginRight: "0.5em"}}>
              <h4>{restaurant.ratingsCount} reviews</h4>
            </div>
            <div className="info_item" style = {{marginRight: "0.5em"}}>
            {
              restaurant.price === "PRICE_LEVEL_INEXPENSIVE" ? 
              (<h4>$</h4>) : restaurant.price === "PRICE_LEVEL_MODERATE" ?
              (<h4>$$</h4>) : restaurant.price === "PRICE_LEVEL_EXPENSIVE" ?
              (<h4>$$$</h4>) : restaurant.price === "PRICE_LEVEL_VERY_EXPENSIVE" ?
              (<h4>$$$$</h4>) : null
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

      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
          <button 
            onClick={handleClose} 
            style={{
              position: 'fixed',
              top: '5px',
              right: '5px',
              width: '30px',
              height: '30px',
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

            <RestaurantModal restaurant={restaurant}  />
            
          </div>
        </div>
      )}

        </div>
        
        <div className="card-links" style={{marginTop: "1em", marginBottom: "1em"}}>
            <a
              href={restaurant.googleMapsLink}
              target="_blank" rel="noreferrer" className="icon-wrapperC" style={{backgroundColor: "#F5F5f5"}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="30"
                viewBox="0 0 24 24"
                width="36"
              >
                <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle fill="#34A853" cx="12" cy="9" r="2.5" />
              </svg>
            </a>


            <a href={restaurant.website} target="_blank" rel="noreferrer" className="icon-wrapperC" style={{backgroundColor: "#3399FF"}}>
              <Globe size={24} className="icon"/> {/* Website Icon */}
            </a>
            <a href={`tel:${restaurant.phoneNumber}` } className="icon-wrapperC" style={{backgroundColor: "#00CC66"}}>
              <Phone size={24} className="icon"/> {/* Call Icon */}
            </a>
          </div>
      </div>
     </div>
  );
  
}

export default RestaurantCard;

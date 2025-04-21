import React from "react";
import "./modal.css";
import { MapPin, Globe, Phone } from "lucide-react"; 

import StarRating from "./StarRating";
import ReviewCarousel from './ModalComponents/ReviewCarousel';
import OpeningHours from './ModalComponents/OpeningHours';
function RestaurantModal({ restaurant }) {
    return (
        <div className="cardModal">
            
            <div className="image_container">
            <img 
                src={restaurant.imageUrl} 
                alt={restaurant.name} 
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                />
            </div>
            
            <div className="title">
                <h4>{restaurant.name}</h4>
                <h6>{restaurant.address}</h6>
            </div>

            {restaurant.cuisineType }
            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#ccc', // or any color
                
            }} />
            <div className="description" style= {{margin:0}}>
                <p style= {{margin:0, fontStyle: 'italic' }}>{restaurant.generativeSummary}</p>
            </div>
            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#ccc', // or any color
                
            }} />
            <div className = "info">
                <div className="info_item">
                    
                    <p>{restaurant.distanceFromUser} miles</p>
                </div>
                <div className="info_item">
                    
                <StarRating rating={restaurant.rating} />
                <p>{restaurant.ratingsCount}</p>
                </div>
                <div className="info_item">
                    
                    
                </div>
                <div className="info_item">
                    
                {
              restaurant.price === "PRICE_LEVEL_INEXPENSIVE" ? 
              (<h3 style = {{color: '#6b8e23',fontWeight: 'bold',} }>$</h3>) : restaurant.price === "PRICE_LEVEL_MODERATE" ?
              (<h3 style = {{color: '#6b8e23',fontWeight: 'bold'}}>$$</h3>) : restaurant.price === "PRICE_LEVEL_EXPENSIVE" ?
              (<h3 style = {{color: '#6b8e23',fontWeight: 'bold'}}>$$$</h3>) : restaurant.price === "PRICE_LEVEL_VERY_EXPENSIVE" ?
              (<h3 style = {{color: '#6b8e23',fontWeight: 'bold'}}>$$$$</h3>) : null
            }
                </div>
                
                
            </div>
            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#ccc', // or any color
                marginBottom: '.5em'
            }} />

            <div className = "info">
                <div className="info_item">
                    
                    <a href={restaurant.googleMapsLink} target="_blank" rel="noreferrer" className="icon-wrapper">
                        <MapPin size={16} className="icon"/> {/* Google Maps Icon */}
                    </a>
                    
                </div>
                <div className="info_item">
                    
                <a href={restaurant.website} target="_blank" rel="noreferrer" className="icon-wrapper">
                    <Globe size={16} className="icon"/> {/* Website Icon */}
                    </a>
                    
                </div>
                <div className="info_item">
                    
                <a href={`tel:${restaurant.phoneNumber}` } className="icon-wrapper">
                    
                    <Phone size={16} className="icon"/> {/* Call Icon */} 
                    </a>
                    
                </div>
                
                    
            </div>

            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#ccc', // or any color
                marginTop: '.5em'
            }} />

            <ReviewCarousel reviews={restaurant.reviews} />
            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#ccc', // or any color
                marginTop: '.5em'
            }} />
            <OpeningHours openingHours={restaurant.openingHours} />

            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#ccc', // or any color
                
            }} />

            


            </div>

    )

}
export default RestaurantModal;  
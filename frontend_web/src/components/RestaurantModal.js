import React from "react";
import "./modal.css";
import { MapPin, Globe, Phone } from "lucide-react"; 
import StarRating from "./StarRating";

import ReviewCarousel from './ModalComponents/ReviewCarousel';
function RestaurantModal({ restaurant }) {
    return (
        <div class="cardModal">
            
            <div class="image_container">
            <img 
                src={restaurant.imageUrl} 
                alt={restaurant.name} 
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                />
            </div>
            
            <div class="title">
                <h4>{restaurant.name}</h4>
                <h6>{restaurant.address}</h6>
            </div>

            {restaurant.cuisineType }
            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#ccc', // or any color
                
            }} />
            <div class="description" style= {{margin:0}}>
                <p style= {{margin:0, fontStyle: 'italic' }}>{restaurant.generativeSummary}</p>
            </div>
            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#ccc', // or any color
                
            }} />
            <div class = "info">
                <div class="info_item">
                    
                    <p>{restaurant.distanceFromUser} miles</p>
                </div>
                <div class="info_item">
                    
                <StarRating rating={restaurant.rating} />
                <p>{restaurant.ratingsCount}</p>
                </div>
                <div class="info_item">
                    
                    
                </div>
                <div class="info_item">
                    
                    {
                        restaurant.price === "PRICE_LEVEL_INEXPENSIVE" ? 
                        (<p>$</p>) : restaurant.price === "PRICE_LEVEL_MODERATE" ?
                        (<p>$$</p>) : restaurant.price === "PRICE_LEVEL_EXPENSIVE" ?
                        (<p>$$$</p>) : restaurant.price === "PRICE_LEVEL_VERY_EXPENSIVE" ?
                        (<p>$$$$</p>) : null
                    }
                </div>
                
                
            </div>
            <div style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#ccc', // or any color
                marginBottom: '.5em'
            }} />

            <div class = "info">
                <div class="info_item">
                    
                    <a href={restaurant.googleMapsLink} target="_blank" rel="noreferrer" className="icon-wrapper">
                    <MapPin size={16} className="icon"/> {/* Google Maps Icon */}
                    </a>
                    
                </div>
                <div class="info_item">
                    
                <a href={restaurant.website} target="_blank" rel="noreferrer" className="icon-wrapper">
                    <Globe size={16} className="icon"/> {/* Website Icon */}
                    </a>
                    
                </div>
                <div class="info_item">
                    
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
            </div>

    )

}
export default RestaurantModal;  
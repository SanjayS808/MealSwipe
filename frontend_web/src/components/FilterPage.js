import React, {useState} from 'react';
import './FilterPage.css';


const StarRating = ({ rating, onRatingChange }) => {
 const handleStarClick = (event, starValue) => {
   const starElement = event.currentTarget;
   const rect = starElement.getBoundingClientRect();
   const clickPosition = event.clientX - rect.left;
   const starWidth = rect.width;


   // Determine if click is on left or right half of star
   const ratingValue = clickPosition < starWidth / 2
     ? starValue - 0.5
     : starValue;


   onRatingChange(ratingValue);
 };


 return (
   <div className="star-rating-selector">
     {[1, 2, 3, 4, 5].map((starValue) => (
       <svg
         key={starValue}
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         className={`star ${rating >= starValue - 0.5 ? 'partially-filled' : ''} ${rating >= starValue ? 'filled' : ''}`}
         onClick={(e) => handleStarClick(e, starValue)}
       >
         {rating >= starValue - 0.5 && rating < starValue && (
           <defs>
             <linearGradient id={`halfGradient${starValue}`}>
               <stop offset="50%" stopColor="#ffc107"/>
               <stop offset="50%" stopColor="#ddd" stopOpacity="1"/>
             </linearGradient>
           </defs>
         )}
         <path
           fill={
             rating >= starValue - 0.5 && rating < starValue
               ? `url(#halfGradient${starValue})`
               : (rating >= starValue ? '#ffc107' : '#ddd')
           }
           d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
         />
       </svg>
     ))}
   </div>
 );
};


const FilterPage = ({
 maxDistance,
 setMaxDistance,
 minRating,
 setMinRating,
 priceLevels,
 setPriceLevels,
 applyFilters,
 onClose,
 isOpen
}) => {
  const [isKm, setIsKm] = useState(false); // Track whether it's in kilometers or miles

  // Function to handle unit toggle
  const toggleUnit = () => {
    setIsKm(prev => !prev);
  };

  // Convert maxDistance based on the selected unit
  const handleDistanceChange = (e) => {
    let value = parseInt(e.target.value, 10);
    setMaxDistance(value);
  };
  
  const displayedDistance = isKm ? (maxDistance * 1.61).toFixed(1) : maxDistance;

 // Set min/max values for the range input based on the unit
 const sliderMin = 1; // Min is adjusted for kilometers (multiply by 1.61 for km)
 const sliderMax = 50; // Max is adjusted for kilometers (multiply by 1.61 for km)

 const togglePriceLevel = (level) => {
   setPriceLevels(prev =>
     prev.includes(level)
       ? prev.filter(l => l !== level)
       : [...prev, level]
   );
 };


 return (
   <div className={`filter-page ${isOpen ? 'open' : ''}`}>
     <div className="filter-page-content">
       <button className="close-button" onClick={onClose}>×</button>
       <h2>Filters</h2>
      
       <div className="filter-section">
         <label>Max Distance: {displayedDistance} {isKm ? 'km' : 'miles'}</label>
         <input
           type="range"
           min={sliderMin}
           max={sliderMax}
           value={maxDistance}
           onChange={handleDistanceChange}
         />
         <div className="toggle-container">
            <label className="switch">
            <input type="checkbox" checked={isKm} onChange={toggleUnit} />
            <span className="slider round"></span>
            </label>
            <span>{isKm ? 'Switch to Miles' : 'Switch to Kilometers'}</span>
         </div>
       </div>

       <div className="filter-section">
         <label>Min Rating: {minRating} Stars</label>
         <StarRating
           rating={minRating}
           onRatingChange={setMinRating}
         />
       </div>
      
       <div className="filter-section">
         <label>Price Level</label>
         <div className="price-level-selector">
           {[1, 2, 3, 4].map(level => (
             <button
               key={level}
               className={`price-level-btn ${priceLevels.includes(level) ? 'selected' : ''}`}
               onClick={() => togglePriceLevel(level)}
             >
               {'$'.repeat(level)}
             </button>
           ))}
         </div>
       </div>
      
       <button
         className="apply-filters-button"
         onClick={applyFilters}
       >
         Apply Filters
       </button>
     </div>
   </div>
 );
}


export default FilterPage;

import React from 'react';
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
 isOpen,
 types,
  allowedTypes,
  setAllowedTypes
}) => {
 const togglePriceLevel = (level) => {
   setPriceLevels(prev =>
     prev.includes(level)
       ? prev.filter(l => l !== level)
       : [...prev, level]
   );
 };
 const toggleType = (type) => {
  const allTypesSelected = allowedTypes.length === types.length;
  if (allTypesSelected) {
    setAllowedTypes([type]);
  } else {
    setAllowedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }
};

const allTypesSelected = allowedTypes.length === types.length;

 return (
   <div className={`filter-page ${isOpen ? 'open' : ''}`}>
     <div className="filter-page-content">
       <button className="close-button" onClick={onClose}>×</button>
       <h2>Filters</h2>
      
       <div className="filter-section">
         <label>Max Distance: {maxDistance} miles</label>
         <input
           type="range"
           min="1"
           max="50"
           value={maxDistance}
           onChange={e => setMaxDistance(parseInt(e.target.value, 10))}
         />
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
       <div className="filter-section">
        <label>Types</label>
        <div className="type-checkboxes">
          {types.map((type) => (
            <label key={type} className="type-option">
              <input
                type="checkbox"
                value={type}
                checked={!allTypesSelected && allowedTypes.includes(type)}
                onChange={() => toggleType(type)}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
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

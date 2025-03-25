import React from 'react';
import './FilterPage.css';

const FilterPage = ({ 
  maxDistance, 
  setMaxDistance, 
  minRating, 
  setMinRating, 
  priceLevel,
  setPriceLevel,
  applyFilters, 
  onClose,
  isOpen
}) => {
  return (
    <div className={`filter-page ${isOpen ? 'open' : ''}`}>
      <div className="filter-page-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Filters</h2>
        
        <div className="filter-section">
          <label>Max Distance: {maxDistance} km</label>
          <input
            type="range"
            min="1"
            max="100"
            value={maxDistance}
            onChange={e => setMaxDistance(parseInt(e.target.value, 10))}
          />
        </div>
        
        <div className="filter-section">
          <label>Min Rating: {minRating} Stars</label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={e => setMinRating(parseFloat(e.target.value))}
          />
        </div>
        
        <div className="filter-section">
          <label>Price Level</label>
          <div className="price-level-selector">
            {[1, 2, 3, 4].map(level => (
              <button
                key={level}
                className={`price-level-btn ${priceLevel === level ? 'selected' : ''}`}
                onClick={() => setPriceLevel(priceLevel === level ? 0 : level)}
              >
                {'$'.repeat(level)}
              </button>
            ))}
          </div>
        </div>
        
        <button className="apply-filters-button" onClick={() => {
          applyFilters();
          onClose();
        }}>
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default FilterPage;
import React from 'react';

const Filters = ({ maxDistance, setMaxDistance, minRating, setMinRating, applyFilters }) => {
  return (
    <div style={{ position: 'absolute', top: '50px', right: '10px', padding: "10px", backgroundColor: "white", borderRadius: "8px" }}>
      <div>
        <label>Max Distance: {maxDistance} km</label>
        <input
          type="range"
          min="1"
          max="100"
          value={maxDistance}
          onChange={e => setMaxDistance(e.target.value)}
        />
      </div>
      <div>
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
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
}

export default Filters;

/**
 * @module StarRating
 * @description A component that renders star ratings for restaurants using FontAwesome icons.
 * Displays a combination of full stars, half stars, and empty stars based on the provided rating value.
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegStar } from '@fortawesome/free-regular-svg-icons';

/**
 * Displays a star rating visualization
 * @function StarRating
 * @memberof module:StarRating
 * @param {number} rating - The rating value to display (0-5)
 * @returns {JSX.Element} The rendered star rating component
 */
const StarRating = ({ rating }) => {
  // Round the rating value to the nearest 0.5 to simplify the rendering
  const fullStars = Math.floor(rating);
  const halfStars = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - (fullStars + halfStars);
  const starStyle = {
    color: '#d9413d',
    textShadow: '0 0 5px black'
  };
  
  /**
   * Generates an array of star icons based on the rating
   * @function renderStars
   * @memberof module:StarRating
   * @returns {Array<JSX.Element>} Array of FontAwesome star icons
   */
  const renderStars = () => {
    let stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} style={starStyle}/>);
    }

    // Add half star if needed
    if (halfStars) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} style={starStyle}/>);
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faRegStar} style={starStyle}/>);
    }

    return stars;
  };

  return <div>{renderStars()}</div>;
};

/**
 * @exports StarRating
 */
export default StarRating;
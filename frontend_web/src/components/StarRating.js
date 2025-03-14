import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegStar } from '@fortawesome/free-regular-svg-icons';

const StarRating = ({ rating }) => {
  // Round the rating value to the nearest 0.5 to simplify the rendering
  const fullStars = Math.floor(rating);
  const halfStars = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - (fullStars + halfStars);

  const renderStars = () => {
    let stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} />);
    }

    // Add half star if needed
    if (halfStars) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} />);
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faRegStar} />);
    }

    return stars;
  };

  return <div>{renderStars()}</div>;
};

export default StarRating;
// This component is used to display the star rating for a restaurant.
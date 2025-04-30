/**
 * @module Restaurant
 */
/**
 * Helper function to format a string.
 * Converts underscore_separated words into Title Case words.
 * Example: "mexican_food" -> "Mexican Food"
 *
 * @param {string} str - The string to format
 * @returns {string} - The formatted string
 */
function formatString(str) {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Class representing a Restaurant.
 * Encapsulates restaurant data and utility methods like adding reviews.
 */
class Restaurant {
  /**
   * Creates a new Restaurant instance.
   * 
   * @param {string} id - Unique restaurant ID
   * @param {string} name - Name of the restaurant
   * @param {number} rating - Average star rating (0.0 - 5.0)
   * @param {string} price - Price level (ex: "PRICE_LEVEL_VERY_EXPENSIVE")
   * @param {string} address - Street address
   * @param {string} generativeSummary - AI-generated summary of the restaurant
   * @param {string} googleMapsLink - Link to view on Google Maps
   * @param {Array} reviews - Array of review objects
   * @param {string} website - Restaurant's official website URL
   * @param {number} ratingsCount - Total number of ratings
   * @param {boolean} isOpen - Whether the restaurant is currently open
   * @param {string} phoneNumber - Contact phone number
   * @param {Array} photos - Array of photo URLs
   * @param {number} distanceFromUser - Distance from user's location (in miles)
   * @param {string} cuisineType - Cuisine type (ex: "italian_food")
   * @param {number} ratingCount - Number of ratings (possibly duplicate, consider consolidating)
   * @param {Array} openingHours - Weekly schedule
   */
  constructor(
    id = ' ',
    name = ' ',
    rating = 0.0,
    price = 'PRICE_LEVEL_VERY_EXPENSIVE',
    address = ' ',
    generativeSummary = ' ',
    googleMapsLink = '',
    reviews = [],
    website = ' ',
    ratingsCount = 0,
    isOpen = false,
    phoneNumber = ' ',
    photos = [],
    distanceFromUser = 10.0,
    cuisineType = ' ',
    ratingCount = 0,
    openingHours = []
  ) {
    this.id = id;
    this.name = name;
    this.rating = rating;
    this.price = price;
    this.imageUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";   
    this.address = address;
    this.generativeSummary = generativeSummary;
    this.googleMapsLink = googleMapsLink;
    this.reviews = reviews;
    this.website = website;
    this.ratingsCount = ratingsCount;
    this.isOpen = isOpen;
    this.phoneNumber = phoneNumber;
    this.photos = photos;
    this.distanceFromUser = distanceFromUser;
    this.cuisineType = formatString(cuisineType);
    this.ratingCount = ratingCount;
    this.openingHours = openingHours;
  }

  /**
   * Adds a new review to the restaurant.
   * 
   * @param {string} author - Name of the review's author
   * @param {string} text - Review text
   * @param {number} rating - Rating score (0-5)
   */
  addReview(author, text, rating) {
    const review = {
      author,
      text,
      rating,
    };
    this.reviews.push(review);
  }
}

export default Restaurant;

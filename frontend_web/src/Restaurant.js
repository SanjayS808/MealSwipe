import Review from "./Review.js";
function formatString(str) {
  return str
    .split('_') // split on underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize first letter
    .join(' '); // join with space
}
class HourInfo{
  constructor(day, openTime, closeTime){
    this.day = day;
    this.openTime = openTime;
    this.closeTime = closeTime;
  }

}
class Restaurant{
    constructor(id = ' ',
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
      openingHours = []) {
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
/**
 * @module Review
 */

class Review{
    /**
     * Creates a new Restaurant instance.
     * 
     * @param {String}  author - Name of the author.
     * @param {String}  text - Body of review.
     * @param {Float}   rating - Rating given by author
     */
    constructor(author, text, rating){
        this.author = author; // Author's name
        this.text = text; // Review text
        this.rating = rating; // Rating given by the author (1 to 5 stars)

    }

}

export default Review;
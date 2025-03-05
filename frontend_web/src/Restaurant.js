class Restaurant{
    constructor(id,name,rating,price,address, generativeSummary, googleMapsLink, reviews,website, ratingsCount ,isOpen, phoneNumber, photos){
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
    }
}

export default Restaurant;
const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();

const API_URI = "https://mealswipe-flask-service.75ct69eg04jk6.us-west-2.cs.amazonlightsail.com/v1/places:searchNearby";

// Haversine formula to calculate distance between two points on Earth
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

const CENTER_LAT = 30.627977;
const CENTER_LON = -96.334404;

app.use(cors());

app.get("/api/serve/get-all-restaurants", (req, res) => {
    const maxDistance = parseFloat(req.query.maxDistance) || 10;
    const minRating = parseFloat(req.query.minRating) || 0;
    
    // Parse price levels from query string
    const priceLevels = req.query.priceLevels 
        ? req.query.priceLevels.split(',').map(Number)
        : [];

    console.log("Received filters:", {
        maxDistance,
        minRating,
        priceLevels
    });

    const data = {
        "includedTypes": ["restaurant"],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": CENTER_LAT,
                    "longitude": CENTER_LON
                },
                "radius": 50 
            }
        }
    };

    const clientServerOptions = {
        uri: API_URI,
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    request(clientServerOptions, function (error, response) {
        if (error) {
            console.error("Backend API error:", error);
            res.status(500).send("Internal Server Error");
            return;
        }
    
        try {
            const restaurants = JSON.parse(response.body);
    
            const filteredRestaurants = restaurants['places'].filter(restaurant => {
                const rating = parseFloat(restaurant.rating || 0);
                const normalizedPriceLevels = {
                    4: 1,  // Very expensive -> $
                    3: 2,  // Expensive -> $$
                    2: 3,  // Moderate -> $$$
                    1: 4   // Inexpensive -> $$$$
                };
                
                const restaurantPriceLevel = normalizedPriceLevels[restaurant.priceLevel] || 0;
                
                // Calculate distance
                const distance = calculateDistance(
                    CENTER_LAT, 
                    CENTER_LON, 
                    restaurant.location.latitude, 
                    restaurant.location.longitude
                );
                
                const ratingMatch = rating >= minRating;
                const distanceMatch = distance <= maxDistance;
                
                // Price level matching logic
                const priceLevelMatch = 
                    // If no price levels selected, show all
                    priceLevels.length === 0 || 
                    // If all price levels are selected, show all
                    priceLevels.length === 4 || 
                    // Or if the restaurant's price level is in the selected levels
                    priceLevels.includes(restaurantPriceLevel);
                
                const matchDetails = {
                    name: restaurant.displayName?.text,
                    distance: distance.toFixed(2),
                    originalPriceLevel: restaurant.priceLevel,
                    normalizedPriceLevel: restaurantPriceLevel,
                    rating: rating,
                    ratingMatch,
                    distanceMatch,
                    priceLevelMatch
                };
                
                console.log("Restaurant Match Details:", matchDetails);
                
                return ratingMatch && distanceMatch && priceLevelMatch;
            });
    
            console.log(`Total restaurants: ${restaurants['places'].length}, Filtered restaurants: ${filteredRestaurants.length}`);
            res.json(filteredRestaurants);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).send("Error processing data");
        }
    });
});


app.get("/api", (req, res) => {
    res.json({"restaurants": ["resOne", "resTwo"]});
});

// Used to test CI/CD functionality.
app.get("/", (req, res) => {
    res.json({"connection-status" : "valid"});
});

app.get("/health", (req, res) => {
    res.json({"health-check-status": "working"});
    res.status(200).send('OK');
})

const server = app.listen(5001, () => console.log("Server started on port 5001"));

// Exporting app for testing.
module.exports = { app, server };

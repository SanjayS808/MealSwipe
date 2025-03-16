const express = require('express');
const cors = require('cors');  // Import CORS middleware
const request = require('request');  // To make HTTP requests

const app = express();

const API_URI = "https://mealswipe-flask-service.75ct69eg04jk6.us-west-2.cs.amazonlightsail.com/v1/places:searchNearby";

app.use(cors());  // Enable CORS

app.get("/api/serve/get-all-restaurants", (req, res) => {
    const data = {
        "includedTypes": ["restaurant"],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": 30.627977,
                    "longitude": -96.334404
                },
                "radius": parseFloat(req.query.maxDistance) * 1000 || 10000.0  // Adjusted default radius
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
            // console.log("Received data:", restaurants); 
    
            const minRating = parseFloat(req.query.minRating) || 0;
            // console.log("Minimum rating filter set to:", minRating);  
    
            const filteredRestaurants = restaurants['places'].filter(restaurant => {
                const rating = parseFloat(restaurant.rating);
                console.log("Restaurant rating:", rating); 
                return rating >= minRating;
            });
    
            // console.log("Filtered restaurants count:", filteredRestaurants.length);  
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

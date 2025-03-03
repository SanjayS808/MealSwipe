const express = require('express');
const cors = require('cors');  // Import CORS middleware
const request = require('request');

const app = express();

const API_uri = "https://mealswipe-flask-service.75ct69eg04jk6.us-west-2.cs.amazonlightsail.com/v1/places:searchNearby"

app.use(cors());  // Enable CORS

app.get("/api/serve/get-all-restaurants", (req, res) => {
    var data = {
        "includedTypes": ["restaurant"],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": 30.627977,
                    "longitude": -96.334404
                },
                "radius": parseFloat(req.query.maxDistance) || 100.0  // <-- max distance
            }
        }
    };
    var clientServerOptions = {
        uri: API_uri,
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
        } else {
            res.json(JSON.parse(response.body));
        }
    });
});


app.get("/api", (req, res) => {
    res.json({"restaurants" : ["resOne", "resTwo"]});
});

app.listen(5001, () => console.log("Server started on port 5001"));

const express = require('express');
const cors = require('cors');  // Import CORS middleware
const request = require('request');

const app = express();

const API_uri = "https://mealswipe-flask-service.75ct69eg04jk6.us-west-2.cs.amazonlightsail.com/v1/places:searchNearby"

app.use(cors());  // Enable CORS

app.get("/api/serve/get-all-restaurants", (req, res) => {
    // Setup and serve API option.
    var data = {
        "includedTypes": ["restaurant"],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {
                "latitude": 30.627977,
                "longitude": -96.334404},
                "radius": 100.0
            }
        }
    };
    var clientServerOptions = {
        uri: API_uri,
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'None',
            'X-Goog-FieldMask': '*'
        }
        
    };
    request(clientServerOptions, function (error, response) {
        return res.json(response.body);
    });
});

app.get("/api", (req, res) => {
    res.json({"restaurants" : ["resOne", "resTwo"]});
});

// Used to test CI/CD functionality.
app.get("/", (req, res) => {
    res.json({"connection-status" : "valid"});
});

app.get("/health", (req, res) => {
    res.json({"health-check-status": "working"});
    res.status(200).send('OK');
})

app.listen(5000, () => console.log("Server started on port 5000"));

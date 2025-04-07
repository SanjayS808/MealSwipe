const express = require('express');
const cors = require('cors');  // Import CORS middleware
const request = require('request');  // To make HTTP requests
const pool = require('./db'); // Add access to DB
const DEV_MODE = require('./config')
const CENTER_LAT = 30.627977;  // College Station latitude
const CENTER_LNG = -96.334404; // College Station longitude

const app = express();

const API_URI = "https://mealswipe-flask-service.75ct69eg04jk6.us-west-2.cs.amazonlightsail.com/v1/places:searchNearby";

app.use(cors());  // Enable CORS
app.use(express.json()); // This enables JSON body parsing
app.use(express.urlencoded({ extended: true })); // Support for URL-encoded data

// Makes sure usernames or restaurant information can be added to SQL
const sanitize_text = (raw_text) => {
    let sanitizedString = raw_text.replace(/'/g, "''");
    sanitizedString = sanitizedString.replace(/\\/g, '\\\\');
    return sanitizedString;
};

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in miles
}

app.get("/api/serve/get-all-restaurants", (req, res) => {
    // Default maximum distance of 50 miles
    const maxDistance = parseFloat(req.query.maxDistance) || 50;

    const data = {
        "includedTypes": ["restaurant"],
        "maxResultCount": 50, // Increased to allow more results
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": CENTER_LAT,
                    "longitude": CENTER_LNG
                },
                "radius": maxDistance * 1609.34 // Convert miles to meters
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
            
            // Add distance to each restaurant
            const restaurantsWithDistance = (restaurants['places'] || []).map(place => {
                // Check if the restaurant has location data
                if (place.location && place.location.latitude && place.location.longitude) {
                    const distance = calculateDistance(
                        CENTER_LAT, 
                        CENTER_LNG, 
                        place.location.latitude, 
                        place.location.longitude
                    );
                    
                    // Add distance to restaurant object
                    return {
                        ...place,
                        distanceFromCenter: parseFloat(distance.toFixed(1)) // Round to 1 decimal place
                    };
                }
                
                // If no location data, return restaurant with default distance
                return {
                    ...place,
                    distanceFromCenter: null
                };
            });
            
            res.json(restaurantsWithDistance);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).send("Error processing data");
        }
    });
});

// Get userid via username
app.get("/api/serve/get-userid-with-uname", async (req, res) => {
    if(req.query.uname === undefined) {
        console.error('Could not fetch undefined user.');
        res.status(400).json({error: 'Could not fetch undefined username.'});
        return;
    }
    const query = `SELECT userid FROM Users WHERE name='${req.query.uname}';`
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get user info via ID
app.get("/api/serve/get-user-with-id", async (req, res) => {
    if(req.query.uid === undefined) {
        console.error('Could not fetch undefined user.');
        res.status(400).json({error: 'Could not fetch undefined user.'});
        return;
    }
    const query = `SELECT * FROM Users WHERE userid='${req.query.uid}';`
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/api/serve/add-user", async (req, res) => {
    // Check and insert all information needed for creating new user.
    const hasNullValue = (array) => array.some(element => element === undefined);
    const uinfo = [req.body.uname, req.body.ubio, req.body.nswipe, req.body.email];
    if(hasNullValue(uinfo)) {
        console.error('Could not create user. User information is missing.');
        res.status(400).json({error: 'Could not create user. User information is missing.'});
        return;
    }

    const add_query = `INSERT INTO users (name, bio, numswipes, email)
    VALUES ('${sanitize_text(req.body.uname)}', '${sanitize_text(req.body.ubio)}', ${req.body.nswipe}, '${req.body.email}');`;

    const get_query = `SELECT * FROM Users WHERE name='${req.body.uname}' OR email='${req.body.email}';`;

    try {
        // Check if user already exists.
        const get_result = await pool.query(get_query);
        if(get_result.rows.length != 0) {
            console.log(`Username ${req.body.uname} already exists.`);
            res.status(200).json({error: `User already exists.`})
            return;
        }

        // If not add, user.
        const add_result = await pool.query(add_query);
        if(add_result.rowCount != 1) {
            throw Error(`POST function modified unintended columns.`);
        }

        res.status(200).json("User succesfully added.")

    } catch(err) {
        console.error('Error creating new user: ', err);
        res.status(500).json({error: 'Internal Server Error'})
    } 
});

// Gets restaurant id via the restaurant's name.
app.get("/api/serve/get-rid-with-rname", async (req, res) => {
    if(req.query.rname === undefined) {
        console.error('Could not fetch undefined restuarant.');
        res.status(400).json({error: 'Could not fetch undefined restuarant.'});
        return;
    }
    const query = `SELECT name FROM restaurants WHERE name='${req.query.rname}';`
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Gets restaurant info via the restaurant's id.
app.get("/api/serve/get-rinfo-with-rid", async (req, res) => {
    if(req.query.rid === undefined) {
        console.error('Could not fetch undefined restuarant.');
        res.status(400).json({error: 'Could not fetch undefined restuarant.'});
        return;
    }
    const query = `SELECT * FROM restaurants WHERE placeid='${req.query.rid}';`
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post("/api/serve/add-restaurant", async (req, res) => {
    // Check and insert all information needed for creating new user.
    const hasNullValue = (array) => array.some(element => element === undefined);
    const uinfo = [req.body.rid, req.body.rname, req.body.price, req.body.rating,
        req.body.weburl, req.body.gmapurl];
    if(hasNullValue(uinfo)) {
        console.error('Could not create user. User information is missing.');
        res.status(400).json({error: 'Could not create user. User information is missing.'});
        return;
    }

    // Map name to value.
    let num_price_level = -1;
    switch(req.body.price) {
        case 'PRICE_LEVEL_UNSPECIFIED':
            num_price_level = -1
            break;
        case 'PRICE_LEVEL_FREE':
            num_price_level = 0
            break;
        case 'PRICE_LEVEL_INEXPENSIVE':
            num_price_level = 1
            break;
        case 'PRICE_LEVEL_MODERATE':
            num_price_level = 2
            break;
        case 'PRICE_LEVEL_EXPENSIVE':
            num_price_level = 3
            break;
        case 'PRICE_LEVEL_VERY_EXPENSIVE':
            num_price_level = 4
            break;
    }

    const add_query = `INSERT INTO Restaurants 
    VALUES ('${req.body.rid}', '${sanitize_text(req.body.rname)}', ${num_price_level}, ${req.body.rating},
    '${req.body.weburl}', '${req.body.gmapurl}');`;

    const get_query = `SELECT * FROM Restaurants WHERE name='${sanitize_text(req.body.rname)}'`;

    try {
        // Check if user already exists.
        const get_result = await pool.query(get_query);
        if(get_result.rows.length != 0) {
            res.status(200).json({warning: `Username ${req.body.rname} already exists.`});
            return;
        }

        console.log("Getting succesful");

        // If not add, restaurant.
        const add_result = await pool.query(add_query);
        if(add_result.rowCount != 1) {
            throw Error(`POST function modified unintended columns.`);
        }

        console.log("Posting Succesful succesful");

        res.status(200).json("User succesfully added.")

    } catch(err) {
        console.error('Error creating new user: ', err);
        res.status(500).json({error: 'Internal Server Error'})
    } 
})

app.get("/api/serve/get-user-trashed-restaurant", async (req, res) => {
    if(req.query.uid === undefined) {
        console.error('Could not fetch undefined user.');
        res.status(400).json({error: 'Could not fetch undefined user.'});
        return;
    }
    const query = `SELECT * FROM trashed_swipes WHERE userid='${req.query.uid}';`
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching trashed restaurants:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// User provides userid and restaurant name. We check if entities
// With these values exist, we add relationship in table.
app.post("/api/serve/add-user-trashed-restaurant", async (req, res) => {
    // Check and insert all information needed for creating new user.
    const hasNullValue = (array) => array.some(element => element === undefined);
    const uinfo = [req.body.uid, req.body.rid];
    if(hasNullValue(uinfo)) {
        console.error('Could not create user. User information is missing.');
        res.status(400).json({error: 'Could not create user. User information is missing.'});
        return;
    }

    const get_query = `SELECT * FROM liked_swipes AS l JOIN trashed_swipes AS t ON l.userid=t.userid
    WHERE l.userid='${req.body.uid}' AND (l.placeid='${req.body.rid}' OR t.placeid='${req.body.rid}')`;

    const add_query = `INSERT INTO trashed_swipes 
    VALUES ((SELECT userid FROM Users WHERE userid='${req.body.uid}'), 
    (SELECT placeid FROM Restaurants WHERE placeid='${req.body.rid}'));`;

    try {
        // If not add, user.
        const get_result = await pool.query(get_query);
        console.log(get_result.rows);
         if(get_result.rows.length != 0) {
             res.status(200).json({warning: `Swipe with ${req.body.rname} already exists.`});
            return;
        }
        const add_result = await pool.query(add_query);
        if(add_result.rowCount != 1) {
            throw Error(`POST function modified unintended columns.`);
        }

        res.status(200).json("User succesfully added.")

    } catch(err) {
        // One of the more common errors will be that either the restaurant or user entity,
        // does not exist.
        console.error('Error creating new user: ', err);
        res.status(500).json({error: 'Internal Server Error'})
    } 
});

app.get("/api/serve/get-user-favorite-restaurants", async (req, res) => {
    if(req.query.uid === undefined) {
        console.error('Could not fetch undefined user.');
        res.status(400).json({error: 'Could not fetch undefined user.'});
        return;
    }
    const query = `SELECT * FROM liked_swipes WHERE userid='${req.query.uid}';`
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/api/serve/add-user-favorite-restaurant", async (req, res) => {
     // Check and insert all information needed for creating new user.
     const hasNullValue = (array) => array.some(element => element === undefined);
     const uinfo = [req.body.uid, req.body.rid];
     if(hasNullValue(uinfo)) {
         console.error('Could not create user. User information is missing.');
         res.status(400).json({error: 'Could not create user. User information is missing.'});
         return;
     }

     // First check that entry does not already exist.
     const get_query = `SELECT * FROM liked_swipes AS l JOIN trashed_swipes AS t ON l.userid=t.userid
      WHERE l.userid='${req.body.uid}' AND (l.placeid='${req.body.rid}' OR t.placeid='${req.body.rid}')`;

     const add_query = `INSERT INTO liked_swipes 
     VALUES ((SELECT userid FROM Users WHERE userid='${req.body.uid}'), 
     (SELECT placeid FROM Restaurants WHERE placeid='${req.body.rid}'));`;
 
     try {
         // If not add, user.
         const get_result = await pool.query(get_query);
         if(get_result.rows.length != 0) {
            res.status(200).json({warning: `Username ${req.body.rname} already exists.`});
            return;
        }


         const add_result = await pool.query(add_query);
         if(add_result.rowCount != 1) {
             throw Error(`POST function modified unintended columns.`);
         }
 
         res.status(200).json("User succesfully added.")
 
     } catch(err) {
         // One of the more common errors will be that either the restaurant or user entity,
         // does not exist.
         console.error('Error creating new user: ', err);
         res.status(500).json({error: 'Internal Server Error'})
     } 
});

app.delete("/api/serve/delete-trashed-swipe-with-rid-uid", async (req, res) => {
    if(req.query.rid === undefined && req.query.uid === undefined) {
        console.error('Could not fetch undefined user or restaurant id.');
        res.status(400).json({error: 'Could not fetch with undefined user and restaurant id.'});
        return;
    }
    const delete_query = `DELETE FROM trashed_swipes WHERE placeid='${sanitize_text(req.query.rid)}' AND userid='${req.query.uid}'`;

    try {
        const result = await pool.query(delete_query);
        res.status(200).json({transactionComplete: "Deleted trashed swipes of placeidown by user"});
    } catch(err) {
        console.error(`Error deleting user's trashed swipes: ${err}`);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

app.delete("/api/serve/delete-favorite-swipe-with-rid-uid", async (req, res) => {
    if(req.query.rid === undefined && req.query.uid === undefined) {
        console.error('Could not fetch undefined user or restaurant id.');
        res.status(400).json({error: 'Could not fetch with undefined user and restaurant id.'});
        return;
    }
    const delete_query = `DELETE FROM liked_swipes WHERE placeid='${sanitize_text(req.query.rid)}' AND userid='${req.query.uid}'`;

    try {
        const result = await pool.query(delete_query);
        res.status(200).json({transactionComplete: "Deleted favorite_swipe of placeidown by user"});
    } catch(err) {
        console.error(`Error deleting user's favorite swipes: ${err}`);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Deletes all trashed swipes from user.
app.delete("/api/serve/delete-trashed-swipe-with-uid", async (req, res) => {
    if(req.query.uid === undefined) {
        console.error('Could not fetch undefined user.');
        res.status(400).json({error: 'Could not fetch with undefined user.'});
        return;
    }
    const delete_query = `DELETE FROM trashed_swipes WHERE userid='${req.query.uid}';`

    try {
        const result = await pool.query(delete_query);
        res.status(200).json({transactionComplete: "Deleted all trashed_swipes own by user"});
    } catch(err) {
        console.error(`Error deleting user's trashed swipes: ${err}`);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Deletes all favorite swipes from user.
app.delete("/api/serve/delete-favorite-swipe-with-uid", async (req, res) => {
    if(req.query.uid === undefined) {
        console.error('Could not fetch undefined user.');
        res.status(400).json({error: 'Could not fetch with undefined user.'});
        return;
    }
    const delete_query = `DELETE FROM liked_swipes WHERE userid='${req.query.uid}';`

    try {
        const result = await pool.query(delete_query);
        res.status(200).json({transactionComplete: "Deleted all trashed_swipes own by user"});
    } catch(err) {
        console.error(`Error deleting user's favorite swipes: ${err}`);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Get and update numswipes.

app.get("/api/serve/get-swipes", async (req, res) => {
    if(req.query.uid === undefined) {
        console.error('Could not fetch invalid userid.');
        res.status(400).json({error: 'Could not fetch undefined username.'});
        return;
    }

    console.log(req.query.uid)

    const get_query = `SELECT numswipes FROM Users WHERE userid=${req.query.uid};`
    try {
        const result = await pool.query(get_query);
        if(!result.rows) {
            res.status(400).json({error: `Could not find information with uid ${req.query.uid}`})
        }
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/api/serve/increment-swipes", async (req, res) => {
    // Check and insert all information needed for creating new user.
    const hasNullValue = (array) => array.some(element => element === undefined);
    const uinfo = [req.body.uid, req.body.rid];
    if(hasNullValue(uinfo)) {
        console.error('Could not create user. User information is missing.');
        res.status(400).json({error: 'Could not create user. User information is missing.'});
        return;
    }

    const update_query = `UPDATE users SET numswipes = numswipes +1 WHERE userid=${req.body.uid};`;
    try {
        const result = await pool.query(update_query);
        res.status(200).json({transactionComplete: "Added number of swipes to 1."});
    } catch(err) {
        console.error(`Error deleting user's favorite swipes: ${err}`);
        res.status(500).json({error: 'Internal Server Error'});
    }

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

let server = undefined;
if (DEV_MODE) {
    server = app.listen(5001, () => console.log("Server started on port 5001"));
} else {
    // Node.js Express example
    server = app.use(cors({
        origin: '',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })).listen(5001, () => console.log("Server started on port 5001"));
}

// Exporting app for testing.
module.exports = { app, server };

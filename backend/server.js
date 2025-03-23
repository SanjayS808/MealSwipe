const express = require('express');
const cors = require('cors');  // Import CORS middleware
const request = require('request');  // To make HTTP requests
const pool = require('./db'); // Add access to DB

const app = express();

const API_URI = "https://mealswipe-flask-service.75ct69eg04jk6.us-west-2.cs.amazonlightsail.com/v1/places:searchNearby";

app.use(cors());  // Enable CORS
app.use(express.json()); // This enables JSON body parsing
app.use(express.urlencoded({ extended: true })); // Support for URL-encoded data

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
                // console.log("Restaurant rating:", rating); 
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
    const uinfo = [req.body.uid, req.body.uname, req.body.ubio, req.body.nswipes];
    if(hasNullValue(uinfo)) {
        console.error('Could not create user. User information is missing.');
        res.status(400).json({error: 'Could not create user. User information is missing.'});
        return;
    }

    const add_query = `INSERT INTO Users 
    VALUES (${req.body.uid}, '${req.body.uname}', '${req.body.ubio}', ${req.body.nswipes});`;

    const get_query = `SELECT * FROM Users WHERE name='${req.body.uname}'`;

    try {
        // Check if user already exists.
        const get_result = await pool.query(get_query);
        if(get_result.rows.length != 0) {
            throw Error(`Username ${req.body.uname} already exists.`);
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

    const add_query = `INSERT INTO Restaurants 
    VALUES (${req.body.rid}, '${req.body.rname}', ${req.body.price}, ${req.body.rating},
    '${req.body.weburl}', '${req.body.gmapurl}');`;

    const get_query = `SELECT * FROM Restaurants WHERE name='${req.body.rname}'`;

    try {
        // Check if user already exists.
        const get_result = await pool.query(get_query);
        if(get_result.rows.length != 0) {
            throw Error(`Username ${req.body.uname} already exists.`);
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
app.post("/api/serve/add-user-trashed-resstaurant", async (req, res) => {
    // Check and insert all information needed for creating new user.
    const hasNullValue = (array) => array.some(element => element === undefined);
    const uinfo = [req.body.uid, req.body.rname];
    if(hasNullValue(uinfo)) {
        console.error('Could not create user. User information is missing.');
        res.status(400).json({error: 'Could not create user. User information is missing.'});
        return;
    }

    const add_query = `INSERT INTO trahsed_swipes 
    VALUES ((SELECT userid FROM Users WHERE userid=${uid}), 
    (SELECT placeid FROM Restaurants WHERE name=${rname}));`;

    try {
        // If not add, user.
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
     const uinfo = [req.body.uid, req.body.rname];
     if(hasNullValue(uinfo)) {
         console.error('Could not create user. User information is missing.');
         res.status(400).json({error: 'Could not create user. User information is missing.'});
         return;
     }
 
     const add_query = `INSERT INTO liked_swipes 
     VALUES ((SELECT userid FROM Users WHERE userid=${uid}), 
     (SELECT placeid FROM Restaurants WHERE name=${rname}));`;
 
     try {
         // If not add, user.
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
